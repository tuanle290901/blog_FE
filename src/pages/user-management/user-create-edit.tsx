import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  DatePicker,
  Form,
  FormListFieldData,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import defaultImg from '~/assets/images/default-img.png'
import { getBase64 } from '~/utils/util.ts'
import { IUser } from '~/types/user.interface.ts'
import dayjs, { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { ROLE } from '~/constants/app.constant.ts'
import { createUser } from '~/stores/features/user/user.slice.ts'

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
const UserCreateEdit: React.FC<{
  open: boolean
  handleClose: (isCreateUserSuccess: boolean) => void
  userData?: IUser | null
}> = ({ open, handleClose, userData }) => {
  const [t] = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null)
  const [form] = Form.useForm<Omit<IUser, 'birthday'> & { birthday: Dayjs }>()
  const uploadRef = useRef<HTMLDivElement>(null)
  const groups = useAppSelector((state) => state.masterData.groups)
  const userTitle = useAppSelector((state) => state.masterData.listUserTitle)
  const groupOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    return groups.map((item) => {
      return { value: item.code, label: item.name }
    })
  }, [groups])
  const titleOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    return userTitle.map((item) => {
      return { value: item.code, label: item.nameTitle }
    })
  }, [userTitle])

  const roleOptions: { value: string; label: string }[] = [
    {
      value: ROLE.OFFICER,
      label: ROLE.OFFICER
    },
    {
      value: ROLE.SUB_MANAGER,
      label: ROLE.SUB_MANAGER
    },
    {
      value: ROLE.MANAGER,
      label: ROLE.MANAGER
    }
  ]
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setLoading(false)
      setAvatarBase64(url)
    })
  }
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        birthday: dayjs(userData.birthday)
      })
    } else {
      form.resetFields()
    }
  }, [userData])
  const handleSubmit = async () => {
    const value = form.getFieldsValue()
    const groupProfiles = value.groupProfiles.map((item) => ({
      groupCode: item.groupCode,
      role: item.role,
      title: item.title
    }))
    if (avatarBase64) {
      value.avatarBase64 = avatarBase64
    }
    const payload: IUser = { ...value, groupProfiles, birthday: value.birthday.format('YYYY-MM-DD') }
    try {
      setLoading(true)
      await dispatch(createUser(payload))
      handleClose(true)
    } catch (e) {
      handleClose(false)
    } finally {
      setLoading(false)
    }
  }
  const handleClickButtonUpdateAvatar = () => {
    if (uploadRef?.current) {
      uploadRef.current.click()
    }
  }
  const departmentField = [
    {
      name: 0,
      fieldKey: 1,
      key: 1,
      isListField: true
    }
  ]
  return (
    <Modal
      open={open}
      title={t('userList.addMember')}
      onCancel={() => handleClose(false)}
      // okText={t('common.save')}
      // cancelText={t('common.cancel')}
      footer={
        <div className={'tw-flex tw-justify-end'}>
          <Button onClick={() => handleClose(false)}>{t('common.cancel')}</Button>
          <Button type='primary' onClick={handleSubmit} loading={loading}>
            {t('common.save')}
          </Button>
        </div>
      }
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
              {avatarBase64 ? (
                <img
                  className='tw-w-28 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-28 tw-rounded-full tw-object-cover'
                  src={avatarBase64}
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
              <Button onClick={() => setAvatarBase64('')}>{t('userModal.deleteAvatar')}</Button>
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
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.gender')} required name='genderType'>
                  <Select placeholder={t('userModal.selectGender')}>
                    <Select.Option value='male'>{t('userList.male')}</Select.Option>
                    <Select.Option value='female'>{t('userList.female')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.dateOfBirth')} name='birthday'>
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
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.phoneNumber')} required name='phoneNumber'>
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
              <div className='tw-p-4 tw-bg-[#FAFAFA] tw-h-[530px] tw-overflow-auto'>
                <Form.Item style={{ marginBottom: 16 }} label={t('userList.dateJoin')} name='joinDate'>
                  <DatePicker
                    format='YYYY/MM/DD'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.enterDateJoin')}
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
                  name='formalDate'
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
                <Form.List name='groupProfiles' initialValue={departmentField}>
                  {(fields = departmentField, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <div key={key} className='tw-relative'>
                          {fields.length > 1 && (
                            <MinusCircleOutlined
                              className='tw-absolute tw-right-1 tw-top-1 tw-z-50 tw-text-red-600'
                              onClick={() => remove(name)}
                            />
                          )}
                          <Form.Item
                            {...restField}
                            style={{ marginBottom: 16 }}
                            label={t('userList.department') + ' ' + index}
                            name={[name, 'groupCode']}
                            required
                          >
                            <Select options={groupOptions} placeholder={t('userModal.selectDepartment')}></Select>
                          </Form.Item>
                          <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 16 }}
                              name={[name, 'title']}
                              rules={[{ required: true, message: 'Missing first name' }]}
                            >
                              <Select options={titleOptions} placeholder={t('userModal.selectPosition')}></Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 16 }}
                              name={[name, 'role']}
                              rules={[{ required: true, message: 'Missing last name' }]}
                            >
                              <Select options={roleOptions} placeholder={t('userModal.selectFunction')}></Select>
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
