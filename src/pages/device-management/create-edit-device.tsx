import { Form, Input, Modal, Select } from 'antd'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { REGEX_IP_ADDRESS, REGEX_NUMBER_AND_SPACE, REGEX_PORT } from '~/constants/regex.constant'
import { createDevice, updateDevice } from '~/stores/features/device/device.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IDevice, IDeviceForm } from '~/types/device.interface.ts'

const CreateEditDevice: React.FC<{ open: boolean; handleClose: () => void; deviceData?: IDevice | null }> = ({
  open,
  handleClose,
  deviceData
}) => {
  const [t] = useTranslation()
  const [form] = Form.useForm<IDevice>()
  const dispatch = useAppDispatch()
  const groups = useAppSelector((state) => state.masterData.groups)

  const groupOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    return groups.map((item) => {
      return { value: item.code, label: item.name }
    })
  }, [groups])

  useEffect(() => {
    if (deviceData) {
      form.setFieldsValue(deviceData)
    } else {
      form.resetFields()
    }
  }, [deviceData])

  const handleSubmit = () => {
    const { port, name, ipAddress, groupCode } = form.getFieldsValue()
    const payload: IDeviceForm = {
      port: port,
      name: name,
      ipAddress: ipAddress,
      groupCode: groupCode
    }
    if (deviceData) {
      dispatch(
        updateDevice({
          ...payload,
          id: deviceData.id
        })
      )
      form.resetFields()
    } else {
      dispatch(createDevice(payload))
      form.resetFields()
    }
    handleClose()
  }

  const onCancel = () => {
    handleClose()
    form.resetFields()
  }

  return (
    <Modal
      open={open}
      title={t('device.addDevice')}
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
          <Form.Item style={{ marginBottom: 8 }} label={t('device.name')} name='name' required>
            <Input placeholder={t('device.enterName')} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t('device.ipAddress')}
            name='ipAddress'
            required
            rules={[
              {
                pattern: REGEX_IP_ADDRESS,
                message: `${t('device.ipAddress')}`
              }
            ]}
          >
            <Input placeholder={t('device.enterIpAddress')} />
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
                message: 'please enter a port'
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
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t('device.groupCode')}
            name='groupCode'
            rules={[
              {
                required: true,
                message: 'select a group code'
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
            ></Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default CreateEditDevice
