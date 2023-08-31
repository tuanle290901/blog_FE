/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Input, Row, Select, Table, Tooltip, notification } from 'antd'
import './style.scss'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UploadOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { IAttendance, IAbsenceInfo, IReportData } from '~/types/attendance.interface'
import dayjs from 'dayjs'
import TimesheetForm from './component/TimesheetForm'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import {
  exportTimesheet,
  filterTimesheet,
  getEmployeeWorkingTime,
  getUserInGroup
} from '~/stores/features/timesheet/timesheet.slice'
import { IPaging, ISort } from '~/types/api-response.interface'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { LocalStorage } from '~/utils/local-storage'
import { IUser } from '~/types/user.interface'
// import { filterTypesOfLeave } from '~/stores/features/types-of-leave/types-of-leave.slice'
import { IEmployeeWorkingTime } from '~/types/timesheet'
import SyncTimeAttendanceModal from './component/SyncTimeAttendanceModal'
import { getAllDefinationType } from '~/stores/features/leave-request/leave-request.slice'
import { LEAVE_TYPE_MAP } from '~/utils/Constant'

const Timesheet: React.FC = () => {
  const { Search } = Input
  const dispatch = useAppDispatch()
  const { RangePicker } = DatePicker
  const { t } = useTranslation()
  const currentAuth: IUser | null = LocalStorage.getObject('currentAuth')
  const userGroup =
    currentAuth?.groupProfiles[0]?.role === 'SYSTEM_ADMIN' ? 'ALL' : currentAuth?.groupProfiles[0]?.groupCode
  const groupsSate = useAppSelector((state) => state.masterData.groups)
  const timesheetSate = useAppSelector((state) => state.timesheet)
  const usersInGroupSate = useAppSelector((state) => state.timesheet.userInGroup)
  const ticketDifinations = useAppSelector((item) => item.leaveRequest.ticketDefinationType)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(userGroup)
  const [onlyShowWorkingDay, setOnlyShowWorkingDay] = useState(true)
  const [selectedUser, setSelectedUser] = useState(
    currentAuth?.groupProfiles[0]?.role === 'OFFICER' ? currentAuth?.userName : null
  )
  // const [selectedUser, setSelectedUser] = useState(null)
  const [isAllowedAccess, setIsAllowedAccess] = useState(
    currentAuth?.groupProfiles[0]?.role === 'SYSTEM_ADMIN' ? true : false
  )
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs())
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs())
  const [mode, setMode] = useState('list')
  const [clickUpdateButton, setClickUpdateButton] = useState(false)
  const [syncTimeAttendance, setSyncTimeAttendance] = useState(false)
  const [syncManualSuccess, setSyncManualSuccess] = useState(false)
  const timerId = useRef<any>(null)
  const [query, setQuery] = useState<string>('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('')

  const emplWorkingTime = useAppSelector((item) => item.timesheet.empWorkingTime)
  const [chartData, setChartData] = useState<IEmployeeWorkingTime | null>(null)
  const userOptions = usersInGroupSate?.map((item) => {
    return {
      value: item?.userName,
      label: `${item?.fullName ? item?.fullName : ''} (${item?.userName ? item?.userName : ''})`
    }
  })
  const groupOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    const options = groupsSate.map((item) => {
      return { value: item?.code, label: item?.name }
    })
    if (isAllowedAccess) {
      return [{ value: 'ALL', label: t('userList.allGroup') }, ...options]
    } else {
      return [...options]
    }
  }, [groupsSate])

  const [searchValue, setSearchValue] = useState<{
    query: string
    group?: string | null
    userName?: string | null
    startDate?: string | null
    endDate?: string | null
    paging: IPaging
    sorts: ISort[]
    onlyShowWorkingDay?: boolean
  }>({
    query: '',
    paging: {
      page: 0,
      size: 15,
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
      notification.warning({ message: t('timesheet.message.selectDate') })
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
    setSelectedEndDate(dayjs())
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs().startOf('M').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
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

  const findViolate = (data: string[] | null, violateType: string) => {
    if (data && data.includes(violateType)) {
      return true
    } else {
      return false
    }
  }

  const renderStatusByPayrollAmount = (reportData: IReportData) => {
    if (reportData?.payrollAmount === null) return
    if (reportData?.payrollAmount < 8 || reportData?.violates?.length > 0) {
      return (
        <div className='tw-text-[#E64D29] tw-uppercase'>
          <CloseOutlined className='tw-text-[10px] tw-mr-[5px]' />
          <span>{t('timesheet.insufficientWorkingHours')}</span>
        </div>
      )
    }
    if (reportData?.payrollAmount >= 8) {
      return (
        <div className='tw-text-[#25BD74] tw-uppercase'>
          <CheckOutlined className='tw-text-[10px] tw-mr-[5px]' />
          <span>{t('timesheet.enoughWorkingHours')}</span>
        </div>
      )
    }
  }

  const handleGetAbsenceTypeName = (data: IAbsenceInfo) => {
    const result = ticketDifinations.find((ticket) => ticket.id === data?.absenceType)
    return result?.name || LEAVE_TYPE_MAP[data?.absenceType]
  }

  const renderTypesOfLeaveName = (reportData: IReportData) => {
    if (reportData?.absenceInfoList?.length <= 0) return
    else {
      return (
        <div>
          {reportData?.absenceInfoList?.map((item) => (
            <div key={item?.ticketCode} className='tw-cursor-context-menu'>
              {handleGetAbsenceTypeName(item)}
            </div>
          ))}
        </div>
      )
    }
  }

  const renderAbsenceInfo = (reportData: IReportData) => {
    if (reportData?.absenceInfoList?.length <= 0) return
    else {
      return (
        <div>
          {reportData?.absenceInfoList?.map((item) => (
            <Tooltip
              color='#ffbc25'
              key={item?.ticketCode}
              title={
                <div className='tw-text-black tw-text-center'>
                  <div>{handleGetAbsenceTypeName(item)}</div>
                  <div>
                    <span>{t('timesheet.from')}</span>
                    <span className='tw-font-bold tw-mx-[10px]'>{item?.startDateTimeRegist?.split(' ')[1]}</span>
                    <span>{t('timesheet.to')}</span>
                    <span className='tw-font-bold tw-ml-[10px]'>{item?.endDateTimeRegist?.split(' ')[1]}</span>
                  </div>
                </div>
              }
            >
              <div className='tw-cursor-context-menu'>{item?.amount?.toFixed(2)}</div>
            </Tooltip>
          ))}
        </div>
      )
    }
  }

  const columns: ColumnsType<IAttendance> = [
    {
      title: t('timesheet.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      width: '160px',
      sortOrder: getSortOrder('fullName'),
      fixed: 'left'
    },
    {
      title: t('timesheet.attendanceCode'),
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
      title: t('timesheet.status'),
      dataIndex: 'reportData',
      ellipsis: true,
      width: '120px',
      render: (reportData) => {
        return renderStatusByPayrollAmount(reportData)
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
                findViolate(record?.reportData?.violates, 'LATE_COME') ||
                findViolate(record?.reportData?.violates, 'FORGET_TIME_ATTENDANCE')
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
                findViolate(record?.reportData?.violates, 'EARLY_BACK') ? 'tw-text-[#E64D29]' : ''
              }`}
            >
              <ClockCircleOutlined className='tw-text-[12px] tw-text-[#B2C2D8] tw-mr-[5px]' /> {endTime}
            </div>
          )
        )
      }
    },
    {
      title: t('timesheet.workingAmount'),
      align: 'center',
      width: '150px',
      render: (record) => {
        return <span>{record?.reportData?.workingAmount?.toFixed(2)}</span>
      }
    },
    {
      title: t('timesheet.payrollAmount'),
      align: 'center',
      width: '150px',
      render: (record) => {
        return <span>{record?.reportData?.payrollAmount?.toFixed(2)}</span>
      }
    },
    {
      title: t('timesheet.absenceAmount'),
      align: 'center',
      width: '120px',
      render: (record) => {
        return renderAbsenceInfo(record?.reportData)
      }
    },
    {
      title: t('timesheet.absenceType'),
      ellipsis: true,
      width: '170px',
      render: (record) => {
        return renderTypesOfLeaveName(record?.reportData)
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
    const promiseGetAllDefinationType = dispatch(getAllDefinationType())
    // const promiseGetAllGroup = dispatch(getAllGroup())
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, group: selectedGroup }
    })
    // const promiseFilterTypesOfLeave = dispatch(
    //   filterTypesOfLeave({
    //     paging: null,
    //     sorts: null,
    //     query: null
    //   })
    // )
    return () => {
      promiseGetAllDefinationType.abort()
      // promiseFilterTypesOfLeave.abort()
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
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, userName: selectedUser }
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
        userName: searchValue.userName,
        onlyShowWorkingDay: searchValue.onlyShowWorkingDay
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue, clickUpdateButton, syncManualSuccess])

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
                <Col xs={24} lg={10} xl={8}>
                  <div className='tw-text-[24px]'>
                    {!isAllowedAccess ? t('timesheet.titleForUser') : t('timesheet.titleForAdmin')} (
                    {timesheetSate?.meta?.total})
                  </div>
                </Col>
                <Col xs={24} lg={14} xl={16}>
                  <Row gutter={[12, 16]} className='tw-flex lg:tw-justify-end'>
                    <Col>
                      <RangePicker
                        onChange={handleSelectDate}
                        format='DD/MM/YYYY'
                        placeholder={[t('timesheet.from'), t('timesheet.to')]}
                        defaultValue={[dayjs(), dayjs()]}
                        value={[selectedStartDate, selectedEndDate]}
                        allowClear={false}
                        disabledDate={(date) => {
                          return date.isAfter(new Date())
                        }}
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
                    </Col>
                    <Col>
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
                              userName: searchValue.userName,
                              onlyShowWorkingDay: searchValue.onlyShowWorkingDay
                            })
                          )
                        }
                      >
                        {t('timesheet.exportData')}
                      </Button>
                    </Col>
                    {isAllowedAccess && (
                      <Col>
                        <div className='timesheet__sync-button'>
                          <Button
                            icon={<SyncOutlined />}
                            type='primary'
                            onClick={() => setSyncTimeAttendance(!syncTimeAttendance)}
                          >
                            {t('timesheet.syncData')}
                          </Button>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className='tw-mt-[12px]'>
                <Col xs={24} lg={8} xl={4}>
                  <Select
                    className='tw-w-full tw-max-w-[380px]'
                    showSearch
                    placeholder={`${t('rootInit.requiredSelect')} ${t('rootInit.group')}`}
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label + '').toLowerCase().includes(input.toLowerCase())}
                    // allowClear
                    // onClear={() => setSelectedGroup(userGroup)}
                    onChange={(value) => handleSelectGroup(value)}
                    defaultValue={userGroup}
                    options={groupOptions}
                  />
                </Col>
                <Col xs={24} lg={8} xl={10}>
                  <Select
                    className='tw-w-full tw-max-w-[380px]'
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
                <Col xs={24} lg={8} xl={10} className='lg:tw-text-right'>
                  <Search
                    value={query}
                    placeholder={t('timesheet.findDataByAttendanceCode')}
                    onChange={(event) => handleSearchValueChange(event.target.value)}
                    className='tw-w-full tw-max-w-[380px]'
                  />
                  {/* <Button icon={<MenuOutlined />} type='default'>
                    Lọc
                  </Button> */}
                </Col>
              </Row>
            </div>
            <div className='tw-text-yellow-600 tw-mt-[10px] tw-text-[13px]'>{t('timesheet.tableNote')}</div>
            <div className='timesheet-table'>
              <Table
                rowKey='id'
                columns={columns}
                dataSource={timesheetSate.timesheetList}
                loading={timesheetSate.loading}
                scroll={{ y: 'calc(100vh - 338px)', x: 800 }}
                rowClassName={(record: IAttendance) =>
                  record?.reportData?.dateType !== 'WORKING_DATE'
                    ? record?.reportData?.dateType?.toLocaleLowerCase()
                    : ''
                }
                onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
                pagination={{
                  className: 'd-flex justify-content-end align-items-center',
                  current: timesheetSate?.meta && timesheetSate?.meta?.page + 1,
                  total: timesheetSate?.meta?.total,
                  defaultPageSize: timesheetSate?.meta?.size,
                  pageSize: timesheetSate?.meta?.size,
                  pageSizeOptions: ['5', '10', '15', '25', '50'],
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
                className={`timesheet-table__checkbox ${
                  timesheetSate?.meta?.total < 1 && 'timesheet-table__checkbox--nodata'
                }`}
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
      <SyncTimeAttendanceModal
        open={syncTimeAttendance}
        handleClose={() => setSyncTimeAttendance(!syncTimeAttendance)}
        onSyncSuccess={() => setSyncManualSuccess(!syncManualSuccess)}
      />
    </Row>
  )
}

export default Timesheet
