/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Input, Row, Select, Table, notification } from 'antd'
import './style.scss'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UploadOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { IAttendance, IPayloadUpdateAttendance, IReportData, IViolate } from '~/types/attendance.interface'
import dayjs from 'dayjs'
import TimesheetForm from './component/TimesheetForm'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import {
  exportTimesheet,
  filterTimesheet,
  getAllGroup,
  getEmployeeWorkingTime,
  getUserInGroup,
  updateAttendanceStatistic
} from '~/stores/features/timesheet/timesheet.slice'
import { IPaging, ISort } from '~/types/api-response.interface'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { LocalStorage } from '~/utils/local-storage'
import { IUser } from '~/types/user.interface'
import { filterTypesOfLeave } from '~/stores/features/types-of-leave/types-of-leave.slice'
import TimesheetChartForAdmin from './component/TimesheetChartForAdmin'
import TimesheetChart from './component/TimesheetChart'
import { IEmployeeWorkingTime } from '~/types/timesheet'

const Timesheet: React.FC = () => {
  const { Search } = Input
  const dispatch = useAppDispatch()
  const { RangePicker } = DatePicker
  const { Option } = Select
  const { t } = useTranslation()
  const currentAuth: IUser | null = LocalStorage.getObject('currentAuth')
  const userGroup = currentAuth?.groupProfiles[0]?.groupCode
  const groupsSate = useAppSelector((state) => state.timesheet.groups)
  const timesheetSate = useAppSelector((state) => state.timesheet)
  const usersInGroupSate = useAppSelector((state) => state.timesheet.userInGroup)
  const typesOfLeaveSate = useAppSelector((state) => state.typesOfLeave)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(userGroup)
  const [onlyShowWorkingDay, setOnlyShowWorkingDay] = useState(false)
  const [selectedUser, setSelectedUser] = useState(
    currentAuth?.groupProfiles[0]?.role === 'OFFICER' ? usersInGroupSate[0]?.id : null
  )
  const [isAllowedAccess, setIsAllowedAccess] = useState(
    currentAuth?.groupProfiles[0]?.role === 'SYSTEM_ADMIN' ? true : false
  )
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs())
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs())
  const [mode, setMode] = useState('list')
  const [clickUpdateButton, setClickUpdateButton] = useState(false)
  const timerId = useRef<any>(null)
  const [query, setQuery] = useState<string>('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('')
  let confirmAttendanceStatisticList: any[] = []
  const typesOfLeaveOptions = typesOfLeaveSate?.listData?.map((item) => {
    return { value: item?.code, label: item?.name }
  })
  const userOptions = usersInGroupSate?.map((item) => {
    return { value: item?.id, label: item?.fullName }
  })

  const emplWorkingTime = useAppSelector((item) => item.timesheet.empWorkingTime)
  const [chartData, setChartData] = useState<IEmployeeWorkingTime | null>(null)

  const [searchValue, setSearchValue] = useState<{
    query: string
    group?: string | null
    userId?: string | null
    startDate?: string | null
    endDate?: string | null
    paging: IPaging
    sorts: ISort[]
    onlyShowWorkingDay?: boolean
  }>({
    query: '',
    paging: {
      page: 0,
      size: 10,
      total: 0,
      totalPage: 0
    },
    sorts: []
  })

  const handleCloseTimesheetModal = () => {
    setIsOpenModal(false)
  }

  const handleSelectDate = (dataSelected: any) => {
    setSelectedStartDate(dayjs(dataSelected[0]))
    setSelectedEndDate(dayjs(dataSelected[1]))
    if (dayjs(dataSelected[0]).year() !== dayjs(dataSelected[1]).year()) {
      notification.warning({ message: 'Chỉ được chọn ngày trong cùng một năm' })
      return
    }
    if (dataSelected[0] && dataSelected[1]) {
      setSearchValue((prevState) => {
        return {
          ...prevState,
          paging: { ...prevState.paging, page: 0 },
          startDate: dayjs(dataSelected[0]).format('YYYY-MM-DD'),
          endDate: dayjs(dataSelected[1]).format('YYYY-MM-DD')
        }
      })
    }
  }

  const handleSelectToday = () => {
    setSelectedTimeRange('today')
    setSelectedStartDate(dayjs())
    setSelectedEndDate(dayjs())
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
      }
    })
  }

  const handleSelectThisMonth = () => {
    setSelectedTimeRange('this_month')
    setSelectedStartDate(dayjs().startOf('M'))
    setSelectedEndDate(dayjs().endOf('M'))
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs().startOf('M').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('M').format('YYYY-MM-DD')
      }
    })
  }

  const handleSelectLastMonth = () => {
    setSelectedTimeRange('last_month')
    setSelectedStartDate(
      dayjs()
        .month(dayjs().month() - 1)
        .startOf('M')
    )
    setSelectedEndDate(
      dayjs()
        .month(dayjs().month() - 1)
        .endOf('M')
    )
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs()
          .month(dayjs().month() - 1)
          .startOf('M')
          .format('YYYY-MM-DD'),
        endDate: dayjs()
          .month(dayjs().month() - 1)
          .endOf('M')
          .format('YYYY-MM-DD')
      }
    })
  }

  const handleSelectGroup = (value: string) => {
    setSelectedUser(null)
    setSelectedGroup(value)
  }

  const getSortOrder = (filed: string) => {
    const sort = searchValue.sorts[0]
    if (sort && sort.field === filed) {
      return searchValue.sorts[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }

  const findViolate = (data: IViolate[] | null, violateType: string) => {
    if (!data) return false
    if (data?.findIndex((item: IViolate) => item?.violateType === violateType) > -1) {
      return true
    } else {
      return false
    }
  }

  const handleUpdateAttendanceStatistic = async () => {
    const response = await dispatch(updateAttendanceStatistic(confirmAttendanceStatisticList)).unwrap()
    if (response) {
      notification.success({
        message: response?.message
      })
    }
    setClickUpdateButton(!clickUpdateButton)
    confirmAttendanceStatisticList = []
  }

  const handleSelectTypesOfLeave = (data: IAttendance, typesOfLeave: string) => {
    const index = confirmAttendanceStatisticList.findIndex((item) => item?.id === data.id)
    let payload = {}
    if (index > -1) {
      payload = {
        date: confirmAttendanceStatisticList[index]?.date,
        id: confirmAttendanceStatisticList[index]?.id,
        userId: confirmAttendanceStatisticList[index]?.userId,
        reportData: {
          ...confirmAttendanceStatisticList[index]?.reportData,
          absenceType: typesOfLeave !== undefined ? typesOfLeave : null,
          absenceAmount:
            typesOfLeave !== undefined ? 1 - confirmAttendanceStatisticList[index]?.reportData?.workingAmount : 0.0
        }
      }
      confirmAttendanceStatisticList.splice(index, 1)
    } else {
      payload = {
        date: data?.date,
        id: data?.id,
        userId: data?.userId,
        reportData: {
          ...data?.reportData,
          absenceType: typesOfLeave !== undefined ? typesOfLeave : null,
          absenceAmount: typesOfLeave !== undefined ? 1 - data?.reportData?.workingAmount : 0.0
        }
      }
    }
    confirmAttendanceStatisticList.push(payload)
  }

  const handleAddNote = (data: IAttendance, newNote: string) => {
    const index = confirmAttendanceStatisticList.findIndex((item) => item?.id === data?.id)
    let payload = {}
    if (index > -1) {
      payload = {
        date: confirmAttendanceStatisticList[index]?.date,
        id: confirmAttendanceStatisticList[index]?.id,
        userId: confirmAttendanceStatisticList[index]?.userId,
        reportData: {
          ...confirmAttendanceStatisticList[index]?.reportData,
          note: newNote
        }
      }
      confirmAttendanceStatisticList.splice(index, 1)
    } else {
      payload = {
        date: data?.date,
        id: data?.id,
        userId: data?.userId,
        reportData: {
          ...data?.reportData,
          note: newNote
        }
      }
    }
    confirmAttendanceStatisticList.push(payload)
  }

  const renderStatusByWorkingAmount = (workingAmount: number) => {
    switch (workingAmount) {
      case 0.0:
        return (
          <div className='tw-text-[#E64D29]'>
            <CloseOutlined className='tw-text-[10px] tw-mr-[5px]' />
            <span>THIẾU CÔNG</span>
          </div>
        )
      case 0.5:
        return (
          <div className='tw-text-[#25BD74]'>
            <CheckOutlined className='tw-text-[10px] tw-mr-[5px]' />
            <span>1/2 CÔNG</span>
          </div>
        )
      case 1:
        return (
          <div className='tw-text-[#25BD74]'>
            <CheckOutlined className='tw-text-[10px] tw-mr-[5px]' />
            <span>ĐỦ CÔNG</span>
          </div>
        )
      default:
        return ''
    }
  }

  const renderTypesOfLeaveName = (code: string) => {
    if (!code) return
    const result = typesOfLeaveSate?.listData?.find((item) => item?.code === code)
    return result?.name || ''
  }

  const columns: ColumnsType<IAttendance> = [
    {
      title: t('timesheet.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      width: '160px',
      sortOrder: getSortOrder('fullName')
    },
    {
      title: t('Mã chấm công'),
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true,
      sorter: true,
      showSorterTooltip: false,
      width: '160px',
      sortOrder: getSortOrder('userName')
    },
    {
      title: t('timesheet.attendanceDate'),
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('date'),
      width: '170px',
      align: 'center',
      render: (date) => {
        return (
          <div className='tw-flex tw-items-center'>
            <CalendarOutlined className='tw-text-[12px] tw-text-[#B2C2D8] tw-mr-[5px]' />
            {dayjs(date).format('DD/MM/YYYY')}
          </div>
        )
      }
    },
    {
      title: t('Trạng thái'),
      dataIndex: 'reportData',
      ellipsis: true,
      width: '120px',
      render: (reportData) => {
        return reportData?.noneWorkingDay ? '' : renderStatusByWorkingAmount(reportData?.workingAmount)
      }
    },
    {
      title: t('timesheet.startTime'),
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('startTime'),
      align: 'center',
      width: '110px',
      render: (startTime, record) => {
        return (
          startTime && (
            <div
              className={`tw-flex tw-items-center ${
                findViolate(record?.reportData?.violate, 'LATE_COME') ||
                findViolate(record?.reportData?.violate, 'FORGET_TIME_ATTENDANCE')
                  ? 'tw-text-[#E64D29]'
                  : ''
              }`}
            >
              <ClockCircleOutlined className='tw-text-[12px] tw-text-[#B2C2D8] tw-mr-[5px]' /> {startTime}
            </div>
          )
        )
      }
    },
    {
      title: t('timesheet.endTime'),
      dataIndex: 'endTime',
      key: 'endTime',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('endTime'),
      align: 'center',
      width: '110px',
      render: (endTime, record) => {
        return (
          endTime && (
            <div
              className={`tw-flex tw-items-center ${
                findViolate(record?.reportData?.violate, 'EARLY_BACK') ? 'tw-text-[#E64D29]' : ''
              }`}
            >
              <ClockCircleOutlined className='tw-text-[12px] tw-text-[#B2C2D8] tw-mr-[5px]' /> {endTime}
            </div>
          )
        )
      }
    },
    {
      title: t('Số giờ làm'),
      dataIndex: 'workingHour',
      key: 'workingHour',
      sortOrder: getSortOrder('workingHour'),
      align: 'center',
      width: '120px'
    },
    {
      title: t('Công nghỉ'),
      dataIndex: 'reportData',
      ellipsis: true,
      width: '170px',
      render: (reportData, record) => {
        return reportData?.noneWorkingDay
          ? ''
          : !isAllowedAccess
          ? renderTypesOfLeaveName(reportData?.absenceType)
          : reportData?.workingAmount < 1 && (
              <Select
                onChange={(value) => handleSelectTypesOfLeave(record, value)}
                defaultValue={reportData?.absenceType}
                options={typesOfLeaveOptions}
                className='tw-w-full'
                showSearch
                filterOption={(input, option) => (option?.label + '').toLowerCase().includes(input.toLowerCase())}
                allowClear
              />
            )
      }
    },
    {
      title: t('timesheet.noteFromManager'),
      dataIndex: '',
      key: '',
      ellipsis: true,
      width: '200px',
      render: (record) => {
        return record?.reportData?.noneWorkingDay ? (
          ''
        ) : !isAllowedAccess ? (
          record?.reportData?.note
        ) : (
          <Input
            onChange={(e) => handleAddNote(record, e?.target?.value)}
            defaultValue={record?.reportData?.note || ''}
            className='tw-w-full'
          />
        )
      }
    }
  ]

  function handleTableChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IAttendance> | any
  ) {
    setSearchValue((prevState) => {
      const paging: IPaging = {
        ...prevState.paging,
        page: Number(pagination.current) - 1,
        size: pagination.pageSize as number
      }
      const sorts: ISort[] = []
      if (sorter.order) {
        sorts.push({ field: sorter.field as string, direction: sorter.order === 'ascend' ? 'ASC' : 'DESC' })
      }
      return { ...prevState, paging, sorts }
    })
  }

  const handleSearchValueChange = (value: string) => {
    setQuery(value)
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      setSearchValue((prevState) => ({ ...prevState, query: value, paging: { ...prevState.paging, page: 0 } }))
    }, 500)
  }

  useEffect(() => {
    dispatch(getEmployeeWorkingTime())
    const promiseGetAllGroup = dispatch(getAllGroup())
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, group: selectedGroup }
    })
    const promiseFilterTypesOfLeave = dispatch(
      filterTypesOfLeave({
        paging: null,
        sorts: null,
        query: null
      })
    )
    return () => {
      promiseGetAllGroup.abort()
      promiseFilterTypesOfLeave.abort()
    }
  }, [])

  useEffect(() => {
    setChartData(emplWorkingTime)
  }, [emplWorkingTime])

  useEffect(() => {
    const promise = dispatch(getUserInGroup(selectedGroup))
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, group: selectedGroup }
    })
    return () => promise.abort()
  }, [selectedGroup])

  useEffect(() => {
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, userId: selectedUser }
    })
  }, [selectedUser])

  useEffect(() => {
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, onlyShowWorkingDay: onlyShowWorkingDay }
    })
  }, [onlyShowWorkingDay])

  useEffect(() => {
    const promise = dispatch(
      filterTimesheet({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query,
        groupCode: searchValue.group,
        startDate: searchValue.startDate,
        endDate: searchValue.endDate,
        userId: searchValue.userId,
        onlyShowWorkingDay: searchValue.onlyShowWorkingDay
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue, clickUpdateButton])

  // const sheetsData = [
  //   {
  //     sheetName: 'Sheet1',
  //     headers: ['1', '23'],
  //     data: [
  //       ['John', 25],
  //       ['Jane', 30]
  //     ]
  //   },
  //   {
  //     sheetName: 'Sheet2',
  //     headers: ['City', 'Population'],
  //     data: [
  //       ['New York', 8500000],
  //       ['London', 8900000]
  //     ]
  //   }
  // ]

  return (
    <Row className='timesheet tw-p-2'>
      {/* {isAllowedAccess && (
        <div className='timesheet-chart-container tw-flex tw-w-full tw-bg-white tw-mb-2'>
          {chartData?.arrivalTime && chartData?.arrivalTime?.workingDate?.length > 0 && (
            <div className='tw-w-1/2 tw-pt-2 '>
              <div className='tw-font-semibold'>Trung bình Giờ đến</div>
              <TimesheetChart
                categories={chartData?.arrivalTime?.workingDate ?? []}
                seriesData={chartData?.arrivalTime?.workingHour ?? []}
                seriesTitle='Thời gian đi làm'
              />
            </div>
          )}

          {chartData?.offTime && chartData?.offTime?.workingDate?.length > 0 && (
            <div className='tw-w-1/2 tw-pt-2'>
              <div className='tw-font-semibold'>Trung bình Giờ về</div>
              <TimesheetChart
                categories={chartData?.offTime?.workingDate ?? []}
                seriesData={chartData?.offTime?.workingHour ?? []}
                seriesTitle='Thời gian về'
              />
            </div>
          )}
        </div>
      )} */}
      {/* <Col xs={24} xl={6} xxl={4}>
        <TimesheetInfo
          data={timesheetSate.timesheetList}
          meta={timesheetSate?.meta}
          userInfo={currentAuth}
          handleOpenModal={setIsOpenModal}
        />
      </Col> */}
      <Col xs={24} className='timesheet-detail'>
        {mode === 'list' && (
          <>
            {/* {!isAllowedAccess && <TimesheetChartForAdmin data={timesheetSate.timesheetList} />} */}
            <div className='timesheet-filter'>
              <Row gutter={[12, 16]} className='timesheet-filter-time'>
                <Col xs={24} lg={8}>
                  <div className='tw-font-bold'>
                    {!isAllowedAccess ? 'Xác nhận ngày công của tôi' : 'Xác nhận ngày công'}
                  </div>
                </Col>
                <Col xs={24} lg={16} className='tw-text-right'>
                  <RangePicker
                    onChange={handleSelectDate}
                    format='DD/MM/YYYY'
                    placeholder={[t('timesheet.from'), t('timesheet.to')]}
                    defaultValue={[dayjs(), dayjs()]}
                    value={[selectedStartDate, selectedEndDate]}
                    allowClear={false}
                    renderExtraFooter={() => (
                      <div className='timesheet-filter-time__button'>
                        <Button
                          onClick={handleSelectToday}
                          size='small'
                          className={selectedTimeRange === 'today' ? 'selected' : ''}
                        >
                          {t('timesheet.today')}
                        </Button>
                        <Button
                          onClick={handleSelectThisMonth}
                          size='small'
                          className={selectedTimeRange === 'this_month' ? 'selected' : ''}
                        >
                          {t('timesheet.thisMonth')}
                        </Button>
                        <Button
                          onClick={handleSelectLastMonth}
                          size='small'
                          className={selectedTimeRange === 'last_month' ? 'selected' : ''}
                        >
                          {t('timesheet.lastMonth')}
                        </Button>
                      </div>
                    )}
                  />
                  <Button
                    icon={<UploadOutlined />}
                    className='timesheet-filter__export'
                    onClick={() =>
                      dispatch(
                        exportTimesheet({
                          paging: searchValue.paging,
                          sorts: searchValue.sorts,
                          query: searchValue.query,
                          groupCode: searchValue.group,
                          startDate: searchValue.startDate,
                          endDate: searchValue.endDate,
                          userId: searchValue.userId
                        })
                      )
                    }
                  >
                    {t('Xuất dữ liệu')}
                  </Button>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className='tw-mt-[12px]'>
                <Col xs={24} lg={5} xl={4}>
                  <Select
                    className='tw-w-full'
                    showSearch
                    placeholder={`${t('rootInit.requiredSelect')} ${t('rootInit.group')}`}
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label + '').toLowerCase().includes(input.toLowerCase())}
                    // allowClear
                    // onClear={() => setSelectedGroup(userGroup)}
                    onChange={(value) => handleSelectGroup(value)}
                    defaultValue={userGroup}
                  >
                    {groupsSate?.length > 0 &&
                      groupsSate?.map((i) => (
                        <Option key={i?.code} label={i?.name} value={i?.code}>
                          {i?.name}
                        </Option>
                      ))}
                  </Select>
                </Col>
                <Col xs={24} lg={5} xl={4}>
                  <Select
                    className='tw-w-full'
                    showSearch
                    placeholder={`${t('rootInit.requiredSelect')} ${t('timesheet.employee')}`}
                    optionFilterProp='children'
                    filterOption={(input, option) => {
                      return (option?.label + '').toLowerCase().includes(input.toLowerCase())
                    }}
                    allowClear
                    // onClear={() => setUserOptions([])}
                    value={selectedUser}
                    defaultValue={selectedUser}
                    onChange={(value) => setSelectedUser(value)}
                    options={userOptions}
                  />
                </Col>
                <Col xs={24} lg={14} xl={16} className='tw-text-right'>
                  <Search
                    value={query}
                    placeholder={'Tìm kiếm theo mã chấm công'}
                    onChange={(event) => handleSearchValueChange(event.target.value)}
                    className='tw-w-full tw-max-w-[300px]'
                  />
                  {/* <Button icon={<MenuOutlined />} type='default'>
                    Lọc
                  </Button> */}
                </Col>
              </Row>
            </div>
            {isAllowedAccess && (
              <div className='tw-text-right tw-mt-[15px]'>
                <Button icon={<CheckCircleOutlined />} type='primary' onClick={() => handleUpdateAttendanceStatistic()}>
                  Cập nhật
                </Button>
              </div>
            )}
            <div className='timesheet-table'>
              <Table
                rowKey='id'
                columns={columns}
                dataSource={timesheetSate.timesheetList}
                loading={timesheetSate.loading}
                scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
                rowClassName={(record: IAttendance) => (record.reportData.noneWorkingDay ? 'dayoff' : '')}
                onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
                pagination={{
                  className: 'd-flex justify-content-end align-items-center',
                  current: timesheetSate?.meta && timesheetSate?.meta?.page + 1,
                  total: timesheetSate?.meta?.total,
                  defaultPageSize: timesheetSate?.meta?.size,
                  pageSize: timesheetSate?.meta?.size,
                  pageSizeOptions: ['5', '10', '25', '50'],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  locale: {
                    items_per_page: `/ ${t('common.page')}`,
                    next_page: t('common.nextPage'),
                    prev_page: t('common.prevPage'),
                    jump_to: t('common.jumpTo'),
                    page: t('common.page')
                  },

                  position: ['bottomRight']
                }}
              />
              <Checkbox
                className='timesheet-table__checkbox'
                onChange={() => setOnlyShowWorkingDay(!onlyShowWorkingDay)}
                defaultChecked={onlyShowWorkingDay}
              >
                {t('timesheet.onlyShowWorkingDay')}
              </Checkbox>
            </div>
          </>
        )}
        {/* {mode === 'calendar' && (
          <TimesheetCalendar data={timesheetSate.timesheetList} handleOpenModal={setIsOpenModal} />
        )} */}
      </Col>
      <TimesheetForm open={isOpenModal} handleClose={handleCloseTimesheetModal} />
    </Row>
  )
}

export default Timesheet
