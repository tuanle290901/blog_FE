/* eslint-disable prettier/prettier */
import { DeleteOutlined, DownOutlined, InfoCircleOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Col, InputNumber, Row, Select, Switch, TimePicker } from 'antd'
import React, { useEffect, useState } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

type WorkingDay = {
  [key: string]: {
    always: boolean
    weeks: number[]
    optionExtend: boolean
    shifts: {
      startTimeShift: string
      endTimeShift: string
    }[]
  } | null
}

type WorkingData = {
  id: string
  groupCode: string
  affectCompensatoryInMonth: number
  startPayrollCutoffDay: number
  endPayrollCutoffDay: number
  defaultLeaveDay: number
  workOT: {
    startTimeOT: string
    endTimeOT: string
  }
  workingDays: {
    workDays: WorkingDay
  }[]
}

function CommonTime() {
  const [workingTimeTogether, setWorkingTimeTogether] = useState<WorkingData>()

  const dataApi = {
    id: 'working-time-id',
    groupCode: 'group-code',
    affectCompensatoryInMonth: 3,
    startPayrollCutoffDay: 1,
    endPayrollCutoffDay: 5,
    defaultLeaveDay: 12,
    workOT: {
      startTimeOT: '17:30',
      endTimeOT: '22:30'
    },
    workingDays: [
      {
        workDays: {
          MONDAY: {
            always: true,
            weeks: [],
            optionExtend: false,
            shifts: [
              {
                startTimeShift: '08:30',
                endTimeShift: '12:00'
              },
              {
                startTimeShift: '13:00',
                endTimeShift: '17:30'
              }
            ]
          },
          TUESDAY: {
            always: false,
            weeks: [1, 2],
            shifts: [
              {
                startTimeShift: '08:30',
                endTimeShift: '12:00'
              },
              {
                startTimeShift: '13:00',
                endTimeShift: '17:30'
              }
            ]
          },
          WEDNESDAY: {
            always: false,
            weeks: [2, 4],
            shifts: [
              {
                startTimeShift: '08:30',
                endTimeShift: '12:00'
              },
              {
                startTimeShift: '13:00',
                endTimeShift: '17:30'
              }
            ]
          },
          THURSDAY: {
            always: false,
            weeks: [3],
            shifts: [
              {
                startTimeShift: '08:30',
                endTimeShift: '12:00'
              },
              {
                startTimeShift: '13:00',
                endTimeShift: '17:30'
              }
            ]
          },
          FRIDAY: {
            always: true,
            weeks: [],
            shifts: [
              {
                startTimeShift: '08:30',
                endTimeShift: '12:00'
              },
              {
                startTimeShift: '13:00',
                endTimeShift: '17:30'
              }
            ]
          },
          SATURDAY: null,
          SUNDAY: null
        }
      }
    ]
  }
  useEffect(() => {
    const updatedData: WorkingData = {
      ...dataApi,
      workingDays: dataApi.workingDays.map((item) => ({
        ...item,
        workDays: Object.fromEntries(
          Object.entries(item.workDays).map(([day, values]) => {
            if (values !== null) {
              return [day, { ...values, optionExtend: false }]
            }
            return [day, values]
          })
        ) as WorkingDay
      }))
    }
    console.log(updatedData)
    setWorkingTimeTogether(updatedData)
  }, [])

  const onAddShiftToWorkingTimeTogether = <T extends keyof WorkingDay>(day: T) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const updatedShifts = [
            ...currentDay.shifts,
            {
              startTimeShift: '08:30',
              endTimeShift: '12:00'
            }
          ]

          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: {
                  ...currentDay,
                  shifts: updatedShifts
                }
              }
            }
          ]

          return {
            ...(prevState || {}),
            workingDays: updatedWorkingDays
          } as WorkingData
        }
      }

      return prevState
    })
  }

  const onRemoveShiftToWorkingTimeTogether = <T extends keyof WorkingDay>(day: T) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const updatedShifts = [...currentDay.shifts]
          updatedShifts.pop() // Xóa phần tử cuối cùng

          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: {
                  ...currentDay,
                  shifts: updatedShifts
                }
              }
            }
          ]

          return {
            ...prevState,
            workingDays: updatedWorkingDays
          }
        }
      }

      return prevState
    })
  }

  const onSetOptionExtendWorkingTimeTogether = <T extends keyof WorkingDay>(day: T) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const updatedOptionExtend = !currentDay.optionExtend

          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: {
                  ...currentDay,
                  optionExtend: updatedOptionExtend
                }
              }
            }
          ]

          return {
            ...prevState,
            workingDays: updatedWorkingDays
          }
        }
      }

      return prevState
    })
  }

  const onOpenorCloseConfigTime = <T extends keyof WorkingDay>(day: T) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: null
              }
            }
          ]

          return {
            ...prevState,
            workingDays: updatedWorkingDays
          }
        } else {
          const defaultConfig = {
            always: true,
            weeks: [],
            optionExtend: false,
            shifts: [
              {
                startTimeShift: '08:30',
                endTimeShift: '12:00'
              },
              {
                startTimeShift: '13:00',
                endTimeShift: '17:30'
              }
            ]
          }
          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: defaultConfig
              }
            }
          ]
          return {
            ...prevState,
            workingDays: updatedWorkingDays
          }
        }
      }

      return prevState
    })
  }

  const onChangeOptionRepeatConfigTime = <T extends keyof WorkingDay>(value: string, day: T) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const updatedDay = {
            ...currentDay,
            always: value !== 'custom',
            weeks: value !== 'custom' ? [] : currentDay.weeks
          }

          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: updatedDay
              }
            }
          ]

          return {
            ...prevState,
            workingDays: updatedWorkingDays
          }
        }
      }

      return prevState
    })
  }

  const setDateCustomRepeat = <T extends keyof WorkingDay>(day: T, week: number) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const existingWeekIndex = currentDay.weeks.indexOf(week)

          if (existingWeekIndex !== -1) {
            // Đã tồn tại trong weeks, xóa week
            const updatedWeeks = [...currentDay.weeks]
            updatedWeeks.splice(existingWeekIndex, 1)

            const updatedWorkingDays = [
              {
                ...prevState.workingDays[0],
                workDays: {
                  ...prevState.workingDays[0].workDays,
                  [day]: {
                    ...currentDay,
                    weeks: updatedWeeks
                  }
                }
              }
            ]

            return {
              ...prevState,
              workingDays: updatedWorkingDays
            }
          } else {
            // Chưa tồn tại trong weeks, thêm week
            const updatedWeeks = [...currentDay.weeks, week]

            const updatedWorkingDays = [
              {
                ...prevState.workingDays[0],
                workDays: {
                  ...prevState.workingDays[0].workDays,
                  [day]: {
                    ...currentDay,
                    weeks: updatedWeeks
                  }
                }
              }
            ]

            return {
              ...prevState,
              workingDays: updatedWorkingDays
            }
          }
        }
      }

      return prevState
    })
  }

  const onChange = (value: number | null) => {
    console.log('changed', value)
  }

  const onChangeConfigTimeMonday = (value: number | string) => {
    console.log(value)
  }

  const handleShiftChange = <T extends keyof WorkingDay>(
    day: T,
    index: number,
    time: Dayjs,
    configTime: 'start' | 'end'
  ) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState) {
        const currentDay = prevState.workingDays[0].workDays[day]

        if (currentDay) {
          const updatedShifts = [...currentDay.shifts]
          const shiftToUpdate = updatedShifts[index]

          if (configTime === 'start') {
            shiftToUpdate.startTimeShift = time.format('HH:mm')
          } else if (configTime === 'end') {
            shiftToUpdate.endTimeShift = time.format('HH:mm')
          }

          const updatedWorkingDays = [
            {
              ...prevState.workingDays[0],
              workDays: {
                ...prevState.workingDays[0].workDays,
                [day]: {
                  ...currentDay,
                  shifts: updatedShifts
                }
              }
            }
          ]

          return {
            ...prevState,
            workingDays: updatedWorkingDays
          }
        }
      }

      return prevState
    })
  }

  useEffect(() => {
    console.log(workingTimeTogether)
  }, [workingTimeTogether])

  return (
    <div className='common-time'>
      <div className='common-time common-time-content'>
        <div className='timelines'>
          <div className='layble-page-time'>
            <p>Các mốc thời gian</p>
          </div>
          <div>
            <div className='monthly-closing-date'>
              <p>Ngày chốt công</p>
              Từ <InputNumber min={1} max={30} defaultValue={dataApi?.startPayrollCutoffDay} onChange={onChange} />
              đến <InputNumber min={1} max={30} defaultValue={dataApi?.endPayrollCutoffDay} onChange={onChange} />
              hàng tháng
            </div>
            <div className='monthly-closing-date monthly-closing-date-default'>
              <p>Số ngày nghỉ phép mặc định </p>
              <InputNumber min={1} max={30} defaultValue={dataApi.defaultLeaveDay} onChange={onChange} />
              ngày
            </div>
            <div className='monthly-closing-date monthly-closing-date-default'>
              <p>Thời gian nghỉ bù có hiệu lực</p>
              <InputNumber min={1} max={12} defaultValue={dataApi.affectCompensatoryInMonth} onChange={onChange} />
              tháng
            </div>
            <div className='monthly-closing-date'>
              <p>Khoảng thời gian làm thêm (OT)</p>
              Từ <TimePicker defaultValue={dayjs('17:30', 'HH:mm')} />
              đến <TimePicker defaultValue={dayjs('22:30', 'HH:mm')} />
              hàng ngày
            </div>
          </div>
        </div>
        <div className='working-time-together'>
          <div className='layble-page-time'>
            <p>Thời gian làm việc chung</p>
          </div>
          <div className='list-day-working'>
            {/* Thứ 2 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.MONDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.MONDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('MONDAY')}
                    />
                    Thứ 2
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.MONDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.MONDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {workingTimeTogether?.workingDays[0]?.workDays.MONDAY?.shifts[index].startTimeShift} -{' '}
                                  {workingTimeTogether?.workingDays[0]?.workDays.MONDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('MONDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.MONDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.MONDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.MONDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('MONDAY')}
                  />
                  Thứ 2
                </div>
                {workingTimeTogether?.workingDays[0].workDays.MONDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.MONDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'MONDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.MONDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.MONDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('MONDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.MONDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('MONDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.MONDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('MONDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.MONDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('MONDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.MONDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('MONDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.MONDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('MONDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.MONDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('MONDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('MONDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('MONDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('MONDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.MONDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('MONDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ 3 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.TUESDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.TUESDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('TUESDAY')}
                    />
                    Thứ 3
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.TUESDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.TUESDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {workingTimeTogether?.workingDays[0]?.workDays.TUESDAY?.shifts[index].startTimeShift}{' '}
                                  - {workingTimeTogether?.workingDays[0]?.workDays.TUESDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('TUESDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.TUESDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.TUESDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.TUESDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('TUESDAY')}
                  />
                  Thứ 3
                </div>
                {workingTimeTogether?.workingDays[0].workDays.TUESDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.TUESDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'TUESDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.TUESDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.TUESDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('TUESDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.TUESDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('TUESDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.TUESDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('TUESDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.TUESDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('TUESDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.TUESDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('TUESDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.TUESDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('TUESDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.TUESDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('TUESDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('TUESDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('TUESDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('TUESDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.TUESDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('TUESDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ 4 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.WEDNESDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.WEDNESDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('WEDNESDAY')}
                    />
                    Thứ 4
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.WEDNESDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.WEDNESDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {
                                    workingTimeTogether?.workingDays[0]?.workDays.WEDNESDAY?.shifts[index]
                                      .startTimeShift
                                  }{' '}
                                  -{' '}
                                  {workingTimeTogether?.workingDays[0]?.workDays.WEDNESDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('WEDNESDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.WEDNESDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.WEDNESDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.WEDNESDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('WEDNESDAY')}
                  />
                  Thứ 4
                </div>
                {workingTimeTogether?.workingDays[0].workDays.WEDNESDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.WEDNESDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'WEDNESDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.WEDNESDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.WEDNESDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('WEDNESDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.WEDNESDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('WEDNESDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.WEDNESDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('WEDNESDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.WEDNESDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('WEDNESDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.WEDNESDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('WEDNESDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.WEDNESDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('WEDNESDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.WEDNESDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('WEDNESDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('WEDNESDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('WEDNESDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('WEDNESDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.WEDNESDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('WEDNESDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ 5 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.THURSDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.THURSDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('THURSDAY')}
                    />
                    Thứ 5
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.THURSDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.THURSDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {workingTimeTogether?.workingDays[0]?.workDays.THURSDAY?.shifts[index].startTimeShift}{' '}
                                  - {workingTimeTogether?.workingDays[0]?.workDays.THURSDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('THURSDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.THURSDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.THURSDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.THURSDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('THURSDAY')}
                  />
                  Thứ 5
                </div>
                {workingTimeTogether?.workingDays[0].workDays.THURSDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.THURSDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'THURSDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.THURSDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.THURSDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('THURSDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.THURSDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('THURSDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.THURSDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('THURSDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.THURSDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('THURSDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.THURSDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('THURSDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.THURSDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('THURSDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.THURSDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('THURSDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('THURSDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('THURSDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('THURSDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.THURSDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('THURSDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ 6 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.FRIDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.FRIDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('FRIDAY')}
                    />
                    Thứ 6
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.FRIDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.FRIDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {workingTimeTogether?.workingDays[0]?.workDays.FRIDAY?.shifts[index].startTimeShift} -{' '}
                                  {workingTimeTogether?.workingDays[0]?.workDays.FRIDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('FRIDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.FRIDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.FRIDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.FRIDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('FRIDAY')}
                  />
                  Thứ 6
                </div>
                {workingTimeTogether?.workingDays[0].workDays.FRIDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.FRIDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'FRIDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.FRIDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.FRIDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('FRIDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.FRIDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('FRIDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.FRIDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('FRIDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.FRIDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('FRIDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.FRIDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('FRIDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.FRIDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('FRIDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.FRIDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('FRIDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('FRIDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('FRIDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('FRIDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.FRIDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('FRIDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ 7 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.SATURDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.SATURDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('SATURDAY')}
                    />
                    Thứ 7
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.SATURDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.SATURDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {workingTimeTogether?.workingDays[0]?.workDays.SATURDAY?.shifts[index].startTimeShift}{' '}
                                  - {workingTimeTogether?.workingDays[0]?.workDays.SATURDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('SATURDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.SATURDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.SATURDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.SATURDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('SATURDAY')}
                  />
                  Thứ 7
                </div>
                {workingTimeTogether?.workingDays[0].workDays.SATURDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.SATURDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'SATURDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.SATURDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SATURDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SATURDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SATURDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SATURDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SATURDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SATURDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SATURDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SATURDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SATURDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SATURDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SATURDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SATURDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.SATURDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('SATURDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('SATURDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('SATURDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('SATURDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.SATURDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('SATURDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ 8 */}
            {!workingTimeTogether?.workingDays[0]?.workDays.SUNDAY?.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch
                      checked={workingTimeTogether?.workingDays[0]?.workDays?.SUNDAY ? true : false}
                      onChange={() => onOpenorCloseConfigTime('SUNDAY')}
                    />
                    Chủ nhật
                  </div>
                  {workingTimeTogether?.workingDays[0].workDays.SUNDAY && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether?.workingDays[0].workDays.SUNDAY.shifts.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>
                                  {workingTimeTogether?.workingDays[0]?.workDays.SUNDAY?.shifts[index].startTimeShift} -{' '}
                                  {workingTimeTogether?.workingDays[0]?.workDays.SUNDAY?.shifts[index].endTimeShift}
                                </div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('SUNDAY')}
                      />
                    </>
                  )}
                </div>
                {!workingTimeTogether?.workingDays[0]?.workDays.SUNDAY?.always &&
                  workingTimeTogether?.workingDays[0]?.workDays?.SUNDAY && (
                    <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                  )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch
                    checked={workingTimeTogether?.workingDays[0]?.workDays?.SUNDAY ? true : false}
                    onChange={() => onOpenorCloseConfigTime('SUNDAY')}
                  />
                  Chủ nhật
                </div>
                {workingTimeTogether?.workingDays[0].workDays.SUNDAY && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether?.workingDays[0].workDays.SUNDAY.always ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'SUNDAY')}
                        options={[
                          {
                            value: 'all',
                            label: 'Luôn lặp lại'
                          },
                          {
                            value: 'custom',
                            label: 'Tùy chỉnh'
                          }
                        ]}
                      />
                    </div>
                    {workingTimeTogether?.workingDays[0].workDays.SUNDAY.always ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SUNDAY.weeks as number[]).includes(1)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SUNDAY', 1)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SUNDAY.weeks as number[]).includes(2)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SUNDAY', 2)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SUNDAY.weeks as number[]).includes(3)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SUNDAY', 3)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SUNDAY.weeks as number[]).includes(4)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SUNDAY', 4)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SUNDAY.weeks as number[]).includes(5)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SUNDAY', 5)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={
                            (workingTimeTogether.workingDays[0].workDays.SUNDAY.weeks as number[]).includes(6)
                              ? 'primary'
                              : 'ghost'
                          }
                          onClick={() => setDateCustomRepeat('SUNDAY', 6)}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether?.workingDays[0].workDays.SUNDAY.shifts.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('SUNDAY', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('SUNDAY', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('SUNDAY')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('SUNDAY')}
                      />
                      {workingTimeTogether?.workingDays[0].workDays.SUNDAY.shifts.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('SUNDAY')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='common-time-button'>
        <Button type='primary'>Lưu cấu hình</Button>
        <Button>Đặt lại thông số</Button>
      </div>
    </div>
  )
}

export default CommonTime
