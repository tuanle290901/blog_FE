import type { FC } from 'react'
import React, { memo, useEffect } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Button, Space, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons'
import Target from './Target'

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
import Source from './Source'

const Index: FC = memo(function Index() {
  const dispatch = useAppDispatch()
  const sourceBoxes = useAppSelector((state) => state.ticketProcess.departments)
  const targetBoxes = useAppSelector((state) => state.ticketProcess.approvalSteps)

  const handleDrop = (item: DragItem, targetKey: string) => {
    dispatch(addDroppedItem({ targetKey, item }))
  }

  const canDropItem = () => {
    return true
  }

  const addNewStep = (item: DropItem, index: number) => {
    dispatch(addNewApprovalStep({ index }))
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
        <div className='tw-h-1/4'>
          <div className='department-title tw-font-semibold tw-text-xl tw-mt-3 tw-mb-3'>Quy trình khởi tạo phép</div>
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
            <div className='button-start-end'>Khởi tạo phép</div>
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
                      <div className='tw-mb-3'>{item.title}</div>
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

                        <Tooltip title={'Thêm bước xét duyệt'}>
                          <Button shape='circle' onClick={() => addNewStep(item, index)}>
                            <PlusOutlined />
                          </Button>
                        </Tooltip>
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
                  * Chú thích: Kéo các thẻ tên vào các ô vuông có nét gạch đứt tương ứng với thứ tự duyệt phép của từng
                  vị trí
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
      </div>
    </DndProvider>
  )
})

export default Index
