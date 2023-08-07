import type { BadgeProps } from 'antd'
import {
  Badge,
  Button,
  Calendar,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  notification
} from 'antd'
import { SelectInfo } from 'antd/es/calendar/generateCalendar'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import { useEffect, useState } from 'react'
import { ExclamationCircleFilled } from '@ant-design/icons'
import {
  addOneHolidaySchedule,
  deleteHolidaySchedule,
  getListHoliday,
  updateHolidaySchedule
} from '~/stores/features/holiday-schedule/holiday-schedule.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IHoliday } from '~/types/holiday-schedule'
import { convertMonthToLocaleVi } from '~/utils/helper'
import '../index.scss'

const { confirm } = Modal

const { RangePicker } = DatePicker
const headerRender = ({ value, onChange }: any) => {
  const start = 0
  const end = 12
  const monthOptions = []

  let current = value.clone()
  const localeData = value.localeData()
  const months = []
  for (let i = 0; i < 12; i++) {
    current = current.month(i)
    months.push(localeData.monthsShort(current))
  }

  for (let i = start; i < end; i++) {
    monthOptions.push(
      <Select.Option key={i} value={i} className='month-item'>
        {convertMonthToLocaleVi(months[i])}
      </Select.Option>
    )
  }

  const year = value.year()
  const month = value.month()
  const options = []
  for (let i = year - 10; i < year + 10; i += 1) {
    options.push(
      <Select.Option key={i} value={i} className='year-item'>
        {i}
      </Select.Option>
    )
  }
  return (
    <div className='tw-w-full tw-flex'>
      <Row className='tw-ml-auto'>
        <Space>
          <Col>
            <Select
              size='large'
              className='my-year-select'
              value={month}
              onChange={(newMonth) => {
                const now = value.clone().month(newMonth)
                onChange(now)
              }}
            >
              {monthOptions}
            </Select>
          </Col>
          <Col>
            <Select
              size='large'
              className='my-year-select'
              value={year}
              onChange={(newYear) => {
                const now = value.clone().year(newYear)
                onChange(now)
              }}
            >
              {options}
            </Select>
          </Col>
        </Space>
      </Row>
    </div>
  )
}

const HolidayScheduleConfig = () => {
  const dispatch = useAppDispatch()
  const [form] = useForm()
  const holidayList = useAppSelector((item) => item.holidaySchedule.holidayList)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(getListHoliday())
  }, [])

  const getListData = (value: Dayjs) => {
    const formattedDate = value.format('YYYY-MM-DD')
    const listData: { type: string; content: string }[] = []
    holidayList.forEach((holiday) => {
      const start = dayjs(holiday.startAt).format('YYYY-MM-DD')
      const end = dayjs(holiday.endAt).format('YYYY-MM-DD')
      if (formattedDate >= start && formattedDate <= end) {
        listData.push({ type: 'error', content: holiday.name })
      }
    })
    return listData
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleRemoveHoliday = async () => {
    const holidayDetail = form.getFieldsValue() as IHoliday
    if (holidayDetail.id) {
      showConfirm(holidayDetail)
    }
  }

  const showConfirm = (holidayDetail: IHoliday) => {
    confirm({
      title: (
        <div>
          <span>Bạn có chắc chắn muốn xóa</span> <span className='tw-font-bold'>{holidayDetail.name}</span>
        </div>
      ),
      icon: <ExclamationCircleFilled />,
      content: (
        <div>
          <div>{holidayDetail.name}</div>
          <div>{holidayDetail.note}</div>
          <div>{holidayDetail.endAt}</div>
        </div>
      ),
      onOk: async () => {
        if (holidayDetail.id) {
          await dispatch(deleteHolidaySchedule(holidayDetail.id))
          notification.success({ message: 'Xóa ngày nghỉ thành công' })
          await dispatch(getListHoliday())
          setIsModalOpen(false)
        }
      },
      onCancel() {
        // TODO
      }
    })
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
    return info.originNode
  }

  const onSelectDate = (date: Dayjs, { source }: SelectInfo) => {
    if (source === 'date') {
      const formattedDate = date.format('YYYY-MM-DD')
      const existedDate = holidayList.find((item) => formattedDate >= item.startAt && formattedDate <= item.endAt)
      form.setFieldsValue({
        id: existedDate ? existedDate.id : null,
        name: existedDate ? existedDate.name : '',
        date: existedDate ? [dayjs(existedDate.startAt), dayjs(existedDate.endAt)] : [date, date],
        note: existedDate ? existedDate.note : ''
      })
      setIsModalOpen(true)
    }
  }

  const onFinish = async ({ id, name, date, note }: { id: string; name: string; date: Dayjs[]; note: string }) => {
    const payload: IHoliday = {
      id,
      name,
      startAt: date[0].format('YYYY-MM-DD'),
      endAt: date[1].format('YYYY-MM-DD'),
      type: 'HOLIDAY',
      note
    }
    if (id) {
      await dispatch(updateHolidaySchedule(payload))
      notification.success({ message: 'Cập nhật ngày nghỉ thành công' })
    } else {
      await dispatch(addOneHolidaySchedule(payload))
      notification.success({ message: 'Thêm mới ngày nghỉ thành công' })
    }
    await dispatch(getListHoliday())

    setIsModalOpen(false)
  }

  const onFinishFailed = () => {
    // TODO
  }

  return (
    <div className='tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white holiday-schedule-container'>
      <h1 className='tw-text-2xl tw-font-semibold'>Cấu hình danh sách ngày nghỉ lễ</h1>
      <Calendar mode='month' cellRender={cellRender} onSelect={onSelectDate} headerRender={headerRender} />

      <Modal title='Thêm ngày nghỉ' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form
          form={form}
          name='basic'
          layout='vertical'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item label='Tiêu đề' name='name' rules={[{ required: true, message: 'Trường bắt buộc' }]}>
            <Input placeholder='Nhập tiêu đề' />
          </Form.Item>

          <Form.Item label='Thời gian nghỉ' name='date' rules={[{ required: true, message: 'Trường bắt buộc' }]}>
            <RangePicker placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} format={'DD/MM/YYYY'} className='tw-w-full' />
          </Form.Item>

          <Form.Item label='Ghi chú' name='note'>
            <TextArea placeholder='Nhập chi chú' />
          </Form.Item>

          <Form.Item label='ID' name='id' style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space className='tw-float-right'>
              <Button type='default' onClick={handleCancel}>
                Quay lại
              </Button>
              {form.getFieldValue('id') && (
                <Button danger onClick={handleRemoveHoliday}>
                  Xóa ngày nghỉ
                </Button>
              )}

              <Button type='primary' htmlType='submit'>
                Thêm ngày nghỉ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default HolidayScheduleConfig
