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
    <div className='tw-h-[calc(100vh-112px)] tw-overflow-auto tw-m-6 tw-p-5 tw-bg-white'>
      <CommonTimeConfig />
    </div>
  )
}

export default Index
