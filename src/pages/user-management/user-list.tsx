import React, { useState } from 'react'
import { Button, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IUser } from '~/types/user.interface.ts'
import UserCreateEdit from '~/pages/user-management/user-create-edit.tsx'

const { Search } = Input

const UserList: React.FC = () => {
  const [t] = useTranslation()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false)
  return (
    <div className='tw-h-[calc(100%-48px)] tw-m-6 tw-p-6 tw-bg-white'>
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
    </div>
  )
}

export default UserList
