import type { FC } from 'react'
import React, { memo, useEffect, useRef } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Button, Space } from 'antd'
import Target from './Target'

import iconAdd from '~/assets/images/setting/add.png'
import iconHalfArrow from '~/assets/images/setting/half-arrow.png'
import { addDroppedItem, fetchDepartments } from '~/stores/features/setting/request-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DropItem } from '~/types/setting-request-process'
import { SETTING } from '~/utils/Constant'
import Source from './Source'

const Index: FC = memo(function Index() {
  const dispatch = useAppDispatch()
  const droppedItems = useAppSelector((state) => state.requestProcess.droppedItems)
  const sourceBoxes = useAppSelector((state) => state.requestProcess.departments)
  const targetBoxsRef = useRef([
    {
      key: SETTING.REQUEST_PROCESS.REQUEST_ONE,
      title: 'Duyệt lần 1'
    },
    {
      key: SETTING.REQUEST_PROCESS.REQUEST_TWO,
      title: 'Duyệt lần 2'
    },
    {
      key: SETTING.REQUEST_PROCESS.REQUEST_THREE,
      title: 'Duyệt lần 3'
    }
  ])

  const handleDrop = (item: DropItem, targetKey: string) => {
    dispatch(addDroppedItem({ targetKey, item }))
  }

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [])

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
            {targetBoxsRef.current.map((item, index) => {
              return (
                <>
                  <div className='tw-flex tw-flex-col tw-items-center tw-justify-center' key={index}>
                    <div className='tw-mb-3'>{item.title}</div>
                    <Target key={item.key} targetKey={item.key} onDrop={handleDrop} dropItem={droppedItems[item.key]} />
                  </div>
                  <img src={iconHalfArrow} alt='arrow' />
                </>
              )
            })}
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
