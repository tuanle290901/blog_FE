import React, { useEffect, useRef, useState } from 'react'
import '../index.scss'
import WorkingTimeOfTheWeekConfig, { RefType } from '~/pages/config/component/WorkingTimeOfTheWeekConfig.tsx'
import { Button, Form, InputNumber, notification, Tabs, TimePicker } from 'antd'
import {
  DEFAULT_CONFIG,
  ICommonConfig,
  IWorkingDailySetup,
  IWorkingTimeConfig
} from '~/types/working-time.interface.ts'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import dayjs, { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import {
  createWorkingTime,
  getAllWorkingTimeSetting
} from '~/stores/features/working-time-config/working-time-config.slice.ts'
import SelectGroupModal from '~/pages/config/component/select-group-modal.tsx'
import { getAllGroup } from '~/stores/features/master-data/master-data.slice.ts'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string
const TabItem: React.FC<{ groupCode: string | null; id?: string; data?: IWorkingTimeConfig }> = ({
  groupCode,
  id,
  data
}) => {
  const [disabled, setDisabled] = useState(!!id)
  const ref = useRef<RefType>(null)
  const [config, setConfig] = useState<IWorkingTimeConfig>(() => {
    if (data) {
      let workingDailySetups = [...DEFAULT_CONFIG.workingDailySetups]
      workingDailySetups = workingDailySetups.map((item) => {
        const foundData = data.workingDailySetups.find((day) => day.dayOfWeek === item.dayOfWeek)
        if (foundData) {
          return { ...foundData, isActive: true }
        }
        return {
          startTime: item.startTime,
          endTime: item.endTime,
          always: item.always,
          dayOfWeek: item.dayOfWeek,
          weekIndexInMonth: item.weekIndexInMonth,
          isActive: false
        }
      })
      return {
        ...data,
        workingDailySetups
      }
    } else {
      return { ...DEFAULT_CONFIG }
    }
  })
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
  const dispatch = useAppDispatch()
  const save = async () => {
    const formValue = form.getFieldsValue()
    const common: ICommonConfig = {
      overTimeSetting: {
        startTime: formValue.overTimeSetting.startTime ? formValue.overTimeSetting.startTime.format('HH:mm') : null,
        endTime: formValue.overTimeSetting.endTime ? formValue.overTimeSetting.endTime.format('HH:mm') : null
      },
      endPayrollCutoffDay: {
        day: formValue.endPayrollCutoffDay.day,
        monthType: 'FOR_THIS_MONTH'
      },
      startPayrollCutoffDay: {
        day: formValue.startPayrollCutoffDay.day,
        monthType: 'FOR_THIS_MONTH'
      },
      affectCompensatoryInMonth: formValue.affectCompensatoryInMonth,
      defaultLeaveDay: formValue.defaultLeaveDay
    }
    const workingDailySetups = config.workingDailySetups.filter((item) => item.isActive)
    const payload: IWorkingTimeConfig = { common, workingDailySetups, groupCode }
    try {
      await dispatch(createWorkingTime(payload)).unwrap()
      notification.success({ message: 'Cấu hình thời gian làm việc thành công' })
      setDisabled(true)
    } catch (e) {
      console.log(e)
    }
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
  }, [config])

  const handleDataChange = (data: IWorkingDailySetup[]) => {
    const workingDailySetups = data.map((item) => {
      const newItem = { ...item }
      if (newItem.endTime && newItem.endTime instanceof dayjs) {
        newItem.endTime = newItem.endTime.format('HH:mm')
      }
      if (newItem.startTime && newItem.startTime instanceof dayjs) {
        newItem.startTime = newItem.startTime.format('HH:mm')
      }
      return newItem
    })
    setConfig((prevState) => {
      return { ...prevState, workingDailySetups }
    })
  }
  // const resetForm = () => {
  //   setConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)))
  // }

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
                  <InputNumber disabled={disabled} className='tw-w-14' min={1} max={31} />
                </FormItem>

                <p className='tw-mt-1.5'>Đến</p>
                <FormItem name={['endPayrollCutoffDay', 'day']}>
                  <InputNumber disabled={disabled} className='tw-w-14' min={1} max={31} />
                </FormItem>
                <p className='tw-mt-1.5'>Hàng tháng</p>
              </div>
              <div className='tw-flex tw-gap-8 tw-my-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Số ngày nghỉ phép mặc định</p>
                </div>
                <FormItem name={'defaultLeaveDay'}>
                  <InputNumber disabled={disabled} value={config.common.defaultLeaveDay} className='tw-w-14' min={1} />
                </FormItem>
              </div>
              <div className='tw-flex tw-gap-8 tw-my-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Thời gian nghỉ bù có hiệu lực</p>
                </div>
                <FormItem name={'affectCompensatoryInMonth'}>
                  <InputNumber disabled={disabled} className='tw-w-14' min={1} />
                </FormItem>
              </div>
              <div className='tw-flex tw-gap-2 tw-my-4'>
                <div className='tw-w-56 tw-mt-1.5'>
                  <p>Khoảng thời gian làm thêm(OT)</p>
                </div>
                <p className='tw-mt-1.5'>Từ</p>
                <FormItem name={['overTimeSetting', 'startTime']}>
                  <TimePicker disabled={disabled} format='HH:mm' className='tw-w-32' />
                </FormItem>

                <p className='tw-mt-1.5'>Đến</p>
                <FormItem name={['overTimeSetting', 'endTime']}>
                  <TimePicker disabled={disabled} format='HH:mm' className='tw-w-32' />
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
            <WorkingTimeOfTheWeekConfig
              disabled={disabled}
              onChange={handleDataChange}
              weekConfig={config.workingDailySetups}
              ref={ref}
            />
          </div>
        </div>
      </div>
      {!disabled && (
        <div className='tw-flex tw-gap-4 tw-justify-end tw-mt-4'>
          {/*<Button onClick={resetForm}>Đặt lại thông số</Button>*/}
          <Button type='primary' onClick={save}>
            Lưu cấu hình
          </Button>
        </div>
      )}
    </div>
  )
}

const CommonTimeConfig: React.FC = () => {
  const [activeKey, setActiveKey] = useState('0')
  const [items, setItems] = useState<any[]>([])
  const [openModal, setOpenModal] = useState(false)
  const dispatch = useAppDispatch()
  const listWKTC = useAppSelector((state) => state.workingTime.listWKTC)
  const groups = useAppSelector((state) => state.masterData.groups)
  useEffect(() => {
    const promise1 = dispatch(getAllWorkingTimeSetting())
    const promise2 = dispatch(getAllGroup())
    return () => {
      promise1.abort()
      promise2.abort()
    }
  }, [])
  const onChange = (activeKey: string) => {
    setActiveKey(activeKey)
  }

  useEffect(() => {
    const listTabPanel = listWKTC.map((item, index) => {
      const groupName = groups.find((group) => item.groupCode === group.code)
      return {
        label: groupName?.name || 'Cấu hình chung',
        children: <TabItem groupCode={item.groupCode} id={item.id} data={item} />,
        key: item.groupCode || '0',
        closable: false
      }
    })
    if (listTabPanel.length === 0) {
      listTabPanel.push({
        label: 'Cấu hình chung',
        children: <TabItem groupCode={null} />,
        key: '0',
        closable: false
      })
    }
    setItems(listTabPanel)
    setActiveKey(listTabPanel[0].key)
  }, [listWKTC, groups])
  const add = (code: string, name: string) => {
    setOpenModal(false)
    const newPanes = [...items]
    newPanes.push({ label: name, children: <TabItem groupCode={code} />, key: code, closable: false })
    setItems(newPanes)
    setActiveKey(code)
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
      setOpenModal(true)
    } else {
      remove(targetKey)
    }
  }
  const handleAddConfigForGroup = (group?: { code: string; name: string }) => {
    if (group) {
      add(group.code, group.name)
    }
    setOpenModal(false)
  }

  return (
    <div className='working-time-config  tw-h-[calc(100vh-112px)] tw-overflow-auto tw-m-6 tw-p-5 tw-bg-white'>
      <SelectGroupModal
        ignoreGroupCode={items.map((item) => item.key)}
        open={openModal}
        handleClose={handleAddConfigForGroup}
      />
      <div className='tw-mb-2'>
        <h1 className='tw-text-2xl tw-font-semibold tw-mb-2'>Cấu hình thời gian làm việc</h1>
        <p>Tùy chỉnh thời gian làm việc chung áp dụng cho tất cả các thành viên nếu không có thay đổi</p>
      </div>
      <div className='tw-mt-4'>
        <Tabs type='card' onChange={onChange} activeKey={activeKey} onEdit={onEdit} items={items} />
      </div>
    </div>
  )
}
export default CommonTimeConfig
