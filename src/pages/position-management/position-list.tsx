import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Table, TablePaginationConfig } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { IUser } from '~/types/user.interface.ts'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { cancelEditingUser, startEditingUser } from '~/stores/features/user/user.slice.ts'
import dayjs from 'dayjs'
import { IPaging, ISort } from '~/types/api-response.interface.ts'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { IPosition } from '~/types/position.interface.ts'
import {
  cancelEditingPosition,
  searchPosition,
  startEditingPosition
} from '~/stores/features/position/position.slice.ts'
import CreateEditPosition from '~/pages/position-management/create-edit-position.tsx'

const { Search } = Input

const PositionList: React.FC = () => {
  const [t] = useTranslation()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false)
  const dispatch = useAppDispatch()
  const positionState = useAppSelector((state) => state.position)
  const [searchValue, setSearchValue] = useState<{
    query: string
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
  const timerId = useRef<any>(null)

  const handleClickEditPosition = (position: IPosition) => {
    //   TODO
    dispatch(startEditingPosition(position.id as string))
  }
  const handleClickDeletePosition = (user: IPosition) => {
    //   TODO
  }
  const getSortOrder = (filed: string) => {
    const sort = searchValue.sorts[0]
    if (sort && sort.field === filed) {
      return searchValue.sorts[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }
  const columns: ColumnsType<IPosition> = [
    {
      title: 'Tên chức vụ',
      dataIndex: 'nameTitle',
      key: 'nameTitle',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('nameTitle'),
      ellipsis: true
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'description',
      key: 'description',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('description'),
      ellipsis: true
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('createdAt'),
      ellipsis: true,
      width: '200px',
      align: 'center',
      render: (text, record) => {
        if (text) {
          const date = dayjs(text).format('DD/MM/YYYY')
          return date
        }
      }
    },

    {
      title: t('userList.action'),
      key: 'action',
      align: 'center',
      width: '200px',
      render: (_, record) => {
        return (
          <div className='tw-absolute tw-left-0 tw-w-full'>
            <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
              <Button
                size='small'
                onClick={() => handleClickEditPosition(record)}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
              <Button
                size='small'
                onClick={() => handleClickDeletePosition(record)}
                icon={<DeleteOutlined className='tw-text-red-600' />}
              />
            </div>
          </div>
        )
      }
    }
  ]
  const handleSearchValueChange = (value: string) => {
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      setSearchValue((prevState) => ({ ...prevState, query: value, paging: { ...prevState.paging, page: 0 } }))
    }, 300)
  }
  useEffect(() => {
    const promise = dispatch(
      searchPosition({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IUser> | any
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
  const handleCloseUserModal = (isCreateSuccess: boolean) => {
    setIsOpenUserModal(false)
    dispatch(cancelEditingPosition())
    if (isCreateSuccess) {
      setSearchValue((prevState) => {
        return {
          ...prevState,
          sorts: []
        }
      })
    }
  }

  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <CreateEditPosition
        open={isOpenUserModal || !!positionState.editingPosition}
        position={positionState.editingPosition}
        handleClose={handleCloseUserModal}
      />
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>Chức vụ({positionState.meta.total})</h1>
        <h5 className='tw-text-sm'>Danh sách chức vụ sử dụng trong hệ thống</h5>
      </div>
      <div className='tw-flex tw-justify-between tw-gap-4 tw-mt-4'>
        <Button onClick={() => setIsOpenUserModal(true)} type='primary' icon={<PlusOutlined />}>
          Thêm chức vụ
        </Button>
        <div className='tw-flex tw-gap-4'>
          <Search
            placeholder={'Tìm kiếm chức vụ'}
            onChange={(event) => handleSearchValueChange(event.target.value)}
            className='tw-w-64'
          />
        </div>
      </div>
      <div className='tw-mt-6'>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={positionState.positionList}
          loading={positionState.loading}
          pagination={{ total: positionState.meta.total }}
          scroll={{ y: 'calc(100vh - 390px)', x: 800 }}
          onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
        />
      </div>
    </div>
  )
}

export default PositionList