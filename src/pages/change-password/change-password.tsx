/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Button, Col, Form, Input, Modal, notification, Row } from 'antd'
import { RuleObject } from 'antd/lib/form'
import { AxiosResponse, HttpStatusCode } from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { PUBLIC_PATH } from '~/constants/public-routes'
import { REGEX_PASSWORD } from '~/constants/regex.constant'
import { logout } from '~/stores/features/auth/auth.slice'
import { useAppDispatch } from '~/stores/hook'
import { ErrorResponse } from '~/types/error-response.interface'

interface IChangePassword {
  showModal: boolean | false
  handClose: () => void
}

const ChangePassword: React.FC<IChangePassword> = (props) => {
  const { showModal, handClose } = props
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [serverError, setServerError] = useState<ErrorResponse>({
    status: 0,
    message: ''
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onCancel = async () => {
    await handClose()
    form.resetFields()
    setServerError({
      status: 0,
      message: ''
    })
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate(`auth/${PUBLIC_PATH.login}`)
  }

  const onSave = async () => {
    try {
      const { oldPassword, password, newPassword } = form.getFieldsValue()
      if (password !== newPassword) {
        notification.warning({
          message: t('changePassword.twoPasswordsDoNotMatch')
        })
      } else {
        let payload = {
          newPassword,
          oldPassword
        }
        const response: AxiosResponse<any, any> = await HttpService.post(END_POINT_API.Users.changePassword(), payload)
        if (response.status === HttpStatusCode.Ok) {
          notification.success({ message: response?.data?.message || t('changePassword.changePasswordSuccessfully') })
          await handClose()
          handleLogout()
          setServerError({
            status: 0,
            message: ''
          })
          form.resetFields()
        }
      }
    } catch (error: any) {
      const response = error.response.data as ErrorResponse
      setServerError(response)
      notification.error({ message: `${response?.message}` || 'Error update password' })
    }
  }

  useEffect(() => {
    if (serverError.status !== 0) {
      void form.validateFields(['oldPassword'])
    }
  }, [serverError])

  const oldPassworValidator = (rule: RuleObject | any, value: any) => {
    if (!value) {
      return Promise.reject(`${t('changePassword.inviteToEnterOldPassword')}`)
    }
    if (serverError) {
      if (
        serverError.status === HttpStatusCode.BadRequest ||
        serverError.status === HttpStatusCode.Conflict ||
        serverError.message.includes(value)
      ) {
        return Promise.reject(serverError.message)
      }
    }
    return Promise.resolve()
  }

  return (
    <Modal open={showModal} forceRender footer={null} closable={false} maskClosable={false}>
      <Form form={form} layout='vertical' onFinish={onSave} className='tw-my-[15px]'>
        <Form.Item
          label={<div className='tw-font-semibold'>{t('changePassword.oldPassword')}</div>}
          name='oldPassword'
          required
          rules={[
            {
              validator: oldPassworValidator
            }
          ]}
        >
          <Input.Password
            placeholder={t('changePassword.inviteToEnterOldPassword')}
            maxLength={20}
            minLength={0}
            onPaste={() => {
              setServerError({
                message: '',
                status: 0
              })
            }}
            onChange={() => {
              setServerError({
                message: '',
                status: 0
              })
            }}
          />
        </Form.Item>
        <Form.Item
          label={<div className='tw-font-semibold'>{t('changePassword.newPassword')}</div>}
          name='password'
          rules={[
            {
              required: true,
              message: `${t('changePassword.inviteToEnterNewPassword')}`
            },
            {
              pattern: REGEX_PASSWORD,
              message: `${t('changePassword.thePasswordMusteLongerThan6CharactersAndShorterThanOrEqualTo20Characters')}`
            }
          ]}
        >
          <Input.Password placeholder={t('changePassword.inviteToEnterNewPassword')} maxLength={20} minLength={6} />
        </Form.Item>
        <Form.Item
          label={<div className='tw-font-semibold'>{t('changePassword.enterYourNewPassword')}</div>}
          name='newPassword'
          required
          rules={[
            {
              required: true,
              message: `${t('changePassword.inviteToEnterANewPasswordAgain')}`
            },
            {
              pattern: REGEX_PASSWORD,
              message: `${t('changePassword.thePasswordMusteLongerThan6CharactersAndShorterThanOrEqualTo20Characters')}`
            }
          ]}
        >
          <Input.Password
            placeholder={t('changePassword.inviteToEnterANewPasswordAgain')}
            maxLength={20}
            minLength={6}
          />
        </Form.Item>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Button className='tw-w-full' type='primary' htmlType='submit'>
              {t('common.confirm')}
            </Button>
          </Col>
          <Col span={24}>
            <Button className='tw-w-full' onClick={() => onCancel()}>
              {t('common.cancel')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ChangePassword
