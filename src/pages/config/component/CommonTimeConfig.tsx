import React, { useMemo, useRef, useState } from 'react'
import '../index.scss'
import WorkingTimeOfTheWeekConfig, { RefType } from '~/pages/config/component/WorkingTimeOfTheWeekConfig.tsx'
import { Button, InputNumber, Tabs, TimePicker } from 'antd'
import { DEFAULT_CONFIG, IWorkingTimeConfig } from '~/types/working-time.interface.ts'
import dayjs from 'dayjs'
type TargetKey = React.MouseEvent | React.KeyboardEvent | string
const TabItem = () => {
  const ref = useRef<RefType>(null)
  const [config, setConfig] = useState<IWorkingTimeConfig>({ ...DEFAULT_CONFIG })
  const save = () => {
    ref.current?.submit()
  }
  return (
    <div className='tw-px-4 tw-py-4 tw-border tw-border-t-0 tw-border-[#eee] tw-border-solid'>
      <div className='tw-h-[calc(100vh-350px)] tw-overflow-auto'>
        <div className='tw-flex'>
          <div className='tw-w-1/5'>
            <span className='tw-font-semibold'>Các mốc thời gian</span>
          </div>
          <div className='tw-flex-1'>
            <div className='tw-flex tw-items-center tw-gap-2 tw-mb-4'>
              <div className='tw-w-56'>
                <p>Ngày chốt công</p>
              </div>
              <span>Từ</span>
              <InputNumber
                value={config.common.startPayrollCutoffDay.day}
                className='tw-w-14'
                defaultValue={1}
                min={1}
                max={31}
              />
              <span>Đến</span>
              <InputNumber
                value={config.common.endPayrollCutoffDay.day}
                className='tw-w-14'
                defaultValue={5}
                min={1}
                max={31}
              />
              <span>Hàng tháng</span>
            </div>
            <div className='tw-flex tw-items-center tw-gap-8 tw-my-4'>
              <div className='tw-w-56'>
                <p>Số ngày nghỉ phép mặc định</p>
              </div>
              <InputNumber value={config.common.defaultLeaveDay} className='tw-w-14' defaultValue={12} min={1} />
            </div>
            <div className='tw-flex tw-items-center tw-gap-8 tw-my-4'>
              <div className='tw-w-56'>
                <p>Thời gian nghỉ bù có hiệu lực</p>
              </div>
              <InputNumber
                value={config.common.affectCompensatoryInMonth}
                className='tw-w-14'
                defaultValue={3}
                min={1}
              />
            </div>
            <div className='tw-flex tw-items-center tw-gap-2 tw-my-4'>
              <div className='tw-w-56'>
                <p>Khoảng thời gian làm thêm(OT)</p>
              </div>
              <span>Từ</span>
              <TimePicker
                value={
                  config.common.overTimeSetting.startTime
                    ? dayjs(config.common.overTimeSetting.startTime, 'HH:mm')
                    : null
                }
                format='HH:mm'
                className='tw-w-32'
              />
              <span>Đến</span>
              <TimePicker
                value={
                  config.common.overTimeSetting.endTime ? dayjs(config.common.overTimeSetting.endTime, 'HH:mm') : null
                }
                format='HH:mm'
                className='tw-w-32'
              />
              <span>Hàng ngày</span>
            </div>
          </div>
        </div>
        <div className='tw-flex'>
          <div className='tw-w-1/5'>
            <span className='tw-font-semibold'>Thời gian làm việc</span>
          </div>
          <div className='tw-w-2/5'>
            <WorkingTimeOfTheWeekConfig weekConfig={config.workingDailySetups} ref={ref} />
          </div>
        </div>
      </div>
      <div className='tw-flex tw-gap-4 tw-justify-end tw-mt-4'>
        <Button>Đặt lại thông số</Button>
        <Button type='primary' onClick={save}>
          Lưu cấu hình
        </Button>
      </div>
    </div>
  )
}

const CommonTimeConfig: React.FC = () => {
  const initialItems = [{ label: 'Cấu hình chung', children: <TabItem />, key: '1', closable: false }]
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  const newTabIndex = useRef(0)
  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey)
  }

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`
    const newPanes = [...items]
    newPanes.push({ label: 'New Tab', children: <TabItem />, key: newActiveKey, closable: false })
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey
    let lastIndex = -1
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = items.filter((item) => item.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add()
    } else {
      remove(targetKey)
    }
  }

  return (
    <div className='working-time-config  tw-h-[calc(100vh-112px)] tw-overflow-auto tw-m-6 tw-p-5 tw-bg-white'>
      <div className='tw-mb-2'>
        <h1 className='tw-text-3xl tw-font-semibold tw-mb-2'>Cấu hình thời gian làm việc</h1>
        <p>Tùy chỉnh thời gian làm việc chung áp dụng cho tất cả các thành viên nếu không có thay đổi</p>
      </div>
      <div className='tw-mt-4'>
        <Tabs type='editable-card' onChange={onChange} activeKey={activeKey} onEdit={onEdit} items={items} />
      </div>
    </div>
  )
}
export default CommonTimeConfig
