import { DatePicker, Form, Input, Modal } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createDepartment, getListDepartments, updateDepartment } from '~/stores/features/department/department.silce'
import { useAppDispatch } from '~/stores/hook'
import { IDepartment, IDepartmentModal } from '~/types/department.interface'
import { ACTION_TYPE, REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_TRIM } from '~/utils/helper'

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
    } else {
      payload = {
        ...payload,
        parentCode: dataParent && dataParent[dataParent.length - 1].code
      }
      await dispatch(createDepartment(payload))
      dispatch(getListDepartments())
    }
    form.resetFields()
    await onOk()
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
      onOk={() => onSaveData()}
      title={typeModel === ACTION_TYPE.Created ? 'Thêm mới hoặc chính sửa departmanet' : 'Cập nhật ...'}
      maskClosable={false}
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='code'
          label={t('Mã phòng ban')}
          rules={[
            {
              required: true,
              message: `${t('campaign.please-insert-input')} ${t('campaign.campaign-name')}`
            },
            {
              pattern: REGEX_TRIM,
              message: `${t('campaign.alter-notification.do-not-leave-spaces-special-characters-vietnamese-accents')}`
            }
          ]}
        >
          <Input disabled={typeModel === ACTION_TYPE.Created ? false : true} />
        </Form.Item>
        <Form.Item
          name='name'
          label={t('Tên phòng ban')}
          rules={[
            {
              required: true,
              message: `${t('campaign.please-insert-input')} ${t('campaign.campaign-name')}`
            },
            {
              pattern: REGEX_TRIM,
              message: `${t('campaign.alter-notification.do-not-leave-spaces-special-characters-vietnamese-accents')}`
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='contactEmail'
          label={t('Email phòng ban')}
          rules={[
            {
              pattern: REGEX_EMAIL,
              message: `${t('campaign.alter-notification.do-not-leave-spaces-special-characters-vietnamese-accents')}`
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='contactPhoneNumber'
          label={t('Số điện thoại')}
          rules={[
            {
              pattern: REGEX_PHONE_NUMBER,
              message: `${t('campaign.alter-notification.do-not-leave-spaces-special-characters-vietnamese-accents')}`
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='address' label={t('Địa chỉ')}>
          <Input />
        </Form.Item>
        <Form.Item labelAlign='left' name='publishDate' label={t('Ngày thành lập')}>
          <DatePicker className='tw-w-[100%]' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DepartmentModal
