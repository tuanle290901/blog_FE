import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, notification, Select, Table, TablePaginationConfig } from 'antd'
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IUser } from '~/types/user.interface.ts'
import defaultImg from '~/assets/images/default-img.png'
import UserCreateEdit from '~/pages/user-management/user-create-edit.tsx'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { cancelEditingUser, importUser, searchUser, startEditingUser } from '~/stores/features/user/user.slice.ts'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getAllGroup, getTitle } from '~/stores/features/master-data/master-data.slice.ts'
import { IPaging, ISort } from '~/types/api-response.interface.ts'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useUserInfo } from '~/stores/hooks/useUserProfile.tsx'
import { GENDER, ROLE } from '~/constants/app.constant.ts'
import { hasPermission } from '~/utils/helper.ts'

const { Search } = Input

const UserList: React.FC = () => {
  const [t] = useTranslation()
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
    return hasPermission([ROLE.MANAGER, ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER], userInfo?.groupProfiles)
  }, [userInfo])
  // const [pagingAndSort, setPagingAndSort] = useState<{ paging: IPaging; sorts: ISort[] }>({
  //   paging: {
  //     page: 0,
  //     size: 10,
  //     total: 0,
  //     totalPage: 0
  //   },
  //   sorts: []
  // })
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
    //   TODO
    await dispatch(startEditingUser(user.id as string))
  }
  const handleClickDeleteUser = (user: IUser) => {
    //   TODO
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
        paging: prevState.paging,
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
  const columns: ColumnsType<IUser> = [
    {
      title: t('userList.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('fullName'),
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
      render: (text, record) => {
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
      render: (text, record) => {
        return record.groupProfiles
          .map((item, index) => {
            return `${item.groupName}(${t(`common.role.${item.role.toLowerCase()}`)})`
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
              <Button
                size='small'
                onClick={() => handleClickEditUser(record)}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
              {/*<Button*/}
              {/*  size='small'*/}
              {/*  onClick={() => handleClickDeleteUser(record)}*/}
              {/*  icon={<DeleteOutlined className='tw-text-red-600' />}*/}
              {/*/>*/}
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
        } catch (e) {
          console.log(e)
        }
      }
    }
    if (fileSelect?.current) {
      fileSelect.current.value = ''
    }
  }
  return (
    <div className='user-list tw-h-[calc(100vh-112px)] tw-m-6 tw-p-5 tw-bg-white'>
      {(isOpenUserModal || !!userState.editingUser) && (
        <UserCreateEdit
          open={isOpenUserModal || !!userState.editingUser}
          userData={userState.editingUser}
          handleClose={handleCloseUserModal}
        />
      )}
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>
          {t('userList.member')}({userState.meta.total})
        </h1>
        <h5 className='tw-text-sm'>{t('userList.memberList')}</h5>
      </div>
      <div className='tw-flex tw-gap-4 tw-mt-4'>
        {permissionAddUser && (
          <div className='tw-gap-4 tw-flex'>
            <Button onClick={openModalCreateUser} type='primary' icon={<PlusOutlined />}>
              {t('userList.addMember')}
            </Button>
            <Button icon={<UploadOutlined />} onClick={() => fileSelect?.current?.click()}>
              Import thành viên
            </Button>
            <input
              ref={fileSelect}
              className='tw-hidden'
              type='file'
              accept='.xlxs,.xls'
              onChange={(event) => handleFileChange(event.target.files)}
            />
          </div>
        )}

        <div className='tw-flex tw-gap-4 tw-justify-end tw-flex-1'>
          <Select
            onChange={handleDepartmentChange}
            defaultValue={'all'}
            options={groupOptions}
            value={searchValue.group}
            className='tw-w-64'
          ></Select>
          <Search
            value={query}
            placeholder={'Tìm kiếm thành viên'}
            onChange={(event) => handleSearchValueChange(event.target.value)}
            className='tw-w-64'
          />
        </div>
      </div>
      <div className='tw-mt-6'>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={userState.userList}
          loading={userState.loading}
          pagination={{ total: userState.meta.total, showSizeChanger: true, showQuickJumper: true }}
          scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
          onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
        />
      </div>
    </div>
  )
}

export default UserList
