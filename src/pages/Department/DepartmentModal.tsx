/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Form, Input, Modal, notification } from 'antd'
import { AxiosResponse, HttpStatusCode } from 'axios'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_TRIM } from '~/constants/regex.constant'
import { createDepartment, getListDepartments, updateDepartment } from '~/stores/features/department/department.silce'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IDepartment, IDepartmentModal } from '~/types/department.interface'
import { ACTION_TYPE } from '~/utils/helper'

const DepartmentModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, typeModel, data, dataParent } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const onSaveData = async () => {
    const { code, address, name, publishDate, contactEmail, contactPhoneNumber } = form.getFieldsValue()
    let payload: IDepartment = {
      code,
      address,
      name,
      publishDate,
      contactEmail,
      contactPhoneNumber,
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
          form.resetFields()
          await onOk()
        })
        .catch((error) => {
          notification.error({
            message: error.message
          })
        })
    } else {
      payload = {
        ...payload,
        parentCode: dataParent && dataParent[dataParent.length > 2 ? dataParent.length - 1 : 0].code
      }
      dispatch(createDepartment(payload))
        .unwrap()
        .then(async (response) => {
          notification.success({
            message: response.message
          })
          form.resetFields()
          await onOk()
          dispatch(getListDepartments())
        })
        .catch((error) => {
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
        publishDate: data.publishDate,
        contactEmail: data.contactEmail,
        contactPhoneNumber: data.contactPhoneNumber,
        parentCode: data.parentCode
      })
    }
    return () => form.resetFields()
  }, [data])

  const onCancel = async () => {
    form.resetFields()
    await onClose()
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
          rules={[
            {
              required: true,
              message: `${t('department.please-insert-input')} ${t('department.code')}`
            },
            {
              pattern: REGEX_TRIM,
              message: `${t('department.alter-notification.do-not-leave-spaces-special-accents')}`
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
              pattern: REGEX_TRIM,
              message: `${t('department.alter-notification.do-not-leave-spaces-special-characters-vietnamese-accents')}`
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
          <DatePicker className='tw-w-[100%]' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DepartmentModal
