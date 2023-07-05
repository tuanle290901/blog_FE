import React, { useEffect, useState } from 'react'
import { Button, Input, Table } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IUser } from '~/types/user.interface.ts'
import defaultImg from '~/assets/images/default-img.png'
import UserCreateEdit from '~/pages/user-management/user-create-edit.tsx'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { getListUser } from '~/stores/features/user/user.slice.ts'

const { Search } = Input

const UserList: React.FC = () => {
  const [t] = useTranslation()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false)
  const dispatch = useAppDispatch()
  const userState = useAppSelector((state) => state.user)
  const handleClickEditUser = (user: IUser) => {
    //   TODO
  }
  const handleClickDeleteUser = (user: IUser) => {
    //   TODO
  }
  const handleClickViewUserHistory = (user: IUser) => {
    //   TODO
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
      render: (_, record) => {
        return (
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
        )
      }
    }
  ]

  useEffect(() => {
    const promise = dispatch(getListUser())
    return () => {
      promise.abort()
    }
  }, [])
  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <UserCreateEdit open={isOpenUserModal} handleClose={() => setIsOpenUserModal(false)} />
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>{t('userList.member')}(100)</h1>
        <h5 className='tw-text-sm'>{t('userList.memberList')}</h5>
      </div>
      <div className='tw-flex tw-justify-end tw-gap-4'>
        <Search className='tw-w-64' />
        <Button onClick={() => setIsOpenUserModal(true)} type='primary' icon={<PlusOutlined />}>
          {t('userList.addMember')}
        </Button>
      </div>
      <div className='tw-mt-6'>
        <Table
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
