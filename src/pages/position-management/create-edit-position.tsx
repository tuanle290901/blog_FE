import { Button, Form, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IPosition } from '~/types/position.interface.ts'
import FormItem from 'antd/es/form/FormItem'
import TextArea from 'antd/es/input/TextArea'
import { useAppDispatch } from '~/stores/hook.ts'
import { createPosition } from '~/stores/features/position/position.slice.ts'

const CreateEditPosition: React.FC<{
  open: boolean
  handleClose: (isCreateUserSuccess: boolean) => void
  position?: IPosition | null
}> = ({ open, position, handleClose }) => {
  const [t] = useTranslation()
  const [form] = Form.useForm<{ nameTitle: string; description: string }>()
  const dispatch = useAppDispatch()
  function finishAndClose(isSuccess: boolean) {
    handleClose(isSuccess)
    form.resetFields()
  }
  useEffect(() => {
    if (position) {
      form.setFieldsValue({
        description: position.description,
        nameTitle: position.nameTitle
      })
    } else {
      form.resetFields()
    }
  }, [position])
  const handleSubmit = async () => {
    try {
      setLoading(true)
      await form.validateFields()
      const value = form.getFieldsValue()
      if (!position?.id) {
        await dispatch(createPosition(value))
      } else {
        // TODO update position
      }
      finishAndClose(true)
    } catch (e) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  const [loading, setLoading] = useState(false)
  return (
    <Modal
      open={open}
      title={position ? 'Thêm chức vụ' : 'Cập nhật chức vụ'}
      onCancel={() => finishAndClose(false)}
      footer={
        <div className={'tw-flex tw-justify-end'}>
          <Button onClick={() => finishAndClose(false)}>{t('common.cancel')}</Button>
          <Button type='primary' onClick={handleSubmit} loading={loading}>
            {t('common.save')}
          </Button>
        </div>
      }
      maskClosable={false}
      forceRender
      centered
    >
      <Form form={form} layout='vertical'>
        <FormItem
          name='nameTitle'
          label='Tên chức vụ'
          required
          rules={[
            {
              required: true,
              message: 'Trường chức vụ không được để trống'
            }
          ]}
        >
          <Input placeholder={'Nhập tên chúc vụ'} />
        </FormItem>
        <FormItem name='Mô tả' label='Mô tả'>
          <TextArea placeholder={'Mô tả cho chức vụ'} />
        </FormItem>
      </Form>
    </Modal>
  )
}
export default CreateEditPosition
