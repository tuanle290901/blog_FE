import { DatePicker, Form, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { createDepartment, departmentSelectors } from '~/stores/features/department/department.silce'
import { useAppDispatch } from '~/stores/hook'
import { IDepartment, IDepartmentModal } from '~/types/department.interface'
import { ACTION_TYPE, REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_TRIM } from '~/utils/helper'

const DepartmentModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, typeModel, data, dataParent } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const onSaveData = async () => {
    const { code, address, name, id, publishDate, contactEmail, contactPhoneNumber } = form.getFieldsValue()
    let payload: IDepartment = {
      code,
      address,
      name,
      id,
      publishDate,
      contactEmail,
      contactPhoneNumber,
      status: 'INITIAL',
      type: 'HEADQUARTER',
      parentCode: ''
    }
    if (data) {
      payload = {
        ...payload,
        id: data.id
      }
    } else {
      payload = {
        ...payload,
        parentCode: dataParent[dataParent.length - 1].code
      }
      dispatch(createDepartment(payload))
    }
    form.resetFields()
    await onOk()
  }

  console.log(data)

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        code: data.code,
        address: data.address,
        id: data.id,
        publishDate: data.publishDate,
        contactEmail: data.contactEmail,
        contactPhoneNumber: data.contactPhoneNumber,
        status: data.status,
        type: data.type,
        parentCode: data.parentCode
      })
    }
  }, [])

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
        <Form.Item name='id' label={t('Mã phòng ban')} hidden={true}>
          <Input />
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
