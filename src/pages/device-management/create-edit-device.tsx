import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Modal, Select } from 'antd'
import { IDevice } from '~/types/device.interface.ts'
import TextArea from 'antd/es/input/TextArea'

const CreateEditDevice: React.FC<{ open: boolean; handleClose: () => void; deviceData?: IDevice | null }> = ({
  open,
  handleClose,
  deviceData
}) => {
  const [t] = useTranslation()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<IDevice>()
  useEffect(() => {
    if (deviceData) {
      form.setFieldsValue(deviceData)
    } else {
      form.resetFields()
    }
  }, [deviceData])
  const handleSubmit = () => {
    const value = form.getFieldsValue()
    handleClose()
  }
  return (
    <Modal
      open={open}
      title={t('device.addDevice')}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      centered
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical'>
          <Form.Item style={{ marginBottom: 8 }} label={t('device.deviceCode')} name='deviceCode' required>
            <Input placeholder={t('device.enterDeviceCode')} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('device.installationLocation')} name='installationLocation'>
            <TextArea placeholder={t('device.enterInstallationLocation')} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('device.departmentManager')} name='department'>
            <Select placeholder={t('userModal.selectDepartment')}></Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default CreateEditDevice
