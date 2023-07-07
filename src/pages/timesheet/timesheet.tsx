import React from 'react'
import { Button, DatePicker, Table } from 'antd'
import DaySelected from './component/DaySelected'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PlusCircleFilled, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { IAttendance } from '~/types/attendance.interface'
import dayjs from 'dayjs'

const Timesheet: React.FC = () => {
  const { RangePicker } = DatePicker
  const [t] = useTranslation()
  const handleClickAddReason = (record: IAttendance) => {
    console.log(record)
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
    { id: '7abc', date: '2023-07-26', timeStart: '08:10', timeEnd: '17:51', status: 'ontime' },
    { id: '8abc', date: '2023-07-27', timeStart: '07:10', timeEnd: '17:52', status: 'ontime' },
    { id: '9abc', date: '2023-07-28', timeStart: '08:10', timeEnd: '17:55', status: 'ontime' },
    { id: '10abc', date: '2023-07-29', timeStart: '09:10', timeEnd: '17:55', status: 'waiting' },
    { id: '567abc', date: '2023-07-30', timeStart: '', timeEnd: '', status: '' }
  ]

  return (
    <div className='timesheet tw-p-5'>
      <div className=' tw-bg-white tw-p-5'>
        <div className='tw-flex tw-items-center tw-mb-8'>
          <div className='tw-mr-[10px]'>Thời gian thống kê:</div>
          <RangePicker format='DD/MM/YYYY' />
        </div>
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
      </div>
    </div>
  )
}

export default Timesheet
