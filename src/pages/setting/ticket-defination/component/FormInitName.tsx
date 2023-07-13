import { Button, Col, Form, Input, Row } from 'antd'
import type { FC } from 'react'
import { FormInitProp } from '../type/ItemTypes'

const FormInitName: FC<FormInitProp> = function FormInitName(props) {
  const { form, onContinue } = props
  return (
    <div className='tw-w-1/3 tw-m-auto'>
      <div className='tw-text-xl tw-font-semibold tw-mb-4 tw-mt-4'>Thiết lập quy trình xử lý yêu cầu</div>
      <Form form={form} onFinish={onContinue} layout='vertical'>
        <Row align='middle' gutter={[0, 16]}>
          <Col span={24}>
            <Form.Item label='Biểu mẫu yêu cầu' name='name'>
              <Input placeholder='Biểu mẫu yêu cầu' size='large' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Mô tả' name='description'>
              <Input placeholder='Mô tả' size='large' />
            </Form.Item>
          </Col>

          <Col span={24} push={20}>
            <Button type='primary' size='large' className='tw-ml-auto' htmlType='submit'>
              Tiếp tục
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default FormInitName
