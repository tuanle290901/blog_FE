import React from 'react'
import { Table, TableColumnsType } from 'antd'
import { IUserHistory, IUserHistoryDetail } from '~/types/user-history.interface.ts'

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' }
]
const userHistory: React.FC = () => {
  const expandedRowRender = (record: IUserHistory) => {
    const columns: TableColumnsType<IUserHistoryDetail> = [
      { key: 'fieldName', title: 'Field Name', dataIndex: 'fieldName' },
      {
        key: 'oldValue',
        title: 'Olf Value',
        dataIndex: 'oldValue',
        render: (text) => <span className='tw-text-red-600'>{text}</span>
      },
      {
        key: 'newValue',
        title: 'New Value',
        dataIndex: 'newValue',
        render: (text) => <span className='tw-text-blue-600'>{text}</span>
      }
    ]
    return <Table columns={columns} size='small' rowKey='key' bordered dataSource={record.details} pagination={false} />
  }

  const columns: TableColumnsType<IUserHistory> = [
    { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt' },
    { key: 'updatedBy', title: 'Updated By', dataIndex: 'updatedBy' },
    { key: 'message', title: 'Information', dataIndex: 'message' }
  ]

  const data: IUserHistory[] = new Array(100).fill(0).map((item, index) => {
    return {
      id: index,
      updatedAt: '2023/11/14',
      updatedBy: 'sangTx',
      message: 'Change role',
      details: [
        { key: '1', fieldName: 'Name', oldValue: 'Trần Xuân Sang', newValue: 'Lí Mặc Sầu' },
        { key: '2', fieldName: 'department', oldValue: 'HTSC', newValue: 'Binance' },
        { key: '3', fieldName: 'role', oldValue: 'Employee', newValue: 'CTO' }
      ]
    }
  })
  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <h1 className='tw-text-3xl tw-font-semibold tw-mb-6'>User history</h1>
      <div className='tw-mt-14'>
        <Table
          rowKey='id'
          scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
          columns={columns}
          expandable={{ expandedRowRender }}
          dataSource={data}
        />
      </div>
    </div>
  )
}
export default userHistory
