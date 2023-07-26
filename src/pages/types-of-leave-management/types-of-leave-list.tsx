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
import TypesOfLeaveForm from '~/pages/types-of-leave-management/types-of-leave-form'
import {
  cancelEditing,
  deleteTypesOfLeave,
  filterTypesOfLeave,
  resetValueFilter,
  setValueFilter,
  startEditing
} from '~/stores/features/types-of-leave/types-of-leave.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IPaging, ISort } from '~/types/api-response.interface'
import { ITypesOfLeave } from '~/types/types-of-leave'
// import { convertUTCToLocaleDate } from '~/utils/helper'
import dayjs from 'dayjs'

const TypesOfLeave: React.FC = () => {
  const { t } = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const listData: ITypesOfLeave[] = useAppSelector((state: any) => state.typesOfLeave.listData)
  const timerId = useRef<any>(null)
  const meta: IPaging = useAppSelector((state: any) => state.typesOfLeave.meta)
  const editingTypesOfLeave = useAppSelector((state: any) => state.typesOfLeave.editingTypesOfLeave)
  const filter = useAppSelector((state: any) => state.typesOfLeave.filter)

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
      },
      {
        direction: 'DESC',
        field: 'name'
      }
    ]
  })

  const handleClickDelete = async (record: ITypesOfLeave) => {
    try {
      const response = await dispatch(deleteTypesOfLeave(record.id as string)).unwrap()
      await notification.success({
        message: response.message
      })
      dispatch(
        filterTypesOfLeave({
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

  const handleClickUpdate = (record: ITypesOfLeave) => {
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
    const columns: TableColumnsType<ITypesOfLeave> = [
      {
        key: 'name',
        title: t('typesOfLeave.name'),
        dataIndex: 'name',
        sorter: true,
        showSorterTooltip: false,
        sortOrder: getSortOrder('name'),
        ellipsis: true
      },
      {
        key: 'code',
        title: t('typesOfLeave.code'),
        dataIndex: 'code',
        ellipsis: true
      },
      {
        key: 'createdAt',
        title: t('typesOfLeave.createdAt'),
        dataIndex: 'createdAt',
        ellipsis: true,
        render: (createdAt) => {
          return dayjs(createdAt).format('DD/MM/YYYY')
        }
      },
      {
        key: '',
        title: t('device.action'),
        width: '120px',
        align: 'center',
        render: (_, record: ITypesOfLeave) => {
          return (
            <Space size='small'>
              <Button
                size='small'
                onClick={() => handleClickUpdate(record)}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
              <Popconfirm
                title={t('typesOfLeave.confirmDeleteTitle')}
                description={t('typesOfLeave.confirmDelete')}
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
        filterTypesOfLeave({
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
      filterTypesOfLeave({
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
    sorter: SorterResult<ITypesOfLeave> | any
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
      <TypesOfLeaveForm open={isOpenModal} data={editingTypesOfLeave} handleClose={handleCloseModal} />
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>{t('typesOfLeave.title')}</h1>
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
            {t('typesOfLeave.createNew')}
          </Button>
        </Col>
        <Col xs={24} lg={12} className=' tw-text-right'>
          <Input.Search
            className='tw-w-64'
            placeholder={t('typesOfLeave.search')}
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
export default TypesOfLeave
