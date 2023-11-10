import { Col, DatePicker, Form, Input, Row } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { FC, useState } from 'react'
import { ROLE } from '~/constants/app.constant'
import { useUserInfo } from '~/stores/hooks/useUserProfile'

const InitProps: FC<any> = function InitProps(props) {
  const { form } = props
  const { userInfo } = useUserInfo()
  const systemAdminInfo = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)
  const [disabledForm, setDisabledForm] = useState(true)

  const onChangeDisabled = () => {
    setDisabledForm(!disabledForm)
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
            <Form.Item label='Phiên bản' name='rev' rules={[{ required: true, message: 'Trường bắt buộc' }]}>
              <Input placeholder='Nhập tên phiên bản' />
            </Form.Item>
          </Col>
          <Col span={9} offset={1}>
            <Form.Item
              label='Ngày áp dụng'
              name='applyFromDate'
              rules={[{ required: true, message: 'Trường bắt buộc' }]}
            >
              <DatePicker className='tw-w-full' placeholder='Chọn ngày áp dụng' format='DD/MM/YYYY' />
            </Form.Item>
          </Col>

          <Col span={9} offset={1}>
            <Form.Item label='Ngày kết thúc' name='applyToDate'>
              <DatePicker className='tw-w-full' placeholder='Chọn ngày kết thúc' format='DD/MM/YYYY' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default InitProps
