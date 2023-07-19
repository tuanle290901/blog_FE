import { Button, Col, Form, Input, Modal, Row, notification } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { REGEX_PASSWORD } from '~/constants/regex.constant'

interface IChangePassword {
  showModal: boolean | false
  handClose: () => void
}

const ChangePassword: React.FC<IChangePassword> = (props) => {
  const { showModal, handClose } = props
  const [t] = useTranslation()
  const [form] = Form.useForm()

  const onCancel = async () => {
    await handClose()
    form.resetFields()
  }

  const onSave = async () => {
    const { password, newPassword } = form.getFieldsValue()
    if (password !== newPassword) {
      notification.warning({
        message: 'Hai mật khẩu không giống nhau'
      })
    }
    await handClose()
    form.resetFields()
  }

  return (
    <Modal open={showModal} forceRender footer={null} closable={false} maskClosable={false}>
      <Form form={form} layout='vertical' onFinish={onSave} className='tw-my-[15px]'>
        <Form.Item
          label={<div className='tw-font-semibold'>{t('Mật khẩu mới')}</div>}
          name='password'
          rules={[
            {
              pattern: REGEX_PASSWORD,
              message: `${t('Tài khoản mật khẩu phải có 1 chữ hoa, một ký tự đặc biệt, phải lớn hơn 6 ký tự')}`
            }
          ]}
        >
          <Input.Password placeholder='Nhập mật khẩu mới' maxLength={32} minLength={6} />
        </Form.Item>
        <Form.Item
          label={<div className='tw-font-semibold'>{t('Xác nhận mât khẩu mới')}</div>}
          name='newPassword'
          rules={[
            {
              pattern: REGEX_PASSWORD,
              message: `${t('Tài khoản mật khẩu phải có 1 chữ hoa, một ký tự đặc biệt, phải lớn hơn 6 ký tự')}`
            }
          ]}
        >
          <Input.Password placeholder='Nhập lại mật khẩu vừa đặt' maxLength={32} minLength={6} />
        </Form.Item>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Button className='tw-w-full' type='primary' htmlType='submit'>
              {t('Xác nhận')}
            </Button>
          </Col>
          <Col span={24}>
            <Button className='tw-w-full' onClick={() => onCancel()}>
              {t('Hủy bỏ')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ChangePassword
