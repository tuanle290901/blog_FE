/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC } from 'react'
import React, { memo, useEffect, useState, useRef } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Space, Tabs, Tooltip, notification } from 'antd'
import Target from './component/Target'

import iconAdd from '~/assets/images/setting/add.png'
import iconTickDone from '~/assets/images/setting/tick-done.png'
import {
  addDroppedItem,
  addNewApprovalStep,
  createRevision,
  fetchDepartments,
  removeApprovalStep
} from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DragItem, DropItem, TicketDefRevisionCreateReq, TicketProcessRevision } from '~/types/setting-ticket-process'
import BottomControl from './component/BottomControl'
import FormInitName from './component/FormInitName'
import ModalInitAttr from './component/ModalInitAttrr'
import Source from './component/Source'
import { TicketInitial } from './type/ItemTypes'

const Index: FC = memo(function Index() {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [initAttrForm] = Form.useForm()
  const sourceBoxes = useAppSelector((state) => state.ticketProcess.departments)
  const targetBoxes = useAppSelector((state) => state.ticketProcess.approvalSteps)

  const [ticketInfo, setTicketInfo] = useState<TicketInitial>({ name: '', description: '', isFinished: false })
  const [isModalInitAttrOpen, setIsModalInitAttrOpen] = useState<{ key: string; status: boolean }>({
    key: '0',
    status: false
  })
  const ticketRequestPayloadRef = useRef<TicketDefRevisionCreateReq>({
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
  })
  const ticketNodeIndexRef = useRef<number>(0)

  const onContinue = (formValue: TicketInitial) => {
    const { name, description } = formValue
    if (!name || name.trim().length === 0) {
      notification.error({ message: 'Hãy nhập tên biểu mẫu' })
      return
    }
    setTicketInfo({ name, description, isFinished: true })
  }

  const onUpdateTicketName = () => {
    setTicketInfo((prev) => {
      return {
        ...prev,
        isFinished: false
      }
    })
    form.setFieldsValue({
      name: ticketInfo.name,
      description: ticketInfo.description
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
    if (ticketNodeIndexRef.current === 0) {
      ticketRequestPayloadRef.current.revision.processNodes[ticketNodeIndexRef.current].groupCode = 'INIT'
    } else {
      ticketRequestPayloadRef.current.revision.processNodes[ticketNodeIndexRef.current].groupCode =
        targetBoxes[ticketNodeIndexRef.current - 1].data[0].id
    }
    ticketRequestPayloadRef.current.revision.processNodes[ticketNodeIndexRef.current].attributes =
      initFormValues.initAttr
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
    ticketRequestPayloadRef.current.revision.processNodes.push(newNode)
    dispatch(addNewApprovalStep())
  }

  const removeStep = (item: DropItem, index: number) => {
    if (index >= 0 && index < ticketRequestPayloadRef.current.revision.processNodes.length) {
      ticketRequestPayloadRef.current.revision.processNodes.splice(index + 1, 1)
    }
    dispatch(removeApprovalStep({ index: index }))
  }

  const isValidStep = (index: number) => {
    let isVaid = false
    const item = ticketRequestPayloadRef.current.revision
    if (item.processNodes[index].groupCode && item.processNodes[index].attributes[0].name) {
      isVaid = true
    }
    return isVaid
  }

  const onSaveAll = () => {
    const targetBoxLen = targetBoxes.length
    let startNode = 0
    let endNode = 1
    const processFlowTemp = []
    for (let i = 0; i < targetBoxLen; i++) {
      processFlowTemp.push({ destIdx: startNode, srcIdx: endNode })
      startNode++
      endNode++
    }
    ticketRequestPayloadRef.current.revision.processFlow = processFlowTemp
    ticketRequestPayloadRef.current.revision.rev = 0
    ticketRequestPayloadRef.current.revision.stopTransferStrategy = 'BY_ONE_RESULT'
    ticketRequestPayloadRef.current.revision.strategy = 'JUDGEMENT_IMMEDIATELY'
    ticketRequestPayloadRef.current.ticketDefId = '12345678'
    dispatch(createRevision(ticketRequestPayloadRef.current))
  }

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  useEffect(() => {
    if (ticketInfo.name && ticketInfo.isFinished) {
      ticketRequestPayloadRef.current.name = ticketInfo.name
      ticketRequestPayloadRef.current.description = ticketInfo.description
    }
  }, [ticketInfo])

  useEffect(() => {
    if (!isModalInitAttrOpen.status) {
      initAttrForm.resetFields()
    }

    if (isModalInitAttrOpen.status) {
      console.log(isModalInitAttrOpen)
      console.log(ticketRequestPayloadRef.current)
      const modalFormData = ticketRequestPayloadRef.current.revision.processNodes.find(
        (item, index) => Number(index) === Number(isModalInitAttrOpen.key)
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
        <Tabs
          defaultActiveKey='0'
          tabPosition={'left'}
          style={{ height: 'calc(100vh - 100px)' }}
          items={new Array(5).fill(null).map((_, i) => {
            const id = String(i)
            return {
              label: `Biểu mẫu đăng ký nghỉ phép -${id}`,
              key: id,
              disabled: i === 28,
              children: (
                <>
                  {!ticketInfo?.isFinished && <FormInitName form={form} onContinue={onContinue} />}

                  {ticketInfo?.isFinished && (
                    <>
                      <div className='tw-h-1/4'>
                        <div className='department-title  tw-text-lg tw-mt-3 tw-mb-[25px]'>
                          <span className='tw-font-semibold'>{ticketInfo.name}</span>
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
                                      {index !== 0 && (
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
                </>
              )
            }
          })}
        />
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
