import { Col, Form, Input, Row } from 'antd'
import { FC } from 'react'

const InitProps: FC<any> = function InitProps(props) {
  const { form } = props
  return (
    <div className='tw-w-full'>
      <div className='tw-text-md tw-font-semibold tw-mb-4 tw-mt-4'>Thiết lập quy trình xử lý yêu cầu</div>
      <Form form={form} layout='horizontal'>
        <Row align='middle'>
          <Col span={8}>
            <Form.Item label='Biểu mẫu yêu cầu' name='name'>
              <Input placeholder='Biểu mẫu yêu cầu' />
            </Form.Item>
          </Col>
          <Col span={15} offset={1}>
            <Form.Item label='Mô tả' name='description'>
              <Input placeholder='Mô tả' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default InitProps
