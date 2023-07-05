import React, { useState } from 'react'
import { InfoCircleOutlined, MailFilled } from '@ant-design/icons'
import { Button, Col, Form, Tooltip, Row, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
// import { REGEX_EMAIL, REGEX_PASSWORD, REGEX_TRIM, REGEX_ONLYTEXT, LOCAL_STORAGE } from '../../utils/Constants'
import Logo from '~/assets/images/logo.png'
import './style.scss'
// import CommonInput from '../../commons/components/Input/CommonInput'
// import CommonInputPassword from '../../commons/components/Input/CommonInputPassword'

interface Payload {
  email: string
  address: string
  contactPhoneNumber: string
  password: string
  confirmPassword: string
  token: string
}

const Initialize: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [rootForm] = Form.useForm()
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false)
  const [checkInitInfo, setCheckInitInfo] = useState<string>('')
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  const validationLogin = {
    email: [
      {
        required: true,
        message: `${t('rootInit.requiredInput')} ${t('rootInit.email')}`
      }
      // {
      //   pattern: REGEX_EMAIL,
      //   message: `${t('validation.auth.invalidEmail')}`
      // }
    ],
    password: [
      {
        required: true,
        message: `${t('rootInit.requiredInput')} ${t('rootInit.password')}`
      }
      // {
      //   pattern: REGEX_PASSWORD,
      //   message: t('validation.auth.passwordRegex')
      // }
    ],
    confirmPassword: [
      {
        required: true,
        message: `${t('rootInit.requiredInput')} ${t('rootInit.confirmPassword')}`
      }
      // {
      //   pattern: REGEX_PASSWORD,
      //   message: t('validation.auth.passwordRegex')
      // }
    ]
  }

  // const getProfile = async () => {
  //   const { data } = await UserService.getProfile()
  //   localStorage.setItem(LOCAL_STORAGE.USER_PROFILE, JSON.stringify(data))
  // }

  const onSubmit = async (data: Payload) => {
    try {
      if (data?.password !== data?.confirmPassword) {
        alert(t('changePassword.passwordNotMatch'))
      } else {
        const initData = {
          email: data?.email,
          address: data?.address,
          contactPhoneNumber: data?.contactPhoneNumber,
          password: data?.password,
          token: data?.token
        }
        console.log('initData', initData)
        // const resData = await RootInitializationService.initAdmin(initData)
        // const resData: any = []
        // if (resData?.data?.accessToken) {
        //   console.log(t('rootInit.initSuccessfully'))
        //   navigate(`/`)
        // }
      }
    } catch (error) {
      console.log('error')
    }
  }

  return (
    <div className='root-initialization'>
      <div className='root-banner' />
      <div className='root-detail'>
        <div className='root-detail-logo'>
          <div className='root-detail-logo__img'>
            <img src={Logo} alt='' />
          </div>
          <div className='root-detail-logo__title'>{t('common.title')}</div>
        </div>
        <div className='root-detail-form'>
          {!disableSubmit && <div className='root-detail-form__warning'>{t('rootInit.accountAvailable')}</div>}
          <div className='root-detail-form__title'>{t('rootInit.title')}</div>
          <Form
            layout='vertical'
            name='root-form'
            className='root-detail-form-main'
            initialValues={{}}
            onFinish={onSubmit}
            form={rootForm}
          >
            <Row align='middle'>
              <div className='root-detail-form-main__label required'>{t('rootInit.code')}</div>
              <Tooltip title={`${t('rootInit.codeTooltip')} ${checkInitInfo}`}>
                <InfoCircleOutlined />
              </Tooltip>
            </Row>
            <Form.Item
              name='token'
              rules={[
                {
                  required: true,
                  message: `${t('rootInit.requiredInput')} ${t('rootInit.code')}`
                }
                // {
                //   pattern: REGEX_TRIM,
                //   message: t('validation.trim')
                // }
              ]}
            >
              <Input
                className='root-detail-form-main__input'
                placeholder={`${t('rootInit.requiredInput')} ${t('rootInit.code')}`}
              />
            </Form.Item>
            <div className='root-detail-form-main__title'>{t('rootInit.loginInformation')}</div>
            <div className='root-detail-form-main__label required'>{t('rootInit.email')}</div>
            <Form.Item name='email' rules={validationLogin.email}>
              <Input
                className='root-detail-form-main__input'
                suffix={<MailFilled />}
                placeholder={`${t('rootInit.requiredInput')} ${t('rootInit.email')}`}
              />
            </Form.Item>
            <div className='root-detail-form-main__label required'>{t('rootInit.password')}</div>
            <p className='root-detail-form-main__notice'>{t('rootInit.passwordRegex')}</p>
            <Form.Item name='password' rules={validationLogin.password}>
              <Input.Password
                placeholder={`${t('rootInit.requiredInput')} ${t('rootInit.password')}`}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible
                }}
                className='root-detail-form-main__input'
              />
            </Form.Item>
            <div className='root-detail-form-main__label required'>{t('rootInit.confirmPassword')}</div>
            <Form.Item name='confirmPassword' rules={validationLogin.confirmPassword}>
              <Input.Password
                placeholder={`${t('rootInit.requiredInput')} ${t('rootInit.confirmPassword')}`}
                visibilityToggle={{
                  visible: confirmPasswordVisible,
                  onVisibleChange: setConfirmPasswordVisible
                }}
                className='root-detail-form-main__input'
              />
            </Form.Item>
            <div className='root-detail-form-main__title'>{t('rootInit.detailInformation')}</div>
            <Row gutter={16} align='middle'>
              <Col span={24} md={{ span: 12 }}>
                <div className='root-detail-form-main__label required'>{t('rootInit.address')}</div>
                <Form.Item
                  name='address'
                  rules={[
                    {
                      required: true,
                      message: `${t('rootInit.requiredInput')} ${t('rootInit.address')}`
                    }
                    // {
                    //   pattern: REGEX_ONLYTEXT,
                    //   message: `${t('rootInit.address')} ${t('validation.onlyText')}`
                    // }
                  ]}
                >
                  <Input
                    className='root-detail-form-main__input'
                    placeholder={`${t('rootInit.requiredInput')} ${t('rootInit.address')}`}
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={{ span: 12 }}>
                <div className='root-detail-form-main__label required'>{t('rootInit.phoneNumber')}</div>
                <Form.Item
                  name='contactPhoneNumber'
                  rules={[
                    {
                      required: true,
                      message: `${t('rootInit.requiredInput')} ${t('rootInit.phoneNumber')}`
                    }
                    // {
                    //   pattern: REGEX_TRIM,
                    //   message: t('validation.trim')
                    // },
                  ]}
                >
                  <Input
                    className='root-detail-form-main__input'
                    placeholder={`${t('rootInit.requiredInput')} ${t('rootInit.phoneNumber')}`}
                  />
                </Form.Item>
              </Col>
            </Row>
            {disableSubmit && (
              <Form.Item>
                <Button type='primary' htmlType='submit' className='root-detail-form-main__apply'>
                  {t('rootInit.apply')}
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Initialize
