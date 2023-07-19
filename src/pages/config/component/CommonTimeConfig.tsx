import React, { useEffect, useRef, useState } from 'react'
import '../index.scss'
import WorkingTimeOfTheWeekConfig, { RefType } from '~/pages/config/component/WorkingTimeOfTheWeekConfig.tsx'
import { Button, Form, InputNumber, Tabs, TimePicker } from 'antd'
import { DEFAULT_CONFIG, ICommonConfig, IWorkingTimeConfig } from '~/types/working-time.interface.ts'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import dayjs, { Dayjs } from 'dayjs'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string
const TabItem = () => {
  const ref = useRef<RefType>(null)
  const [config, setConfig] = useState<IWorkingTimeConfig>({ ...DEFAULT_CONFIG })
  const [form] = useForm<
    Omit<ICommonConfig, 'overTimeSetting' | 'endPayrollCutoffDay' | 'startPayrollCutoffDay'> & {
      endPayrollCutoffDay: { day: number }
      startPayrollCutoffDay: { day: number }
      overTimeSetting: {
        startTime: Dayjs | null
        endTime: Dayjs | null
      }
    }
  >()
  const save = () => {
    ref.current?.submit()
  }
  useEffect(() => {
    form.setFieldsValue({
      defaultLeaveDay: config.common.defaultLeaveDay,
      affectCompensatoryInMonth: config.common.affectCompensatoryInMonth,
      endPayrollCutoffDay: { day: config.common.endPayrollCutoffDay.day },
      startPayrollCutoffDay: { day: config.common.startPayrollCutoffDay.day },
      overTimeSetting: {
        startTime: config.common.overTimeSetting.startTime
          ? dayjs(config.common.overTimeSetting.startTime, 'HH:mm')
          : null,
        endTime: config.common.overTimeSetting.endTime ? dayjs(config.common.overTimeSetting.endTime, 'HH:mm') : null
      }
    })
    console.log({
      defaultLeaveDay: config.common.defaultLeaveDay,
      affectCompensatoryInMonth: config.common.affectCompensatoryInMonth,
      endPayrollCutoffDay: { day: config.common.endPayrollCutoffDay.day },
      startPayrollCutoffDay: { day: config.common.startPayrollCutoffDay.day },
      overTimeSetting: {
        startTime: config.common.overTimeSetting.startTime
          ? dayjs(config.common.overTimeSetting.startTime, 'HH:mm')
          : null,
        endTime: config.common.overTimeSetting.endTime ? dayjs(config.common.overTimeSetting.endTime, 'HH:mm') : null
      }
    })
  }, [config])
  return (
    <div className='tw-px-4 tw-py-4 tw-border tw-border-t-0 tw-border-[#eee] tw-border-solid'>
      <div className='tw-h-[calc(100vh-350px)] tw-overflow-auto'>
        <div className='tw-flex'>
          <div className='tw-w-1/5'>
            <span className='tw-font-semibold'>Các mốc thời gian</span>
          </div>
          <div className='tw-flex-1'>
            <Form form={form}>
              <div className='tw-flex tw-gap-2 tw-mb-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Ngày chốt công</p>
                </div>
                <p className='tw-mt-1.5'>Từ</p>
                <FormItem name={['startPayrollCutoffDay', 'day']}>
                  <InputNumber className='tw-w-14' min={1} max={31} />
                </FormItem>

                <p className='tw-mt-1.5'>Đến</p>
                <FormItem name={['endPayrollCutoffDay', 'day']}>
                  <InputNumber className='tw-w-14' min={1} max={31} />
                </FormItem>
                <p className='tw-mt-1.5'>Hàng tháng</p>
              </div>
              <div className='tw-flex tw-gap-8 tw-my-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Số ngày nghỉ phép mặc định</p>
                </div>
                <FormItem name={'defaultLeaveDay'}>
                  <InputNumber value={config.common.defaultLeaveDay} className='tw-w-14' min={1} />
                </FormItem>
              </div>
              <div className='tw-flex tw-gap-8 tw-my-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Thời gian nghỉ bù có hiệu lực</p>
                </div>
                <FormItem name={'affectCompensatoryInMonth'}>
                  <InputNumber className='tw-w-14' min={1} />
                </FormItem>
              </div>
              <div className='tw-flex tw-gap-2 tw-my-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Khoảng thời gian làm thêm(OT)</p>
                </div>
                <p className='tw-mt-1.5'>Từ</p>
                <FormItem name={['overTimeSetting', 'startTime']}>
                  <TimePicker format='HH:mm' className='tw-w-32' />
                </FormItem>

                <p className='tw-mt-1.5'>Đến</p>
                <FormItem name={['overTimeSetting', 'endTime']}>
                  <TimePicker format='HH:mm' className='tw-w-32' />
                </FormItem>
                <p className='tw-mt-1.5'>Hàng ngày</p>
              </div>
            </Form>
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
