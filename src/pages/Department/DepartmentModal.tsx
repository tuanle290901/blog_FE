/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Form, Input, Modal, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_TRIM } from '~/constants/regex.constant'
import { createDepartment, getListDepartments, updateDepartment } from '~/stores/features/department/department.silce'
import { useAppDispatch } from '~/stores/hook'
import { IDepartment, IDepartmentModal } from '~/types/department.interface'
import { ACTION_TYPE } from '~/utils/helper'

import dayjs from 'dayjs'
import { RuleObject } from 'antd/lib/form'
import { HttpStatusCode } from 'axios'

const DepartmentModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, typeModel, data, dataParent } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const [serverError, setServerError] = useState<any>(null)

  const onSaveData = async () => {
    const { code, address, name, publishDate, contactEmail, contactPhoneNumber } = form.getFieldsValue()
    let payload: IDepartment = {
      code,
      address,
      name,
      publishDate: publishDate ? publishDate.format('YYYY-MM-DD') : null,
      contactEmail: contactEmail ? contactEmail : null,
      contactPhoneNumber: contactPhoneNumber ? contactPhoneNumber : null,
      parentCode: ''
    }
    if (data) {
      payload = {
        ...payload,
        parentCode: data?.parentCode,
        code: data.code
      }
      await dispatch(updateDepartment(payload))
        .unwrap()
        .then(async (response) => {
          notification.success({
            message: response.message
          })
          setServerError(null)
          form.resetFields()
          await onOk()
        })
        .catch((error) => {
          setServerError(error)
          notification.error({
            message: error.message
          })
        })
    } else {
      payload = {
        ...payload,
        parentCode: dataParent && dataParent[dataParent.length >= 2 ? dataParent.length - 1 : 0].code
      }
      dispatch(createDepartment(payload))
        .unwrap()
        .then(async (response) => {
          notification.success({
            message: response.message
          })
          form.resetFields()
          await onOk()
          setServerError(null)
          dispatch(getListDepartments())
        })
        .catch((error) => {
          setServerError(error)
          notification.error({
            message: error.message
          })
        })
    }
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        code: data.code,
        address: data.address,
        publishDate: data.publishDate ? dayjs(data.publishDate) : undefined,
        contactEmail: data.contactEmail,
        contactPhoneNumber: data.contactPhoneNumber,
        parentCode: data.parentCode
      })
    }
    return () => form.resetFields()
  }, [data])

  const onCancel = async () => {
    form.resetFields()
    setServerError(null)
    await onClose()
  }

  useEffect(() => {
    if (serverError) {
      void form.validateFields(['code'])
    }
  }, [serverError])

  const codeValidator = (rule: RuleObject | any, value: any) => {
    if (!value) {
      return Promise.reject(`${t('department.please-insert-input')} ${t('department.code')}`)
    }
    if (!REGEX_SPECIAL_CHARS.test(value)) {
      return Promise.reject(t('department.alter-notification.do-not-leave-spaces-special-accents'))
    }
    // if (serverError) {
    //   if (serverError.status === HttpStatusCode.Conflict || serverError.message.includes(value)) {
    //     return Promise.reject('Mã phòng ban ' + value + ' đã được sử dụng.')
    //   }
    // }
    return Promise.resolve()
  }

  return (
    <Modal
      open={showModal}
      forceRender
      closable
      onCancel={() => onCancel()}
      onOk={form.submit}
      okText={`${t('common.save')}`}
      cancelText={`${t('common.cancel')}`}
      title={
        typeModel === ACTION_TYPE.Created
          ? `${t('department.departmentAdd')}`
          : `${t('department.departmentUpdate', { name: data && data.name })}`
      }
      maskClosable={false}
    >
      <Form form={form} layout='vertical' onFinish={onSaveData}>
        <Form.Item
          name='code'
          label={t('department.code')}
          required
          rules={[
            {
              validator: codeValidator
            }
          ]}
        >
          <Input
            disabled={typeModel === ACTION_TYPE.Created ? false : true}
            placeholder={`${t('department.please-insert-input')}`}
          />
        </Form.Item>
        <Form.Item
          name='name'
          label={t('department.name')}
          rules={[
            {
              required: true,
              message: `${t('department.please-insert-input')} ${t('department.name')}`
            },
            {
              pattern: REGEX_SPECIAL_TRIM,
              message: `${t('department.alter-notification.do-not-leave-spaces-special-accents')}`
            }
          ]}
        >
          <Input placeholder={`${t('department.please-insert-input')}`} />
        </Form.Item>
        <Form.Item
          name='contactEmail'
          label={t('department.email')}
          rules={[
            {
              pattern: REGEX_EMAIL,
              message: `${t('department.alter-notification.do-not-email-accents')}`
            }
          ]}
        >
          <Input placeholder={`${t('department.please-insert-input')}`} />
        </Form.Item>
        <Form.Item
          name='contactPhoneNumber'
          label={t('department.phone-number')}
          rules={[
            {
              pattern: REGEX_PHONE_NUMBER,
              message: `${t('department.alter-notification.do-not-phone-accents')}`
            }
          ]}
        >
          <Input placeholder={`${t('department.please-insert-input')}`} />
        </Form.Item>
        <Form.Item name='address' label={t('department.address')}>
          <Input placeholder={`${t('department.please-insert-input')}`} />
        </Form.Item>
        <Form.Item labelAlign='left' name='publishDate' label={t('department.publishDate')}>
          <DatePicker
            className='tw-w-[100%]'
            format='DD/MM/YYYY'
            showToday={false}
            placeholder={`${t('department.please-insert-input')}`}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DepartmentModal
