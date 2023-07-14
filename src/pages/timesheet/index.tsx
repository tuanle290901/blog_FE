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
    setSearchValue((prevState) => {
      return {
        ...prevState,
        startDate: `${dayjs(dataSelected[0]).format('YYYY-MM-DD')}T00:00:00Z`,
        endDate: `${dayjs(dataSelected[1]).format('YYYY-MM-DD')}T00:00:00Z`
      }
    })
  }

  const columns: ColumnsType<IAttendance> = [
    {
      title: t('Họ tên'),
      dataIndex: 'userName',
      key: 'userName',
      render: (userName) => {
        return userName || 'Nguyễn Đức Anh'
      }
    },
    {
      title: t('Ngày điểm danh'),
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
      render: (date, record) => {
        return (
          <span className={`${record.status === 'late' || record.status === 'early' ? 'tw-text-[#D46B08]' : ''}`}>
            {dayjs(date).format('DD/MM/YYYY')}
          </span>
        )
      }
    },
    {
      title: t('Thời gian đến'),
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime, record) => {
        return <span className={`${record.status === 'late' ? 'tw-text-[#D46B08]' : ''}`}>{startTime || '--'}</span>
      }
    },
    {
      title: t('Thời gian về'),
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime, record) => {
        return <span className={`${record.status === 'early' ? 'tw-text-[#D46B08]' : ''}`}>{endTime || '--'}</span>
      }
    },
    {
      title: t('Trạng thái'),
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
            {record?.status === 'ontime' ? (
              <div>
                <CheckCircleFilled className='tw-text-[#389E0D] tw-mr-3' />
                Đúng giờ
              </div>
            ) : record?.status === 'waiting' ? (
              <div>
                <MinusCircleFilled className='tw-text-[#096DD9] tw-mr-3' />
                Đang chờ duyệt
              </div>
            ) : (
              <Button
                className='tw-border-none'
                size='middle'
                onClick={() => handleClickAddReason()}
                icon={<PlusCircleFilled className='tw-text-[#ffe53b]' />}
              >
                Thêm lý do
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const attendanceList: IAttendance[] = [
    { id: '1abc', date: '2023-07-20', timeStart: '08:25', timeEnd: '17:26', status: 'early' },
    { id: '2abc', date: '2023-07-21', timeStart: '08:20', timeEnd: '17:35', status: 'ontime' },
    { id: '3abc', date: '2023-07-22', timeStart: '08:35', timeEnd: '17:32', status: 'late' },
    { id: '4abc', date: '2023-07-23', timeStart: '', timeEnd: '', status: '' },
    { id: '5abc', date: '2023-07-24', timeStart: '08:10', timeEnd: '17:45', status: 'ontime' },
    { id: '6abc', date: '2023-07-25', timeStart: '07:10', timeEnd: '17:56', status: 'ontime' },
    { id: '7abc', date: '2023-07-26', timeStart: '08:40', timeEnd: '17:51', status: 'late' },
    { id: '8abc', date: '2023-07-27', timeStart: '07:10', timeEnd: '17:52', status: 'ontime' },
    { id: '9abc', date: '2023-07-28', timeStart: '08:10', timeEnd: '17:55', status: 'ontime' },
    { id: '10abc', date: '2023-07-29', timeStart: '09:10', timeEnd: '17:55', status: 'waiting' },
    { id: '56abc', date: '2023-07-30', timeStart: '', timeEnd: '', status: '' }
  ]

  function handleTableChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | any
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
      } else {
        sorts.push({
          direction: 'DESC',
          field: 'date'
        })
      }
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
        <TimesheetInfo data={timesheetSate.timesheetList} handleOpenModal={setIsOpenModal} />
      </Col>
      <Col xs={24} xl={18} xxl={20} className='timesheet-filter'>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={18}>
            {mode === 'list' && (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={6}>
                  <p className='tw-mb-2'>Lọc theo nhóm</p>
                  <Select
                    className='tw-w-full'
                    showSearch
                    placeholder={`${t('rootInit.requiredSelect')} ${t('rootInit.group')}`}
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label + '').toLowerCase().includes(input.toLowerCase())}
                    // allowClear
                    onClear={() => setSelectedGroup(userGroup)}
                    onChange={(value) => setSelectedGroup(value)}
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
                  <p className='tw-mb-2'>Lọc theo nhân viên</p>
                  <Select
                    className='tw-w-full'
                    showSearch
                    placeholder={`${t('rootInit.requiredSelect')} ${t('nhân viên')}`}
                    optionFilterProp='children'
                    filterOption={(input, option) => {
                      return (option?.label + '').toLowerCase().includes(input.toLowerCase())
                    }}
                    allowClear
                    // onClear={() => setUserOptions([])}
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
                    <div className='tw-mb-2'>Thời gian thống kê</div>
                    <RangePicker
                      onChange={handleSelectDate}
                      format='DD/MM/YYYY'
                      placeholder={['Từ ngày', 'Đến ngày']}
                      locale={localeVI}
                      defaultValue={[dayjs(), dayjs()]}
                      allowClear={false}
                      renderExtraFooter={() => (
                        <div className='timesheet-filter-time__button'>
                          <Button size='small'>Hôm nay</Button>
                          <Button size='small'>Tháng này</Button>
                          <Button size='small'>Tháng trước</Button>
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
                { label: 'Lịch', value: 'calendar' },
                { label: 'Danh sách', value: 'list' }
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
              <Checkbox onChange={() => void {}}>Chỉ hiển thị ngày vi phạm chưa có phép</Checkbox>
            </div>
          </>
        )}
        {mode === 'calendar' && <TimesheetCalendar data={attendanceList} handleOpenModal={setIsOpenModal} />}
      </Col>
      <TimesheetForm open={isOpenModal} handleClose={handleCloseTimesheetModal} />
    </Row>
  )
}

export default Timesheet
