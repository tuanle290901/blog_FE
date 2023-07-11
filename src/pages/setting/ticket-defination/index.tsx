/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC } from 'react'
import React, { memo, useEffect, useState } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space, Tooltip, notification } from 'antd'
import { PlusOutlined, EditOutlined, MinusOutlined, MinusCircleFilled } from '@ant-design/icons'
import Target from './component/Target'

import iconAdd from '~/assets/images/setting/add.png'
import iconHalfArrow from '~/assets/images/setting/half-arrow.png'
import {
  addDroppedItem,
  addNewApprovalStep,
  fetchDepartments,
  removeApprovalStep
} from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DragItem, DropItem } from '~/types/setting-ticket-process'
import Source from './component/Source'
import TextArea from 'antd/es/input/TextArea'
import { INPUT_TYPE } from '~/utils/Constant'
import ModalInitAttr from './component/ModalInitAttrr'
import FormInitName from './component/FormInitName'
import { TicketInitial } from './type/ItemTypes'

const Index: FC = memo(function Index() {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [initAttrForm] = Form.useForm()
  const sourceBoxes = useAppSelector((state) => state.ticketProcess.departments)
  const targetBoxes = useAppSelector((state) => state.ticketProcess.approvalSteps)

  const [ticketInfo, setTicketInfo] = useState<TicketInitial>({ name: '', description: '', isFinished: false })
  const [isModalInitAttrOpen, setIsModalInitAttrOpen] = useState<boolean>(false)

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

  const openModalInitAttr = () => {
    setIsModalInitAttrOpen(true)
  }

  const onChangeType = (value: string, index: number) => {
    const updatedForm = { ...initAttrForm.getFieldsValue() }
    updatedForm.initAttr[index].type = value
    initAttrForm.setFieldsValue(updatedForm)
  }

  const onFinishInitAttr = (initFormValues: any) => {
    setIsModalInitAttrOpen(false)
  }

  const onFinishInitAttrFail = (initFormValues: any) => {
    console.log(initFormValues, 'initFormValues')
  }

  const handleCancelModalInitAttr = () => {
    setIsModalInitAttrOpen(false)
    initAttrForm.resetFields()
  }

  const handleDrop = (item: DragItem, targetKey: string) => {
    dispatch(addDroppedItem({ targetKey, item }))
  }

  const canDropItem = () => {
    return true
  }

  const addNewStep = () => {
    dispatch(addNewApprovalStep())
  }

  const removeStep = (item: DropItem, index: number) => {
    dispatch(removeApprovalStep({ index }))
  }

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='process-container tw-p-[10px] tw-w-full tw-h-full'>
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
              <Space align='end' wrap>
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
                <div className='button-start-end' onClick={openModalInitAttr}>
                  Khởi tạo phép
                </div>
                <img src={iconHalfArrow} alt='arrow' />
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
                          />
                          <Space className='tw-mt-3'>
                            <Tooltip title={'Xóa bước xét duyệt'}>
                              <Button shape='circle' onClick={() => removeStep(item, index)}>
                                <MinusOutlined />
                              </Button>
                            </Tooltip>

                            <Tooltip title={'Cập nhật thông tin thuộc tính'}>
                              <Button shape='circle'>
                                <EditOutlined />
                              </Button>
                            </Tooltip>

                            {index === targetBoxes.length - 1 && (
                              <Tooltip title={'Thêm bước xét duyệt'}>
                                <Button shape='circle' onClick={addNewStep}>
                                  <PlusOutlined />
                                </Button>
                              </Tooltip>
                            )}
                          </Space>
                        </div>

                        {index !== targetBoxes.length - 1 && <img src={iconHalfArrow} alt='arrow' />}
                      </>
                    )
                  })}
                </div>
                <img src={iconHalfArrow} alt='arrow' />
                <div className='button-start-end'>Trạng thái cuối</div>
              </div>

              <div className='item-tartget__bottom'>
                <Space direction='vertical' size={'large'}>
                  <div>
                    <div className='tw-font-medium'>
                      * Chú thích: Kéo các thẻ tên vào các ô vuông có nét gạch đứt tương ứng với thứ tự duyệt phép của
                      từng vị trí
                    </div>
                    <div className='tw-mt-2 tw-italic'>(Bỏ trống để bỏ qua bước duyệt)</div>
                  </div>

                  <Space>
                    <Button type='primary'>Lưu cấu hình</Button>
                    <Button>Đặt lại mặc định</Button>
                  </Space>
                </Space>
              </div>
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
