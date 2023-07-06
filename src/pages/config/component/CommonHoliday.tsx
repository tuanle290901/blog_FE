/* eslint-disable prettier/prettier */
import { DeleteOutlined, EditOutlined, LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Space, Badge, Calendar, Modal, Form, Input, DatePicker } from 'antd'
import type { BadgeProps } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import React, { useState } from 'react'
interface Holiday {
  from_date: string
  to_date: string
  content: string
}

function CommonHoliday() {
  const [form] = Form.useForm()
  const { RangePicker } = DatePicker
  const [isModalOpenCreateUpdateHoliday, setIsModalOpenCreateUpdateHoliday] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(dayjs('2023-07-01'))

  const list_holiday: Holiday[] = [
    {
      from_date: '01/07/2023',
      to_date: '01/07/2023',
      content: ''
    },
    {
      from_date: '02/07/2023',
      to_date: '03/07/2023',
      content: 'Ngày sinh'
    },
    {
      from_date: '10/07/2023',
      to_date: '10/07/2023',
      content: 'Ngày Quốc tế người tị nạn'
    },
    {
      from_date: '21/07/2023',
      to_date: '21/07/2023',
      content: 'Ngày Lễ hè'
    },
    {
      from_date: '27/07/2023',
      to_date: '29/07/2023',
      content: 'Ngày Người lưởi'
    }
  ]

  const convertTimeIntervalToDate = () => {
    const allDates: string[] = []
    list_holiday.forEach((range) => {
      const fromDateParts: string[] = range.from_date.split('/')
      const toDateParts: string[] = range.to_date.split('/')

      const fromDate: Date = new Date(
        parseInt(fromDateParts[2]),
        parseInt(fromDateParts[1]) - 1,
        parseInt(fromDateParts[0])
      )

      const toDate: Date = new Date(parseInt(toDateParts[2]), parseInt(toDateParts[1]) - 1, parseInt(toDateParts[0]))

      const datesInRange: string[] = []

      while (fromDate <= toDate) {
        datesInRange.push(formatDate(fromDate))
        fromDate.setDate(fromDate.getDate() + 1)
      }

      allDates.push(...datesInRange)
    })

    return allDates
  }

  function formatDate(date: Date): string {
    const day: number = date.getDate()
    const month: number = date.getMonth() + 1
    const year: number = date.getFullYear()
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  }

  const getListData = (value: Dayjs) => {
    let listData
    const holidays = convertTimeIntervalToDate()
    if (holidays.includes(value.format('DD/MM/YYYY'))) {
      listData = [{ type: 'error', content: '' }]
    }
    return listData || []
  }

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394
    }
  }

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value)
    return num ? (
      <div className='notes-month'>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null
  }

  const dateCellRender = (value: Dayjs) => {
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
    if (info.type === 'month') return monthCellRender(current)
    return info.originNode
  }

  const handleCreateOrUpdateHoliday = () => {
    setIsModalOpenCreateUpdateHoliday(false)
  }

  const handleCloseModalCreateHoliday = () => {
    setIsModalOpenCreateUpdateHoliday(false)
  }

  const onEditHoliday = (holiday: Holiday) => {
    form.setFieldsValue({
      title: holiday.content,
      holidays: [dayjs(holiday.from_date, 'DD/MM/YYYY'), dayjs(holiday.to_date, 'DD/MM/YYYY')]
    })
    setIsModalOpenCreateUpdateHoliday(true)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  return (
    <div className='common-holiday'>
      <div className='header'>
        <Space align='baseline'>
          <Button type='default' shape='circle' icon={<LeftOutlined />} size='middle' onClick={handlePrevMonth} />
          <h1>{currentMonth.format('MMMM, YYYY')}</h1>
          <Button type='default' shape='circle' icon={<RightOutlined />} size='middle' onClick={handleNextMonth} />
        </Space>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          size='middle'
          onClick={() => setIsModalOpenCreateUpdateHoliday(true)}
        >
          Thêm ngày nghỉ
        </Button>
      </div>
      <div className='content'>
        <Calendar cellRender={cellRender} value={currentMonth} />
        <div className='list-of-holidays'>
          Danh sách ngày nghỉ trong tháng 7 ({list_holiday.length})
          <ul>
            {list_holiday.map((holiday, index) => {
              return (
                <li key={index}>
                  <div className='holiday'>
                    <span className='separation-point' />
                    <span>
                      {holiday.from_date} : {holiday.content}
                    </span>
                    <Button type='text' onClick={() => onEditHoliday(holiday)} icon={<EditOutlined />} />
                    <Button type='text' icon={<DeleteOutlined />} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <Modal
          title='Thêm ngày nghỉ'
          open={isModalOpenCreateUpdateHoliday}
          onOk={form.submit}
          onCancel={handleCloseModalCreateHoliday}
          okText='Lưu'
          cancelText='Hủy bỏ'
        >
          <Form
            form={form}
            onFinish={handleCreateOrUpdateHoliday}
            autoComplete='off'
            layout='vertical'
            className='create-holiday'
          >
            <Form.Item
              label='Tiêu đề'
              name='title'
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Ngày nghỉ'
              name='holidays'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default CommonHoliday
