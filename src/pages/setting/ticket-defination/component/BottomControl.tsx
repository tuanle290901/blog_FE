import { Button, Space } from 'antd'
import { FC } from 'react'

const BottomControl: FC = () => {
  return (
    <div className='item-tartget__bottom'>
      <Space direction='vertical' size={'large'}>
        <div>
          <div className='tw-font-medium'>
            * Chú thích: Kéo các thẻ tên vào các ô vuông có nét gạch đứt tương ứng với thứ tự duyệt phép của từng vị trí
          </div>
          <div className='tw-mt-2 tw-italic'>(Bỏ trống để bỏ qua bước duyệt)</div>
        </div>

        <Space>
          <Button type='primary'>Lưu cấu hình</Button>
          <Button>Đặt lại mặc định</Button>
        </Space>
      </Space>
    </div>
  )
}

export default BottomControl
