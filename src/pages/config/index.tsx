import React from 'react'
import { Tabs } from 'antd'
import './index.scss'
import CommonTime from './component/CommonTime.tsx'
import CommonHoliday from './component/CommonHoliday.tsx'

const { TabPane } = Tabs

const Index: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items = [
    {
      key: '1',
      label: 'Cài đặt chung',
      children: <CommonTime />
    },
    {
      key: '2',
      label: 'Ngày nghỉ',
      children: <CommonHoliday />
    }
  ]

  return (
    <div className='configure-working-time tw-p-[10px] tw-w-full tw-h-full'>
      <div className='header'>
        <h1>Cấu hình thời gian làm việc</h1>
        <p>Tùy chỉnh thời gian làm việc chung áp dụng cho tất cả các thành viên nếu không có yêu cầu thay đổi</p>
      </div>
      <div className='content'>
        <Tabs defaultActiveKey='1' onChange={onChange}>
          {items.map((item) => (
            <TabPane tab={item.label} key={item.key}>
              {item.children}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default Index
