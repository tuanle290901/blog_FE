import { CopyOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Table, TableColumnsType, Tooltip } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteRevision } from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { SearchPayload, TicketProcessRevision } from '~/types/setting-ticket-process'

const TabItems = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const ticketSelected = useAppSelector((state) => state.ticketProcess.ticketSelected)
  const listRevByTicketType = useAppSelector((state) => state.ticketProcess.listRevisionsByTicketType)
  const isLoading = useAppSelector((state) => state.ticketProcess.loading)

  const goToTicketProcessMap = (type: 'view' | 'create' | 'update') => {
    if (type === 'view') {
      navigate(`create-revison/${ticketSelected?.id}`)
    } else {
      navigate(`create-revison/${ticketSelected?.id}`)
    }
  }

  const deleteRev = (record: any) => {
    if (record && record.rev) {
      const payload: SearchPayload = Object.create(null)
      payload.rev = record.rev
      payload.ticketType = record.ticketType
      dispatch(deleteRevision(payload))
    }
  }

  const columns = useMemo(() => {
    const columns: TableColumnsType<TicketProcessRevision> = [
      {
        key: 'rev',
        title: 'Phiên bản',
        width: 80,
        dataIndex: 'rev',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'applyFromDate',
        title: 'Ngày áp dụng',
        width: 120,
        dataIndex: 'applyFromDate',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'applyToDate',
        title: 'Ngày kết thúc',
        width: 120,
        dataIndex: 'applyToDate',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'status',
        title: 'Trạng thái',
        width: 100,
        dataIndex: 'status',
        sorter: false,
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        title: 'Hành động',
        key: 'action',
        align: 'center',
        width: '120px',
        render: (_, record) => {
          return (
            <div className='tw-bottom-[12px] tw-w-full'>
              <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
                <>
                  <Tooltip title='Xem phiên bản này'>
                    <Button
                      onClick={() => goToTicketProcessMap('view')}
                      size='small'
                      icon={<EyeOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  <Tooltip title='Sao chép từ phiên bản này'>
                    <Button size='small' icon={<CopyOutlined className='tw-text-blue-600' />} />
                  </Tooltip>
                  <Tooltip title='Xóa phiên bản'>
                    <Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => deleteRev(record)}>
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

  return (
    <div>
      <div className='tw-mb-2 tw-flex tw-items-center'>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => goToTicketProcessMap('view')}>
          Tạo phiên bản mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={listRevByTicketType}
        scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
        loading={isLoading}
      />
    </div>
  )
}

export default TabItems
