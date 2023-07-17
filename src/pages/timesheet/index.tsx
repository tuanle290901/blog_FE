import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Row, Segmented, Select, Table } from 'antd'
import DaySelected from './component/DaySelected'
import './style.scss'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PlusCircleFilled, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { IAttendance } from '~/types/attendance.interface'
import dayjs from 'dayjs'
import TimesheetForm from './component/TimesheetForm'
import TimesheetCalendar from './component/TimesheetCalendar'
import TimesheetInfo from './component/TimesheetInfo'
import localeVI from 'antd/es/date-picker/locale/vi_VN'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { filterTimesheet, getAllGroup, getUserInGroup } from '~/stores/features/timesheet/timesheet.slice'
import { IPaging, ISort } from '~/types/api-response.interface'
import { FilterValue, SorterResult } from 'antd/es/table/interface'

const Timesheet: React.FC = () => {
  const dispatch = useAppDispatch()
  const { RangePicker } = DatePicker
  const { Option } = Select
  const [t] = useTranslation()
  const authSate = useAppSelector((state) => state.auth)
  const userGroup = authSate?.userInfo?.groupProfiles ? authSate?.userInfo?.groupProfiles[0]?.groupCode : ''
  const groupsSate = useAppSelector((state) => state.timesheet.groups)
  const timesheetSate = useAppSelector((state) => state.timesheet)
  const usersInGroupSate = useAppSelector((state) => state.timesheet.userInGroup)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(userGroup)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs())
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs())
  const [mode, setMode] = useState('calendar')

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
      }
    ]
  })

  const handleClickAddReason = () => {
    setIsOpenModal(true)
  }

  const handleCloseTimesheetModal = () => {
    setIsOpenModal(false)
  }

  const handleSelectDate = (dataSelected: any) => {
    setSelectedStartDate(dayjs(dataSelected[0]))
    setSelectedEndDate(dayjs(dataSelected[1]))
    setSearchValue((prevState) => {
      return {
        ...prevState,
        startDate: `${dayjs(dataSelected[0]).format('YYYY-MM-DD')}T00:00:00Z`,
        endDate: `${dayjs(dataSelected[1]).format('YYYY-MM-DD')}T23:59:59Z`
      }
    })
  }

  const handleSelectToday = () => {
    setSelectedStartDate(dayjs())
    setSelectedEndDate(dayjs())
    setSearchValue((prevState) => {
      return {
        ...prevState,
        startDate: `${dayjs().format('YYYY-MM-DD')}T00:00:00Z`,
        endDate: `${dayjs().format('YYYY-MM-DD')}T23:59:59Z`
      }
    })
  }

  const handleSelectThisMonth = () => {
    setSelectedStartDate(dayjs().startOf('M'))
    setSelectedEndDate(dayjs().endOf('M'))
    setSearchValue((prevState) => {
      return {
        ...prevState,
        startDate: `${dayjs().startOf('M').format('YYYY-MM-DD')}T00:00:00Z`,
        endDate: `${dayjs().endOf('M').format('YYYY-MM-DD')}T23:59:59Z`
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
        startDate: `${dayjs()
          .month(dayjs().month() - 1)
          .startOf('M')
          .format('YYYY-MM-DD')}T00:00:00Z`,
        endDate: `${dayjs()
          .month(dayjs().month() - 1)
          .endOf('M')
          .format('YYYY-MM-DD')}T23:59:59Z`
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

  const columns: ColumnsType<IAttendance> = [
    {
      title: t('timesheet.fullName'),
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true,
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('fullName'),
      render: (userName, record) => {
        return userName || `Nguyễn Đức Anh ${record?.userId?.slice(-2)}`
      }
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
          <span className={`${record.status === 'late' || record.status === 'early' ? 'tw-text-[#D46B08]' : ''}`}>
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
        return <span className={`${record.status === 'late' ? 'tw-text-[#D46B08]' : ''}`}>{startTime || '--'}</span>
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
        return <span className={`${record.status === 'early' ? 'tw-text-[#D46B08]' : ''}`}>{endTime || '--'}</span>
      }
    },
    {
      title: t('timesheet.status'),
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
            {record?.status === 'ontime' ? (
              <div>
                <CheckCircleFilled className='tw-text-[#389E0D] tw-mr-3' />
                {t('timesheet.ontime')}
              </div>
            ) : record?.status === 'waiting' ? (
              <div>
                <MinusCircleFilled className='tw-text-[#096DD9] tw-mr-3' />
                {t('timesheet.waiting')}
              </div>
            ) : (
              <Button
                className='tw-border-none'
                size='middle'
                onClick={() => handleClickAddReason()}
                icon={<PlusCircleFilled className='tw-text-[#ffe53b]' />}
              >
                {t('timesheet.addNewNote')}
              </Button>
            )}
          </div>
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
      //  else {
      //   sorts.push({
      //     direction: 'DESC',
      //     field: 'date'
      //   })
      // }
      return { ...prevState, paging, sorts }
    })
  }

  useEffect(() => {
    const promise = dispatch(getAllGroup())
    setSearchValue((prevState) => {
      return { ...prevState, group: selectedGroup }
    })
    return () => promise.abort()
  }, [])

  useEffect(() => {
    const promise = dispatch(getUserInGroup(selectedGroup))
    setSearchValue((prevState) => {
      return { ...prevState, group: selectedGroup }
    })
    return () => promise.abort()
  }, [selectedGroup])

  useEffect(() => {
    setSearchValue((prevState) => {
      return { ...prevState, userId: selectedUser }
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
  }, [searchValue])

  return (
    <Row className='timesheet tw-p-5'>
      <Col xs={24} xl={6} xxl={4}>
        <TimesheetInfo
          data={timesheetSate.timesheetList}
          userInfo={authSate.userInfo}
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
                        <Option key={i?.userName} label={i?.userName} value={i?.userName}>
                          {i?.userName}
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
          <Col xs={24} lg={6} className='timesheet-filter-tab'>
            <Segmented
              options={[
                { label: t('timesheet.calendar'), value: 'calendar' },
                { label: t('timesheet.list'), value: 'list' }
              ]}
              defaultValue='calendar'
              onChange={(v) => setMode(v.toString())}
            />
          </Col>
        </Row>
        {mode === 'list' && (
          <>
            <DaySelected data={timesheetSate.timesheetList} />
            <div className='tw-mt-6'>
              <Table
                rowKey='id'
                columns={columns}
                dataSource={timesheetSate.timesheetList}
                loading={timesheetSate.loading}
                scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
                onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
              />
              <Checkbox onChange={() => void {}}>{t('timesheet.showOnlyViolateDate')}</Checkbox>
            </div>
          </>
        )}
        {mode === 'calendar' && (
          <TimesheetCalendar data={timesheetSate.timesheetList} handleOpenModal={setIsOpenModal} />
        )}
      </Col>
      <TimesheetForm open={isOpenModal} handleClose={handleCloseTimesheetModal} />
    </Row>
  )
}

export default Timesheet
