import { Col, DatePicker, Form, Input, Row } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { FC, useEffect, useState } from 'react'
import { ROLE } from '~/constants/app.constant'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { useLocation } from 'react-router-dom'
import { REGEX_SPECIAL_CHARS } from '~/constants/regex.constant'
import dayjs from 'dayjs'
import { RangePickerProps } from 'antd/es/date-picker'

const InitProps: FC<any> = function InitProps(props) {
  const location = useLocation()
  const { form } = props
  const { userInfo } = useUserInfo()
  const systemAdminInfo = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)
  const [disabledForm, setDisabledForm] = useState(true)

  const onChangeDisabled = () => {
    setDisabledForm(!disabledForm)
  }

  useEffect(() => {
    if (location.pathname && location.pathname.includes('view-revison')) {
      setDisabledForm(true)
    } else {
      setDisabledForm(false)
    }
  }, [location.pathname])

  const isEndDateDisabled: RangePickerProps['disabledDate'] = (current) => {
    const startDate = form.getFieldValue('applyFromDate')
    return startDate && current && current <= startDate.endOf('day')
  }
  const isStartDateDisabled: RangePickerProps['disabledDate'] = (current) => {
    const startDate = form.getFieldValue('applyToDate')
    return startDate && current && current >= startDate.endOf('day')
  }

  return (
    <div className='tw-w-full'>
      <div className='tw-text-md tw-font-semibold tw-mb-4 tw-mt-4'>
        <span>Quy trình xử lý yêu cầu</span>
        {systemAdminInfo?.role === ROLE.SYSTEM_ADMIN && (
          <span className='tw-ml-1 tw-cursor-pointer' onClick={onChangeDisabled}>
            <EditOutlined />
          </span>
        )}
      </div>
      <Form form={form} layout='horizontal' disabled={disabledForm}>
        <Row align='middle'>
          <Col span={4}>
            <Form.Item
              label='Phiên bản'
              name='rev'
              rules={[
                { required: true, message: 'Trường bắt buộc' },
                {
                  pattern: REGEX_SPECIAL_CHARS,
                  message: 'Tên không chưa các ký tự đặc biệt'
                }
              ]}
            >
              <Input disabled={location.pathname.includes('view-revison')} placeholder='Nhập tên phiên bản' />
            </Form.Item>
          </Col>
          <Col span={9} offset={1}>
            <Form.Item
              label='Ngày áp dụng'
              name='applyFromDate'
              rules={[{ required: true, message: 'Trường bắt buộc' }]}
            >
              <DatePicker
                disabledDate={isStartDateDisabled}
                className='tw-w-full'
                placeholder='Chọn ngày áp dụng'
                format='DD/MM/YYYY'
              />
            </Form.Item>
          </Col>

          <Col span={9} offset={1}>
            <Form.Item label='Ngày kết thúc' name='applyToDate'>
              <DatePicker
                disabledDate={isEndDateDisabled}
                className='tw-w-full'
                placeholder='Chọn ngày kết thúc'
                format='DD/MM/YYYY'
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default InitProps
