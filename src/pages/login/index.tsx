import React from 'react'
import { login } from '~/stores/features/auth/auth.slice.ts'
import { useAppDispatch } from '~/stores/hook.ts'
import { LoginPayload } from '~/types/login-payload.ts'
import { useTranslation } from 'react-i18next'

import logo from '~/assets/images/logo.png'
import iconHand from '~/assets/images/login/icon-hand.png'
import { Button, Col, Form, Input, Row } from 'antd'

import './style.scss'

const LoginComponent: React.FC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const onFinish = (formValues: LoginPayload) => {
    console.log(formValues)
    const payload: LoginPayload = { username: formValues.username, password: formValues.password }
    dispatch(login(payload))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const validateMessages = {
    required: t('${name}-required')
  }

  return (
    <div className='login-container tw-pt-[15%]'>
      <Row className='login-logo-container tw-h-[12%]'>
        <Col xs={24} md={{ span: 16, offset: 4 }}>
          <img src={logo} alt='logo' />
        </Col>
      </Row>

      <Row className='login-title-container tw-h-[12%]'>
        <Col xs={24} md={{ span: 16, offset: 4 }}>
          <div className='title-one tw-flex tw-items-center'>
            <span>Xin chào</span>
            <img src={iconHand} alt='' className='tw-ml-[10px]' />
          </div>
          <div className='title-two tw-mt-[10px]'>Đăng nhập vào hệ thống chấm công</div>
        </Col>
      </Row>

      <div className='login-form-container'>
        <Form
          className='tw-w-full'
          layout={'vertical'}
          name='loginForm'
          autoComplete='off'
          labelCol={{ xs: 24, md: { span: 16, offset: 4 } }}
          wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          validateMessages={validateMessages}
        >
          <Form.Item
            label={<div className='tw-font-semibold'>Tên đăng nhập</div>}
            name='username'
            rules={[{ required: true }]}
          >
            <Input placeholder='Tên đăng nhập' className='login-input-custom' />
          </Form.Item>

          <Form.Item
            label={<div className='tw-font-semibold'>Mật khẩu</div>}
            name='password'
            rules={[{ required: true }]}
          >
            <Input.Password placeholder='Mật khẩu' className='login-input-custom' />
          </Form.Item>

          <Form.Item wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}>
            <div className='tw-text-end tw-text-sky-500'>Quên mật khẩu</div>
          </Form.Item>

          <Form.Item wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}>
            <Button className='login-button tw-w-full' type='primary' htmlType='submit'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default LoginComponent
