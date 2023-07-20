import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, notification, Radio, Select, Upload } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { RuleObject } from 'antd/lib/form'
import { useTranslation } from 'react-i18next'
import { RcFile } from 'antd/es/upload'
import defaultImg from '~/assets/images/default-img.png'
import { getBase64 } from '~/utils/util.ts'
import { IUser } from '~/types/user.interface.ts'
import dayjs, { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { GENDER, ROLE } from '~/constants/app.constant.ts'
import { createUser, updateUser } from '~/stores/features/user/user.slice.ts'
import { EMAIL_REG, REGEX_PHONE_NUMBER } from '~/constants/regex.constant.ts'
import Password from 'antd/es/input/Password'

const UserCreateEdit: React.FC<{
  open: boolean
  handleClose: (isCreateUserSuccess: boolean) => void
  userData?: IUser | null
}> = ({ open, handleClose, userData }) => {
  const [t] = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [avatarBase64, setAvatarBase64] = useState<string>('')
  const [avtError, setAvtError] = useState(false)
  const [serverError, setServerError] = useState<any>(null)
  const [form] = Form.useForm<
    Omit<IUser, 'birthday' | 'joinDate' | 'formalDate'> & { birthday: Dayjs; joinDate: Dayjs; formalDate: Dayjs }
  >()
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
      label: t('common.role.officer'),
      value: ROLE.OFFICER
    },
    {
      label: t('common.role.subManager'),
      value: ROLE.SUB_MANAGER
    },
    {
      label: t('common.role.manager'),
      value: ROLE.MANAGER
    }
  ]
  const groupProfiles: any[] = useMemo(() => {
    if (userData?.groupProfiles) {
      return userData.groupProfiles.map((item, index) => {
        return {
          name: index,
          fieldKey: index,
          key: index,
          isListField: true,
          role: item.role,
          groupCode: item.groupCode,
          title: item.title
        }
      })
    }
    return [
      {
        name: 0,
        fieldKey: 1,
        key: 1,
        isListField: true,
        role: ROLE.OFFICER
      }
    ]
  }, [userData])
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      void message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      void message.error('Image must smaller than 2MB!')
    }
    if (isJpgOrPng && isLt2M) {
      getBase64(file, (url) => {
        setLoading(false)
        setAvatarBase64(url)
        setAvtError(false)
      })
    }
    return false
  }
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        birthday: userData.birthday ? dayjs(userData.birthday) : undefined,
        formalDate: userData.formalDate ? dayjs(userData.formalDate) : undefined,
        joinDate: userData.joinDate ? dayjs(userData.joinDate) : undefined
      })
      setAvatarBase64('data:image/png;base64,' + userData.avatarBase64)
    } else {
      form.resetFields()
      setAvatarBase64('')
    }
  }, [userData])
  const handleSubmit = async () => {
    try {
      setAvtError(!avatarBase64)
      await form.validateFields()
      if (!avatarBase64) {
        return
      }
      const value = form.getFieldsValue()
      const groupProfiles = value.groupProfiles.map((item) => ({
        groupCode: item.groupCode,
        role: item.role,
        title: item.title
      }))
      const index = avatarBase64.indexOf(',')
      value.avatarBase64 = avatarBase64.slice(index + 1)
      const birthday = value.birthday ? value.birthday.format('YYYY-MM-DD') : null
      const joinDate = value.joinDate ? value.joinDate.format('YYYY-MM-DD') : null
      const formalDate = value.formalDate ? value.formalDate.format('YYYY-MM-DD') : null
      const payload: IUser = {
        ...value,
        groupProfiles,
        birthday,
        formalDate,
        joinDate
      }
      try {
        setLoading(true)
        if (userData) {
          await dispatch(
            updateUser({ userId: userData.id as string, user: { ...payload, userName: userData.userName } })
          ).unwrap()
        } else {
          await dispatch(createUser(payload)).unwrap()
        }
        setServerError(null)
        finishAndClose(true)
        notification.success({
          message: userData ? 'Cập nhật thông tin thành viên thành công' : 'Tạo mới thành viên thành công'
        })
      } catch (e) {
        setServerError(e)
      } finally {
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (serverError) {
      void form.validateFields(['email', 'phoneNumber'])
    }
  }, [serverError])
  const finishAndClose = (isSuccess: boolean) => {
    handleClose(isSuccess)
    form.resetFields()
    setAvtError(false)
    setAvatarBase64('')
    setServerError(null)
  }
  const handleClickButtonUpdateAvatar = () => {
    if (uploadRef?.current) {
      uploadRef.current.click()
    }
  }

  const emailValidator = (rule: RuleObject | any, value: any) => {
    if (!value) {
      return Promise.resolve()
    }
    if (!EMAIL_REG.test(value)) {
      return Promise.reject(t('userModal.errorMessage.invalidEmail'))
    }
    if (serverError) {
      if (serverError.message.includes(value)) {
        return Promise.reject('Email ' + value + ' đã được sử dụng.')
      }
    }
    return Promise.resolve()
  }
  const phoneNumberValidator = (rule: RuleObject | any, value: any) => {
    if (!value) {
      return Promise.reject(t('userModal.errorMessage.phoneNumberEmpty'))
    }
    if (!REGEX_PHONE_NUMBER.test(value)) {
      return Promise.reject(t('userModal.errorMessage.invalidPhoneNumber'))
    }
    console.log(serverError)
    if (serverError && serverError.message.includes(value)) {
      return Promise.reject('Số điện thoại ' + value + ' đã được sử dụng.')
    }
    return Promise.resolve()
  }

  return (
    <Modal
      open={open}
      title={t('userList.addMember')}
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
      width={1000}
      centered
    >
      <div className=' tw-min-w-[800px] tw-overflow-auto'>
        <div className='tw-flex tw-items-center tw-gap-4'>
          <Upload name='avatar' accept='image/png, image/jpeg' showUploadList={false} beforeUpload={beforeUpload}>
            <div ref={uploadRef}>
              {avatarBase64 ? (
                <img
                  className='tw-w-16 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-16 tw-rounded-full tw-object-cover'
                  src={avatarBase64}
                  alt='avatar'
                />
              ) : (
                <img
                  className='tw-w-16 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-16 tw-rounded-full tw-object-cover'
                  src={defaultImg}
                  alt='avatar'
                />
              )}
            </div>
          </Upload>
          <div className='tw-h-auto'>
            <div className='tw-flex tw-gap-2'>
              <Button onClick={handleClickButtonUpdateAvatar} type='primary'>
                {t(avatarBase64 ? 'userModal.updateAvatar' : 'userModal.chooseAvatar')}
              </Button>
              {/*<Button onClick={() => setAvatarBase64('')}>{t('userModal.deleteAvatar')}</Button>*/}
            </div>
            <div className='tw-mt-1'>
              <p className='tw-text-[#BFBFBF]'>{t('userModal.avatarAccept')}</p>
              {avtError && <p className='tw-text-red-600'>{t('userModal.errorMessage.avatarEmpty')}</p>}
            </div>
          </div>
        </div>
        <div className='tw-border-[#eee] tw-border tw-border-solid tw-my-2' />
        <Form form={form} layout='vertical'>
          <div className='tw-flex tw-gap-4'>
            <div className='tw-w-1/2'>
              <h3 className='tw-py-3 tw-font-semibold tw-text-sm'>{t('userList.commonInfo')}</h3>
              <div className='tw-p-4 tw-bg-[#FAFAFA]'>
                {userData?.userName && (
                  <Form.Item
                    initialValue={userData.userName}
                    style={{ marginBottom: 24 }}
                    label={t('userList.username')}
                    name='userName'
                  >
                    <Input disabled />
                  </Form.Item>
                )}
                <Form.Item
                  style={{ marginBottom: 24 }}
                  label={t('userList.fullName')}
                  name='fullName'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('userModal.errorMessage.fullNameIsEmpty')
                    }
                  ]}
                >
                  <Input placeholder={t('userModal.enterMemberName')} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 24 }} label={t('userList.gender')} name='genderType'>
                  {/*<Select placeholder={t('userModal.selectGender')}>*/}
                  {/*  <Select.Option value={GENDER.MALE}>{t('userList.male')}</Select.Option>*/}
                  {/*  <Select.Option value={GENDER.FEMALE}>{t('userList.female')}</Select.Option>*/}
                  {/*</Select>*/}
                  <Radio.Group name='genderType' className='tw-w-full'>
                    <div className='tw-flex tw-gap-32 tw-border tw-border-gray-300 tw-border-solid  tw-bg-white tw-py-1 tw-px-2 tw-rounded-md'>
                      <Radio value={GENDER.MALE}>{t('userList.male')}</Radio>
                      <Radio value={GENDER.FEMALE}>{t('userList.female')}</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
                <Form.Item style={{ marginBottom: 24 }} label={t('userList.dateOfBirth')} name='birthday'>
                  <DatePicker
                    format='DD/MM/YYYY'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.selectDOB')}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 24 }}
                  label={t('userList.phoneNumber')}
                  required
                  name='phoneNumber'
                  rules={[
                    {
                      validator: phoneNumberValidator
                    }
                  ]}
                >
                  <Input placeholder={t('userModal.enterPhoneNumber')} />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 24 }}
                  label={t('userList.email')}
                  name='email'
                  rules={[
                    {
                      validator: emailValidator
                    }
                  ]}
                >
                  <Input placeholder={t('userModal.enterEmail')} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 24 }} label={t('userList.address')} name='address'>
                  <Input placeholder={t('userModal.enterAddress')} />
                </Form.Item>
                <Form.Item
                  label={t('userList.password')}
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: t('userModal.errorMessage.passwordIsEmpty')
                    }
                  ]}
                >
                  <Password placeholder={t('userModal.enterPassword')}></Password>
                </Form.Item>
              </div>
            </div>
            <div className='tw-w-1/2'>
              <h3 className='tw-py-3 tw-font-semibold tw-text-sm'>{t('userList.workInfo')}</h3>
              <div
                className={`tw-p-4 tw-bg-[#FAFAFA] ${
                  userData?.userName ? 'tw-h-[578px]' : 'tw-h-[602px]'
                }   tw-overflow-auto`}
              >
                <Form.Item style={{ marginBottom: 24 }} label={t('userList.dateJoin')} name='joinDate'>
                  <DatePicker
                    format='DD/MM/YYYY'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.enterDateJoin')}
                  />
                </Form.Item>
                {/*<Form.Item style={{ marginBottom: 24 }} label={t('userList.probationDate')} name='probationDate'>*/}
                {/*  <DatePicker*/}
                {/*    format='DD/MM/YYYY'*/}
                {/*    disabledDate={(date) => {*/}
                {/*      return date.isAfter(new Date())*/}
                {/*    }}*/}
                {/*    showToday={false}*/}
                {/*    className='tw-w-full'*/}
                {/*    placeholder={t('userModal.enterProbationDate')}*/}
                {/*  />*/}
                {/*</Form.Item>*/}
                <Form.Item
                  style={{ marginBottom: 24 }}
                  label={t('userList.officialContractSigningDate')}
                  name='formalDate'
                >
                  <DatePicker
                    format='DD/MM/YYYY'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.enterOfficialContractSigningDate')}
                  />
                </Form.Item>
                <Form.List name='groupProfiles' initialValue={groupProfiles}>
                  {(fields = groupProfiles, { add, remove }) => (
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
                            style={{ marginBottom: 24 }}
                            label={t('userList.department') + ' ' + index}
                            name={[name, 'groupCode']}
                            required
                            rules={[{ required: true, message: t('userModal.errorMessage.groupEmpty') }]}
                          >
                            <Select options={groupOptions} placeholder={t('userModal.selectDepartment')}></Select>
                          </Form.Item>
                          <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 24 }}
                              name={[name, 'title']}
                              rules={[{ required: true, message: t('userModal.errorMessage.titleEmpty') }]}
                            >
                              <Select options={titleOptions} placeholder={t('userModal.selectPosition')}></Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 24 }}
                              name={[name, 'role']}
                              rules={[{ required: true, message: t('userModal.errorMessage.roleEmpty') }]}
                            >
                              <Select options={roleOptions} placeholder={t('userModal.selectFunction')}></Select>
                            </Form.Item>
                          </div>
                        </div>
                      ))}
                      <Form.Item>
                        <Button type='dashed' onClick={() => add({ role: ROLE.OFFICER })} block icon={<PlusOutlined />}>
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
