import React, { useState } from 'react'
import { Calendar, Space, Button, Tooltip } from 'antd'
import { LeftOutlined, RightOutlined, PlusCircleFilled, CheckCircleFilled, FieldTimeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import { IAttendance } from '~/types/attendance.interface'
interface ITimeKeepingNote {
  status: string
  startTime: string
  endTime: string
  reason: string
}
interface ITimeKeeping {
  date: string
  data: ITimeKeepingNote[]
}

const TimesheetCalendar: React.FC<{ data: IAttendance[]; handleOpenModal: any }> = ({ handleOpenModal }) => {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(dayjs())

  const listTimeKeeping = [
    { date: '2023-06-15', data: [{ reason: '', status: 'ontime', startTime: '08:10', endTime: '17:50' }] },
    { date: '2023-07-18', data: [{ reason: '', status: 'ontime', startTime: '08:20', endTime: '17:35' }] },
    { date: '2023-07-24', data: [{ reason: '', status: 'ontime', startTime: '08:20', endTime: '17:35' }] },
    { date: '2023-07-07', data: [{ reason: '', status: 'ontime', startTime: '08:20', endTime: '17:35' }] },
    {
      date: '2023-07-05',
      data: [{ reason: 'Hỏng xe', status: 'late', startTime: '09:55', endTime: '17:35' }]
    },
    {
      date: '2023-07-13',
      data: [{ reason: '', status: 'late', startTime: '08:25', endTime: '17:35' }]
    },
    {
      date: '2023-07-20',
      data: [{ reason: 'Đi gặp khách hàng', status: 'early', startTime: '08:26', endTime: '17:08' }]
    },
    { date: '2023-08-12', data: [{ reason: '', status: 'ontime', startTime: '08:30', endTime: '18:15' }] }
  ]

  const dateCellRender = (value: Dayjs) => {
    return listTimeKeeping.map(
      (renderCell: ITimeKeeping) =>
        renderCell?.date === dayjs(value).format('YYYY-MM-DD') && (
          <div key={renderCell?.date}>
            {renderCell?.data?.map((cellContent: ITimeKeepingNote, index) => (
              <div key={index}>
                <div>
                  {cellContent?.status === 'ontime' ? (
                    <Tooltip
                      title={
                        <div>
                          <div className='tw-flex'>
                            <span className='tw-mr-3'>{t('timesheet.startTime')}:</span>
                            <span className='tw-ml-auto'>{cellContent?.startTime}</span>
                          </div>
                          <div className='tw-flex'>
                            <span className='tw-mr-3'>{t('timesheet.endTime')}:</span>
                            <span className='tw-ml-auto'>{cellContent?.endTime}</span>
                          </div>
                        </div>
                      }
                      color='#52c41a'
                    >
                      <CheckCircleFilled className='tw-text-[#52c41a] tw-mr-3' />
                      {t('timesheet.ontime')}
                    </Tooltip>
                  ) : cellContent?.status === 'early' || cellContent?.status === 'late' ? (
                    <Tooltip
                      className='tw-text-[#f5222d]'
                      title={
                        <div>
                          <div className={`tw-flex ${cellContent?.status === 'early' ? '' : 'tw-text-[#f5222d]'}`}>
                            <span className='tw-mr-3'>{t('timesheet.startTime')}:</span>
                            <span className='tw-ml-auto'>{cellContent?.startTime}</span>
                          </div>
                          <div className={`tw-flex ${cellContent?.status === 'early' ? 'tw-text-[#f5222d]' : ''}`}>
                            <span className='tw-mr-3'>{t('timesheet.endTime')}:</span>
                            <span className='tw-ml-auto'>{cellContent?.endTime}</span>
                          </div>
                        </div>
                      }
                      color='#FFC069'
                    >
                      <FieldTimeOutlined className='tw-text-[#f5222d] tw-mr-3' />
                      {cellContent?.status === 'early'
                        ? t('timesheet.leavingTheCompanyEarly')
                        : t('timesheet.lateForWork')}
                    </Tooltip>
                  ) : (
                    <p>{t('timesheet.nodata')}</p>
                  )}
                </div>
                <div>
                  {cellContent?.reason ? (
                    cellContent?.reason
                  ) : cellContent?.status === 'ontime' ? (
                    ''
                  ) : (
                    <Button
                      className='tw-border-none tw-mt-1'
                      size='small'
                      onClick={() => handleOpenModal(true)}
                      icon={<PlusCircleFilled className='tw-text-[#ffe53b]' />}
                    >
                      {t('timesheet.addNewNote')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
    )
  }

  const cellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type === 'date') return dateCellRender(current)
    return info.originNode
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  return (
    <div className='timesheet-calendar tw-mt-2'>
      <Space align='baseline' className='tw-mb-3'>
        <Button type='default' shape='circle' icon={<LeftOutlined />} size='middle' onClick={handlePrevMonth} />
        <p>{currentMonth.format('MMMM, YYYY')}</p>
        <Button type='default' shape='circle' icon={<RightOutlined />} size='middle' onClick={handleNextMonth} />
      </Space>
      <Calendar cellRender={cellRender} value={currentMonth} />
    </div>
  )
}

export default TimesheetCalendar
