import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, notification, Radio, Select, Upload, Row, Col } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { RuleObject } from 'antd/lib/form'
import { useTranslation } from 'react-i18next'
import { RcFile } from 'antd/es/upload'
import defaultImg from '~/assets/images/default-img.png'
import { getBase64 } from '~/utils/util.ts'
import { IUser } from '~/types/user.interface.ts'
import dayjs, { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { EDIT_TYPE, GENDER, ROLE, USER_STATUS } from '~/constants/app.constant.ts'
import { createUser, updateUser } from '~/stores/features/user/user.slice.ts'
import { EMAIL_REG, REGEX_PHONE_NUMBER, REGEX_POSITIVE_NUMBER } from '~/constants/regex.constant.ts'
import { hasPermission } from '~/utils/helper.ts'
import { useUserInfo } from '~/stores/hooks/useUserProfile.tsx'
import { VALIDATE_FORM } from '~/utils/Constant'

const UserCreateEdit: React.FC<{
  open: boolean
  handleClose: (isCreateUserSuccess: boolean) => void
  userData?: IUser | null
  resetPageUser: any
}> = ({ open, handleClose, userData, resetPageUser }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [avatarBase64, setAvatarBase64] = useState<string>('')
  const [avtError, setAvtError] = useState(false)
  const [serverError, setServerError] = useState<any>(null)
  const [remainLeaveMinute, setRemainLeaveMinute] = useState<number>(userData?.createWithRemainLeaveMinutes || 0)
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

  const { userInfo, setUserProfileInfo } = useUserInfo()
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
    },
    {
      label: t('common.role.system_admin'),
      value: ROLE.SYSTEM_ADMIN
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
    const isLt2M = file.size / 1024 / 1024 < 12
    if (!isLt2M) {
      void message.error('Kích thước ảnh phải nhỏ hơn 12MB!')
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
  const [checkDisableUpdateUser, setCheckDisableUpdateUser] = useState(true)
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        birthday: userData.birthday ? dayjs(userData.birthday) : undefined,
        formalDate: userData.formalDate ? dayjs(userData.formalDate) : undefined,
        joinDate: userData.joinDate ? dayjs(userData.joinDate) : undefined
      })
      if (userData.avatarBase64) {
        setAvatarBase64('data:image/png;base64,' + userData.avatarBase64)
      }
      if (!hasPermission([ROLE.HR, ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles)) {
        if (userInfo?.userName !== userData.userName) {
          setCheckDisableUpdateUser(false)
        }
      }
    } else {
      form.resetFields()
      setAvatarBase64('')
    }
  }, [form, userData, userInfo?.groupProfiles, userInfo?.userName])

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
      const joinDate = value.joinDate ? value.joinDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      const formalDate = value.formalDate ? value.formalDate.format('YYYY-MM-DD') : null
      if (joinDate && formalDate && joinDate > formalDate) {
        notification.warning({ message: t('userModal.signingDateWarning') })
        return
      }
      const payload: IUser = {
        ...value,
        groupProfiles,
        birthday,
        formalDate,
        joinDate,
        email: value.email || null,
        phoneNumber: value.phoneNumber || null,
        createWithRemainLeaveMinutes: Number(value?.createWithRemainLeaveMinutes) || 0
      }
      try {
        setLoading(true)
        if (userData) {
          await dispatch(
            updateUser({ userId: userData.id as string, user: { ...payload, userName: userData.userName } })
          ).unwrap()
          if (userData && userInfo && (userData.userName === userInfo?.userName || userData.id === userInfo?.id)) {
            setUserProfileInfo(payload)
          }
        } else {
          await dispatch(createUser(payload)).unwrap()
          resetPageUser()
        }
        setServerError(null)
        finishAndClose(true)
        notification.success({
          message: userData ? 'Cập nhật thông tin thành viên thành công' : 'Tạo mới thành viên thành công'
        })
      } catch (e: any) {
        if (e?.status === 409) {
          setServerError(e)
        }
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
      return Promise.reject('Email không được để trống')
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
      return Promise.resolve(true)
    }
    if (!REGEX_PHONE_NUMBER.test(value)) {
      return Promise.reject(t('userModal.errorMessage.invalidPhoneNumber'))
    }
    if (serverError && serverError.message.includes(value)) {
      return Promise.reject('Số điện thoại ' + value + ' đã được sử dụng.')
    }
    return Promise.resolve()
  }
  const hasPermissionAddAndChangeRole = () => {
    if (userData) {
      if (userData.editType === EDIT_TYPE.ADMIN || userData.editType === EDIT_TYPE.HR) {
        return true
      }
    } else {
      return hasPermission([ROLE.SYSTEM_ADMIN, ROLE.HR], userInfo?.groupProfiles)
    }
  }

  return (
    <Modal
      open={open}
      title={userData ? t('userList.editMember') : t('userList.addMember')}
      onCancel={() => finishAndClose(false)}
      footer={
        <div className={'tw-flex tw-justify-end'}>
          {(userData?.status !== USER_STATUS.DEACTIVE || !userData) && (
            <>
              <Button onClick={() => finishAndClose(false)}>{t('common.cancel')}</Button>
              {userData ? (
                checkDisableUpdateUser && (
                  <Button type='primary' onClick={handleSubmit} loading={loading}>
                    {t('common.save')}
                  </Button>
                )
              ) : (
                <Button type='primary' onClick={handleSubmit} loading={loading}>
                  {t('common.save')}
                </Button>
              )}
            </>
          )}
        </div>
      }
      maskClosable={false}
      forceRender
      width={1100}
      centered
    >
      <div>
        <div className='tw-flex tw-items-center tw-gap-4'>
          <Upload name='avatar' accept='image/png, image/jpeg' showUploadList={false} beforeUpload={beforeUpload}>
            <div ref={uploadRef}>
              {avatarBase64 ? (
                <img
                  className='tw-w-20 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-20 tw-rounded-full tw-object-cover'
                  src={avatarBase64}
                  alt='avatar'
                />
              ) : (
                <img
                  className='tw-w-20 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-20 tw-rounded-full tw-object-cover'
                  src={defaultImg}
                  alt='avatar'
                />
              )}
            </div>
          </Upload>
          <div className='tw-h-auto'>
            <div className='tw-flex tw-gap-2'>
              <Button
                disabled={userData?.status === USER_STATUS.DEACTIVE}
                onClick={handleClickButtonUpdateAvatar}
                type='primary'
              >
                {t(avatarBase64 ? 'userModal.updateAvatar' : 'userModal.chooseAvatar')}
              </Button>
              {/*<Button onClick={() => setAvatarBase64('')}>{t('userModal.deleteAvatar')}</Button>*/}
            </div>
            <div className='tw-mt-1'>
              <p className='tw-text-yellow-600'>{t('userModal.avatarAccept')}</p>
              {avtError && <p className='tw-text-red-600'>{t('userModal.errorMessage.avatarEmpty')}</p>}
            </div>
          </div>
        </div>
        <div className='tw-border-[#eee] tw-border tw-border-solid tw-my-2' />
        <Form form={form} layout='vertical'>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <h3 className='tw-py-3 tw-font-semibold tw-text-sm'>{t('userList.commonInfo')}</h3>
              <div className='tw-p-4 tw-bg-[#FAFAFA]'>
                {userData?.userName && (
                  <Form.Item
                    initialValue={userData.userName}
                    style={{ marginBottom: 20 }}
                    label={t('userList.username')}
                    name='userName'
                  >
                    <Input disabled />
                  </Form.Item>
                )}
                <Form.Item
                  style={{ marginBottom: 20 }}
                  label={t('userList.fullName')}
                  name='fullName'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('userModal.errorMessage.fullNameIsEmpty')
                    },
                    {
                      pattern: /^(?!\s+$).+/,
                      message: t('userModal.errorMessage.fullNameIsEmpty')
                    }
                  ]}
                >
                  <Input
                    disabled={userData?.status === USER_STATUS.DEACTIVE || !checkDisableUpdateUser}
                    placeholder={t('userModal.enterMemberName')}
                    maxLength={VALIDATE_FORM.MAX_LENGTH_FULLNAME}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 20 }} label={t('userList.gender')} name='genderType'>
                  {/*<Select placeholder={t('userModal.selectGender')}>*/}
                  {/*  <Select.Option value={GENDER.MALE}>{t('userList.male')}</Select.Option>*/}
                  {/*  <Select.Option value={GENDER.FEMALE}>{t('userList.female')}</Select.Option>*/}
                  {/*</Select>*/}
                  <Radio.Group
                    name='genderType'
                    className='tw-w-full'
                    disabled={userData?.status === USER_STATUS.DEACTIVE || !checkDisableUpdateUser}
                  >
                    <div className='tw-flex tw-gap-32 tw-border tw-border-gray-300 tw-border-solid  tw-bg-white tw-py-1 tw-px-2 tw-rounded-md'>
                      <Radio value={GENDER.MALE}>{t('userList.male')}</Radio>
                      <Radio value={GENDER.FEMALE}>{t('userList.female')}</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
                <Form.Item style={{ marginBottom: 20 }} label={t('userList.dateOfBirth')} name='birthday'>
                  <DatePicker
                    format='DD/MM/YYYY'
                    disabled={userData?.status === USER_STATUS.DEACTIVE || !checkDisableUpdateUser}
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.selectDOB')}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 20 }}
                  label={t('userList.phoneNumber')}
                  name='phoneNumber'
                  rules={[
                    {
                      validator: phoneNumberValidator
                    }
                  ]}
                >
                  <Input
                    disabled={userData?.status === USER_STATUS.DEACTIVE || !checkDisableUpdateUser}
                    placeholder={t('userModal.enterPhoneNumber')}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 20 }}
                  label={t('userList.email')}
                  name='email'
                  required
                  rules={[
                    {
                      validator: emailValidator
                    }
                  ]}
                >
                  <Input
                    disabled={userData?.status === USER_STATUS.DEACTIVE || !checkDisableUpdateUser}
                    placeholder={t('userModal.enterEmail')}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: '10px' }} label={t('userList.address')} name='address'>
                  <Input
                    disabled={userData?.status === USER_STATUS.DEACTIVE || !checkDisableUpdateUser}
                    placeholder={t('userModal.enterAddress')}
                  />
                </Form.Item>
                {/*{!userData && (*/}
                {/*  <Form.Item*/}
                {/*    label={t('userList.password')}*/}
                {/*    name='password'*/}
                {/*    rules={[*/}
                {/*      {*/}
                {/*        required: true,*/}
                {/*        message: t('userModal.errorMessage.passwordIsEmpty')*/}
                {/*      }*/}
                {/*    ]}*/}
                {/*  >*/}
                {/*    <Password placeholder={t('userModal.enterPassword')}></Password>*/}
                {/*  </Form.Item>*/}
                {/*)}*/}
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <h3 className='tw-py-3 tw-font-semibold tw-text-sm'>{t('userList.workInfo')}</h3>
              <div className={`tw-p-4 tw-bg-[#FAFAFA] ${userData?.userName ? 'tw-h-[564px]' : 'tw-h-[482px]'}`}>
                <Form.Item style={{ marginBottom: 20 }} label={t('userList.dateJoin')} name='joinDate' required>
                  {userData ? (
                    <DatePicker
                      format='DD/MM/YYYY'
                      disabledDate={(date) => {
                        return date.isAfter(new Date())
                      }}
                      disabled={
                        (!!userData && userData.editType === EDIT_TYPE.SELF) ||
                        userData?.status === USER_STATUS.DEACTIVE
                      }
                      showToday={false}
                      defaultValue={userData?.joinDate ? dayjs(userData?.joinDate) : undefined}
                      className='tw-w-full'
                      placeholder={t('userModal.enterDateJoin')}
                      allowClear={false}
                    />
                  ) : (
                    <DatePicker
                      format='DD/MM/YYYY'
                      disabledDate={(date) => {
                        return date.isAfter(new Date())
                      }}
                      disabled={!!userData}
                      showToday={false}
                      defaultValue={dayjs()}
                      className='tw-w-full'
                      placeholder={t('userModal.enterDateJoin')}
                      allowClear={false}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 20 }}
                  label={t('userList.officialContractSigningDate')}
                  name='formalDate'
                >
                  <DatePicker
                    format='DD/MM/YYYY'
                    disabledDate={(date) => {
                      return date.isAfter(new Date())
                    }}
                    disabled={
                      (!!userData && userData.editType === EDIT_TYPE.SELF) || userData?.status === USER_STATUS.DEACTIVE
                    }
                    showToday={false}
                    className='tw-w-full'
                    placeholder={t('userModal.enterOfficialContractSigningDate')}
                  />
                </Form.Item>
                {hasPermissionAddAndChangeRole() && userData?.status !== USER_STATUS.DEACTIVE && (
                  <>
                    <div className='form-item__label required'>
                      <span>{t('userModal.remainLeaveMinute')}</span>
                      {remainLeaveMinute > 0 && (
                        <span className='tw-text-orange-600 tw-ml-1'>
                          ({(remainLeaveMinute / 60)?.toFixed(2)} {t('timesheet.hour')}
                          <span className='tw-italic tw-mx-2'>=</span>
                          {(remainLeaveMinute / (8 * 60))?.toFixed(2)} {t('timesheet.day')} )
                        </span>
                      )}
                    </div>
                    <div className='tw-text-yellow-600 tw-ml-[10px] tw-mb-[10px] tw-text-[13px]'>
                      <p>- Bắt buộc nhập khi tạo mới thành viên.</p>
                      <p>
                        - Việc cập nhật lại sẽ không có tác dụng nếu thành viên đó đã từng được phê duyệt yêu cầu nghỉ
                        phép trong hệ thống.
                      </p>
                    </div>
                    <Form.Item
                      style={{ marginBottom: 20 }}
                      name='createWithRemainLeaveMinutes'
                      required
                      initialValue={userData?.createWithRemainLeaveMinutes || 0}
                      rules={[
                        {
                          required: true,
                          message: t('userModal.errorMessage.remainLeaveMinuteIsEmpty')
                        },
                        {
                          pattern: REGEX_POSITIVE_NUMBER,
                          message: t('userModal.errorMessage.remainLeaveMinuteIsPositive')
                        }
                      ]}
                    >
                      <Input
                        placeholder={t('userModal.enterRemainLeaveMinute')}
                        type='number'
                        min={0}
                        max={99999}
                        onChange={(e) => setRemainLeaveMinute(Number(e?.target?.value))}
                      />
                    </Form.Item>
                  </>
                )}
                <Form.List name='groupProfiles' initialValue={groupProfiles}>
                  {(fields = groupProfiles, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className='tw-relative'>
                          {fields.length > 1 && hasPermissionAddAndChangeRole() && (
                            <MinusCircleOutlined
                              className='tw-absolute tw-right-1 tw-top-1 tw-z-50 tw-text-red-600'
                              onClick={() => remove(name)}
                            />
                          )}
                          <Form.Item
                            {...restField}
                            style={{ marginBottom: 20 }}
                            label={t('userList.department')}
                            name={[name, 'groupCode']}
                            required
                            rules={[{ required: true, message: t('userModal.errorMessage.groupEmpty') }]}
                          >
                            <Select
                              disabled={!hasPermissionAddAndChangeRole() || userData?.status === USER_STATUS.DEACTIVE}
                              options={groupOptions}
                              placeholder={t('userModal.selectDepartment')}
                            ></Select>
                          </Form.Item>
                          <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
                            <Form.Item
                              {...restField}
                              style={{ marginBottom: 20 }}
                              name={[name, 'title']}
                              label={t('userModal.departmentRole')}
                              rules={[{ required: true, message: t('userModal.errorMessage.titleEmpty') }]}
                            >
                              <Select
                                disabled={!hasPermissionAddAndChangeRole() || userData?.status === USER_STATUS.DEACTIVE}
                                options={titleOptions}
                                placeholder={t('userModal.selectPosition')}
                              ></Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label={t('userModal.systemRole')}
                              name={[name, 'role']}
                              rules={[{ required: true, message: t('userModal.errorMessage.roleEmpty') }]}
                            >
                              <Select
                                disabled={!hasPermissionAddAndChangeRole() || userData?.status === USER_STATUS.DEACTIVE}
                                options={roleOptions}
                                placeholder={t('userModal.selectFunction')}
                              ></Select>
                            </Form.Item>
                          </div>
                        </div>
                      ))}
                      {/* <Form.Item>
                        {hasPermissionAddAndChangeRole() && userData?.status !== USER_STATUS.DEACTIVE && (
                          <Button
                            type='dashed'
                            onClick={() => add({ role: ROLE.OFFICER })}
                            block
                            icon={<PlusOutlined />}
                          >
                            {t('userModal.addRole')}
                          </Button>
                        )}
                      </Form.Item> */}
                    </>
                  )}
                </Form.List>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}
export default UserCreateEdit
