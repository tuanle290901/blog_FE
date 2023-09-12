/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Tag,
  Tooltip,
  notification
} from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ROLE } from '~/constants/app.constant'
import LeaveRequestForm from '~/pages/leave-request/leave-request-form'
import { getListDepartments } from '~/stores/features/department/department.silce'
import {
  TicketRequestPayload,
  cancelEditing,
  countLeaveRequest,
  deleteLeaveRequest,
  filterLeaveRequest,
  getAllDefinationType,
  getTicketDetail,
  resetLeaveRequest,
  resetValueFilter,
  onUpdateRequestStatus,
  setValueFilter,
  startEditing
} from '~/stores/features/leave-request/leave-request.slice'
import { searchUser } from '~/stores/features/user/user.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { IPaging, ISort } from '~/types/api-response.interface'
import { ILeaveRequest } from '~/types/leave-request'
import { LEAVE_TYPE_MAP, TICKET_STATUS, TICKET_STATUS_FILTER, TicketStatusEnum } from '~/utils/Constant'
import { mappingDepartmentByCode, tagColorMapping } from '~/utils/helper'
import ModalApprove from './ModalApprove'
import './style.scss'
const { RangePicker } = DatePicker
const initialPayload: TicketRequestPayload = {
  startDate: dayjs.utc().startOf('month').format(),
  endDate: dayjs.utc().endOf('day').format(),
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
  const [queryParameters] = useSearchParams()

  const ticketDifinations = useAppSelector((item) => item.leaveRequest.ticketDefinationType)
  const listData: ILeaveRequest[] = useAppSelector((state) => state.leaveRequest.listData)
  const users = useAppSelector((item) => item.user.userList)
  const departments = useAppSelector((item) => item.department.listData)
  const editingLeaveRequest = useAppSelector((state) => state.leaveRequest.editingLeaveRequest)
  const countLeaveRequestSate = useAppSelector((state) => state.leaveRequest.countLeaveRequest)
  const isLoading = useAppSelector((state) => state.leaveRequest.loading)

  const [dateFilter, setDateFilter] = useState<Dayjs>(dayjs().startOf('month'))
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isApprovedSuccess, setIsApprovedSuccess] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<TicketRequestPayload>(initialPayload)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [canUpdateForm, setCanUpdateForm] = useState<boolean>(true)
  const [isOpenModalApprove, setIsOpenModalApprove] = useState<boolean>(false)
  const [selectedTicket, setSelectedTicket] = useState<ILeaveRequest>()
  const isSystemAdmin = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)
  const isManagerDepartment = userInfo?.groupProfiles.find(
    (gr) => gr.role === ROLE.MANAGER || gr.role === ROLE.SUB_MANAGER
  )
  const isisUpdateRequestStatusSuccess = useAppSelector((item: any) => item.leaveRequest.isUpdateRequestStatusSuccess)

  const meta: IPaging = useAppSelector((state) => state.leaveRequest.meta)

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
      dispatch(onUpdateRequestStatus(false))
      const response = await dispatch(resetLeaveRequest(record.id)).unwrap()
      await dispatch(filterLeaveRequest(searchValue))
      notification.success({
        message: response.message
      })
      dispatch(onUpdateRequestStatus(true))
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

  const handleModalAprroveOk = () => {
    setIsOpenModalApprove(false)
  }

  const handleModalAprroveCancel = () => {
    setIsOpenModalApprove(false)
  }

  const onOpenModalApprove = (record: ILeaveRequest) => {
    setSelectedTicket(record)
    setIsOpenModalApprove(true)
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
        updateSearchValue(() => ({ onlyAssignToMe: requestItem.target.checked }))
        break

      case 'requestBy':
        updateSearchValue(() => ({ requestedBy: requestItem }))
        break

      case 'requestTime':
        setDateFilter(requestItem)
        updateSearchValue(() => ({
          startDate: requestItem
            ? dayjs
                .utc(dayjs().month(dayjs(requestItem).month()))
                .startOf('month')
                .format()
            : '',
          endDate: requestItem
            ? dayjs
                .utc(dayjs().month(dayjs(requestItem).month()))
                .endOf('month')
                .format()
            : ''
        }))
        break

      case 'requestStatus':
        setStatusFilter(requestItem)
        updateSearchValue(() => ({ statuses: requestItem }))
        break
    }
  }

  const setApproveStatus = (isApprove: boolean) => {
    setIsApprovedSuccess(isApprove)
  }

  useEffect(() => {
    if (isApprovedSuccess) {
      setIsOpenModalApprove(false)
      dispatch(filterLeaveRequest(searchValue))
    }
  }, [isApprovedSuccess])

  useEffect(() => {
    if (queryParameters.get('code')) {
      const getDetail = async () => {
        const ticketSelected = await getTicketDetail(queryParameters.get('code') ?? '')
        if (ticketSelected) {
          setSelectedTicket(ticketSelected)
          setIsOpenModalApprove(true)
        }
      }
      getDetail()
    }
  }, [queryParameters])

  useEffect(() => {
    if (isisUpdateRequestStatusSuccess) {
      dispatch(countLeaveRequest(dateFilter))
    }
  }, [isisUpdateRequestStatusSuccess])

  const handleGetAbsenceTypeName = (record: any) => {
    if (record?.processStatus?.[0]?.attributes?.type) {
      return LEAVE_TYPE_MAP[record?.processStatus?.[0]?.attributes?.type]
    } else {
      const result = ticketDifinations.find((ticket) => ticket.id === record?.ticketDefinitionId)
      return result?.name
    }
  }

  const columns = useMemo(() => {
    const columns: TableColumnsType<ILeaveRequest> = [
      {
        key: 'ticketCode',
        title: 'Mã yêu cầu',
        width: 120,
        dataIndex: 'ticketCode',
        sorter: false,
        showSorterTooltip: false,
        sortOrder: getSortOrder('ticketDefinitionId'),
        ellipsis: true
      },
      {
        key: 'ticketDefinitionId',
        title: 'Loại yêu cầu',
        width: 160,
        dataIndex: 'ticketDefinitionId',
        sorter: false,
        showSorterTooltip: false,
        sortOrder: getSortOrder('ticketDefinitionId'),
        ellipsis: true,
        render: (item, record) => {
          return handleGetAbsenceTypeName(record)
        }
        // fixed: 'left'
      },
      {
        key: 'startDate',
        title: t('leaveRequest.startDate'),
        width: 140,
        sorter: false,
        dataIndex: 'processStatus',
        ellipsis: true,
        render: (item) => {
          const startDate = item['0']?.attributes?.start_time
          return dayjs(startDate).format('DD/MM/YYYY HH:mm')
        }
      },
      {
        key: 'endDate',
        title: t('leaveRequest.endDate'),
        width: 140,
        dataIndex: 'processStatus',
        ellipsis: false,
        sorter: false,
        render: (item) => {
          const endDate = item['0']?.attributes?.end_time
          return dayjs(endDate).format('DD/MM/YYYY HH:mm')
        }
      },
      {
        key: 'description',
        title: t('leaveRequest.requestMessage'),
        width: 200,
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
        width: 140,
        dataIndex: 'createdAt',
        sorter: true,
        ellipsis: true,
        render: (requestDate) => {
          return dayjs(requestDate).format('DD/MM/YYYY HH:mm')
        }
      },
      {
        key: 'createdBy',
        title: 'Người yêu cầu',
        width: 150,
        dataIndex: 'createdBy',
        showSorterTooltip: false,
        ellipsis: true,
        sorter: true
      },
      {
        key: 'groupCode',
        title: 'Phòng ban',
        width: 120,
        dataIndex: 'groupCode',
        showSorterTooltip: false,
        ellipsis: true,
        sorter: true,
        render: (departmentCode) => {
          return mappingDepartmentByCode(departments, departmentCode)
        }
      },
      {
        key: 'status',
        title: t('leaveRequest.status'),
        width: 120,
        dataIndex: 'status',
        showSorterTooltip: false,
        ellipsis: true,
        render: (status) => {
          return (
            <div>
              <Tag style={{ minWidth: 80, textAlign: 'center' }} color={tagColorMapping(status)}>
                {TICKET_STATUS[status]}
              </Tag>
            </div>
          )
        }
      },
      {
        key: 'action',
        title: t('device.action'),
        width: 160,
        align: 'left',
        render: (_, record: ILeaveRequest) => {
          return (
            <div className='tw-flex tw-justify-center tw-gap-[8px]'>
              <Tooltip title='Xem thông tin phê duyệt' className='tw-flex tw-items-center'>
                <div
                  onClick={() => onOpenModalApprove(record)}
                  className='tw-text-blue-600 tw-cursor-pointer tw-underline'
                >
                  {record.status === TicketStatusEnum.SUBMITTED || record.status === TicketStatusEnum.PROCESSING
                    ? 'Phê duyệt'
                    : record.status === TicketStatusEnum.CONFIRMED || record.status === TicketStatusEnum.REJECTED
                    ? 'Xem phê duyệt'
                    : ''}
                </div>
              </Tooltip>

              {record?.status !== TicketStatusEnum.CANCELLED &&
                record?.status !== TicketStatusEnum.CONFIRMED &&
                record?.status !== TicketStatusEnum.REJECTED && (
                  <Tooltip title='Cập nhật thông tin' className='tw-flex tw-items-center tw-justify-center'>
                    <Button
                      size='small'
                      onClick={() => handleClickUpdate('update', record)}
                      icon={<EditOutlined className='tw-text-blue-600' />}
                      disabled={
                        record.createdBy !== userInfo?.userName || record.status === TicketStatusEnum.PROCESSING
                      }
                    />
                  </Tooltip>
                )}

              {record?.status !== TicketStatusEnum.CANCELLED &&
                record?.status !== TicketStatusEnum.CONFIRMED &&
                record?.status !== TicketStatusEnum.REJECTED && (
                  <Tooltip title='Hủy yêu cầu'>
                    <Popconfirm
                      title='Hủy yêu cầu'
                      description='Bạn có chắc chắn muốn hủy yêu cầu'
                      onConfirm={() => handleClickDelete(record)}
                      okText={t('common.yes')}
                      cancelText={t('common.no')}
                      disabled={
                        record.createdBy !== userInfo?.userName ||
                        record.createdBy !== userInfo?.userName ||
                        record.status === TicketStatusEnum.PROCESSING
                      }
                    >
                      <Button
                        size='small'
                        icon={<DeleteOutlined className='tw-text-red-600' />}
                        disabled={
                          record.createdBy !== userInfo?.userName || record.status === TicketStatusEnum.PROCESSING
                        }
                      />
                    </Popconfirm>
                  </Tooltip>
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
            </div>
          )
        }
      }
    ]
    return columns
  }, [handleClickDelete, getSortOrder, handleClickUpdate, t])

  const [visibleColumns, setVisibleColumns] = useState(columns.map((col: any) => col.key))

  const onChangeColumnVisibility = (selectedColumns: any[]) => {
    setVisibleColumns(selectedColumns)
  }

  useEffect(() => {
    dispatch(getAllDefinationType())
    dispatch(searchUser(filterUserPayload))
    dispatch(getListDepartments())
  }, [])

  useEffect(() => {
    if (isSystemAdmin) {
      dispatch(countLeaveRequest(dateFilter))
    }
  }, [dateFilter, isSystemAdmin])

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

  const getPercentage = (amount: number) => {
    const percent =
      (amount / (countLeaveRequestSate.approved + countLeaveRequestSate.rejected + countLeaveRequestSate.submitted)) *
      100
    return percent?.toFixed(3) || 0
  }

  const onFasFilter = (status: TicketStatusEnum.SUBMITTED | TicketStatusEnum.REJECTED | TicketStatusEnum.CONFIRMED) => {
    // setDateFilter(dayjs().startOf('month'))
    setStatusFilter([status])
    setSearchValue((prev) => {
      return {
        ...prev,
        // startDate: dayjs.utc().startOf('month').format(),
        // endDate: dayjs.utc().format(),
        statuses: [status]
      }
    })
  }

  return (
    <div className='user-list tw-h-[calc(100%-48px)] tw-m-3 tw-p-5 tw-bg-white'>
      <LeaveRequestForm
        open={isOpenModal}
        data={editingLeaveRequest}
        handleClose={handleCloseModal}
        canUpdateForm={canUpdateForm}
      />
      <div className='tw-flex'>
        <h1 className='tw-text-2xl tw-font-semibold'>{t('leaveRequest.title')}</h1>
      </div>
      <div className='tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-gap-[10px] tw-my-5'>
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
        <div className='tw-flex tw-flex-col md:tw-flex-row tw-gap-[10px] tw-justify-between'>
          {(isSystemAdmin || isManagerDepartment) && (
            <Select
              onChange={(val) => onChangeRequest('requestBy', val)}
              optionFilterProp='children'
              filterOption={(input, option) => {
                return (option?.label + '').toLowerCase().includes(input.toLowerCase())
              }}
              mode='multiple'
              placeholder='Người yêu cầu'
              style={{ minWidth: 380 }}
              options={users.map((user) => {
                return {
                  label: user?.fullName + ' (' + user?.userName + ')',
                  value: user?.userName
                }
              })}
            />
          )}

          <DatePicker
            picker='month'
            allowClear={false}
            value={dateFilter}
            format={'MM/YYYY'}
            onChange={(val) => onChangeRequest('requestTime', val)}
            disabledDate={(date) => {
              return date.isAfter(new Date())
            }}
          />

          <Select
            value={statusFilter}
            onChange={(val) => onChangeRequest('requestStatus', val)}
            mode='multiple'
            placeholder='Trạng thái yêu cầu'
            style={{ minWidth: 200 }}
            options={Object.entries(TICKET_STATUS_FILTER).map((item) => {
              return {
                label: item[1],
                value: item[0]
              }
            })}
          />
        </div>
      </div>
      {isSystemAdmin && (
        <>
          <Row gutter={[16, 16]} className='leave-request-count tw-hidden md:tw-flex'>
            <Col xs={24} sm={7} className='leave-request-count-title'>
              <Tooltip title='Không bao gồm trạng thái Đã hủy và Đang xử lý'>
                Số yêu cầu trong tháng {dayjs(dateFilter).format('MM/YYYY')}
                <span className='leave-request-count-title__amount'>
                  {countLeaveRequestSate.approved + countLeaveRequestSate.rejected + countLeaveRequestSate.submitted}
                </span>
              </Tooltip>
            </Col>
            <Col xs={24} sm={17} className='leave-request-count-detail'>
              <div
                className='leave-request-count-detail__item leave-request-count-detail__item--submitted'
                onClick={() => onFasFilter(TicketStatusEnum.SUBMITTED)}
              >
                <span className={statusFilter?.includes(TicketStatusEnum.SUBMITTED) ? 'active' : ''}>
                  Đang chờ: <span>{countLeaveRequestSate.submitted}</span>
                </span>
              </div>
              <div className='leave-request-count-detail__item' onClick={() => onFasFilter(TicketStatusEnum.CONFIRMED)}>
                <span className={statusFilter?.includes(TicketStatusEnum.CONFIRMED) ? 'active' : ''}>
                  Đã phê duyệt: <span>{countLeaveRequestSate.approved}</span>
                </span>
              </div>
              <div
                className='leave-request-count-detail__item leave-request-count-detail__item--rejected'
                onClick={() => onFasFilter(TicketStatusEnum.REJECTED)}
              >
                <span className={statusFilter?.includes(TicketStatusEnum.REJECTED) ? 'active' : ''}>
                  Đã từ chối: <span>{countLeaveRequestSate.rejected}</span>
                </span>
              </div>
            </Col>
          </Row>

          <div className='leave-request-percent tw-hidden md:tw-flex'>
            <div
              style={{ width: `${getPercentage(countLeaveRequestSate.submitted)}%` }}
              className='leave-request-percent__item tw-bg-[#1677ff]'
            ></div>
            <div
              className='leave-request-percent__item'
              style={{ width: `${getPercentage(countLeaveRequestSate.approved)}%` }}
            ></div>
            <div
              style={{ width: `${getPercentage(countLeaveRequestSate.rejected)}%` }}
              className='leave-request-percent__item tw-bg-[#cf1322]'
            ></div>
          </div>
        </>
      )}

      <div>
        <Table
          columns={columns.filter((col: any) => visibleColumns.includes(col.key))}
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

      <Modal
        title={`Yêu cầu ${selectedTicket?.ticketCode} - ${
          ticketDifinations.find((ticket) => ticket.id === selectedTicket?.ticketDefinitionId)?.name
        }`}
        open={isOpenModalApprove}
        onOk={handleModalAprroveOk}
        onCancel={handleModalAprroveCancel}
        width='60%'
        style={{ minWidth: 350 }}
        footer={null}
      >
        {selectedTicket && (
          <ModalApprove
            isSystemAdmin={isSystemAdmin}
            departments={departments}
            ticket={selectedTicket}
            onUpdateSuccess={(value) => setApproveStatus(value)}
          />
        )}
      </Modal>
    </div>
  )
}
export default LeaveRequest
