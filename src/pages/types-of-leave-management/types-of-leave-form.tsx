/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Modal, notification } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { REGEX_TRIM } from '~/constants/regex.constant'
import { createTypesOfLeave, updateTypesOfLeave } from '~/stores/features/types-of-leave/types-of-leave.slice'
import { useAppDispatch } from '~/stores/hook'
import { ITypesOfLeave, ITypesOfLeaveForm } from '~/types/types-of-leave'

const TypesOfLeaveForm: React.FC<{ open: boolean; handleClose: () => void; data?: ITypesOfLeave | null }> = ({
  open,
  handleClose,
  data
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<ITypesOfLeave>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [data])

  const handleSubmit = async () => {
    const { name, code } = form.getFieldsValue()
    const payload: ITypesOfLeaveForm = {
      name: name,
      code: code
    }
    if (data) {
      try {
        const response = await dispatch(
          updateTypesOfLeave({
            ...payload,
            id: data.id
          })
        ).unwrap()
        form.resetFields()
        handleClose()
        notification.success({
          message: response.message
        })
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
    } else {
      try {
        const response = await dispatch(createTypesOfLeave(payload)).unwrap()
        form.resetFields()
        handleClose()
        notification.success({
          message: response.message
        })
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
    }
  }

  const onCancel = () => {
    handleClose()
    form.resetFields()
  }

  return (
    <Modal
      open={open}
      title={t('typesOfLeave.createNew')}
      onCancel={onCancel}
      onOk={form.submit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      centered
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t('typesOfLeave.name')}
            name='name'
            required
            rules={[
              {
                pattern: REGEX_TRIM,
                message: `${t('rootInit.trim')}`
              },
              {
                required: true,
                message: `${t('rootInit.requiredInput')} ${t('typesOfLeave.name')}`
              }
            ]}
          >
            <Input placeholder={`${t('rootInit.requiredInput')} ${t('typesOfLeave.name')}`} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t('typesOfLeave.code')}
            name='code'
            required
            rules={[
              {
                pattern: REGEX_TRIM,
                message: `${t('rootInit.trim')}`
              },
              {
                required: true,
                message: `${t('rootInit.requiredInput')} ${t('typesOfLeave.code')}`
              }
            ]}
          >
            <Input placeholder={`${t('rootInit.requiredInput')} ${t('typesOfLeave.code')}`} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default TypesOfLeaveForm
