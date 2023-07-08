import React, { useState } from 'react'
import { Button, Col, DatePicker, Image, Row, Segmented, Table } from 'antd'
import DaySelected from './component/DaySelected'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PlusCircleFilled, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { IAttendance } from '~/types/attendance.interface'
import dayjs from 'dayjs'
import TimesheetForm from './component/TimesheetForm'
import DefaultImage from '~/assets/images/default-img.png'
import IconBag from '~/assets/images/timesheet/icon_bag.png'
import TimesheetCalendar from './component/TimesheetCalendar'

const Timesheet: React.FC = () => {
  const { RangePicker } = DatePicker
  const [t] = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [mode, setMode] = useState('calendar')

  const handleClickAddReason = (record: IAttendance) => {
    setIsOpenModal(true)
  }

  const handleCloseTimesheetModal = () => {
    setIsOpenModal(false)
  }

  const handleSelectDate = (dataSelected: any) => {
    console.log(dayjs(dataSelected[0]).format('DD/MM/YYYY'))
    console.log(dayjs(dataSelected[1]).format('DD/MM/YYYY'))
  }

  const columns: ColumnsType<IAttendance> = [
    {
      title: t('Ngày điểm danh'),
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY')
      }
    },
    {
      title: t('Thời gian đến'),
      dataIndex: 'timeStart',
      key: 'timeStart',
      render: (timeStart, record) => {
        return <span className={`${record.status === 'late' ? 'tw-text-[#D46B08]' : ''}`}>{timeStart || '--'}</span>
      }
    },
    {
      title: t('Thời gian về'),
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      render: (timeEnd, record) => {
        return <span className={`${record.status === 'early' ? 'tw-text-[#D46B08]' : ''}`}>{timeEnd || '--'}</span>
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
                onClick={() => handleClickAddReason(record)}
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

  return (
    <Row className='timesheet tw-p-5'>
      <Col xs={24} xl={4} className='timesheet-short'>
        <div className='tw-text-center'>
          <Image className='tw-max-w-[130px]' src={DefaultImage} alt='' />
          <p className='timesheet-short__fullname'>Quản trị viên</p>
          <p className='timesheet-short__department'>HTSC</p>
          <div className='tw-flex tw-justify-center tw-items-center tw-mt-4'>
            <img className='tw-max-w-[100%]' src={IconBag} alt='' />
            <p>
              <span className='tw-mx-2 tw-text-[20px] tw-font-bold'>{attendanceList?.length}</span>ngày công
            </p>
          </div>
        </div>
        <div className='timesheet-short-info'>
          <div className='timesheet-short-info__item'>
            <p>
              <span>23</span>giờ
            </p>
            <p>Làm thêm (OT)</p>
          </div>
          <div className='timesheet-short-info__item'>
            <p>
              <span>0</span>ngày
            </p>
            <p>Nghỉ bù</p>
          </div>
        </div>
        <div className='timesheet-short-info timesheet-short-info--onbussiness'>
          <div className='timesheet-short-info__item'>
            <p className='tw-border-t-cyan-950'>
              <span>0</span>ngày
            </p>
            <p>Đi công tác</p>
          </div>
          <div className='timesheet-short-info__item'>
            <p>
              <span>0</span>ngày
            </p>
            <p>Nghỉ phép</p>
          </div>
        </div>
        <div className='timesheet-short-info timesheet-short-info--violate'>
          <div className='timesheet-short-info__item'>
            <p>
              <span>0</span>lần
            </p>
            <p>Vi phạm</p>
          </div>
          <div className='timesheet-short-info__item'>
            <p>
              <span>0</span>ngày
            </p>
            <p>Nghỉ không phép</p>
          </div>
        </div>
        <div className='tw-mt-20'>
          <Button className='tw-w-full tw-bg-blue-500 tw-text-white' size='middle' onClick={() => setIsOpenModal(true)}>
            Thêm phép
          </Button>
        </div>
        <div className='tw-mt-3'>
          <Button
            className='tw-w-full tw-border-blue-500 tw-text-blue-500'
            size='middle'
            onClick={() => setIsOpenModal(true)}
          >
            Thời gian làm việc cá nhân
          </Button>
        </div>
      </Col>
      <Col xs={24} xl={20} className=' tw-bg-white tw-p-5'>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {mode === 'list' && (
              <div className='tw-flex tw-items-center tw-mb-8'>
                <div className='tw-mr-[10px]'>Thời gian thống kê:</div>
                <RangePicker onChange={handleSelectDate} format='DD/MM/YYYY' placeholder={['Từ ngày', 'Đến ngày']} />
              </div>
            )}
          </Col>
          <Col xs={24} lg={12} className='tw-text-right'>
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
            <DaySelected data={attendanceList} />
            <div className='tw-mt-6'>
              <Table
                rowKey='id'
                columns={columns}
                dataSource={attendanceList}
                // loading={userState.loading}
                scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
              />
            </div>
          </>
        )}
        {mode === 'calendar' && <TimesheetCalendar />}
      </Col>
      <TimesheetForm open={isOpenModal} handleClose={handleCloseTimesheetModal} />
    </Row>
  )
}

export default Timesheet
