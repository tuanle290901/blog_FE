import { Button, Popconfirm, Table, TableColumnsType, TablePaginationConfig, Tabs, Tooltip } from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { FC, memo, useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ROLE } from '~/constants/app.constant'
import { fetchListTicket } from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IPaging } from '~/types/api-response.interface'
import { ILeaveRequest } from '~/types/leave-request'
import { hasPermission } from '~/utils/helper'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const Index: FC = memo(function Index() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const listData: ILeaveRequest[] = useAppSelector((state) => state.ticketProcess.tickets)
  const isLoading = useAppSelector((state) => state.leaveRequest.loading)
  const meta: IPaging = useAppSelector((state) => state.leaveRequest.meta)

  const goToTicketProcessMap = (data: ILeaveRequest | null, type: 'view' | 'create' | 'update') => {
    if (data && type === 'view') {
      navigate(`${data.id}`)
    } else {
      navigate('create')
    }
  }

  const columns = useMemo(() => {
    const columns: TableColumnsType<ILeaveRequest> = [
      {
        key: 'name',
        title: 'Tên quy trình',
        width: 120,
        dataIndex: 'name',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'description',
        title: 'Mô tả',
        width: 200,
        dataIndex: 'description',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'createdAt',
        title: 'Ngày tạo',
        width: 100,
        dataIndex: 'createdAt',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'createdBy',
        title: 'Người tạo',
        width: 100,
        dataIndex: 'createdBy',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        title: t('userList.action'),
        key: 'action',
        align: 'center',
        width: '120px',
        render: (_, record) => {
          return (
            <div className='tw-bottom-[12px] tw-w-full'>
              <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
                <>
                  <Tooltip title={'Xem quy trình'}>
                    <Button
                      onClick={() => goToTicketProcessMap(record, 'view')}
                      size='small'
                      icon={<EyeOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  <Tooltip title={'Cập nhật quy trình'}>
                    <Button
                      onClick={() => goToTicketProcessMap(record, 'update')}
                      size='small'
                      icon={<EditOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  <Tooltip title='Xóa quy trình'>
                    <Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => console.log}>
                      <Button size='small' icon={<DeleteOutlined className='tw-text-red-600' />} />
                    </Popconfirm>
                  </Tooltip>
                </>
              </div>
            </div>
          )
        }
      }
    ]
    return columns
  }, [])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ILeaveRequest> | any
  ) => {
    //TODO
  }

  useEffect(() => {
    dispatch(fetchListTicket())
  }, [])

  return (
    <div className='tw-m-2 md:tw-m-4 tw-p-4 tw-bg-white'>
      <div className='tw-mb-3'>
        <h1 className='tw-text-2xl tw-font-semibold'>Quy trình phê duyệt</h1>
        <h5 className='tw-text-sm'>Danh sách tất cả quy trình phê duyệt</h5>
      </div>
      <div className='tw-mt-3 tw-mb-3'>
        <Button onClick={() => goToTicketProcessMap(null, 'view')} type='primary'>
          Thêm mới quy trình
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={listData}
        scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
        onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
        loading={isLoading}
        pagination={{
          className: 'd-flex justify-content-end align-items-center',
          current: meta?.page + 1,
          total: meta?.total,
          defaultPageSize: meta?.size,
          pageSize: meta?.size,
          pageSizeOptions: ['10', '25', '50'],
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          locale: {
            items_per_page: `/ ${t('common.page')}`,
            next_page: t('common.nextPage'),
            prev_page: t('common.prevPage'),
            jump_to: t('common.jumpTo'),
            page: t('common.page')
          },
          position: ['bottomRight']
        }}
      />
    </div>
  )
})

export default Index
