import React, { useEffect, useRef, useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, Select, Upload, UploadFile, UploadProps } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import defaultImg from '~/assets/images/default-img.png'
import { getBase64 } from '~/utils/util.ts'
import { IUser } from '~/types/user.interface.ts'
import dayjs, { Dayjs } from 'dayjs'

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
const UserCreateEdit: React.FC<{ open: boolean; handleClose: () => void; userData?: IUser | null }> = ({
  open,
  handleClose,
  userData
}) => {
  const [t] = useTranslation()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [form] = Form.useForm<Omit<IUser, 'dateOfBirth'> & { dateOfBirth: Dayjs }>()
  const uploadRef = useRef<HTMLDivElement>(null)
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setLoading(false)
      setImageUrl(url)
    })
  }
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        dateOfBirth: dayjs(userData.dateOfBirth)
      })
    } else {
      form.resetFields()
    }
  }, [userData])
  const handleSubmit = () => {
    const value = form.getFieldsValue()
    // handleClose()
    console.log(value)
  }
  const handleClickButtonUpdateAvatar = () => {
    if (uploadRef?.current) {
      uploadRef.current.click()
    }
  }
  return (
    <Modal
      open={open}
      title={t('userList.addMember')}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      width={1000}
      centered
    >
      <div className='tw-max-h-[calc(100vh-214px)] tw-min-w-[800px] tw-overflow-auto'>
        <div className='tw-flex tw-items-center tw-gap-4'>
          <Upload
            name='avatar'
            showUploadList={false}
            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <div ref={uploadRef}>
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
          </Upload>
          <div className='tw-h-auto'>
            <div className='tw-flex tw-gap-2'>
              <Button onClick={handleClickButtonUpdateAvatar} type='primary'>
                {t('userModal.updateAvatar')}
              </Button>
              <Button onClick={() => setImageUrl('')}>{t('userModal.deleteAvatar')}</Button>
            </div>
            <div className='tw-mt-1'>
              <p className='tw-text-[#BFBFBF]'>{t('userModal.avatarAccept')}</p>
            </div>
          </div>
        </div>
        <div className='tw-border-[#eee] tw-border tw-border-solid tw-my-2' />
        <Form form={form} layout='vertical'>
          <div className='tw-flex tw-gap-4'>
            <div className='tw-w-1/2'>
              <h3 className='tw-py-3 tw-font-semibold tw-text-sm'>{t('userList.commonInfo')}</h3>
              <div className='tw-p-4 tw-bg-[#FAFAFA]'>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.username')} name='username' required>
                  <Input placeholder={t('userModal.enterUserName')} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.fullName')} name='fullName' required>
                  <Input placeholder={t('userModal.enterMemberName')} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.gender')} name='gender'>
                  <Select placeholder={t('userModal.selectGender')}>
                    <Select.Option value='male'>{t('userList.male')}</Select.Option>
                    <Select.Option value='female'>{t('userList.female')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.dateOfBirth')} name='dateOfBirth'>
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
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.phoneNumber')} name='phoneNumber'>
                  <Input placeholder={t('userModal.enterPhoneNumber')} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.email')} name='email'>
                  <Input placeholder={t('userModal.enterEmail')} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }} label={t('userList.address')} name='address'>
                  <Input placeholder={t('userModal.enterAddress')} />
                </Form.Item>
              </div>
            </div>
            <div className='tw-w-1/2'>
              <h3 className='tw-py-3 tw-font-semibold tw-text-sm'>{t('userList.workInfo')}</h3>
              <div className='tw-p-4 tw-bg-[#FAFAFA] tw-h-[482px] tw-overflow-auto'>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.dateJoin')} name='dateJoin'>
                  <DatePicker
                    format='YYYY/MM/DD'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.probationDate')}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.probationDate')} name='probationDate'>
                  <DatePicker
                    format='YYYY/MM/DD'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.enterProbationDate')}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 16 }}
                  label={t('userList.officialContractSigningDate')}
                  name='officialContractSigningDate'
                >
                  <DatePicker
                    format='YYYY/MM/DD'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.enterOfficialContractSigningDate')}
                  />
                </Form.Item>
                <Form.List name='users'>
                  {(fields = [], { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <div key={key}>
                          <Form.Item
                            {...restField}
                            style={{ marginBottom: 16 }}
                            label={t('userList.department') + ' ' + index}
                            name={[name, 'department']}
                            required
                          >
                            <MinusCircleOutlined
                              className='tw-absolute -tw-top-[24px] -tw-right-0 tw-z-50 tw-text-red-600'
                              onClick={() => remove(name)}
                            />
                            <Select placeholder={t('userModal.selectDepartment')}></Select>
                          </Form.Item>
                          <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 16 }}
                              name={[name, 'first']}
                              rules={[{ required: true, message: 'Missing first name' }]}
                            >
                              <Select placeholder={t('userModal.selectPosition')}></Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 16 }}
                              name={[name, 'last']}
                              rules={[{ required: true, message: 'Missing last name' }]}
                            >
                              <Select placeholder={t('userModal.selectFunction')}></Select>
                            </Form.Item>
                          </div>
                        </div>
                      ))}
                      <Form.Item>
                        <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                          {t('userModal.addRole')}
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}
export default UserCreateEdit
