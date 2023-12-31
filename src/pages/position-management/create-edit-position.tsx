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
import { REGEX_TRIM } from '~/constants/regex.constant'

const CreateEditPosition: React.FC<{
  userInfo: IUser | null
  open: boolean
  handleClose: (isCreateUserSuccess: boolean) => void
  position?: IPosition | null
}> = ({ open, position, handleClose, userInfo }) => {
  const { t } = useTranslation()
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
        const response: any = await dispatch(createPosition(value))
        if (response?.payload?.status === 200) {
          notification.success({ message: t('position.message.createPositionSuccess') })
        } else {
          notification.error({ message: t('position.message.createPositionFail') })
        }
      } else {
        const response: any = await dispatch(updatePosition({ ...value, id: position.id }))
        if (response?.payload?.status === 200) {
          notification.success({ message: t('position.message.updatePositionSuccess') })
        } else {
          notification.error({ message: t('position.message.updatePositionFail') })
        }
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
          label={t('position.positionName')}
          required
          rules={[
            {
              required: true,
              message: t('position.message.positionEmpty')
            },
            {
              pattern: REGEX_TRIM,
              message: t('rootInit.trim')
            }
          ]}
        >
          <Input disabled={!editAble} placeholder={t('position.message.enterPositionName')} />
        </FormItem>
        <FormItem
          name='description'
          label={t('position.description')}
          rules={[
            {
              pattern: REGEX_TRIM,
              message: t('rootInit.trim')
            }
          ]}
        >
          <TextArea disabled={!editAble} placeholder={t('position.message.enterDescription')} />
        </FormItem>
      </Form>
    </Modal>
  )
}
export default CreateEditPosition
