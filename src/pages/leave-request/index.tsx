/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined
} from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Tag,
  Tooltip,
  notification
} from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LeaveRequestForm from '~/pages/leave-request/leave-request-form'
import {
  TicketRequestPayload,
  cancelEditing,
  deleteLeaveRequest,
  filterLeaveRequest,
  getAllDefinationType,
  resetLeaveRequest,
  resetValueFilter,
  setValueFilter,
  startEditing,
  updateLeaveRequest
} from '~/stores/features/leave-request/leave-request.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { IPaging, ISort } from '~/types/api-response.interface'
import { ILeaveRequest, ILeaveRequestUpdateStatusForm } from '~/types/leave-request'
// import { convertUTCToLocaleDate } from '~/utils/helper'
import dayjs from 'dayjs'
import { ROLE } from '~/constants/app.constant'
import { searchUser } from '~/stores/features/user/user.slice'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { TicketStatusType } from '~/types/leave-request.interface'
import { TICKET_STATUS, TicketStatusEnum } from '~/utils/Constant'
import { tagColorMapping } from '~/utils/helper'

const { confirm } = Modal
const { RangePicker } = DatePicker
const initialPayload: TicketRequestPayload = {
  startDate: '',
  endDate: '',
  page: 0,
  size: 10,
  sort: [
    {
      field: 'createdAt',
      direction: 'DESC'
    }
  ],
  requestedBy: [],
  statuses: [],
  ticketDef: [],
  onlyAssignToMe: false
}
const filterUserPayload = {
  query: '',
  paging: {
    page: 0,
    size: 10000,
    total: 0,
    totalPage: 0
  },
  sorts: [],
  groupCode: null
}

const LeaveRequest: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { userInfo } = useUserInfo()

  const ticketDifinations = useAppSelector((item) => item.leaveRequest.ticketDefinationType)
  const listData: ILeaveRequest[] = useAppSelector((state: any) => state.leaveRequest.listData)
  const users = useAppSelector((item) => item.user.userList)
  const editingLeaveRequest = useAppSelector((state: any) => state.leaveRequest.editingLeaveRequest)
  const isLoading = useAppSelector((state: any) => state.leaveRequest.loading)

  const [searchValue, setSearchValue] = useState<TicketRequestPayload>(initialPayload)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [canUpdateForm, setCanUpdateForm] = useState<boolean>(true)
  const isSystemAdmin = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)
  const isManagerDepartment = userInfo?.groupProfiles.find(
    (gr) => gr.role === ROLE.MANAGER || gr.role === ROLE.SUB_MANAGER
  )

  const meta: IPaging = useAppSelector((state: any) => state.leaveRequest.meta)

  const handleClickDelete = async (record: ILeaveRequest) => {
    try {
      const response = await dispatch(deleteLeaveRequest(record.id as string)).unwrap()
      await dispatch(filterLeaveRequest(searchValue))
      notification.success({
        message: response.message
      })
    } catch (error: any) {
      notification.error({
        message: error.message
      })
    }
  }

  const handleClickReset = async (record: ILeaveRequest) => {
    try {
      const response = await dispatch(resetLeaveRequest(record.id)).unwrap()
      await dispatch(filterLeaveRequest(searchValue))
      notification.success({
        message: response.message
      })
    } catch (error: any) {
      notification.error({
        message: error.message
      })
    }
  }

  const handleClickUpdate = (type: string, record: ILeaveRequest) => {
    if (type === 'view') {
      setCanUpdateForm(false)
    } else {
      setCanUpdateForm(true)
    }
    setIsOpenModal(true)
    dispatch(startEditing(record.id))
  }

  const getSortOrder = (filed: string) => {
    const sort = searchValue.sort[0]
    if (sort && sort.field === filed) {
      return searchValue.sort[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }

  const handleCloseModal = async () => {
    setIsOpenModal(false)
    dispatch(cancelEditing())
    dispatch(resetValueFilter())
    dispatch(filterLeaveRequest(searchValue))
  }

  const onChangeRequest = (type: string, requestItem: string | any) => {
    const updateSearchValue = (updateFn: (prev: any) => any) => {
      setSearchValue((prev) => ({
        ...prev,
        ...updateFn(prev)
      }))
    }

    switch (type) {
      case 'onlyAssignToMe':
        updateSearchValue((prev) => ({ onlyAssignToMe: requestItem.target.checked }))
        break

      case 'requestBy':
        updateSearchValue((prev) => ({ requestedBy: requestItem }))
        break

      case 'requestTime':
        updateSearchValue((prev) => ({
          startDate: requestItem ? dayjs.utc(requestItem[0]).format() : '',
          endDate: requestItem ? dayjs.utc(requestItem[1]).format() : ''
        }))
        break

      case 'requestStatus':
        updateSearchValue((prev) => ({ statuses: requestItem }))
        break
    }
  }

  const showConfirm = (status: TicketStatusEnum.FINISHED | TicketStatusEnum.REJECTED, data: ILeaveRequest) => {
    confirm({
      title: status === TicketStatusEnum.FINISHED ? 'Đồng ý' : 'Từ chối',
      icon: <ExclamationCircleFilled />,
      content: status === TicketStatusEnum.FINISHED ? 'Bạn có muốn duyệt yêu cầu?' : 'Bạn có muốn từ chối yêu cầu?',
      onOk() {
        onUpdateStatus(status, data)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const onUpdateStatus = async (status: TicketStatusEnum.FINISHED | TicketStatusEnum.REJECTED, data: ILeaveRequest) => {
    const payload: ILeaveRequestUpdateStatusForm = {
      attrs: data?.processStatus['0']?.attributes,
      nodeId: 1,
      status,
      ticketId: data.id
    }
    await dispatch(updateLeaveRequest(payload))
    await dispatch(filterLeaveRequest(searchValue))
  }

  const columns = useMemo(() => {
    const columns: TableColumnsType<ILeaveRequest> = [
      {
        key: 'ticketDefinitionId',
        title: 'Yêu cầu',
        dataIndex: 'ticketDefinitionId',
        sorter: false,
        showSorterTooltip: false,
        sortOrder: getSortOrder('ticketDefinitionId'),
        ellipsis: true,
        render: (item) => {
          return ticketDifinations.find((ticket) => ticket.id === item)?.name
        }
      },
      {
        key: 'processStatus',
        title: t('leaveRequest.startDate'),
        sorter: false,
        dataIndex: 'processStatus',
        ellipsis: true,
        render: (item) => {
          const startDate = item['0']?.attributes?.start_time
          return dayjs(startDate).format('DD/MM/YYYY HH:mm:ss')
        }
      },
      {
        key: 'processStatus',
        title: t('leaveRequest.endDate'),
        dataIndex: 'processStatus',
        ellipsis: false,
        sorter: false,
        render: (item) => {
          const endDate = item['0']?.attributes?.end_time
          return dayjs(endDate).format('DD/MM/YYYY HH:mm:ss')
        }
      },
      {
        key: 'processStatus',
        title: t('leaveRequest.requestMessage'),
        dataIndex: 'processStatus',
        showSorterTooltip: false,
        ellipsis: true,
        render: (item) => {
          const reason = item['0']?.attributes?.reason || item['0']?.attributes?.description
          return reason
        }
      },
      {
        key: 'createdAt',
        title: t('leaveRequest.requestDate'),
        dataIndex: 'createdAt',
        sorter: true,
        ellipsis: true,
        render: (requestDate) => {
          return dayjs(requestDate).format('DD/MM/YYYY HH:mm:ss')
        }
      },
      {
        key: 'createdBy',
        title: 'Người yêu cầu',
        dataIndex: 'createdBy',
        showSorterTooltip: false,
        ellipsis: true,
        sorter: true
      },
      {
        key: '',
        title: t('leaveRequest.status'),
        dataIndex: 'status',
        showSorterTooltip: false,
        ellipsis: true,
        render: (_, record: ILeaveRequest) => {
          const status: keyof TicketStatusType = record.status
          return (
            <div>
              {isSystemAdmin ? (
                <Space>
                  {status !== TicketStatusEnum.CONFIRMED &&
                    status !== TicketStatusEnum.REJECTED &&
                    status !== TicketStatusEnum.CANCELLED && (
                      <>
                        <Tooltip title='Từ chối'>
                          <CloseCircleOutlined
                            className='tw-text-red-600 tw-text-2xl tw-cursor-pointer'
                            onClick={() => showConfirm(TicketStatusEnum.REJECTED, record)}
                          />
                        </Tooltip>
                        <Tooltip title='Đồng ý'>
                          <CheckCircleOutlined
                            className='tw-text-green-600 tw-text-2xl tw-cursor-pointer'
                            onClick={() => showConfirm(TicketStatusEnum.FINISHED, record)}
                          />
                        </Tooltip>
                      </>
                    )}
                  {(status === TicketStatusEnum.CONFIRMED ||
                    status === TicketStatusEnum.REJECTED ||
                    status === TicketStatusEnum.CANCELLED) && (
                    <Tag color={tagColorMapping(status)}>{TICKET_STATUS[status]}</Tag>
                  )}
                </Space>
              ) : (
                <Tag color={tagColorMapping(status)}>{TICKET_STATUS[status]}</Tag>
              )}
            </div>
          )
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
              {record?.status !== TicketStatusEnum.CONFIRMED && record?.status !== TicketStatusEnum.REJECTED && (
                <Button
                  size='small'
                  onClick={() => handleClickUpdate('view', record)}
                  icon={<InfoCircleOutlined className='tw-text-blue-600' />}
                />
              )}

              {record?.status !== TicketStatusEnum.CONFIRMED && record?.status !== TicketStatusEnum.REJECTED && (
                <Button
                  size='small'
                  onClick={() => handleClickUpdate('update', record)}
                  icon={<EditOutlined className='tw-text-blue-600' />}
                  disabled={record.createdBy !== userInfo?.userName}
                />
              )}

              {record?.status !== TicketStatusEnum.CONFIRMED && record?.status !== TicketStatusEnum.REJECTED && (
                <Popconfirm
                  title='Hủy yêu cầu'
                  description='Bạn có chắc chắn muốn hủy yêu cầu'
                  onConfirm={() => handleClickDelete(record)}
                  okText={t('common.yes')}
                  cancelText={t('common.no')}
                  disabled={record.createdBy !== userInfo?.userName}
                >
                  <Button
                    size='small'
                    icon={<DeleteOutlined className='tw-text-red-600' />}
                    disabled={record.createdBy !== userInfo?.userName}
                  />
                </Popconfirm>
              )}

              {isSystemAdmin &&
                (record?.status === TicketStatusEnum.CONFIRMED || record?.status === TicketStatusEnum.REJECTED) && (
                  <Popconfirm
                    title='Đặt lại yêu cầu'
                    description='Bạn có chắc chắn muốn đặt lại yêu cầu không?'
                    onConfirm={() => handleClickReset(record)}
                    okText={t('common.yes')}
                    cancelText={t('common.no')}
                  >
                    <Button size='small' icon={<ReloadOutlined className='tw-text-red-600' />} />
                  </Popconfirm>
                )}
            </Space>
          )
        }
      }
    ]
    return columns
  }, [handleClickDelete, getSortOrder, handleClickUpdate, t])

  useEffect(() => {
    dispatch(getAllDefinationType())
    if (isSystemAdmin || isManagerDepartment) {
      dispatch(searchUser(filterUserPayload))
    }
  }, [])

  useEffect(() => {
    const promise = dispatch(filterLeaveRequest(searchValue))
    return () => {
      promise.abort()
    }
  }, [searchValue, dispatch])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ILeaveRequest> | any
  ) => {
    const sorts: ISort[] = []
    if (sorter.order) {
      sorts.push({ field: sorter.field as string, direction: sorter.order === 'ascend' ? 'ASC' : 'DESC' })
    } else {
      sorts.push({
        direction: 'DESC',
        field: 'createdAt'
      })
    }

    setSearchValue((prev) => {
      return {
        ...prev,
        page: (pagination.current as number) - 1,
        size: pagination.pageSize as number,
        sort: sorts
      }
    })
  }

  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <LeaveRequestForm
        open={isOpenModal}
        data={editingLeaveRequest}
        handleClose={handleCloseModal}
        canUpdateForm={canUpdateForm}
      />
      <div className='tw-flex'>
        <h1 className='tw-text-2xl tw-font-semibold'>{t('leaveRequest.title')}</h1>
      </div>
      <div className='tw-flex tw-justify-between tw-my-5'>
        <Button
          onClick={() => {
            setCanUpdateForm(true)
            setIsOpenModal(true)
            dispatch(setValueFilter(JSON.stringify(searchValue)))
          }}
          icon={<PlusOutlined />}
          type='primary'
        >
          {t('leaveRequest.createNew')}
        </Button>
        <Space>
          {/* {isSystemAdmin && (
            <Checkbox onChange={(val) => onChangeRequest('onlyAssignToMe', val)}>Các yêu cầu cần tôi xử lý</Checkbox>
          )} */}

          {(isSystemAdmin || isManagerDepartment) && (
            <Select
              onChange={(val) => onChangeRequest('requestBy', val)}
              mode='multiple'
              placeholder='Người yêu cầu'
              style={{ minWidth: 200 }}
              options={users.map((user) => {
                return {
                  label: user?.fullName || user?.userName,
                  value: user?.userName
                }
              })}
            />
          )}

          <RangePicker format={'DD/MM/YYYY'} onChange={(val) => onChangeRequest('requestTime', val)} />

          <Select
            onChange={(val) => onChangeRequest('requestStatus', val)}
            mode='multiple'
            placeholder='Trạng thái yêu cầu'
            style={{ minWidth: 200 }}
            options={Object.entries(TICKET_STATUS).map((item) => {
              return {
                label: item[1],
                value: item[0]
              }
            })}
          />
        </Space>
      </div>

      <div>
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
    </div>
  )
}
export default LeaveRequest
