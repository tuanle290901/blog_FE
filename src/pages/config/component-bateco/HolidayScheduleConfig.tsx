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
import { useEffect, useRef, useState } from 'react'
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
import { REGEX_TRIM } from '~/constants/regex.constant'
import { useTranslation } from 'react-i18next'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { ROLE } from '~/constants/app.constant'

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
  const { userInfo } = useUserInfo()
  const systemAdminInfo = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)
  const holidayList = useAppSelector((item) => item.holidaySchedule.holidayList)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { t } = useTranslation()
  const selectedHolidayCode = useRef<string>('')

  useEffect(() => {
    dispatch(getListHoliday())
  }, [])

  const getListData = (value: Dayjs) => {
    const formattedDate = value.format('YYYY-MM-DD')
    const listData: { code: string; type: string; content: string }[] = []
    holidayList.forEach((holiday) => {
      const start = dayjs(holiday.startAt).format('YYYY-MM-DD')
      const end = dayjs(holiday.endAt).format('YYYY-MM-DD')
      if (formattedDate >= start && formattedDate <= end) {
        listData.push({ code: holiday.code, type: 'error', content: holiday.name })
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
          try {
            const response: any = await dispatch(deleteHolidaySchedule(holidayDetail.id)).unwrap()
            await dispatch(getListHoliday())
            setIsModalOpen(false)
            notification.success({
              message: response.message
            })
          } catch (error: any) {
            notification.error({
              message: error?.response?.data?.message
            })
          }
        }
      },
      onCancel() {
        // TODO
      }
    })
  }

  const onClickContent = (data: any) => {
    if (data && data.code) {
      selectedHolidayCode.current = data.code
    }
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value)
    return (
      <ul className='events'>
        {listData.map((item) => (
          <li key={item.content} onClick={() => onClickContent(item)}>
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
      form.resetFields()
      const formattedDate = date.format('YYYY-MM-DD')
      const listOfHoliday = holidayList.filter((item) => formattedDate >= item.startAt && formattedDate <= item.endAt)
      const existedDate = listOfHoliday.find((item) => item.code === selectedHolidayCode.current)
      form.setFieldsValue({
        id: existedDate ? existedDate.id : null,
        code: existedDate ? existedDate.code : '',
        name: existedDate ? existedDate.name : '',
        date: existedDate ? [dayjs(existedDate.startAt), dayjs(existedDate.endAt)] : [date, date],
        note: existedDate ? existedDate.note : ''
      })
      setIsModalOpen(true)
    }
  }

  const onFinish = async ({
    id,
    code,
    name,
    date,
    note
  }: {
    id: string
    code: string
    name: string
    date: Dayjs[]
    note: string
  }) => {
    try {
      const payload: IHoliday = {
        id,
        code,
        name,
        startAt: date[0].format('YYYY-MM-DD'),
        endAt: date[1].format('YYYY-MM-DD'),
        type: 'HOLIDAY',
        note
      }
      if (id) {
        const response: any = await dispatch(updateHolidaySchedule(payload))
        if (response?.type?.includes('/rejected')) {
          notification.error({ message: response?.payload?.response?.data?.message })
        } else {
          await dispatch(getListHoliday())
          notification.success({ message: 'Cập nhật ngày nghỉ thành công' })
        }
      } else {
        const response: any = await dispatch(addOneHolidaySchedule(payload))
        if (response?.type?.includes('/rejected')) {
          notification.error({ message: response?.payload?.response?.data?.message })
        } else {
          await dispatch(getListHoliday())
          notification.success({ message: 'Thêm mới ngày nghỉ thành công' })
        }
      }

      setIsModalOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const onFinishFailed = () => {
    // TODO
  }

  return (
    <div className='tw-h-[calc(100%-32px)] tw-m-2 tw-p-2 md:tw-m-4 md:tw-p-4 tw-bg-white holiday-schedule-container'>
      <h1 className='tw-text-2xl tw-font-semibold'>Cấu hình danh sách ngày nghỉ lễ</h1>
      <Calendar
        mode='month'
        cellRender={cellRender}
        onSelect={onSelectDate}
        headerRender={headerRender}
        disabledDate={(date) => {
          if (date.endOf('day').valueOf() < dayjs().valueOf()) {
            return true
          }
          return false
        }}
      />

      <Modal title='Thông tin ngày nghỉ lễ' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
          disabled={systemAdminInfo?.role !== ROLE.SYSTEM_ADMIN}
        >
          <Form.Item
            label='Mã ngày nghỉ'
            name='code'
            rules={[
              {
                required: true,
                message: 'Trường bắt buộc'
              },
              {
                pattern: REGEX_TRIM,
                message: t('rootInit.trim')
              }
            ]}
          >
            <Input placeholder='Nhập mã ngày nghỉ' disabled={form.getFieldValue('id')} />
          </Form.Item>

          <Form.Item
            label='Tiêu đề'
            name='name'
            rules={[
              {
                required: true,
                message: 'Trường bắt buộc'
              },
              {
                pattern: REGEX_TRIM,
                message: t('rootInit.trim')
              }
            ]}
          >
            <Input placeholder='Nhập tiêu đề' />
          </Form.Item>

          <Form.Item
            label='Thời gian nghỉ'
            name='date'
            rules={[
              {
                required: true,
                message: 'Trường bắt buộc'
              },
              {
                pattern: REGEX_TRIM,
                message: t('rootInit.trim')
              }
            ]}
          >
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
                Lưu thông tin
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default HolidayScheduleConfig
