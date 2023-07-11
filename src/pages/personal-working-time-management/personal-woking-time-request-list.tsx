import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IRequestWorkTime } from '~/types/personal-working-time.interface.ts'
import { Switch, Table } from 'antd'
import defaultImg from '~/assets/images/default-img.png'
import React from 'react'

const PersonalWokingTimeRequestList = () => {
  const [t] = useTranslation()
  const columns: ColumnsType<IRequestWorkTime> = [
    {
      title: 'Người yêu cầu',
      dataIndex: 'requester',
      key: 'requester',
      render: (text, record) => {
        return (
          <div className='tw-relative'>
            <img className='tw-w-8 tw-h-8 tw-absolute -tw-top-1 tw-left-0' alt='avatar' src={defaultImg} />
            <span className='tw-pl-10'>{text}</span>
          </div>
        )
      }
    },
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'requestTime',
      key: 'requestTime'
    },
    {
      title: 'Thời gian áp dụng',
      dataIndex: 'applyTime',
      key: 'applyTime'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'requester',
      key: 'requester'
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '150px'
    }
  ]
  const data: IRequestWorkTime[] = new Array(100).fill({
    requester: 'Trần Xuân Công',
    requestTime: '26/06/2023',
    applyTime: '26/06/2023 đến 26/07/2023',
    status: 'Đã duyệt'
  })
  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <div className='tw-my-4'>
        <Switch className='tw-mr-2' />
        <span>Hiển thị yêu cầu dã duyệt</span>
      </div>
      <Table columns={columns} dataSource={data} scroll={{ y: 'calc(100vh - 330px)', x: 800 }} />
    </div>
  )
}
export default PersonalWokingTimeRequestList
