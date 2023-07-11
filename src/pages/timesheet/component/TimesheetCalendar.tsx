import React, { useState } from 'react'
import { BadgeProps, Calendar, Badge, Space, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
// import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import { IAttendance } from '~/types/attendance.interface'
interface ITimeKeepingNote {
  type: string
  content: string
}
interface ITimeKeeping {
  date: string
  data: ITimeKeepingNote[]
}

const TimesheetCalendar: React.FC<{ data: IAttendance[] }> = () => {
  // const [t] = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(dayjs())

  const listTimeKeeping = [
    { date: '2023-06-15', data: [{ type: 'success', content: 'Đúng giờ' }] },
    { date: '2023-07-03', data: [{ type: 'success', content: 'Đúng giờ' }] },
    {
      date: '2023-07-11',
      data: [
        { type: 'error', content: 'Đến muộn' },
        { type: 'error', content: 'Về sớm' }
      ]
    },
    { date: '2023-07-20', data: [{ type: 'error', content: 'Đến muộn' }] },
    { date: '2023-08-12', data: [{ type: 'success', content: 'Đúng giờ' }] }
  ]

  const dateCellRender = (value: Dayjs) => {
    return listTimeKeeping.map(
      (renderCell: ITimeKeeping) =>
        renderCell?.date === dayjs(value).format('YYYY-MM-DD') && (
          <ul key={renderCell?.date} className='events'>
            {renderCell?.data?.map((cellContent: ITimeKeepingNote) => (
              <li key={cellContent.content}>
                <Badge status={cellContent?.type as BadgeProps['status']} text={cellContent?.content} />
              </li>
            ))}
          </ul>
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
    <div className='tw-mt-2'>
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
