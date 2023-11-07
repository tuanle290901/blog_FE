import { Col, DatePicker, Form, Input, Row } from 'antd'
import { FC } from 'react'

const InitProps: FC<any> = function InitProps(props) {
  const { form } = props
  return (
    <div className='tw-w-full'>
      <div className='tw-text-md tw-font-semibold tw-mb-4 tw-mt-4'>Quy trình xử lý yêu cầu</div>
      <Form form={form} layout='horizontal'>
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
