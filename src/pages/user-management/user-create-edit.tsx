import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, Select, Upload, UploadFile, UploadProps } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import defaultImg from '~/assets/images/default-img.png'
import { getBase64 } from '~/utils/util.ts'
import { IUser } from '~/types/user.interface.ts'

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    void message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    void message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}
const UserCreateEdit: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
  const [t] = useTranslation()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [form] = useForm<Partial<IUser>>()
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setLoading(false)
      setImageUrl(url)
    })
  }
  const handleSubmit = () => {
    const value = form.getFieldsValue()
    console.log(value.dateOfBirth)
    handleClose()
  }
  return (
    <Modal
      open={open}
      title={t('userList.addMember')}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      closable={false}
    >
      <div className='user-modal tw-flex tw-flex-col tw-justify-center tw-items-center '>
        <Upload
          name='avatar'
          showUploadList={false}
          action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          <div className='tw-relative'>
            {imageUrl ? (
              <img
                className='tw-w-28 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-28 tw-rounded-full tw-object-cover'
                src={imageUrl}
                alt='avatar'
              />
            ) : (
              <img
                className='tw-w-28 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-28 tw-rounded-full tw-object-cover'
                src={defaultImg}
                alt='avatar'
              />
            )}
          </div>
          <Button type='primary' shape='circle' icon={<EditOutlined />} className='tw-absolute tw-right-0 tw-top-0' />
        </Upload>
        {/*<Radio.Group className='tw-mt-2'>*/}
        {/*  <Radio.Button className='tw-w-16' value='male'>*/}
        {/*    {t('userList.male')}*/}
        {/*  </Radio.Button>*/}
        {/*  <Radio.Button className='tw-w-16' value='female'>*/}
        {/*    {t('userList.female')}*/}
        {/*  </Radio.Button>*/}
        {/*</Radio.Group>*/}
      </div>
      <div className='tw-my-4'>
        <Form form={form} layout='vertical'>
          <Form.Item style={{ marginBottom: 8 }} label={t('userList.fullName')} name='fullName' required>
            <Input placeholder={t('userModal.enterMemberName')} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('userList.gender')} name='gender'>
            <Select placeholder={t('userModal.selectGender')}>
              <Select.Option value='male'>{t('userList.male')}</Select.Option>
              <Select.Option value='female'>{t('userList.female')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('userList.dateOfBirth')} name='dateOfBirth'>
            <DatePicker
              format='YYYY/MM/DD'
              disabledDate={(date) => {
                return date.isAfter(new Date())
              }}
              showToday={false}
              className='tw-w-full'
              placeholder={t('userModal.selectDOB')}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('userList.department')} name='department' required>
            <Select placeholder={t('userModal.selectDepartment')}>
              <Select.Option value='d1'>Department1</Select.Option>
              <Select.Option value='d2'>Department1</Select.Option>
              <Select.Option value='d3'>Department2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('userList.phoneNumber')} name='phoneNumber'>
            <Input placeholder={t('userModal.enterPhoneNumber')} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }} label={t('userList.email')} name='email'>
            <Input placeholder={t('userModal.enterEmail')} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default UserCreateEdit
