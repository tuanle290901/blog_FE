import React, { useEffect } from 'react'
import { fetchUserInfo, login } from '~/stores/features/auth/auth.slice.ts'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { LoginPayload } from '~/types/login-payload.ts'

import { Button, Col, Form, Input, Row } from 'antd'
import logo from '~/assets/images/logo_blue.png'

import { useLocation, useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { LocalStorage } from '~/utils/local-storage'

import { useTranslation } from 'react-i18next'
import '../../layouts/style.scss'

const Index: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const loginState = useAppSelector((state) => state.auth)
  const historyUrl = useAppSelector((state) => state.auth.historyUrl)
  const location = useLocation()
  console.log(location.state, 'location 1')

  const onKeyDown = (event: any) => {
    if (event.key === ' ') event.preventDefault()
  }

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
    if (loginState?.userInfo?.userName) {
      LocalStorage.setObject(LOCAL_STORAGE.AUTH_INFO, loginState.userInfo)
      const hrefSource = location.state
      if (hrefSource) {
        const path = hrefSource.split('/')[3]
        const indexOfPath = hrefSource.indexOf(path)
        const url = hrefSource.substring(indexOfPath)
        navigate(`../../${url}`, { replace: true })
      } else {
        navigate(`/timesheet`, { replace: true })
      }
    }
  }, [loginState.userInfo, navigate, historyUrl])

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === LOCAL_STORAGE.AUTH_INFO) {
        if (event.newValue) {
          setTimeout(() => {
            navigate('/')
          }, 1000)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <div className='login-container tw-pt-[15%]'>
      <Row className='login-logo-container tw-h-[12%]' align='middle'>
        <Col xs={24} md={{ span: 16, offset: 4 }}>
          <div className='tw-flex tw-justify-center'>
            <img src={logo} alt='logo' className='tw-w-full' />
          </div>
        </Col>
      </Row>

      <Row className='login-title-container tw-h-[12%]'>
        <Col xs={24} md={{ span: 16, offset: 4 }}>
          <div className='title-one tw-flex tw-items-center'>
            <span>{t('auth.hello')}</span>
            {/* <img src={iconHand} alt='' className='tw-ml-[10px]' /> */}
          </div>
          <div className='title-two tw-mt-[10px]'>{t('auth.loginToSystem')}</div>
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
            label={<div className='tw-font-semibold'>{t('auth.username')}</div>}
            name='username'
            rules={[{ required: true, message: t('auth.fieldIsRequired') }]}
          >
            <Input placeholder={t('auth.username')} className='login-input-custom' onKeyDown={onKeyDown} />
          </Form.Item>

          <Form.Item
            label={<div className='tw-font-semibold'>{t('auth.password')}</div>}
            name='password'
            rules={[{ required: true, message: t('auth.fieldIsRequired') }]}
          >
            <Input.Password placeholder='Mật khẩu' className='login-input-custom' maxLength={32} />
          </Form.Item>

          {/* <Form.Item wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}>
            <div className='tw-text-end tw-text-sky-500'>{t('auth.forgotPassword')}</div>
          </Form.Item> */}

          <Form.Item wrapperCol={{ xs: 24, md: { span: 16, offset: 4 } }}>
            <Button
              className='login-button tw-w-full tw-mt-4'
              type='primary'
              htmlType='submit'
              loading={loginState.loading}
            >
              {t('auth.login')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Index
