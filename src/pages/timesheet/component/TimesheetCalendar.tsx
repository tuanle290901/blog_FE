import React, { useState } from 'react'
import { BadgeProps, Calendar, Badge, Space, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
// import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'

const TimesheetCalendar: React.FC = () => {
  // const [t] = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(dayjs('2023-07-01'))

  const getListData = (value: Dayjs) => {
    let listData
    switch (value.date()) {
      case 8:
        listData = [{ type: 'success', content: 'Đúng giờ' }]
        break
      case 10:
        listData = [{ type: 'error', content: 'Về sớm' }]
        break
      case 15:
        listData = [{ type: 'error', content: 'Đến muộn' }]
        break
      default:
    }
    return listData || []
  }

  const dateCellRender = (value: Dayjs) => {
    console.log('value', value)
    const listData = getListData(value)
    return (
      <ul className='events'>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
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
