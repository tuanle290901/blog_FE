/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Space, Table, TableColumnsType, TablePaginationConfig } from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreateEditDevice from '~/pages/device-management/create-edit-device.tsx'
import {
  cancelEditingDevice,
  getListDevice,
  resetValueFilter,
  setValueFilter,
  startEditingDevice
} from '~/stores/features/device/device.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IPaging, ISort } from '~/types/api-response.interface'
import { IDevice } from '~/types/device.interface.ts'

const DeviceList: React.FC = () => {
  const [t] = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const listData: IDevice[] = useAppSelector((state: any) => state.device.listData)
  const timerId = useRef<any>(null)
  const meta: IPaging = useAppSelector((state: any) => state.device.meta)
  const handleClickDeleteUser = (record: IDevice) => {
    console.log(record)
  }

  const editingDevice = useAppSelector((state: any) => state.device.editingDevice)
  const filter = useAppSelector((state: any) => state.device.filter)

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

  const handleClickEditDevice = (record: IDevice) => {
    setIsOpenModal(true)
    dispatch(startEditingDevice(record.id as string))
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
    const columns: TableColumnsType<IDevice> = [
      {
        key: 'name',
        title: t('device.name'),
        dataIndex: 'name',
        sortOrder: getSortOrder('name'),
        ellipsis: true
      },
      {
        key: 'ipAddress',
        title: t('device.ipAddress'),
        dataIndex: 'ipAddress',
        ellipsis: true
      },
      {
        key: 'port',
        title: t('device.port'),
        dataIndex: 'port',
        ellipsis: true
      },
      {
        key: '',
        title: t('device.action'),
        width: '120px',
        align: 'center',
        render: (_, record: IDevice) => {
          return (
            <Space size='small'>
              <Button
                size='small'
                onClick={() => handleClickEditDevice(record)}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
              <Button
                size='small'
                onClick={() => handleClickDeleteUser(record)}
                icon={<DeleteOutlined className='tw-text-red-600' />}
              />
            </Space>
          )
        }
      }
    ]
    return columns
  }, [handleClickDeleteUser, getSortOrder, handleClickEditDevice, t])

  const handleCloseModal = () => {
    setIsOpenModal(false)
    dispatch(cancelEditingDevice())
    if (filter && JSON.parse(filter) !== '') {
      setSearchValue({
        ...JSON.parse(filter)
      })
    }
    dispatch(resetValueFilter())
  }

  useEffect(() => {
    const promise = dispatch(
      getListDevice({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query,
        groupCode: searchValue.group
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue, dispatch])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IDevice> | any
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
      <CreateEditDevice open={isOpenModal} deviceData={editingDevice} handleClose={handleCloseModal} />
      <div>
        <h1 className='tw-text-3xl tw-font-semibold'>
          {t('device.deviceListTitle')}({meta.total})
        </h1>
        <h5 className='tw-text-sm'>{t('device.deviceListSubTitle')}</h5>
      </div>
      <div className='tw-flex tw-my-3 tw-justify-between '>
        <Button
          onClick={() => {
            setIsOpenModal(true)
            dispatch(setValueFilter(JSON.stringify(searchValue)))
          }}
          icon={<PlusOutlined />}
          type='primary'
        >
          {t('device.addDevice')}
        </Button>
        <Input.Search
          className='tw-w-64'
          placeholder='Tìm kiếm thiết bị'
          onChange={(event) => handleSearchValueChange(event.target.value)}
        />
      </div>
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
              items_per_page: `/ ${t('pagination.page')}`,
              next_page: t('pagination.nextPage'),
              prev_page: t('pagination.prevPage'),
              jump_to: t('pagination.jumpTo'),
              page: t('pagination.page')
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
export default DeviceList
