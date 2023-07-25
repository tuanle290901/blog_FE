import { Button, Form, Input, Modal, notification } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IPosition } from '~/types/position.interface.ts'
import FormItem from 'antd/es/form/FormItem'
import TextArea from 'antd/es/input/TextArea'
import { useAppDispatch } from '~/stores/hook.ts'
import { createPosition, updatePosition } from '~/stores/features/position/position.slice.ts'
import { IUser } from '~/types/user.interface.ts'
import { hasPermission } from '~/utils/helper.ts'
import { ROLE } from '~/constants/app.constant.ts'

const CreateEditPosition: React.FC<{
  userInfo: IUser | null
  open: boolean
  handleClose: (isCreateUserSuccess: boolean) => void
  position?: IPosition | null
}> = ({ open, position, handleClose, userInfo }) => {
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
        notification.success({ message: 'Tạo mới chức vụ thành công' })
      } else {
        await dispatch(updatePosition({ ...value, id: position.id }))
        notification.success({ message: 'Cập nhật chức vụ thành công' })
      }
      finishAndClose(true)
    } catch (e) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  const editAble = useMemo(() => {
    if (userInfo) {
      return hasPermission([ROLE.SYSTEM_ADMIN], userInfo.groupProfiles)
    }
    return false
  }, [userInfo])
  const [loading, setLoading] = useState(false)
  return (
    <Modal
      open={open}
      title={!editAble && position ? 'Thông tin chức vụ' : position ? 'Cập nhật chức vụ' : 'Thêm chức vụ'}
      onCancel={() => finishAndClose(false)}
      footer={
        editAble && (
          <div className={'tw-flex tw-justify-end'}>
            <Button onClick={() => finishAndClose(false)}>{t('common.cancel')}</Button>
            <Button type='primary' onClick={handleSubmit} loading={loading}>
              {t('common.save')}
            </Button>
          </div>
        )
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
          <Input disabled={!editAble} placeholder={'Nhập tên chức vụ'} />
        </FormItem>
        <FormItem name='description' label='Mô tả'>
          <TextArea disabled={!editAble} placeholder={'Mô tả cho chức vụ'} />
        </FormItem>
      </Form>
    </Modal>
  )
}
export default CreateEditPosition
