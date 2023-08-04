/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  notification
} from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LeaveRequestForm from '~/pages/leave-request/leave-request-form'
import {
  cancelEditing,
  deleteLeaveRequest,
  filterLeaveRequest,
  resetValueFilter,
  setValueFilter,
  startEditing
} from '~/stores/features/leave-request/leave-request.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IPaging, ISort } from '~/types/api-response.interface'
import { ILeaveRequest } from '~/types/leave-request'
// import { convertUTCToLocaleDate } from '~/utils/helper'
import dayjs from 'dayjs'

const LeaveRequest: React.FC = () => {
  const { t } = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  // const listData: ILeaveRequest[] = useAppSelector((state: any) => state.leaveRequest.listData)
  const listData: ILeaveRequest[] = [
    {
      id: '64bf80014da3c80a38g4374f',
      typeOfLeave: 'Nghỉ ốm',
      startDate: '2023-08-01',
      endDate: '2023-08-01',
      requestMessage: '',
      AmountTimeLeave: 1,
      requestDate: '2023-08-01',
      status: 'processing'
    },
    {
      id: '64bf80014da3c80a38as374f',
      typeOfLeave: 'Nghỉ cưới',
      startDate: '2023-08-04',
      endDate: '2023-08-05',
      requestMessage: '',
      AmountTimeLeave: 2,
      requestDate: '2023-08-02',
      status: 'approve'
    }
  ]
  const timerId = useRef<any>(null)
  // const meta: IPaging = useAppSelector((state: any) => state.leaveRequest.meta)
  const meta: IPaging = {
    page: 0,
    size: 10,
    total: 12,
    totalPage: 2
  }
  const editingLeaveRequest = useAppSelector((state: any) => state.leaveRequest.editingLeaveRequest)
  const filter = useAppSelector((state: any) => state.leaveRequest.filter)

  const dispatch = useAppDispatch()
  const [searchValue, setSearchValue] = useState<{
    query: string | ''
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

  const handleClickDelete = async (record: ILeaveRequest) => {
    try {
      const response = await dispatch(deleteLeaveRequest(record.id as string)).unwrap()
      await notification.success({
        message: response.message
      })
      dispatch(
        filterLeaveRequest({
          paging: searchValue.paging,
          sorts: searchValue.sorts,
          query: searchValue.query
        })
      )
    } catch (error: any) {
      notification.error({
        message: error.message
      })
    }
  }

  const handleClickUpdate = (record: ILeaveRequest) => {
    setIsOpenModal(true)
    dispatch(startEditing(record.id as string))
  }

  const getSortOrder = (filed: string) => {
    const sort = searchValue.sorts[0]
    if (sort && sort.field === filed) {
      return searchValue.sorts[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }

  const columns = useMemo(() => {
    const columns: TableColumnsType<ILeaveRequest> = [
      {
        key: 'typeOfLeave',
        title: t('leaveRequest.typeOfLeave'),
        dataIndex: 'typeOfLeave',
        sorter: true,
        showSorterTooltip: false,
        sortOrder: getSortOrder('typeOfLeave'),
        ellipsis: true
      },
      {
        key: 'startDate',
        title: t('leaveRequest.startDate'),
        dataIndex: 'startDate',
        ellipsis: true,
        render: (startDate) => {
          return dayjs(startDate).format('DD/MM/YYYY')
        }
      },
      {
        key: 'endDate',
        title: t('leaveRequest.endDate'),
        dataIndex: 'endDate',
        ellipsis: true,
        render: (endDate) => {
          return dayjs(endDate).format('DD/MM/YYYY')
        }
      },
      {
        key: 'requestMessage',
        title: t('leaveRequest.requestMessage'),
        dataIndex: 'requestMessage',
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'AmountTimeLeave',
        title: t('leaveRequest.AmountTimeLeave'),
        dataIndex: 'AmountTimeLeave',
        showSorterTooltip: false,
        ellipsis: true
      },
      {
        key: 'requestDate',
        title: t('leaveRequest.requestDate'),
        dataIndex: 'requestDate',
        ellipsis: true,
        render: (requestDate) => {
          return dayjs(requestDate).format('DD/MM/YYYY')
        }
      },
      {
        key: 'status',
        title: t('leaveRequest.status'),
        dataIndex: 'status',
        showSorterTooltip: false,
        ellipsis: true,
        render: (status) => {
          return <div className={status === 'processing' ? 'tw-text-red-500' : 'tw-text-green-500'}>{status}</div>
        }
      },
      {
        key: '',
        title: t('device.action'),
        width: '120px',
        align: 'center',
        render: (_, record: ILeaveRequest) => {
          return (
            <Space size='small'>
              <Button
                size='small'
                onClick={() => handleClickUpdate(record)}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
              <Popconfirm
                title={t('leaveRequest.confirmDeleteTitle')}
                description={t('leaveRequest.confirmDelete')}
                onConfirm={() => handleClickDelete(record)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button size='small' icon={<DeleteOutlined className='tw-text-red-600' />} />
              </Popconfirm>
            </Space>
          )
        }
      }
    ]
    return columns
  }, [handleClickDelete, getSortOrder, handleClickUpdate, t])

  const handleCloseModal = () => {
    setIsOpenModal(false)
    dispatch(cancelEditing())
    if (filter && JSON.parse(filter) !== '') {
      setSearchValue({
        ...JSON.parse(filter)
      })
    } else {
      dispatch(
        filterLeaveRequest({
          paging: searchValue.paging,
          sorts: searchValue.sorts,
          query: searchValue.query
        })
      )
    }
    dispatch(resetValueFilter())
  }

  useEffect(() => {
    const promise = dispatch(
      filterLeaveRequest({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue, dispatch])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ILeaveRequest> | any
  ) => {
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

  const handleSearchValueChange = (value: string) => {
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      setSearchValue((prevState) => ({ ...prevState, query: value, paging: { ...prevState.paging, page: 0 } }))
    }, 500)
  }

  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <LeaveRequestForm open={isOpenModal} data={editingLeaveRequest} handleClose={handleCloseModal} />
      <div>
        <h1 className='tw-text-2xl tw-font-semibold'>{t('leaveRequest.title')}</h1>
      </div>
      <Row gutter={[16, 16]} className='tw-flex tw-my-5 tw-justify-between'>
        <Col xs={24} lg={12}>
          <Button
            onClick={() => {
              setIsOpenModal(true)
              dispatch(setValueFilter(JSON.stringify(searchValue)))
            }}
            icon={<PlusOutlined />}
            type='default'
          >
            {t('leaveRequest.createNew')}
          </Button>
        </Col>
        <Col xs={24} lg={12} className=' tw-text-right'>
          <Input.Search
            className='tw-w-64'
            placeholder={t('leaveRequest.search')}
            onChange={(event) => handleSearchValueChange(event.target.value)}
          />
        </Col>
      </Row>
      <div>
        <Table
          columns={columns}
          dataSource={listData}
          scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
          onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
          pagination={{
            className: 'd-flex justify-content-end align-items-center',
            current: meta && meta.page + 1,
            total: meta?.total,
            defaultPageSize: meta?.size,
            pageSize: meta?.size,
            pageSizeOptions: ['10', '25', '50'],
            showSizeChanger: true,
            showQuickJumper: true,
            locale: {
              items_per_page: `/ ${t('common.page')}`,
              next_page: t('common.nextPage'),
              prev_page: t('common.prevPage'),
              jump_to: t('common.jumpTo'),
              page: t('common.page')
            },

            position: ['bottomRight']
            // onChange: (page: number, pageSize: number) => {
            //   if (handlePropsChange) {
            //     handlePropsChange(page, pageSize)
            //   }
            // }
          }}
        />
      </div>
    </div>
  )
}
export default LeaveRequest
