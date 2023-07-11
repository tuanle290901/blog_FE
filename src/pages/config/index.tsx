import React from 'react'
import { Tabs } from 'antd'
import './index.scss'
import CommonHoliday from './component/CommonHoliday.tsx'
import CommonTimeConfig from '~/pages/config/component/CommonTimeConfig.tsx'

const { TabPane } = Tabs

const Index: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items = [
    {
      key: '1',
      label: 'Cài đặt chung',
      children: <CommonTimeConfig />
    },
    {
      key: '2',
      label: 'Ngày nghỉ',
      children: <CommonHoliday />
    }
  ]

  return (
    <div className='tw-h-[calc(100%-48px)] tw-m-6 tw-p-5 tw-bg-white'>
      <div className='tw-my-2'>
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
