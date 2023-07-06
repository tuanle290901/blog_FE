import React from 'react'
import { Button, DatePicker, Table } from 'antd'
import DaySelected from './component/DaySelected'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PlusCircleFilled, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { IAttendance } from '~/types/attendance.interface'

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
      ellipsis: true
    },
    {
      title: t('Thời gian đến'),
      dataIndex: 'timeStart',
      key: 'timeStart',
      render: (text) => {
        return text || '--'
      }
    },
    {
      title: t('Thời gian về'),
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      render: (text) => {
        return text || '--'
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
    { id: '123abc', date: '20/06/2023', timeStart: '08:25', timeEnd: '17:26', status: 'early' },
    { id: '234abc', date: '21/06/2023', timeStart: '08:20', timeEnd: '17:35', status: 'ontime' },
    { id: '345abc', date: '22/06/2023', timeStart: '08:35', timeEnd: '17:32', status: 'late' },
    { id: '456abc', date: '23/06/2023', timeStart: '09:10', timeEnd: '17:55', status: 'waiting' },
    { id: '567abc', date: '24/06/2023', timeStart: '', timeEnd: '', status: '' }
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
