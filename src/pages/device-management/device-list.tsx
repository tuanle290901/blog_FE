/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  MinusCircleFilled,
  PlusOutlined,
  EyeOutlined,
  CheckOutlined
} from '@ant-design/icons'
import { Button, Input, notification, Popconfirm, Space, Table, TableColumnsType, TablePaginationConfig } from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreateEditDevice from '~/pages/device-management/create-edit-device.tsx'
import {
  activeDevice,
  cancelEditingDevice,
  deleteDevice,
  getListDevice,
  resetValueFilter,
  setValueFilter,
  startEditingDevice
} from '~/stores/features/device/device.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IPaging, ISort } from '~/types/api-response.interface'
import { IDevice } from '~/types/device.interface.ts'
import { DEVICE_STATUS } from '~/utils/Constant'
import { ACTION_TYPE } from '~/utils/helper'

const DeviceList: React.FC = () => {
  const { t } = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState<{
    openModel: boolean
    typeAction: string
  }>({
    openModel: false,
    typeAction: ''
  })
  const listData: IDevice[] = useAppSelector((state: any) => state.device.listData)
  const timerId = useRef<any>(null)
  const meta: IPaging = useAppSelector((state: any) => state.device.meta)
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

  const handleClickEditDevice = (record: IDevice, typeAction: string) => {
    setIsOpenModal({
      openModel: !isOpenModal.openModel,
      typeAction: typeAction
    })
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

  const handleClickDeleteUser = async (record: IDevice) => {
    if (record?.id) {
      try {
        const response = await dispatch(deleteDevice(record?.id)).unwrap()
        notification.success({
          message: response.message
        })
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
    }
  }

  const handleActiveDevice = async (record: IDevice) => {
    if (record?.id) {
      try {
        const response = await dispatch(activeDevice(record?.id)).unwrap()
        notification.success({
          message: response.message
        })
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
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
        key: 'groupName',
        title: t('device.groupName'),
        dataIndex: 'groupName',
        ellipsis: true
      },
      {
        key: 'status',
        title: t('device.status'),
        dataIndex: 'status',
        ellipsis: true,
        render: (_, record) => {
          return (
            <div className='tw-flex tw-justify-left tw-items-left'>
              {record?.status === DEVICE_STATUS.INITIAL ? (
                <div>
                  <InfoCircleOutlined className='tw-text-[#096DD9] tw-mr-1' />
                  {t(`device.${record?.status}`)}
                </div>
              ) : record?.status === DEVICE_STATUS.ACTIVE ? (
                <div>
                  <CheckCircleFilled className='tw-text-[#389E0D] tw-mr-1' /> {t(`device.${record?.status}`)}
                </div>
              ) : (
                <div>
                  <MinusCircleFilled className='tw-text-[#f33c3c] tw-mr-1' /> {t(`device.${record?.status}`)}
                </div>
              )}
              {/* <Switch
                checkedChildren={
                  <div>
                    <CheckOutlined className='tw-mr-1' />
                    Kích hoạt
                  </div>
                }
                unCheckedChildren='Hủy kích hoạt'
                defaultChecked={record?.status === DEVICE_STATUS.ACTIVE}
              /> */}
            </div>
          )
        }
      },
      {
        key: '',
        title: t('device.action'),
        width: '120px',
        align: 'center',
        render: (_, record: IDevice) => {
          if (record?.status !== DEVICE_STATUS.DEACTIVE) {
            return (
              <Space size='small'>
                <Button
                  size='small'
                  onClick={() => handleClickEditDevice(record, ACTION_TYPE.Updated)}
                  icon={<EditOutlined className='tw-text-blue-600' />}
                />
                <Popconfirm
                  title={t('device.confirmDeleteDeviceTitle')}
                  description={t('device.confirmDeleteDevice')}
                  onConfirm={() => handleClickDeleteUser(record)}
                  okText={t('common.yes')}
                  cancelText={t('common.no')}
                >
                  <Button size='small' icon={<DeleteOutlined className='tw-text-red-600' />} />
                </Popconfirm>
              </Space>
            )
          } else {
            return (
              <Space size='small'>
                <Button
                  size='small'
                  onClick={() => handleClickEditDevice(record, ACTION_TYPE.View)}
                  icon={<EyeOutlined className='tw-text-blue-600' />}
                />
                <Popconfirm
                  title={t('device.confirmActiveDeviceTitle')}
                  description={t('device.confirmActiveDevice')}
                  onConfirm={() => handleActiveDevice(record)}
                  okText={t('common.yes')}
                  cancelText={t('common.no')}
                >
                  <Button size='small' icon={<CheckOutlined className='tw-text-green-500' />} />
                </Popconfirm>
              </Space>
            )
          }
        }
      }
    ]
    return columns
  }, [handleClickDeleteUser, getSortOrder, handleClickEditDevice, t])

  const handleCloseModal = () => {
    setIsOpenModal({
      openModel: !isOpenModal.openModel,
      typeAction: ''
    })
    dispatch(cancelEditingDevice())
    if (filter && JSON.parse(filter) !== '') {
      setSearchValue({
        ...JSON.parse(filter)
      })
    } else {
      dispatch(
        getListDevice({
          paging: searchValue.paging,
          sorts: searchValue.sorts,
          query: searchValue.query,
          groupCode: searchValue.group
        })
      )
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
      <CreateEditDevice
        open={isOpenModal.openModel}
        deviceData={editingDevice}
        handleClose={handleCloseModal}
        typeAction={isOpenModal.typeAction}
      />
      <div>
        <h1 className='tw-text-2xl tw-font-semibold'>
          {t('device.deviceListTitle')}({meta.total})
        </h1>
        <h5 className='tw-text-sm'>{t('device.deviceListSubTitle')}</h5>
      </div>
      <div className='tw-flex tw-my-3 tw-justify-between '>
        <Button
          onClick={() => {
            setIsOpenModal({
              typeAction: ACTION_TYPE.Created,
              openModel: !isOpenModal.openModel
            })
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
export default DeviceList
