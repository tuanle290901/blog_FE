import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
  TablePaginationConfig,
  Tooltip,
  Row,
  Col,
  Space,
  Dropdown,
  MenuProps
} from 'antd'
import {
  DownloadOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UndoOutlined,
  LockOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IUser } from '~/types/user.interface.ts'
import defaultImg from '~/assets/images/default-img.png'
import UserCreateEdit from '~/pages/user-management/user-create-edit.tsx'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import {
  cancelEditingUser,
  deleteUser,
  getImportTemplate,
  importUser,
  restoreUser,
  searchUser,
  startEditingUser,
  startResetPassworkUser
} from '~/stores/features/user/user.slice.ts'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getAllGroup, getTitle } from '~/stores/features/master-data/master-data.slice.ts'
import { IPaging, ISort } from '~/types/api-response.interface.ts'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useUserInfo } from '~/stores/hooks/useUserProfile.tsx'
import { COMMON_ERROR_CODE, GENDER, ROLE, USER_STATUS } from '~/constants/app.constant.ts'
import { hasPermission } from '~/utils/helper.ts'
import { saveAs } from 'file-saver'

const { Search } = Input

const UserList: React.FC = () => {
  const { t } = useTranslation()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false)
  const dispatch = useAppDispatch()
  const { userInfo, setUserProfileInfo } = useUserInfo()
  const navigate = useNavigate()
  const userState = useAppSelector((state) => state.user)
  const groups = useAppSelector((state) => state.masterData.groups)
  const [query, setQuery] = useState<string>('')
  const fileSelect = useRef<any>(null)
  const [searchValue, setSearchValue] = useState<{
    query: string
    group?: string | null
    paging: IPaging
    sorts: ISort[]
  }>({
    query: '',
    paging: {
      page: 0,
      size: 10,
      total: 0,
      totalPage: 0
    },
    sorts: [
      {
        direction: 'DESC',
        field: 'created_at'
      }
    ]
  })
  const permissionAddUser = useMemo(() => {
    return hasPermission([ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles)
  }, [userInfo])
  const permissionImportUser = useMemo(() => {
    return hasPermission([ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles)
  }, [userInfo])

  const timerId = useRef<any>(null)
  useEffect(() => {
    const promise = [dispatch(getAllGroup()), dispatch(getTitle())]
    return () => {
      promise.forEach((item) => item.abort())
    }
  }, [])
  const groupOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    const options = groups.map((item) => {
      return { value: item.code, label: item.name }
    })
    return [{ value: 'all', label: t('userList.allGroup') }, ...options]
  }, [groups])
  const handleClickEditUser = async (user: IUser) => {
    try {
      await dispatch(startEditingUser(user.id as string))
    } catch (e: any) {
      if (e.status === 404) {
        notification.error({ message: 'Thành viên đã bị xóa khỏi hệ thống' })
      }
      resetAndSearchUser()
    }
  }
  const handleClickDeleteUser = async (user: IUser) => {
    try {
      await dispatch(deleteUser(user))
      notification.success({ message: 'Vô hiệu hóa tài khoản thành công' })
      dispatch(
        searchUser({
          paging: searchValue.paging,
          sorts: searchValue.sorts,
          query: searchValue.query,
          groupCode: searchValue.group === 'all' ? null : searchValue.group
        })
      )
    } catch (e) {
      console.log(e)
    }
  }
  const handleClickViewUserHistory = (user: IUser) => {
    navigate('/user/history/' + user.id)
  }
  const handleCloseUserModal = (isCreateUserSuccess: boolean) => {
    setIsOpenUserModal(false)
    dispatch(cancelEditingUser())
    if (isCreateUserSuccess) {
      resetAndSearchUser()
    }
  }
  const resetAndSearchUser = () => {
    setQuery('')
    setSearchValue((prevState) => {
      return {
        group: 'all',
        query: '',
        paging: { ...prevState.paging, page: 0 },
        sorts: [
          {
            direction: 'DESC',
            field: 'created_at'
          }
        ]
      }
    })
  }
  const getSortOrder = (filed: string) => {
    const sort = searchValue.sorts[0]
    if (sort && sort.field === filed) {
      return searchValue.sorts[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }
  const handleClickResetPasswordUser = async (user: IUser) => {
    try {
      await dispatch(startResetPassworkUser({ userId: user.id as string }))
      notification.success({ message: 'Khôi phục mật khẩu thành công' })
    } catch (e) {
      console.log(e)
    }
  }
  const handleRestoreUser = async (user: IUser) => {
    try {
      await dispatch(restoreUser(user))
      notification.success({ message: 'Khôi phục tài khoản thành công' })
      dispatch(
        searchUser({
          paging: searchValue.paging,
          sorts: searchValue.sorts,
          query: searchValue.query,
          groupCode: searchValue.group === 'all' ? null : searchValue.group
        })
      )
    } catch (e) {
      console.log(e)
    }
  }

  const columns: ColumnsType<IUser> = [
    {
      title: t('userList.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('fullName'),
      width: '200px',
      render: (text, record) => {
        return (
          <div className='tw-relative'>
            <img
              className='tw-w-8 tw-h-8 tw-absolute -tw-top-1 tw-left-0 tw-rounded-full'
              alt='avatar'
              src={record.avatarBase64 ? `data:image/png;base64,${record.avatarBase64}` : defaultImg}
            />
            <span className='tw-pl-10'>{text}</span>
          </div>
        )
      },
      ellipsis: true
    },
    {
      title: t('userList.userName'),
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('userName'),
      width: '150px',
      ellipsis: true
    },
    {
      title: t('userList.dateOfBirth'),
      dataIndex: 'birthday',
      key: 'birthday',
      sorter: true,
      sortOrder: getSortOrder('birthday'),
      showSorterTooltip: false,
      width: '150px',
      align: 'center',
      render: (text) => {
        if (text) {
          const date = dayjs(text).format('DD/MM/YYYY')
          return date
        }
      }
    },
    {
      title: t('userList.gender'),
      dataIndex: 'genderType',
      key: 'genderType',
      sorter: true,
      width: '120px',
      align: 'center',
      sortOrder: getSortOrder('genderType'),
      showSorterTooltip: false,
      render: (text, _) => {
        return text ? t(text === GENDER.MALE ? 'userList.male' : 'userList.female') : ''
      }
    },
    {
      title: t('userList.department'),
      dataIndex: 'groupProfiles',
      key: 'groupProfiles',
      width: '250px',
      render: (text, record) => {
        return record.groupProfiles
          .map((item) => {
            return `${item.groupName} (${t(`common.role.${item.role.toLowerCase()}`)})`
          })
          .join(',')
      },
      ellipsis: true
    },
    {
      title: t('userList.phoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
      width: '150px',
      sortOrder: getSortOrder('phoneNumber'),
      showSorterTooltip: false
    },
    {
      title: t('userList.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('email'),
      width: '200px',
      ellipsis: true
    },
    {
      title: t('userList.action'),
      key: 'action',
      align: 'center',
      width: '120px',
      render: (_, record) => {
        return (
          <div className='tw-absolute tw-left-0 tw-w-full'>
            <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
              {record.status !== USER_STATUS.DEACTIVE && (
                <>
                  <Tooltip title={'Chỉnh sửa thành viên'}>
                    <Button
                      size='small'
                      onClick={() => handleClickEditUser(record)}
                      icon={<EditOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  {hasPermission([ROLE.HR, ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles) && (
                    <>
                      <Tooltip title='Vô hiệu hóa tài khoản'>
                        <Popconfirm
                          title='Xác nhận vô hiệu hóa tài khoản'
                          onConfirm={() => handleClickDeleteUser(record)}
                        >
                          <Button size='small' icon={<DeleteOutlined className='tw-text-red-600' />} />
                        </Popconfirm>
                      </Tooltip>
                      <Tooltip title='Đặt lại mật khẩu'>
                        <Popconfirm
                          title={t('userList.descriptionConfirmResetPassword', {
                            account: record.fullName
                          })}
                          onConfirm={() => handleClickResetPasswordUser(record)}
                          okText={t('common.confirm')}
                          cancelText={t('common.cancel')}
                        >
                          <Button size='small' icon={<LockOutlined className='tw-text-blue-600' />} />
                        </Popconfirm>
                      </Tooltip>
                    </>
                  )}
                </>
              )}
              {record.status === USER_STATUS.DEACTIVE && (
                <>
                  <Tooltip title='Xem chi tiết'>
                    <Button
                      size='small'
                      onClick={() => handleClickEditUser(record)}
                      icon={<EyeOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  {hasPermission([ROLE.HR, ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles) && (
                    <>
                      <Tooltip title='Khôi phục'>
                        <Popconfirm
                          title={'Xác nhận khôi phục thành viên' + `'${record.fullName}'`}
                          okText={t('common.yes')}
                          onConfirm={() => handleRestoreUser(record)}
                        >
                          <Button size='small' icon={<UndoOutlined className='tw-text-blue-600' />} />
                        </Popconfirm>
                      </Tooltip>
                    </>
                  )}
                </>
              )}

              {/*<Button size='small' onClick={() => handleClickViewUserHistory(record)} icon={<HistoryOutlined />} />*/}
            </div>
          </div>
        )
      }
    }
  ]
  const handleDepartmentChange = (value: string | null) => {
    setSearchValue((prevState) => {
      return { ...prevState, query: prevState.query, group: value }
    })
  }
  const handleSearchValueChange = (value: string) => {
    setQuery(value)
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      setSearchValue((prevState) => ({ ...prevState, query: value, paging: { ...prevState.paging, page: 0 } }))
    }, 500)
  }
  const resetPageUser = () => {
    setSearchValue({
      query: '',
      paging: {
        page: 0,
        size: 10,
        total: 0,
        totalPage: 0
      },
      sorts: [
        {
          direction: 'DESC',
          field: 'created_at'
        }
      ]
    })
  }
  useEffect(() => {
    const promise = dispatch(
      searchUser({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query,
        groupCode: searchValue.group === 'all' ? null : searchValue.group
      })
    )

    return () => {
      promise.abort()
    }
  }, [searchValue])

  function handleTableChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IUser> | any
  ) {
    setSearchValue((prevState) => {
      const paging: IPaging = {
        ...prevState.paging,
        page: Number(pagination.current) - 1,
        size: pagination.pageSize as number
      }
      const sorts: ISort[] = []
      if (sorter.order) {
        sorts.push({ field: sorter.field as string, direction: sorter.order === 'ascend' ? 'ASC' : 'DESC' })
      } else {
        sorts.push({
          direction: 'DESC',
          field: 'created_at'
        })
      }
      return { ...prevState, paging, sorts }
    })
  }
  const openModalCreateUser = () => {
    setIsOpenUserModal(true)
  }

  const handleFileChange = async (files: FileList | null) => {
    if (files && files.length) {
      const file = files[0]
      const fileName = file.name.split('.')
      const fileExtension = fileName.length ? fileName[fileName.length - 1] : ''
      if (!(fileExtension === 'xlsx' || fileExtension === 'xls')) {
        notification.error({ message: 'Vui lòng chọn file có định dạng xlsx hoặc xls' })
      } else {
        try {
          await dispatch(importUser(file)).unwrap()
          notification.success({ message: 'Import thành viên thành công' })
          resetAndSearchUser()
        } catch (e: any) {
          if (e.status && !COMMON_ERROR_CODE.includes(e.status)) {
            notification.error({ message: e.message })
          }
        }
      }
    }
    if (fileSelect?.current) {
      fileSelect.current.value = ''
    }
  }

  const onDownloadImportTemplate = async () => {
    try {
      const response = (await getImportTemplate()) as any
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
      const fileName = `import-user-template.xlsx`
      saveAs(blob, fileName)
    } catch (error: any) {
      // TODO
    }
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <div className='tw-cursor-pointer' onClick={onDownloadImportTemplate}>
          Tải file import mẫu
        </div>
      ),
      key: '1'
    }
  ]

  return (
    <div className='user-list tw-h-[calc(100vh-112px)] tw-m-6 tw-p-5 tw-bg-white'>
      {(isOpenUserModal || !!userState.editingUser) && (
        <UserCreateEdit
          open={isOpenUserModal || !!userState.editingUser}
          userData={userState.editingUser}
          handleClose={handleCloseUserModal}
          resetPageUser={resetPageUser}
        />
      )}
      <div>
        <h1 className='tw-text-2xl tw-font-semibold'>
          {t('userList.member')} ({userState.meta.total})
        </h1>
        <h5 className='tw-text-sm'>{t('userList.memberList')}</h5>
      </div>
      <Row gutter={[16, 16]} className='tw-mt-4'>
        <Col xs={24} md={12}>
          <div className='tw-float-right tw-flex tw-flex-col md:tw-flex-row tw-w-full tw-gap-[10px]'>
            {permissionAddUser && (
              <Button onClick={openModalCreateUser} type='primary' icon={<PlusOutlined />}>
                {t('userList.addMember')}
              </Button>
            )}

            {permissionImportUser && (
              <Dropdown.Button menu={{ items }} onClick={() => fileSelect?.current?.click()}>
                <>
                  <span className='tw-cursor-pointer'>Import thành viên</span>
                  <input
                    ref={fileSelect}
                    className='tw-hidden'
                    type='file'
                    accept='.xlxs,.xls'
                    onChange={(event) => handleFileChange(event.target.files)}
                  />
                </>
              </Dropdown.Button>
            )}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className='tw-flex tw-flex-col lg:tw-flex-row md:tw-justify-end tw-w-full tw-gap-[10px]'>
            <Select
              onChange={handleDepartmentChange}
              defaultValue={'all'}
              options={groupOptions}
              value={searchValue.group}
              className='tw-w-full lg:tw-w-[200px]'
            />

            <Search
              value={query}
              placeholder={t('userList.searchMember')}
              onChange={(event) => handleSearchValueChange(event.target.value)}
              className='tw-w-full lg:tw-w-[280px]'
            />
          </div>
        </Col>
      </Row>

      <div className='tw-mt-6'>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={userState.userList}
          loading={userState.loading}
          pagination={{
            total: userState.meta.total,
            pageSizeOptions: [5, 10, 25, 50],
            showSizeChanger: true,
            showQuickJumper: true,
            current: searchValue.paging.page + 1
          }}
          rowClassName={(record) => (record.status === USER_STATUS.DEACTIVE ? 'tw-bg-gray-100' : '')}
          scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
          onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
        />
      </div>
    </div>
  )
}

export default UserList
