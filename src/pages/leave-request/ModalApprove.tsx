import { ExclamationCircleFilled } from '@ant-design/icons'
import { AutoComplete, Button, Col, DatePicker, Modal, Row, Space, Tag, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { memo, useEffect, useState } from 'react'
import { setCreateRequestStatus, updateLeaveRequest } from '~/stores/features/leave-request/leave-request.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { DataType } from '~/types/department.interface'
import { ILeaveRequest, ILeaveRequestUpdateStatusForm } from '~/types/leave-request'
import { TicketAttribute, TicketProcessNode } from '~/types/setting-ticket-process'
import { GroupProfile } from '~/types/user.interface'
import { INPUT_TYPE, LEAVE_TYPE_MAP, TICKET_STATUS, TicketStatusEnum } from '~/utils/Constant'
import { mappingDepartmentByCode, tagColorMapping } from '~/utils/helper'
const { confirm } = Modal
export enum PROCESS_GROUPCODE {
  START = '__START__',
  END = '__END__',
  REQUESTER = '__REQUESTER__'
}

const ModalApprove = (props: {
  ticket: ILeaveRequest
  isSystemAdmin: GroupProfile | undefined
  departments: DataType[]
  onUpdateSuccess: (isSuccess: boolean) => void
}) => {
  const { ticket, departments, isSystemAdmin, onUpdateSuccess } = props
  const [fieldValues, setFieldValues] = useState<any>({})
  const dispatch = useAppDispatch()
  const { userInfo } = useUserInfo()

  const listOfDefinition = useAppSelector((item) => item.leaveRequest.ticketDefinationType)
  const ticketDefinition = listOfDefinition.find((item) => item.id === ticket.ticketDefinitionId)
  const ticketProcessNodes: TicketProcessNode[] = Object.values(ticketDefinition?.revisions[0]?.processNodes || [])

  const sortedProcessNodes = Object.entries(ticketProcessNodes)
    .map(([key, value]) => ({ key: parseInt(key), value }))
    .sort((a, b) => a.key - b.key)
    .map(({ value }) => value)

  const processsSteps = Object.values(ticket.processStatus)
  const sortedProcessSteps = Object.entries(processsSteps)
    .map(([key, value]) => ({ key: parseInt(key), value }))
    .sort((a, b) => a.key - b.key)
    .map(({ value }) => value)

  const mappedSteps: TicketProcessNode[] = sortedProcessSteps.map((step: any, index) => {
    const matchingNode = sortedProcessNodes[index]
    const attributes = step.attributes || {}
    const attributesWithValues =
      matchingNode?.attributes?.map((item) => ({
        ...item,
        value: attributes[item.name] || null
      })) || []

    return {
      ...step,
      name: matchingNode?.name || '',
      attributes: attributesWithValues
    }
  })
  const filteredSteps = mappedSteps.filter((step) => step.groupCodes[0] !== PROCESS_GROUPCODE.END)

  filteredSteps.sort((a, b) => {
    if (a.status === TicketStatusEnum.FINISHED && b.status !== TicketStatusEnum.FINISHED) return -1
    if (b.status === TicketStatusEnum.FINISHED && a.status !== TicketStatusEnum.FINISHED) return 1
    return 0
  })

  const mappingValueByType = (item: TicketAttribute) => {
    const { type, value } = item
    if (!value) return '--'
    switch (type) {
      case INPUT_TYPE.DATETIME: {
        return dayjs(value).format('DD/MM/YYYY HH:mm:ss')
      }
      case INPUT_TYPE.SINGLE_SELECT: {
        return LEAVE_TYPE_MAP[value]
      }
      default: {
        return value
      }
    }
  }

  const showConfirm = (
    status: TicketStatusEnum.FINISHED | TicketStatusEnum.REJECTED,
    attributes: any,
    ticketId: string,
    nodeId: number
  ) => {
    for (const prop in attributes) {
      if (dayjs.isDayjs(attributes[prop])) {
        attributes[prop] = attributes[prop].format('YYYY-MM-DD HH:mm:ss')
      }
    }
    confirm({
      title: status === TicketStatusEnum.FINISHED ? 'Đồng ý' : 'Từ chối',
      icon: <ExclamationCircleFilled />,
      content: status === TicketStatusEnum.FINISHED ? 'Bạn có muốn đồng ý yêu cầu?' : 'Bạn có muốn từ chối yêu cầu?',
      onOk() {
        onUpdateStatus(status, attributes, ticketId, nodeId)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const onUpdateStatus = async (
    status: TicketStatusEnum.FINISHED | TicketStatusEnum.REJECTED,
    attributes: any,
    ticketId: string,
    nodeId: number
  ) => {
    dispatch(setCreateRequestStatus(false))
    const payload: ILeaveRequestUpdateStatusForm = {
      attrs: attributes,
      nodeId: nodeId,
      status,
      ticketId
    }

    try {
      const response = await dispatch(updateLeaveRequest(payload)).unwrap()
      onUpdateSuccess(true)
      notification.success({
        message: response.message
      })
      dispatch(setCreateRequestStatus(true))
    } catch (error: any) {
      notification.error({
        message: error.message
      })
    }
  }

  const onApprove = (nodeId: number) => {
    onUpdateSuccess(false)
    showConfirm(TicketStatusEnum.FINISHED, fieldValues, ticket.id, nodeId)
  }

  const onReject = (nodeId: number) => {
    onUpdateSuccess(false)
    showConfirm(TicketStatusEnum.REJECTED, fieldValues, ticket.id, nodeId)
  }

  const isAnyRequiredFieldEmpty = (step: TicketProcessNode) => {
    return step.attributes.some((item) => item?.required && !fieldValues[item.name])
  }

  useEffect(() => {
    if (ticket) {
      setFieldValues({})
    }
  }, [ticket])

  return (
    <div>
      {ticket?.status && (
        <div className='tw-mb-3'>
          <span className='tw-text-base tw-font-semibold'>Trạng thái yêu cầu:</span>
          <Tag
            className='tw-min-w-[80px] tw-leading-8 tw-text-center tw-ml-[10px]'
            color={tagColorMapping(ticket.status)}
          >
            {TICKET_STATUS[ticket.status]}
          </Tag>
        </div>
      )}

      <Row gutter={[0, 16]}>
        <Col span={24}>
          {filteredSteps &&
            filteredSteps.length > 0 &&
            filteredSteps.map((step, mainIndex) => {
              return (
                <>
                  {step.status && (
                    <div className='feature-container' key={mainIndex}>
                      <Row gutter={[0, 16]}>
                        <Col span={24} className='tw-flex'>
                          <div className='tw-font-semibold'>{step.name}</div>
                        </Col>

                        {step.attributes &&
                          step.attributes.length > 0 &&
                          step.attributes.map((item, index) => {
                            if (
                              step.status === TicketStatusEnum.FINISHED ||
                              step.status === TicketStatusEnum.REJECTED
                            ) {
                              return (
                                <Col xs={24} lg={12} className='tw-flex' key={index}>
                                  <div className='lg:tw-min-w-[200px]'>{item.description}:</div>
                                  <div className='tw-font-medium tw-ml-[4px]'>{mappingValueByType(item)}</div>
                                </Col>
                              )
                            } else if (
                              step.status === TicketStatusEnum.PENDING ||
                              step.status === TicketStatusEnum.PROCESSING
                            ) {
                              return (
                                <>
                                  <Col span={24} className='tw-flex tw-items-center' key={index}>
                                    {(isSystemAdmin ||
                                      userInfo.userName === (step?.executors && step.executors[0])) && (
                                      <>
                                        <div className='lg:tw-min-w-[200px]'>
                                          {item?.required && <span className='tw-text-red-600'>* </span>}
                                          {item.description}:
                                        </div>
                                        {item.type === INPUT_TYPE.TEXT && (
                                          <AutoComplete
                                            className='tw-w-full'
                                            value={fieldValues[item.name] || ''}
                                            onChange={(data) => {
                                              const newValue = {
                                                ...fieldValues,
                                                [item.name]: data
                                              }
                                              setFieldValues(newValue)
                                            }}
                                            options={item?.suggestion?.map((value) => ({ value }))}
                                          >
                                            <TextArea placeholder={item.description} />
                                          </AutoComplete>
                                        )}

                                        {item.type === INPUT_TYPE.DATETIME && (
                                          <DatePicker
                                            value={fieldValues[item.name] ? dayjs(fieldValues[item.name]) : null}
                                            onChange={(date) => {
                                              const newValue = {
                                                ...fieldValues,
                                                [item.name]: date
                                              }
                                              setFieldValues(newValue)
                                            }}
                                            placeholder={item.description}
                                            className='tw-w-full'
                                            showTime={{ format: 'HH:mm' }}
                                            format='DD/MM/YYYY HH:mm'
                                          />
                                        )}
                                      </>
                                    )}

                                    {index === 0 &&
                                      !isSystemAdmin &&
                                      userInfo.userName !== (step?.executors && step.executors[0]) && (
                                        <div>
                                          <span className='tw-mr-3'>Trạng thái:</span>
                                          <Tag
                                            style={{ minWidth: 80, textAlign: 'center' }}
                                            color={tagColorMapping(TicketStatusEnum.PROCESSING)}
                                          >
                                            {TICKET_STATUS[TicketStatusEnum.PROCESSING]}
                                          </Tag>
                                        </div>
                                      )}
                                  </Col>
                                  {index === step?.attributes?.length - 1 &&
                                    (step.status === TicketStatusEnum.PENDING ||
                                      step.status === TicketStatusEnum.PROCESSING) &&
                                    (isSystemAdmin || userInfo.userName === (step?.executors && step.executors[0])) && (
                                      <Col span={24} className='tw-flex tw-justify-center'>
                                        <Space>
                                          <Button
                                            danger
                                            onClick={() => onReject(mainIndex)}
                                            disabled={isAnyRequiredFieldEmpty(step)}
                                          >
                                            Từ chối
                                          </Button>
                                          <Button
                                            type='primary'
                                            onClick={() => onApprove(mainIndex)}
                                            disabled={isAnyRequiredFieldEmpty(step)}
                                          >
                                            Đồng ý
                                          </Button>
                                        </Space>
                                      </Col>
                                    )}
                                </>
                              )
                            }
                          })}

                        {/* {(step.status === TicketStatusEnum.PENDING || step.status === TicketStatusEnum.PROCESSING) &&
                          (isSystemAdmin || userInfo.userName === (step?.executors && step.executors[0])) && (
                            <Col span={24} className='tw-flex tw-justify-center'>
                              <Space>
                                <Button danger onClick={() => onReject(mainIndex)}>
                                  Từ chối
                                </Button>
                                <Button type='primary' onClick={() => onApprove(mainIndex)}>
                                  Đồng ý
                                </Button>
                              </Space>
                            </Col>
                          )} */}

                        {step?.status !== TicketStatusEnum.PENDING && step.histories && step?.histories?.length > 0 && (
                          <Col span={24} className='tw-flex tw-justify-end '>
                            <div>
                              <span className='tw-mr-2'>bởi</span>
                              <span className='tw-text-sky-700 tw-italic'>
                                {step?.histories[step?.histories?.length - 1].executorId} -
                                {mappingDepartmentByCode(
                                  departments,
                                  step.groupCodes[0] !== PROCESS_GROUPCODE.START &&
                                    step.groupCodes[0] !== PROCESS_GROUPCODE.REQUESTER
                                    ? step.histories[0].actualGroup
                                    : ticket.groupCode
                                )}{' '}
                                (
                                {dayjs(step?.histories[step?.histories?.length - 1].createdAt).format(
                                  'DD/MM/YYYY HH:mm:ss'
                                )}
                                )
                              </span>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  )}
                </>
              )
            })}
        </Col>
      </Row>
    </div>
  )
}

export default memo(ModalApprove)
