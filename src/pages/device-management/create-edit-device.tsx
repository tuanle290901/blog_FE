/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Modal, Select, notification } from 'antd'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { REGEX_IP_ADDRESS, REGEX_NUMBER_AND_SPACE, REGEX_PORT, REGEX_ONLYTEXT } from '~/constants/regex.constant'
import { createDevice, updateDevice } from '~/stores/features/device/device.slice'
import { IGroup } from '~/stores/features/master-data/master-data.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IDevice, IDeviceForm } from '~/types/device.interface.ts'
import { VALIDATE_FORM } from '~/utils/Constant'
import { ACTION_TYPE } from '~/utils/helper'

const CreateEditDevice: React.FC<{
  open: boolean
  handleClose: () => void
  deviceData?: IDevice | null
  typeAction?: string
  onCreateOrUpdateSuccess: () => void
}> = ({ open, handleClose, deviceData, typeAction, onCreateOrUpdateSuccess }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<IDevice>()
  const dispatch = useAppDispatch()
  const groups = useAppSelector((state: any) => state.masterData.groups)

  const groupOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    return groups.map((item: IGroup) => {
      return { value: item.code, label: item.name }
    })
  }, [groups])

  useEffect(() => {
    if (deviceData) {
      form.setFieldsValue({ ...deviceData, name: deviceData.name })
    } else {
      form.resetFields()
    }
  }, [deviceData])

  const handleSubmit = async () => {
    const { port, name, ipAddress, groupCode } = form.getFieldsValue()
    const payload: IDeviceForm = {
      port: port,
      name: name,
      ipAddress: ipAddress,
      groupCode: groupCode
    }
    if (deviceData) {
      try {
        const response = await dispatch(
          updateDevice({
            ...payload,
            id: deviceData.id
          })
        ).unwrap()
        form.resetFields()
        handleClose()
        notification.success({
          message: response.message
        })
        onCreateOrUpdateSuccess()
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
    } else {
      try {
        const response = await dispatch(createDevice(payload)).unwrap()
        form.resetFields()
        handleClose()
        notification.success({
          message: response.message
        })
        onCreateOrUpdateSuccess()
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
      title={
        deviceData?.id
          ? typeAction === ACTION_TYPE.Updated
            ? t('device.updateDevice')
            : t('device.viewDevice')
          : t('device.addDevice')
      }
      onCancel={onCancel}
      onOk={form.submit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      centered
      cancelButtonProps={{ style: { display: typeAction === ACTION_TYPE.View ? 'none' : '' } }}
      okButtonProps={{ style: { display: typeAction === ACTION_TYPE.View ? 'none' : '' } }}
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='name'
            style={{ marginBottom: 8 }}
            label={t('device.name')}
            required
            rules={[
              {
                required: true,
                message: t('device.enterName')
              }
              // ,
              // {
              //   pattern: REGEX_ONLYTEXT,
              //   message: `${t('device.do-not-leave-spaces-special-accents')}`
              // }
            ]}
          >
            <Input
              placeholder={t('device.enterName')}
              maxLength={VALIDATE_FORM.MAX_LENGTH_INPUT}
              disabled={typeAction === ACTION_TYPE.View ? true : false}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t('device.ipAddress')}
            name='ipAddress'
            required
            rules={[
              {
                pattern: REGEX_IP_ADDRESS,
                message: `${t('device.enterIpAddressWarning')}`
              },
              {
                required: true,
                message: `${t('device.enterIpAddress')}`
              }
            ]}
          >
            <Input placeholder={t('device.enterIpAddress')} disabled={typeAction === ACTION_TYPE.View ? true : false} />
          </Form.Item>
          <Form.Item
            required
            style={{ marginBottom: 8 }}
            label={t('device.port')}
            name='port'
            rules={[
              {
                pattern: REGEX_PORT,
                message: `${t('device.port')}`
              },
              {
                required: true,
                message: `${t('device.enterPort')}`
              }
            ]}
          >
            <Input
              placeholder={t('device.enterPort')}
              maxLength={5}
              minLength={4}
              onPaste={(event) => {
                if (!REGEX_NUMBER_AND_SPACE.test(event.clipboardData.getData('Text'))) {
                  event.preventDefault()
                }
              }}
              disabled={typeAction === ACTION_TYPE.View ? true : false}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t('device.groupCode')}
            name='groupCode'
            rules={[
              {
                required: true,
                message: `${t('device.pleaseSelectAGroup')}`
              }
            ]}
          >
            <Select
              showSearch
              optionFilterProp='children'
              placeholder={t('userModal.selectDepartment')}
              options={groupOptions}
              filterOption={(input: string, option: any) =>
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled={typeAction === ACTION_TYPE.View ? true : false}
            ></Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default CreateEditDevice
