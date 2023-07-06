import React, { useEffect } from 'react'
import { fetchUserInfo, login } from '~/stores/features/auth/auth.slice.ts'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { LoginPayload } from '~/types/login-payload.ts'

import logo from '~/assets/images/logo.png'
import iconHand from '~/assets/images/login/icon-hand.png'
import { Button, Col, Form, Input, Row, Spin } from 'antd'

import './style.scss'
import { useNavigate } from 'react-router-dom'
import { LocalStorage } from '~/utils/local-storage'
import { LOCAL_STORAGE } from '~/utils/Constant'

const LoginComponent: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loginState = useAppSelector((state) => state.auth)

  const onFinish = (formValues: LoginPayload) => {
    dispatch(login(formValues))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    if (loginState.accessToken && loginState.success) {
      LocalStorage.set(LOCAL_STORAGE.ACCESS_TOKEN, loginState.accessToken)
      dispatch(fetchUserInfo())
    }
  }, [dispatch, loginState.accessToken, loginState.success])

  useEffect(() => {
    if (loginState.userInfo.userName) {
      LocalStorage.setObject(LOCAL_STORAGE.AUTH_INFO, loginState.userInfo)
      navigate('/')
    }
  }, [loginState.userInfo, navigate])

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
        >
          <Form.Item
            label={<div className='tw-font-semibold'>Tên đăng nhập</div>}
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder='Tên đăng nhập' className='login-input-custom' />
          </Form.Item>

          <Form.Item
            label={<div className='tw-font-semibold'>Mật khẩu</div>}
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder='Mật khẩu' className='login-input-custom' />
          </Form.Item>

          <Form.Item wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}>
            <div className='tw-text-end tw-text-sky-500'>Quên mật khẩu</div>
          </Form.Item>

          <Form.Item wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}>
            <Button className='login-button tw-w-full' type='primary' htmlType='submit' loading={loginState.loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default LoginComponent
