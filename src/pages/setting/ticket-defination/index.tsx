/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC } from 'react'
import React, { memo, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Space, Tooltip, notification } from 'antd'
import Target from './component/Target'

import { useParams } from 'react-router-dom'
import iconAdd from '~/assets/images/setting/add.png'
import {
  addDroppedItem,
  addNewApprovalStep,
  createRevision,
  fetchDepartments,
  fetchListTicket,
  getTicketById,
  removeApprovalStep,
  setDroppedItem
} from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DragItem, DropItem, TicketDefRevisionCreateReq } from '~/types/setting-ticket-process'
import BottomControl from './component/BottomControl'
import FormInitName from './component/FormInitName'
import ModalInitAttr from './component/ModalInitAttrr'
import Source from './component/Source'
import { TicketInitial } from './type/ItemTypes'

export const Node = {
  START: '__START__',
  END: '__END__'
}

const initialPayloadState = {
  name: '',
  description: '',
  ticketDefId: '',
  revision: {
    processFlow: [],
    processNodes: [
      {
        groupCode: '',
        attributes: []
      },
      {
        groupCode: '',
        attributes: []
      }
    ]
  }
}

const ticketPayloadReducer = (state: TicketDefRevisionCreateReq, action: any) => {
  switch (action.type) {
    case 'SET_TICKET':
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
        revision: action.payload.revision
      }
    case 'SET_PROCESS_NODES':
      return {
        ...state,
        revision: {
          ...state.revision,
          processNodes: action.payload
        }
      }
    case 'SET_PROCESS_FLOW':
      return {
        ...state,
        revision: {
          ...state.revision,
          processFlow: action.payload
        }
      }
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.payload
      }
    case 'SET_REVISION':
      return {
        ...state,
        revision: action.payload
      }
    default:
      return state
  }
}

const Index: FC = memo(function Index() {
  const [ticketRequestPayload, dispatchTicketRequest] = useReducer(ticketPayloadReducer, initialPayloadState)
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [initAttrForm] = Form.useForm()

  const sourceBoxes = useAppSelector((state) => state.ticketProcess.departments)
  const targetBoxes = useAppSelector((state) => state.ticketProcess.approvalSteps)
  const tickets = useAppSelector((state) => state.ticketProcess.tickets)
  const ticketSelected = useAppSelector((state) => state.ticketProcess.ticketSelected)

  const [isUpdateNameFinish, setIsUpdateNameFinish] = useState(false)
  const [isModalInitAttrOpen, setIsModalInitAttrOpen] = useState<{ key: string; status: boolean }>({
    key: '0',
    status: false
  })

  const ticketNodeIndexRef = useRef<number>(0)

  const onContinue = (formValue: TicketInitial) => {
    const { name, description } = formValue
    if (!name || name.trim().length === 0) {
      notification.error({ message: 'Hãy nhập tên biểu mẫu' })
      return
    }
    setIsUpdateNameFinish(true)
    dispatchTicketRequest({ type: 'SET_NAME', payload: name })
    dispatchTicketRequest({ type: 'SET_DESCRIPTION', payload: description })
  }

  const onUpdateTicketName = () => {
    setIsUpdateNameFinish(false)
    form.setFieldsValue({
      name: ticketRequestPayload.name,
      description: ticketRequestPayload.description
    })
  }

  const openModalInitAttr = (indexNode: number) => {
    ticketNodeIndexRef.current = indexNode
    setIsModalInitAttrOpen({
      key: `${indexNode}`,
      status: true
    })
  }

  const onChangeType = (value: string, index: number) => {
    const updatedForm = { ...initAttrForm.getFieldsValue() }
    updatedForm.initAttr[index].type = value
    initAttrForm.setFieldsValue(updatedForm)
  }

  const onFinishInitAttr = (initFormValues: any) => {
    const index = ticketNodeIndexRef.current
    const newProcessNodes = [...ticketRequestPayload.revision.processNodes]
    const newProcessFlow = [
      ...ticketRequestPayload.revision.processFlow,
      {
        destIdx: index,
        srcIdx: index + 1
      }
    ]
    if (index === 0) {
      newProcessNodes[index] = {
        ...newProcessNodes[index],
        groupCode: Node.START,
        attributes: initFormValues.initAttr
      }
    } else {
      newProcessNodes[index] = {
        ...newProcessNodes[index],
        groupCode: targetBoxes[index - 1].data[0].id,
        attributes: initFormValues.initAttr
      }
    }

    dispatchTicketRequest({ type: 'SET_PROCESS_NODES', payload: newProcessNodes })
    dispatchTicketRequest({ type: 'SET_PROCESS_FLOW', payload: newProcessFlow })
    setIsModalInitAttrOpen((prev) => {
      return {
        ...prev,
        status: false
      }
    })
  }

  const onFinishInitAttrFail = (initFormValues: any) => {
    console.log(initFormValues, 'initFormValues')
  }

  const handleCancelModalInitAttr = () => {
    setIsModalInitAttrOpen((prev) => {
      return {
        ...prev,
        status: false
      }
    })
  }

  const handleDrop = (item: DragItem, targetKey: string) => {
    dispatch(addDroppedItem({ targetKey, item }))
  }

  const canDropItem = () => {
    return true
  }

  const addNewStep = () => {
    const newNode = { groupCode: '', attributes: [] }
    const newProcessNodes = [...ticketRequestPayload.revision.processNodes, newNode]
    dispatchTicketRequest({ type: 'SET_PROCESS_NODES', payload: newProcessNodes })
    dispatch(addNewApprovalStep())
  }

  const removeStep = (item: DropItem, index: number) => {
    if (index >= 0 && index < ticketRequestPayload.revision.processNodes.length) {
      const newProcessNodes = [...ticketRequestPayload.revision.processNodes]
      const newProcessFlow = [...ticketRequestPayload.revision.processFlow]
      const indexInProcessNodes = index + 1
      const removedProcessNodes = newProcessNodes.filter((_, i) => i !== indexInProcessNodes)
      const removedProcessFlow = newProcessFlow.filter((_, i) => i !== indexInProcessNodes)
      dispatchTicketRequest({ type: 'SET_PROCESS_NODES', payload: removedProcessNodes })
      dispatchTicketRequest({ type: 'SET_PROCESS_FLOW', payload: removedProcessFlow })
      dispatch(removeApprovalStep({ index: index }))
    }
  }

  const isValidStep = useMemo(() => {
    return (index: number) => {
      let isVaid = false
      const item = ticketRequestPayload.revision
      if (
        item?.processNodes[index]?.groupCode &&
        item?.processNodes[index]?.attributes?.length > 0 &&
        item?.processNodes[index]?.attributes[0]?.name
      ) {
        isVaid = true
      }
      return isVaid
    }
  }, [ticketRequestPayload.revision])

  const setTicketCurrentInfo = (item: any) => {
    const { id, name, description, revisions } = item
    const revision = { ...revisions[0] }
    setIsUpdateNameFinish(true)
    dispatchTicketRequest({
      type: 'SET_TICKET',
      payload: {
        id,
        name,
        description,
        revision
      }
    })
    const fillterNodes = revision.processNodes
      .filter((p: any) => p.groupCode !== Node.START && p.groupCode !== Node.END)
      .map((data: any, index: number) => {
        return {
          index,
          key: `request${index}`,
          tittle: `Duyệt lần ${index + 1} `,
          data: [
            {
              id: data.groupCode,
              name: data.groupCode
            }
          ]
        }
      })

    dispatch(setDroppedItem({ data: fillterNodes }))
  }

  const onSaveAll = () => {
    dispatch(createRevision(ticketRequestPayload))
  }

  useEffect(() => {
    dispatch(fetchListTicket())
    dispatch(fetchDepartments())
  }, [dispatch])

  useEffect(() => {
    if (tickets.length > 0 && id) {
      dispatch(getTicketById({ id }))
    }
  }, [id, tickets, dispatch])

  useEffect(() => {
    if (ticketSelected?.id) {
      setTicketCurrentInfo(ticketSelected)
    }
  }, [ticketSelected])

  useEffect(() => {
    if (!isModalInitAttrOpen.status) {
      initAttrForm.resetFields()
    }

    if (isModalInitAttrOpen.status) {
      const modalFormData = ticketRequestPayload.revision.processNodes.find(
        (item: any, index: number) => Number(index) === Number(isModalInitAttrOpen.key)
      )
      if (modalFormData?.groupCode) {
        const dataForm = {
          initAttr: modalFormData?.attributes
        }
        initAttrForm.setFieldsValue(dataForm)
      }
    }
  }, [isModalInitAttrOpen])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='process-container tw-p-[10px] tw-w-full tw-h-full'>
        {!isUpdateNameFinish && <FormInitName form={form} onContinue={onContinue} />}

        {isUpdateNameFinish && (
          <>
            <div className='tw-h-1/4'>
              <div className='department-title  tw-text-lg tw-mt-3 tw-mb-[25px]'>
                <span className='tw-font-semibold'>{ticketRequestPayload.name}</span>
                <span className='tw-ml-2 tw-cursor-pointer' onClick={onUpdateTicketName}>
                  <EditOutlined />
                </span>
              </div>
              <Space align='start' wrap>
                {sourceBoxes?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Source id={item.id} name={item.name} />
                    </React.Fragment>
                  )
                })}
                <img src={iconAdd} alt='add-department' />
              </Space>
            </div>

            <div className='list-item-target tw-h-3/4'>
              <div className='item-tartget__top'>
                <div
                  className='button-start-end'
                  style={{ border: isValidStep(0) ? '1px solid #0100ff' : '1px solid #d9d9d9' }}
                  onClick={() => openModalInitAttr(0)}
                >
                  <span
                    className='dot'
                    style={{
                      backgroundColor: '#1890ff'
                    }}
                  />
                  <span> Khởi tạo phép</span>
                </div>
                <span className='tw-text-blue-600'>----------</span>
                <div
                  className='target-box-container'
                  style={{
                    overflowY: targetBoxes?.length > 1 ? 'auto' : 'unset'
                  }}
                >
                  {targetBoxes.map((item, index) => {
                    return (
                      <>
                        <div
                          className='tw-flex tw-flex-col tw-items-center tw-justify-center'
                          key={index}
                          style={{ maxWidth: '50%' }}
                        >
                          <div className='tw-mb-3'>Duyệt lần {index + 1}</div>
                          <Target
                            key={item.key}
                            targetKey={item.key}
                            onDrop={handleDrop}
                            dropItem={item}
                            canDropItem={canDropItem}
                            isValidStep={() => isValidStep(index + 1)}
                          />
                          <Space className='tw-mt-3'>
                            {targetBoxes.length > 1 && (
                              <Tooltip title={'Xóa bước duyệt'}>
                                <Button shape='circle' onClick={() => removeStep(item, index)}>
                                  <MinusOutlined />
                                </Button>
                              </Tooltip>
                            )}

                            <Tooltip title={'Cập nhật thông tin thuộc tính'}>
                              <Button
                                shape='circle'
                                onClick={() => openModalInitAttr(index + 1)}
                                disabled={targetBoxes[index].data.length === 0}
                              >
                                <EditOutlined />
                              </Button>
                            </Tooltip>

                            {index === targetBoxes.length - 1 && (
                              <Tooltip title={'Thêm bước duyệt'}>
                                <Button shape='circle' onClick={addNewStep}>
                                  <PlusOutlined />
                                </Button>
                              </Tooltip>
                            )}
                          </Space>
                        </div>

                        {index !== targetBoxes.length - 1 && (
                          <span className='tw-text-blue-600 tw-min-w-[60px]'>----------</span>
                        )}
                      </>
                    )
                  })}
                </div>
                <span className='tw-text-blue-600'>----------</span>
                {/* <img src={iconHalfArrow} alt='arrow' /> */}
                <div className='button-start-end tw-flex tw-items-center tw-justify-center'>
                  <span className='dot' style={{ backgroundColor: '#52c41a' }} /> Trạng thái cuối
                </div>
              </div>

              <BottomControl onSave={onSaveAll} />
            </div>
          </>
        )}
      </div>
      <ModalInitAttr
        isModalInitAttrOpen={isModalInitAttrOpen}
        initAttrForm={initAttrForm}
        handleCancelModalInitAttr={handleCancelModalInitAttr}
        onFinishInitAttr={onFinishInitAttr}
        onFinishInitAttrFail={onFinishInitAttrFail}
        onChangeType={onChangeType}
      />
    </DndProvider>
  )
})

export default Index
