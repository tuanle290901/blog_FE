/* eslint-disable prettier/prettier */
import { DeleteOutlined, DownOutlined, InfoCircleOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Col, InputNumber, Row, Select, Switch, TimePicker } from 'antd'
import React, { useState } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

interface Shift {
  start: string
  end: string
}

interface WorkingDay {
  work: boolean
  optionExtend: boolean
  repeat: string | string[]
  shift: string[]
}

interface WorkingTime {
  monday: WorkingDay
  tuesday: WorkingDay
  wednesday: WorkingDay
  thursday: WorkingDay
  friday: WorkingDay
  saturday: WorkingDay
  sunday: WorkingDay
}

function CommonTime() {
  const [workingTimeTogether, setWorkingTimeTogether] = useState<WorkingTime>({
    monday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    },
    tuesday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    },
    wednesday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    },
    thursday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    },
    friday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    },
    saturday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    },
    sunday: {
      work: true,
      optionExtend: false,
      repeat: 'all',
      shift: ['8:30 - 12:00', '13:30 - 17:30']
    }
  })

  const onAddShiftToWorkingTimeTogether = (day: keyof WorkingTime) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState[day]) {
        return {
          ...prevState,
          [day]: {
            ...prevState[day],
            shift: [...prevState[day].shift, '0:00 - 00:00']
          }
        }
      }
      return prevState
    })
  }

  const onRemoveShiftToWorkingTimeTogether = (day: keyof WorkingTime) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState[day]) {
        return {
          ...prevState,
          [day]: {
            ...prevState[day],
            shift: prevState[day].shift.slice(0, -1)
          }
        }
      }
      return prevState
    })
  }

  const onSetOptionExtendWorkingTimeTogether = (day: keyof WorkingTime) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState[day]) {
        return {
          ...prevState,
          [day]: {
            ...prevState[day],
            optionExtend: !prevState[day].optionExtend
          }
        }
      }
      return prevState
    })
  }

  const onOpenorCloseConfigTime = (day: keyof WorkingTime) => {
    setWorkingTimeTogether((prevState) => {
      if (prevState[day]) {
        return {
          ...prevState,
          [day]: {
            ...prevState[day],
            work: !prevState[day].work
          }
        }
      }
      return prevState
    })
  }

  const onChangeOptionRepeatConfigTime = (value: string, day: keyof WorkingTime) => {
    const updatedWorkingTimeTogether = { ...workingTimeTogether }
    if (day in updatedWorkingTimeTogether) {
      if (value === 'custom') {
        updatedWorkingTimeTogether[day].repeat = []
        setWorkingTimeTogether(updatedWorkingTimeTogether)
      } else {
        updatedWorkingTimeTogether[day].repeat = 'all'
        setWorkingTimeTogether(updatedWorkingTimeTogether)
      }
    }
  }

  const setDateCustomRepeat = (day: keyof WorkingTime, week: string) => {
    const updatedWorkingTimeTogether = { ...workingTimeTogether }
    if (day in updatedWorkingTimeTogether) {
      if (Array.isArray(updatedWorkingTimeTogether[day].repeat)) {
        const test = updatedWorkingTimeTogether[day].repeat as string[]
        if (updatedWorkingTimeTogether[day].repeat.includes(week)) {
          const index = updatedWorkingTimeTogether[day].repeat.indexOf(week)

          test.splice(index, 1)
          setWorkingTimeTogether(updatedWorkingTimeTogether)
        } else {
          test.push(week)
          setWorkingTimeTogether(updatedWorkingTimeTogether)
        }
      } else {
        updatedWorkingTimeTogether[day].repeat = [week]
        setWorkingTimeTogether(updatedWorkingTimeTogether)
      }
    }
  }

  const onChange = (value: number | null) => {
    console.log('changed', value)
  }

  const onChangeConfigTimeMonday = (value: number | string) => {
    console.log(value)
  }

  const handleShiftChange = (day: keyof WorkingTime, index: number, time: Dayjs, configTime: 'start' | 'end') => {
    const updatedWorkingTimeTogether = { ...workingTimeTogether }
    if (day in updatedWorkingTimeTogether) {
      const newShifts = updatedWorkingTimeTogether[day].shift[index]
      if (configTime === 'start') {
        updatedWorkingTimeTogether[day].shift[index] = newShifts.replace(/(\d+:\d+)\b/, time.format('HH:mm'))
      } else if (configTime === 'end') {
        updatedWorkingTimeTogether[day].shift[index] = newShifts.replace(/\b(\d+:\d+)$/, time.format('HH:mm'))
      }
    }
  }

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
              Từ <InputNumber min={1} max={30} defaultValue={1} onChange={onChange} />
              đến <InputNumber min={1} max={30} defaultValue={1} onChange={onChange} />
              hàng tháng
            </div>
            <div className='monthly-closing-date monthly-closing-date-default'>
              <p>Số ngày nghỉ phép mặc định </p>
              <InputNumber min={1} max={30} defaultValue={12} onChange={onChange} />
              ngày
            </div>
            <div className='monthly-closing-date monthly-closing-date-default'>
              <p>Thời gian nghỉ bù có hiệu lực</p>
              <InputNumber min={1} max={30} defaultValue={3} onChange={onChange} />
              tháng
            </div>
            <div className='monthly-closing-date'>
              <p>Khoảng thời gian làm thêm (OT)</p>
              Từ <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
              đến <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
              hàng ngày
            </div>
          </div>
        </div>
        <div className='working-time-together'>
          <div className='layble-page-time'>
            <p>Thời gian làm việc chung</p>
          </div>
          <div className='list-day-working'>
            {!workingTimeTogether.monday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('monday')} />
                    Thứ 2
                  </div>
                  {workingTimeTogether.monday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.monday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.monday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('monday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.monday.repeat !== 'all' && <InfoCircleOutlined style={{ marginLeft: '10px' }} />}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('monday')} />
                  Thứ 2
                </div>
                {workingTimeTogether.monday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.monday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'monday')}
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
                    {workingTimeTogether?.monday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.monday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('monday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.monday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('monday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.monday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('monday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.monday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('monday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.monday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('monday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.monday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('monday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.monday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('monday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('monday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('monday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('monday')}
                      />
                      {workingTimeTogether.monday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('monday')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ ba */}
            {!workingTimeTogether.tuesday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('tuesday')} />
                    Thứ 3
                  </div>
                  {workingTimeTogether.tuesday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.tuesday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.tuesday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('tuesday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.tuesday.repeat !== 'all' && <InfoCircleOutlined style={{ marginLeft: '10px' }} />}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('tuesday')} />
                  Thứ 3
                </div>
                {workingTimeTogether.tuesday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.tuesday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'tuesday')}
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
                    {workingTimeTogether?.tuesday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.tuesday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('tuesday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.tuesday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('tuesday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.tuesday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('tuesday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.tuesday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('tuesday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.tuesday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('tuesday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.tuesday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('tuesday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.tuesday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('tuesday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('tuesday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('tuesday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('tuesday')}
                      />
                      {workingTimeTogether.tuesday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('tuesday')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ tư */}
            {!workingTimeTogether.wednesday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('wednesday')} />
                    Thứ 4
                  </div>
                  {workingTimeTogether.wednesday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.wednesday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.wednesday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('wednesday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.wednesday.repeat !== 'all' && (
                  <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                )}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('wednesday')} />
                  Thứ 4
                </div>
                {workingTimeTogether.wednesday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.wednesday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'wednesday')}
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
                    {workingTimeTogether?.wednesday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.wednesday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('wednesday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.wednesday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('wednesday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.wednesday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('wednesday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.wednesday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('wednesday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.wednesday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('wednesday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.wednesday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('wednesday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.wednesday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('wednesday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('wednesday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('wednesday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('wednesday')}
                      />
                      {workingTimeTogether.wednesday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('wednesday')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Thứ năm */}
            {!workingTimeTogether.thursday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('thursday')} />
                    Thứ 5
                  </div>
                  {workingTimeTogether.thursday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.thursday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.thursday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('thursday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.thursday.repeat !== 'all' && <InfoCircleOutlined style={{ marginLeft: '10px' }} />}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('thursday')} />
                  Thứ 5
                </div>
                {workingTimeTogether.thursday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.thursday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'thursday')}
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
                    {workingTimeTogether?.thursday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.thursday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('thursday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.thursday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('thursday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.thursday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('thursday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.thursday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('thursday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.thursday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('thursday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.thursday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('thursday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.thursday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('thursday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('thursday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('thursday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('thursday')}
                      />
                      {workingTimeTogether.thursday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('thursday')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {!workingTimeTogether.friday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('friday')} />
                    Thứ 6
                  </div>
                  {workingTimeTogether.friday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.friday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.friday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('friday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.friday.repeat !== 'all' && <InfoCircleOutlined style={{ marginLeft: '10px' }} />}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('friday')} />
                  Thứ 6
                </div>
                {workingTimeTogether.friday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.friday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'friday')}
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
                    {workingTimeTogether?.friday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.friday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('friday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.friday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('friday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.friday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('friday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.friday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('friday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.friday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('friday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.friday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('friday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.friday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('friday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('friday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('friday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('friday')}
                      />
                      {workingTimeTogether.friday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('friday')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {!workingTimeTogether.saturday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('saturday')} />
                    Thứ 7
                  </div>
                  {workingTimeTogether.saturday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.saturday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.saturday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('saturday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.saturday.repeat !== 'all' && <InfoCircleOutlined style={{ marginLeft: '10px' }} />}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('saturday')} />
                  Thứ 7
                </div>
                {workingTimeTogether.saturday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.saturday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'saturday')}
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
                    {workingTimeTogether?.saturday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.saturday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('saturday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.saturday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('saturday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.saturday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('saturday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.saturday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('saturday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.saturday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('saturday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.saturday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('saturday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.saturday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('saturday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('saturday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('saturday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('saturday')}
                      />
                      {workingTimeTogether.saturday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('saturday')} />}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {!workingTimeTogether.sunday.optionExtend ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='config-day'>
                  <div className='activated'>
                    <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('sunday')} />
                    Chủ nhật
                  </div>
                  {workingTimeTogether.sunday.work && (
                    <>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        {workingTimeTogether.sunday.shift.map((shiftItem, index) => {
                          if (index < 3) {
                            return (
                              <div className='item-shift' key={index}>
                                <span className='separation-point' />
                                <div className='first-shift'>{workingTimeTogether.sunday.shift[index]}</div>
                              </div>
                            )
                          }
                          return ''
                        })}
                      </div>
                      <UpOutlined
                        className='button-extend'
                        onClick={() => onSetOptionExtendWorkingTimeTogether('sunday')}
                      />
                    </>
                  )}
                </div>
                {workingTimeTogether.sunday.repeat !== 'all' && <InfoCircleOutlined style={{ marginLeft: '10px' }} />}
              </div>
            ) : (
              <div className='config-day config-day-grid'>
                <div className='activated'>
                  <Switch defaultChecked onChange={() => onOpenorCloseConfigTime('sunday')} />
                  Chủ nhật
                </div>
                {workingTimeTogether.sunday.work && (
                  <>
                    <div className='first-shift'>
                      <p>Lặp lại:</p>
                      <Select
                        showSearch
                        defaultValue={workingTimeTogether.sunday.repeat === 'all' ? 'all' : 'custom'}
                        optionFilterProp='children'
                        onChange={(value) => onChangeOptionRepeatConfigTime(value, 'sunday')}
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
                    {workingTimeTogether?.sunday?.repeat === 'all' ? (
                      ''
                    ) : (
                      <div>
                        <Button
                          type={workingTimeTogether?.sunday?.repeat?.includes('week1') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('sunday', 'week1')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 1
                        </Button>
                        <Button
                          type={workingTimeTogether?.sunday?.repeat?.includes('week2') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('sunday', 'week2')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 2
                        </Button>
                        <Button
                          type={workingTimeTogether?.sunday?.repeat?.includes('week3') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('sunday', 'week3')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 3
                        </Button>
                        <Button
                          type={workingTimeTogether?.sunday?.repeat?.includes('week4') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('sunday', 'week4')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 4
                        </Button>
                        <Button
                          type={workingTimeTogether?.sunday?.repeat?.includes('week5') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('sunday', 'week5')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 5
                        </Button>
                        <Button
                          type={workingTimeTogether?.sunday?.repeat?.includes('week6') ? 'primary' : 'ghost'}
                          onClick={() => setDateCustomRepeat('sunday', 'week6')}
                          shape='round'
                          size='middle'
                          className='custom'
                        >
                          Tuần 6
                        </Button>
                      </div>
                    )}
                    {workingTimeTogether.sunday.shift.map((shift, index) => {
                      return (
                        <div className='first-shift' key={index}>
                          <p>Ca {index + 1}:</p>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('sunday', index, time, 'start')
                              }
                            }}
                            format='HH:mm'
                          />
                          <i>đến</i>
                          <TimePicker
                            onChange={(time) => {
                              if (time !== null) {
                                handleShiftChange('sunday', index, time, 'end')
                              }
                            }}
                            format='HH:mm'
                          />
                        </div>
                      )
                    })}
                    <DownOutlined
                      className='button-extend'
                      onClick={() => onSetOptionExtendWorkingTimeTogether('sunday')}
                    />
                    <div className='action-shift'>
                      <Button
                        shape='circle'
                        icon={<PlusOutlined />}
                        onClick={() => onAddShiftToWorkingTimeTogether('sunday')}
                      />
                      {workingTimeTogether.sunday.shift.length > 1 && (
                        <Button
                          shape='circle'
                          icon={<DeleteOutlined onClick={() => onRemoveShiftToWorkingTimeTogether('sunday')} />}
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
