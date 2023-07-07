import React, { useEffect, useState } from 'react'
import { Button, Input, Select, Table } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IUser } from '~/types/user.interface.ts'
import defaultImg from '~/assets/images/default-img.png'
import UserCreateEdit from '~/pages/user-management/user-create-edit.tsx'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { cancelEditingUser, getListUser, startEditingUser } from '~/stores/features/user/user.slice.ts'
import { useNavigate } from 'react-router-dom'

const { Search } = Input

const UserList: React.FC = () => {
  const [t] = useTranslation()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userState = useAppSelector((state) => state.user)
  const handleClickEditUser = (user: IUser) => {
    //   TODO
    dispatch(startEditingUser(user.id as string))
  }
  const handleClickDeleteUser = (user: IUser) => {
    //   TODO
  }
  const handleClickViewUserHistory = (user: IUser) => {
    navigate('/user/history/' + user.id)
  }
  const handleCloseUserModal = () => {
    setIsOpenUserModal(false)
    dispatch(cancelEditingUser())
  }
  const columns: ColumnsType<IUser> = [
    {
      title: t('userList.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => {
        return (
          <div className='tw-relative'>
            <img className='tw-w-8 tw-h-8 tw-absolute -tw-top-1 tw-left-0' alt='avatar' src={defaultImg} />
            <span className='tw-pl-10'>{text}</span>
          </div>
        )
      },
      ellipsis: true
    },
    {
      title: t('userList.dateOfBirth'),
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth'
    },
    {
      title: t('userList.gender'),
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: t('userList.department'),
      dataIndex: 'department',
      key: 'department',
      ellipsis: true
    },
    {
      title: t('userList.phoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: t('userList.email'),
      dataIndex: 'email',
      key: 'email',
      ellipsis: true
    },
    {
      title: t('userList.action'),
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <div className='tw-absolute tw-left-0 tw-w-full'>
            <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
              <Button
                size='small'
                onClick={() => handleClickEditUser(record)}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
              <Button
                size='small'
                onClick={() => handleClickDeleteUser(record)}
                icon={<DeleteOutlined className='tw-text-red-600' />}
              />
              <Button size='small' onClick={() => handleClickViewUserHistory(record)} icon={<HistoryOutlined />} />
            </div>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    const promise = dispatch(getListUser())
    promise.finally(() => console.log('final'))
    return () => {
      promise.abort()
    }
  }, [])
  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <UserCreateEdit
        open={isOpenUserModal || !!userState.editingUser}
        userData={userState.editingUser}
        handleClose={handleCloseUserModal}
      />
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>{t('userList.member')}(100)</h1>
        <h5 className='tw-text-sm'>{t('userList.memberList')}</h5>
      </div>
      <div className='tw-flex tw-justify-between tw-gap-4 tw-mt-4'>
        <Button onClick={() => setIsOpenUserModal(true)} type='primary' icon={<PlusOutlined />}>
          {t('userList.addMember')}
        </Button>
        <div className='tw-flex tw-gap-4'>
          <Select className='tw-w-64'></Select>
          <Search className='tw-w-64' />
        </div>
      </div>
      <div className='tw-mt-6'>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={userState.userList}
          loading={userState.loading}
          scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
        />
      </div>
    </div>
  )
}

export default UserList
