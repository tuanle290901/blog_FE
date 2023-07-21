/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Input, Row, Select, Switch, Table, notification } from 'antd'
import DaySelected from './component/DaySelected'
import './style.scss'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
// import { PlusCircleFilled, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { CheckCircleOutlined } from '@ant-design/icons'
import { IAttendance, IPayloadUpdateAttendance, IReportData, IViolate } from '~/types/attendance.interface'
import dayjs from 'dayjs'
import TimesheetForm from './component/TimesheetForm'
// import TimesheetCalendar from './component/TimesheetCalendar'
import TimesheetInfo from './component/TimesheetInfo'
import localeVI from 'antd/es/date-picker/locale/vi_VN'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import {
  filterTimesheet,
  getAllGroup,
  getUserInGroup,
  updateAttendanceStatistic
} from '~/stores/features/timesheet/timesheet.slice'
import { IPaging, ISort } from '~/types/api-response.interface'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { LocalStorage } from '~/utils/local-storage'
import { IUser } from '~/types/user.interface'
// import { convertUTCToLocaleDate, convertUTCToLocaleTime } from '~/utils/helper'
import { filterTypesOfLeave } from '~/stores/features/types-of-leave/types-of-leave.slice'
import ExcelExportButton from '~/components/ExportExcel/ExcelExportButton'
import ViolateAction from './component/ViolateAction'

const Timesheet: React.FC = () => {
  const dispatch = useAppDispatch()
  const { RangePicker } = DatePicker
  const { Option } = Select
  const [t] = useTranslation()
  const currentAuth: IUser | null = LocalStorage.getObject('currentAuth')
  const userGroup = currentAuth?.groupProfiles[0]?.groupCode
  const groupsSate = useAppSelector((state) => state.timesheet.groups)
  const timesheetSate = useAppSelector((state) => state.timesheet)
  const usersInGroupSate = useAppSelector((state) => state.timesheet.userInGroup)
  const typesOfLeaveSate = useAppSelector((state) => state.typesOfLeave)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(userGroup)
  const [selectedUser, setSelectedUser] = useState(
    currentAuth?.groupProfiles[0]?.role === 'OFFICER' ? usersInGroupSate[0]?.id : ''
  )
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs())
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs())
  const [mode, setMode] = useState('list')
  const [clickUpdateButton, setClickUpdateButton] = useState(false)
  let confirmAttendanceStatisticList: any[] = []
  const typesOfLeaveOptions = typesOfLeaveSate?.listData?.map((item) => {
    return { value: item?.code, label: item?.name }
  })
  const weightOptions: { value: number; label: string }[] = [
    { value: 0.0, label: '0' },
    { value: 0.5, label: '0.5' },
    { value: 1, label: '1' }
  ]

  const [searchValue, setSearchValue] = useState<{
    query: string
    group?: string | null
    userId?: string | null
    startDate?: string | null
    endDate?: string | null
    paging: IPaging
    sorts: ISort[]
  }>({
    query: '',
    paging: {
      page: 0,
      size: 10,
      total: 0,
      totalPage: 0
    },
    sorts: [
      {
        direction: 'DESC',
        field: 'date'
      },
      {
        direction: 'DESC',
        field: 'startTime'
      }
    ]
  })

  // const handleClickAddReason = () => {
  //   setIsOpenModal(true)
  // }

  const handleCloseTimesheetModal = () => {
    setIsOpenModal(false)
  }

  const handleSelectDate = (dataSelected: any) => {
    setSelectedStartDate(dayjs(dataSelected[0]))
    setSelectedEndDate(dayjs(dataSelected[1]))
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
    setSelectedGroup(value)
    setSelectedUser('')
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

  const findViolateBoolean = (data: IViolate[] | null, violateType: string) => {
    if (!data) return -1
    if (data?.findIndex((item: IViolate) => item?.violateType === violateType) > -1) {
      return data?.findIndex((item: IViolate) => item?.violateType === violateType)
    } else {
      return -1
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
          typesOfLeave: typesOfLeave
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
          absenceType: typesOfLeave,
          absenceAmount: 1 - data?.reportData?.workingAmount
        }
      }
    }
    confirmAttendanceStatisticList.push(payload)
  }

  const handleSelectAbsenceAmount = (data: IAttendance, absenceAmount: number) => {
    const index = confirmAttendanceStatisticList.findIndex((item) => item?.id === data?.id)
    let payload = {}
    if (index > -1) {
      payload = {
        date: confirmAttendanceStatisticList[index]?.date,
        id: confirmAttendanceStatisticList[index]?.id,
        userId: confirmAttendanceStatisticList[index]?.userId,
        reportData: {
          ...confirmAttendanceStatisticList[index]?.reportData,
          absenceAmount:
            confirmAttendanceStatisticList[index]?.reportData?.workingAmount + absenceAmount < 1.5
              ? absenceAmount
              : 1 - confirmAttendanceStatisticList[index]?.reportData?.workingAmount
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
          absenceAmount:
            data?.reportData?.workingAmount + absenceAmount < 1.5 ? absenceAmount : 1 - data?.reportData?.workingAmount
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

  const handleApproveViolate = (data: any, violateType: string, confirmed: boolean) => {
    const index = confirmAttendanceStatisticList.findIndex((item) => item?.id === data?.id)
    let payload = {}
    if (index > -1) {
      let reportData = []
      if (confirmAttendanceStatisticList[index]?.reportData?.violate) {
        reportData = confirmAttendanceStatisticList[index].reportData.violate.map(
          (item: { violateType: string; confirmed: boolean }) => {
            if (item.violateType === violateType) {
              return { violateType: item.violateType, confirmed: confirmed }
            }
            return item
          }
        )
      }
      payload = {
        date: confirmAttendanceStatisticList[index]?.date,
        id: confirmAttendanceStatisticList[index]?.id,
        userId: confirmAttendanceStatisticList[index]?.userId,
        reportData: {
          ...confirmAttendanceStatisticList[index]?.reportData,
          violate: reportData
        }
      }
      confirmAttendanceStatisticList.splice(index, 1)
    } else {
      let reportData = []
      if (data?.reportData?.violate) {
        reportData = data.reportData.violate.map((item: { violateType: string; confirmed: boolean }) => {
          if (item.violateType === violateType) {
            return { ...item, confirmed: confirmed }
          }
          return item
        })
      }
      payload = {
        date: data?.date,
        id: data?.id,
        userId: data?.userId,
        reportData: {
          ...data?.reportData,
          violate: reportData
        }
      }
    }
    confirmAttendanceStatisticList.push(payload)
  }

  const columns: ColumnsType<IAttendance> = [
    {
      title: t('timesheet.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      sortOrder: getSortOrder('fullName')
    },
    {
      title: t('timesheet.attendanceDate'),
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('date'),
      render: (date, record) => {
        return (
          <span
            className={
              findViolate(record?.reportData?.violate, 'LATE_COME') ||
              findViolate(record?.reportData?.violate, 'EARLY_BACK')
                ? 'tw-text-[#D46B08]'
                : ''
            }
          >
            {dayjs(date).format('DD/MM/YYYY')}
          </span>
        )
      }
    },
    {
      title: t('timesheet.startTime'),
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('startTime'),
      render: (startTime, record) => {
        return (
          <span
            className={
              findViolate(record?.reportData?.violate, 'LATE_COME') ||
              findViolate(record?.reportData?.violate, 'FORGET_TIME_ATTENDANCE')
                ? 'tw-text-[#D46B08]'
                : ''
            }
          >
            {startTime || '--'}
          </span>
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
      render: (endTime, record) => {
        return (
          <span className={findViolate(record?.reportData?.violate, 'EARLY_BACK') ? 'tw-text-[#D46B08]' : ''}>
            {endTime || '--'}
          </span>
        )
      }
    },
    {
      title: t('Ngày công'),
      dataIndex: 'reportData',
      ellipsis: true,
      width: '102px',
      render: (reportData) => {
        return reportData ? reportData?.workingAmount : ''
      }
    },
    {
      title: t('Công nghỉ'),
      dataIndex: 'reportData',
      ellipsis: true,
      render: (reportData, record) => {
        return (
          reportData?.workingAmount < 1 && (
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
        )
      }
    },
    {
      title: t('Ngày phép'),
      dataIndex: 'reportData',
      ellipsis: true,
      width: '102px',
      render: (reportData, record) => {
        return (
          reportData?.workingAmount < 1 && (
            <Select
              className='tw-w-full'
              onChange={(value) => handleSelectAbsenceAmount(record, value)}
              defaultValue={parseFloat(reportData?.absenceAmount) || 0.0}
              options={weightOptions}
            />
          )
        )
      }
    },
    {
      title: t('timesheet.violate'),
      dataIndex: '',
      key: '',
      ellipsis: true,
      width: '230px',
      render: (record) => {
        return record?.reportData ? (
          <div className='timesheet-violate'>
            {findViolateBoolean(record?.reportData?.violate, 'LATE_COME') > -1 && (
              <div className='tw-flex'>
                <p className='timesheet-violate__lable'>{t('timesheet.lateForWork')}</p>
                <Switch
                  className='tw-ml-auto'
                  checkedChildren='Cho phép'
                  unCheckedChildren='Không duyệt'
                  defaultChecked={
                    record?.reportData?.violate[findViolateBoolean(record?.reportData?.violate, 'LATE_COME')]?.confirmed
                  }
                  onChange={(value) => handleApproveViolate(record, 'LATE_COME', value)}
                />
              </div>
            )}
            {findViolateBoolean(record?.reportData?.violate, 'EARLY_BACK') > -1 && (
              <div className='tw-flex'>
                <p className='timesheet-violate__lable timesheet-violate__lable--early'>
                  {t('timesheet.leavingTheCompanyEarly')}
                </p>
                <Switch
                  className='tw-ml-auto'
                  checkedChildren='Cho phép'
                  unCheckedChildren='Không duyệt'
                  defaultChecked={
                    record?.reportData?.violate[findViolateBoolean(record?.reportData?.violate, 'EARLY_BACK')]
                      ?.confirmed
                  }
                  onChange={(value) => handleApproveViolate(record, 'EARLY_BACK', value)}
                />
              </div>
            )}
            {findViolateBoolean(record?.reportData?.violate, 'FORGET_TIME_ATTENDANCE') > -1 && (
              <div className='tw-flex'>
                <p className='timesheet-violate__lable timesheet-violate__lable--forget'>
                  {t('timesheet.forgetTimeAttendance')}
                </p>
                <Switch
                  className='tw-ml-auto'
                  checkedChildren='Cho phép'
                  unCheckedChildren='Không duyệt'
                  defaultChecked={
                    record?.reportData?.violate[
                      findViolateBoolean(record?.reportData?.violate, 'FORGET_TIME_ATTENDANCE')
                    ]?.confirmed
                  }
                  onChange={(value) => handleApproveViolate(record, 'FORGET_TIME_ATTENDANCE', value)}
                />
              </div>
            )}
          </div>
        ) : (
          ''
        )
      }
    },
    {
      title: t('timesheet.note'),
      dataIndex: '',
      key: '',
      ellipsis: true,
      render: (record) => {
        return (
          <Input
            onChange={(e) => handleAddNote(record, e?.target?.value)}
            defaultValue={record?.reportData?.note || ''}
            className='tw-w-full'
          />
        )
      }
    }
    // {
    //   title: t('timesheet.status'),
    //   key: 'status',
    //   align: 'center',
    //   width: '500px',
    //   render: (_, record) => {
    //     return (
    //       <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
    //         {record?.status === 'ontime' ? (
    //           <div>
    //             <CheckCircleFilled className='tw-text-[#389E0D] tw-mr-3' />
    //             {t('timesheet.ontime')}
    //           </div>
    //         ) : record?.status === 'waiting' ? (
    //           <div>
    //             <MinusCircleFilled className='tw-text-[#096DD9] tw-mr-3' />
    //             {t('timesheet.waiting')}
    //           </div>
    //         ) : (
    //           <>
    //             <Button
    //               className='tw-border-none'
    //               size='middle'
    //               onClick={() => handleClickAddReason()}
    //               icon={<PlusCircleFilled className='tw-text-[#ffe53b]' />}
    //             >
    //               {t('timesheet.addNewNote')}
    //             </Button>
    //           </>
    //         )}
    //       </div>
    //     )
    //   }
    // }
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

  useEffect(() => {
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
    const promise = dispatch(
      filterTimesheet({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query,
        groupCode: searchValue.group,
        startDate: searchValue.startDate,
        endDate: searchValue.endDate,
        userId: searchValue.userId
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue, clickUpdateButton])

  const sheetsData = [
    {
      sheetName: 'Sheet1',
      headers: ['1', '23'],
      data: [
        ['John', 25],
        ['Jane', 30]
      ]
    },
    {
      sheetName: 'Sheet2',
      headers: ['City', 'Population'],
      data: [
        ['New York', 8500000],
        ['London', 8900000]
      ]
    }
  ]
  return (
    <Row className='timesheet tw-p-5'>
      <Col xs={24} xl={6} xxl={4}>
        <TimesheetInfo
          data={timesheetSate.timesheetList}
          meta={timesheetSate?.meta}
          userInfo={currentAuth}
          handleOpenModal={setIsOpenModal}
        />
      </Col>
      <Col xs={24} xl={18} xxl={20} className='timesheet-filter'>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={18}>
            {mode === 'list' && (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={6}>
                  <p className='tw-mb-2'>{t('timesheet.filterByGroup')}</p>
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
                <Col xs={24} lg={6}>
                  <p className='tw-mb-2'>{t('timesheet.filterByEmployee')}</p>
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
                    onChange={(value) => setSelectedUser(value)}
                  >
                    {usersInGroupSate?.length > 0 &&
                      usersInGroupSate?.map((i) => (
                        <Option key={i?.id} label={i?.fullName} value={i?.id}>
                          {i?.fullName || i?.userName}
                        </Option>
                      ))}
                  </Select>
                </Col>
                <Col xs={24} lg={12}>
                  <div className='timesheet-filter-time'>
                    <div className='tw-mb-2'>{t('timesheet.statisticalTime')}</div>
                    <RangePicker
                      onChange={handleSelectDate}
                      format='DD/MM/YYYY'
                      placeholder={[t('timesheet.from'), t('timesheet.to')]}
                      locale={localeVI}
                      defaultValue={[dayjs(), dayjs()]}
                      value={[selectedStartDate, selectedEndDate]}
                      allowClear={false}
                      renderExtraFooter={() => (
                        <div className='timesheet-filter-time__button'>
                          <Button onClick={handleSelectToday} size='small'>
                            {t('timesheet.today')}
                          </Button>
                          <Button onClick={handleSelectThisMonth} size='small'>
                            {t('timesheet.thisMonth')}
                          </Button>
                          <Button onClick={handleSelectLastMonth} size='small'>
                            {t('timesheet.lastMonth')}
                          </Button>
                        </div>
                      )}
                    />
                  </div>
                </Col>
              </Row>
            )}
          </Col>
          {/* {mode === 'list' && (
            <Col xs={24} lg={6} className='tw-flex'>
              <ExcelExportButton fileName='demo' sheetsData={sheetsData} />
            </Col>
          )} */}
          <Col xs={24} lg={6} className='timesheet-filter-tab tw-w-full'>
            <div className='tw-text-right'>
              <Button icon={<CheckCircleOutlined />} type='primary' onClick={() => handleUpdateAttendanceStatistic()}>
                Cập nhật
              </Button>
            </div>
            {/* <Segmented
              options={[
                { label: t('timesheet.calendar'), value: 'calendar' },
                { label: t('timesheet.list'), value: 'list' }
              ]}
              defaultValue='calendar'
              onChange={(v) => setMode(v.toString())}
            /> */}
          </Col>
        </Row>
        {mode === 'list' && (
          <>
            {/* <DaySelected meta={timesheetSate?.meta} /> */}
            <div className='tw-mt-6'>
              {/* <div className='timesheet-listday'>
                {data.map((item) => (
                  <div key={item.id} className={`${handleGenderColor(item.status)} timesheet-listday-item`}>
                    <p className='tw-mb-1'>{handleGenderDayOfWeek(dayjs(item.date).day())}</p>
                    <p className='tw-text-[18px]'>{dayjs(item.date).date()}</p>
                  </div>
                ))}
              </div> */}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <div className='timesheet-workday'>
                    <p>{t('timesheet.totalWorkingDay')}</p>
                    <span>{timesheetSate?.meta?.total}</span>
                  </div>
                </Col>
                <Col xs={24} lg={12} className='tw-flex'>
                  <div className='tw-flex tw-ml-auto'>
                    <div className='timesheet-statistic'>
                      <p>{t('timesheet.leavingTheCompanyEarly')}</p>
                      {/* <span>2</span> */}
                    </div>
                    <div className='timesheet-statistic timesheet-statistic__violate'>
                      <p>{t('timesheet.lateForWork')}</p>
                      {/* <span>1</span> */}
                    </div>
                    <div className='timesheet-statistic timesheet-statistic__waiting'>
                      <p>{t('timesheet.forgetTimeAttendance')}</p>
                      {/* <span>1</span> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className='tw-mt-6'>
              <Table
                rowKey='id'
                columns={columns}
                dataSource={timesheetSate.timesheetList}
                loading={timesheetSate.loading}
                pagination={{ total: timesheetSate?.meta?.total }}
                scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
                onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
              />
              <Checkbox onChange={() => void {}}>{t('timesheet.showOnlyViolateDate')}</Checkbox>
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
