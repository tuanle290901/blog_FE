import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Table, TableColumnsType } from 'antd'
import { IDevice } from '~/types/device.interface.ts'
import { DeleteOutlined, EditOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons'
import CreateEditDevice from '~/pages/device-management/create-edit-device.tsx'

const DeviceList: React.FC = () => {
  const [t] = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const handleClickDeleteUser = (record: IDevice) => {
    console.log(record)
  }

  const handleClickEditUser = (record: IDevice) => {
    console.log(record)
  }

  const data: IDevice[] = new Array(100).fill(0).map((_, index) => {
    return {
      id: index + '',
      deviceCode: 'Thiết bị ' + index,
      departmentManager: 'HSTC',
      installationLocation: 'Cửa ra vào tầng 16 '
    }
  })
  const columns: TableColumnsType<IDevice> = [
    {
      key: 'deviceCode',
      title: t('device.deviceCode'),
      dataIndex: 'deviceCode',
      ellipsis: true
    },
    {
      key: 'installationLocation',
      title: t('device.installationLocation'),
      dataIndex: 'installationLocation',
      ellipsis: true
    },
    {
      key: 'departmentManager',
      title: t('device.action'),
      width: '250px',
      align: 'center',
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
          </div>
        )
      }
    }
  ]
  const handleCloseModal = () => {
    setIsOpenModal(false)
  }
  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <CreateEditDevice open={isOpenModal} deviceData={null} handleClose={handleCloseModal} />
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>{t('device.deviceListTitle')}(100)</h1>
        <h5 className='tw-text-sm'>{t('device.deviceListSubTitle')}</h5>
      </div>
      <div className='tw-flex tw-my-3 tw-justify-between '>
        <Button onClick={() => setIsOpenModal(true)} icon={<PlusOutlined />} type='primary'>
          {t('device.addDevice')}
        </Button>
        <Input.Search className='tw-w-64' placeholder='Tìm kiếm thiết bị' />
      </div>
      <div>
        <Table columns={columns} dataSource={data} scroll={{ y: 'calc(100vh - 390px)', x: 800 }} />
      </div>
    </div>
  )
}
export default DeviceList
