import type { FC } from 'react'
import { memo, useState } from 'react'

import { Box } from './Box'
import { DropItem, Dustbin } from './Dustbin'
import { Button, Space } from 'antd'

import iconAdd from '~/assets/images/setting/add.png'
import iconHalfArrow from '~/assets/images/setting/half-arrow.png'

export const Container: FC = memo(function Container() {
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: DropItem[] }>({
    step1: [],
    step2: [],
    step3: []
  })

  const handleDrop = (item: DropItem, dustbinKey: string) => {
    setDroppedItems((prevItems) => {
      if (prevItems[dustbinKey].includes(item)) {
        return { ...prevItems, dustbinKey: [...prevItems[dustbinKey]] }
      }
      return {
        ...prevItems,
        [dustbinKey]: [...prevItems[dustbinKey], item]
      }
    })
  }

  return (
    <div className='process-container tw-p-[10px] tw-w-full tw-h-full'>
      <div className='tw-h-1/4'>
        <Space align='end' wrap>
          <Box id='box1' name='Glass' />
          <Box id='box2' name='Banana33333333333333333333333' />
          <Box id='box3' name='Paper' />
          <img src={iconAdd} alt='add-department' />
        </Space>
      </div>

      <div className='list-item-target tw-h-3/4'>
        <div className='item-tartget__top'>
          <div className='button-start-end'>Khởi tạo phép</div>
          <img src={iconHalfArrow} alt='arrow' />
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center'>
            <div className='tw-mb-3'>Duyệt lần 1</div>
            <Dustbin dustbinKey='step1' onDrop={handleDrop} dropItem={droppedItems['step1']} />
          </div>
          <img src={iconHalfArrow} alt='arrow' />
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center'>
            <div className='tw-mb-3'>Duyệt lần 2</div>
            <Dustbin dustbinKey='step2' onDrop={handleDrop} dropItem={droppedItems['step2']} />
          </div>

          <img src={iconHalfArrow} alt='arrow' />
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center'>
            <div className='tw-mb-3'>Duyệt lần 3</div>
            <Dustbin dustbinKey='step3' onDrop={handleDrop} dropItem={droppedItems['step3']} />
          </div>

          <img src={iconHalfArrow} alt='arrow' />
          <div className='button-start-end'>Trạng thái cuối</div>
        </div>

        <div className='item-tartget__bottom'>
          <Space direction='vertical' size={'large'}>
            <div>
              <div className='tw-font-medium'>
                * Chú thích: Kéo các thẻ tên vào các ô vuông có nét gạch đứt tương ứng với thứ tự duyệt phép của từng vị
                trí
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
  )
})
