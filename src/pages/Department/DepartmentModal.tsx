import { DatePicker, Form, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IDepartmentModal } from '~/types/department.interface'
import { ACTION_TYPE, REGEX_TRIM } from '~/utils/helper'

const DepartmentModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, typeModel, data } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const onSaveData = async () => {
    const { title, dateTime, note } = form.getFieldsValue()
    await onOk()
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        dateTime: data.dateTime,
        note: data.note
      })
    }
  }, [])

  return (
    <Modal
      open={showModal}
      forceRender
      closable
      onCancel={() => onClose()}
      onOk={() => onSaveData()}
      title={typeModel === ACTION_TYPE.Created ? 'Thêm mới hoặc chính sửa departmanet' : 'Cập nhật ...'}
      maskClosable={false}
    >
      <Form form={form} layout='vertical'>
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
        <Form.Item labelAlign='left' name='dateTime' label={t('Ngày thành lập')}>
          <DatePicker className='tw-w-[100%]' />
        </Form.Item>
        <Form.Item labelAlign='left' name='note' label={t('Mô tả')}>
          <TextArea rows={4} placeholder='can resize' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DepartmentModal
