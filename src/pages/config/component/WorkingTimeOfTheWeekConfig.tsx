import React, { forwardRef, ForwardRefRenderFunction, RefObject, useImperativeHandle, useRef, useState } from 'react'
import { IWorkingDayConfig } from '~/types/working-time.interface.ts'
import { Checkbox, Select, Switch, TimePicker } from 'antd'

import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Dayjs } from 'dayjs'

import { DeleteOutlined, DownOutlined, InfoCircleOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons'

export interface RefType {
  submit: () => void
}

const DayItem: ForwardRefRenderFunction<
  RefType,
  {
    config: IWorkingDayConfig
    onFinish: (data: IWorkingDayConfig) => void
    className?: string
  }
> = ({ config, onFinish, className }, ref) => {
  const [formValue, setFormValue] = useState<IWorkingDayConfig>({ ...config })
  const [isCollapse, setIsCollapse] = useState(true)
  useImperativeHandle(ref, () => ({ submit }))
  const submit = () => {
    //   TODO validate data
    onFinish(formValue)
  }
  const plainOptions = [
    {
      value: 1,
      label: 'Tuần 1'
    },
    {
      value: 2,
      label: 'Tuần 2'
    },
    {
      value: 3,
      label: 'Tuần 3'
    },
    {
      value: 4,
      label: 'Tuần 4'
    },
    {
      value: 5,
      label: 'Tuần cuối'
    }
  ]

  const handleActiveChange = (value: boolean) => {
    setFormValue((prevState) => {
      return { ...prevState, isActive: value }
    })
    if (!value && !isCollapse) {
      setIsCollapse(true)
    }
  }
  const handleToggleHeader = () => {
    if (formValue.isActive) {
      setIsCollapse((prevState) => !prevState)
    }
  }

  const handleRepeatChange = (value: number) => {
    setFormValue((prevState) => {
      let newState: IWorkingDayConfig
      if (value === 0) {
        newState = { ...prevState, always: true, weeks: [] }
      } else {
        newState = { ...prevState, always: false }
      }
      return newState
    })
  }

  const handleRepeatWeeksChange = (values: Array<CheckboxValueType>) => {
    setFormValue({ ...formValue, weeks: values as number[] })
  }

  const handleShiftChange = (value: Dayjs | null, index: number) => {
    console.log(value, index)
  }
  const addShift = () => {
    setFormValue((prevState) => {
      return { ...prevState, shifts: [...prevState.shifts, { startTimeShift: '08:30', endTimeShift: '17:30' }] }
    })
  }
  const removeShift = (index: number) => {
    if (formValue.shifts.length <= 1) {
      return
    }
    setFormValue((prevState) => {
      const shifts = [...prevState.shifts]
      shifts.splice(index)
      return { ...prevState, shifts }
    })
  }

  return (
    <div className={`${className} tw-flex tw-items-center`}>
      <div className='tw-flex-1 tw-border tw-border-solid tw-border-gray-300 tw-rounded-md tw-py-2 tw-px-4'>
        <div
          className={`${
            formValue.isActive ? 'tw-cursor-pointer' : 'tw-cursor-default'
          } tw-flex tw-gap-2 tw-items-center tw-cursor-pointer`}
          onClick={handleToggleHeader}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <Switch checked={formValue.isActive} onChange={(value) => handleActiveChange(value)} />
          </div>
          <span className='tw-font-semibold'>{formValue.day}</span>
          <div
            className={`${
              isCollapse && formValue.isActive ? 'tw-visible' : 'tw-invisible'
            } tw-flex-1 tw-flex tw-gap-4 tw-mx-6`}
          >
            {formValue.shifts.slice(0, 2).map((item, index) => {
              return (
                <span key={index}>
                  {item.startTimeShift} - {item.endTimeShift}
                </span>
              )
            })}
          </div>
          <div className={`${formValue.isActive ? 'tw-visible' : 'tw-invisible'}`}>
            {isCollapse ? <DownOutlined /> : <UpOutlined />}
          </div>
        </div>
        {!isCollapse && (
          <div className='tw-my-4'>
            <div className='tw-flex tw-gap-4 tw-items-center'>
              <p className='tw-w-24'>Lặp lại</p>
              <Select
                className='tw-w-48'
                onChange={(value) => handleRepeatChange(value)}
                defaultValue={formValue.always ? 0 : 1}
                options={[
                  { label: 'Luôn lặp lại', value: 0 },
                  {
                    label: 'Tùy chỉnh',
                    value: 1
                  }
                ]}
              />
            </div>
            {!formValue.always && (
              <div className='tw-my-2'>
                <Checkbox.Group onChange={(values) => handleRepeatWeeksChange(values)} options={plainOptions} />
              </div>
            )}
            {formValue.shifts.map((item, index) => {
              return (
                <div key={index} className='tw-flex tw-gap-4 tw-my-4 tw-items-center'>
                  <label className='tw-min-w-[96px]'>Ca {index}:</label>
                  <TimePicker
                    className='tw-w-32'
                    format='hh:mm'
                    onChange={(value) => handleShiftChange(value, index)}
                  />
                  <p>đến</p>
                  <TimePicker
                    className='tw-w-32'
                    format='hh:mm'
                    onChange={(value) => handleShiftChange(value, index)}
                  />
                  {index + 1 === formValue.shifts.length && (
                    <div className='tw-flex tw-gap-2 tw-items-center'>
                      <PlusOutlined onClick={addShift} className='tw-text-blue-600 tw-cursor-pointer' />
                      {formValue.shifts.length > 1 && (
                        <DeleteOutlined
                          onClick={() => removeShift(index)}
                          className='tw-text-red-600 tw-cursor-pointer'
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div
        className={`${
          isCollapse && formValue.always && formValue.isActive ? 'tw-visible' : 'tw-invisible'
        } tw-w-auto tw-mx-2`}
      >
        <InfoCircleOutlined className='tw-text-blue-600' />
      </div>
    </div>
  )
}
const DayConfigItem = forwardRef(DayItem)
const WeekConfig: ForwardRefRenderFunction<RefType, { weekConfig: IWorkingDayConfig[] }> = (props, ref) => {
  const [data, setData] = useState(props.weekConfig)
  const refList = useRef<any>([
    useRef<RefType>(null),
    useRef<RefType>(null),
    useRef<RefType>(null),
    useRef<RefType>(null),
    useRef<RefType>(null),
    useRef<RefType>(null),
    useRef<RefType>(null)
  ])
  useImperativeHandle(ref, () => ({ submit }))

  const handleDataChange = (data: IWorkingDayConfig) => {
    console.log(data)
  }

  const submit = () => {
    refList.current.forEach((ref: RefObject<RefType>) => {
      ref.current?.submit()
    })
  }

  return (
    <div>
      {data.map((item, index) => {
        return (
          <DayConfigItem
            ref={refList.current[index]}
            key={index}
            className='tw-w-full tw-my-2'
            config={item}
            onFinish={handleDataChange}
          />
        )
      })}
    </div>
  )
}
export default forwardRef(WeekConfig)
