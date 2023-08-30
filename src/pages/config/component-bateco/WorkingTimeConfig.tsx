import type { RadioChangeEvent } from 'antd'
import { Button, Checkbox, Col, Radio, Row, Space, notification } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  getWorkingTimeSettingInfo,
  updateWorkingTime
} from '~/stores/features/working-time-config/working-time-config.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import {
  DailyOverTimeSetup,
  IWorkingInfo,
  SaturdayWorkingConfig,
  TimeWorkQuaterSetup
} from '~/types/working-time.interface'
import '../index.scss'
import { useNavigate } from 'react-router-dom'

const currentQuater = `Q${Math.floor((new Date().getMonth() + 3) / 3)}`
const quarterOptions: { value: string }[] = [{ value: 'Q1' }, { value: 'Q2' }, { value: 'Q3' }, { value: 'Q4' }]

const convertQuarterName = (value: string) => {
  switch (value) {
    case 'Q1':
      return 'Quý 1'
    case 'Q2':
      return 'Quý 2'
    case 'Q3':
      return 'Quý 3'
    case 'Q4':
      return 'Quý 4'
  }
}

const renderTitle = (title: string) => {
  return (
    <div className='tw-text-lg tw-font-semibold tw-flex '>
      <span>{title}</span>
    </div>
  )
}

const renderRow = (type: string, title: string, firstArg: string, secondArg?: string, thirdArg?: string) => {
  return (
    <Row className='tw-text-md' align={'middle'} gutter={[16, 16]}>
      <Col>
        <div className='tw-text-md tw-w-[300px]'>{title}</div>
      </Col>
      <Col>
        <Space>
          <div className='time-box'>{firstArg}</div>
          {type === 'double' && (
            <>
              <span className='tw-font-bold'>-</span>
              <div className='time-box'>{secondArg}</div>
            </>
          )}
          {type === 'doubleComma' && (
            <>
              <span className='tw-font-bold' style={{ visibility: secondArg ? 'visible' : 'hidden' }}>
                ,
              </span>
              <div className='time-box' style={{ visibility: secondArg ? 'visible' : 'hidden' }}>
                {secondArg}
              </div>
              <div className='time-circle'>{thirdArg}</div>
            </>
          )}
        </Space>
      </Col>
    </Row>
  )
}

const WorkingTimeConfig = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const workingTimeInfo: IWorkingInfo = useAppSelector((item) => item.workingTime.workingTimeInfo)
  const [checkedValues, setCheckedValues] = useState<CheckboxValueType[]>([])
  const [selectedQuarter, setSelectedQuarter] = useState<string>(currentQuater)
  const [saturdayList, setSaturdayList] = useState<SaturdayWorkingConfig[]>([])
  const [saturdayListFilter, setSaturdayListFilter] = useState<string[]>([])
  const [collapseRow, setCollapseRow] = useState<boolean[]>([false, false, false, false])

  const overtimeOptions: DailyOverTimeSetup[] = workingTimeInfo?.timeWorkSetup?.dailyOverTimeSetups || []

  const updateCollapseRow = (index: number) => {
    const newCollapseRow = [...collapseRow]
    newCollapseRow[index] = !newCollapseRow[index]
    setCollapseRow(newCollapseRow)
  }

  const onChangeQuarter = (e: RadioChangeEvent) => {
    setSelectedQuarter(e.target.value)
  }

  const onChangeSatOptions = (checkedValues: CheckboxValueType[]) => {
    setCheckedValues(checkedValues)
  }

  const splitSaturdaysByQuarter = (saturdayList: CheckboxValueType[]) => {
    const quarters: CheckboxValueType[][] = [[], [], [], []]

    saturdayList.forEach((saturday) => {
      const date = dayjs(saturday.toString())
      if (date.year() === dayjs().year()) {
        const quarter = Math.floor((date.month() + 3) / 3) - 1
        quarters[quarter].push(saturday)
      }
    })

    return quarters
  }

  const updateQuarter = async () => {
    try {
      const quarters = splitSaturdaysByQuarter(checkedValues)
      const newTimeWorkQuarterSetup: TimeWorkQuaterSetup[] = []
      quarters.forEach((quarter, index) => {
        newTimeWorkQuarterSetup[index] = JSON.parse(
          JSON.stringify(workingTimeInfo.timeWorkSetup.timeWorkQuaterSetups[index])
        )
        const saturdayWorkingMapping = workingTimeInfo.timeWorkSetup.timeWorkQuaterSetups[
          index
        ].saturdayWorkingConfigs.map((item) => {
          return {
            saturdayDate: item.saturdayDate,
            working: quarter.includes(item.saturdayDate) ? true : false
          }
        })
        newTimeWorkQuarterSetup[index].saturdayWorkingConfigs = saturdayWorkingMapping
      })
      const payload = JSON.parse(JSON.stringify(workingTimeInfo))
      payload.timeWorkSetup.timeWorkQuaterSetups = newTimeWorkQuarterSetup
      const response: any = await dispatch(updateWorkingTime(payload))
      if (response.type.includes('/rejected')) {
        notification.error({ message: response.error.message })
      } else if (response.type.includes('/fulfilled')) {
        notification.success({ message: 'Thao tác thành công' })
      }
    } catch (err: any) {
      notification.error({ message: err.message })
    }
    dispatch(getWorkingTimeSettingInfo())
  }

  useEffect(() => {
    dispatch(getWorkingTimeSettingInfo())
  }, [dispatch])

  useEffect(() => {
    if (workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups?.length > 0) {
      const saturdayList =
        workingTimeInfo.timeWorkSetup.timeWorkQuaterSetups.flatMap((item) => item.saturdayWorkingConfigs) || []
      const saturdayDateWorking = saturdayList.filter((option) => option.working).map((item) => item.saturdayDate)
      setSaturdayList(saturdayList)
      setCheckedValues(saturdayDateWorking)
    }
  }, [workingTimeInfo])

  useEffect(() => {
    if (workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups?.length > 0 && selectedQuarter) {
      const saturdayListFilter =
        workingTimeInfo.timeWorkSetup.timeWorkQuaterSetups.find((item) => item.quarter === selectedQuarter)
          ?.saturdayWorkingConfigs || []
      setSaturdayListFilter(saturdayListFilter.map((item) => item.saturdayDate))
    }
  }, [workingTimeInfo, selectedQuarter])

  return (
    <div className='tw-h-[calc(100%-48px)] tw-m-3 tw-p-3 '>
      <div className='tw-bg-white tw-p-4 tw-rounded-md tw-mb-4 box-style'>
        <div className='tw-flex tw-items-center tw-justify-between'>
          {renderTitle('I. Thời gian làm hành chính')}{' '}
          <div className='tw-ml-auto' onClick={() => updateCollapseRow(0)}>
            {!collapseRow[0] && <UpOutlined className='tw-cursor-pointer' />}
            {collapseRow[0] && <DownOutlined className='tw-cursor-pointer' />}
          </div>
        </div>

        {!collapseRow[0] && (
          <div className='tw-mt-2'>
            {renderRow(
              'double',
              '1. Giờ làm việc hành chính (Thứ 2 - Thứ 6)',
              workingTimeInfo?.timeWorkSetup?.workingTime?.startTime,
              workingTimeInfo?.timeWorkSetup?.workingTime?.endTime
            )}
            <div className='tw-text-md tw-mt-4'>
              <Row align={'middle'} justify={'space-between'} gutter={[16, 16]}>
                <Col>
                  {renderRow(
                    'double',
                    '2. Lịch làm việc thứ 7',
                    workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups.find(
                      (item) => item.quarter === selectedQuarter
                    )?.startTime || '',
                    workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups.find(
                      (item) => item.quarter === selectedQuarter
                    )?.endTime || ''
                  )}
                </Col>
                <Col>
                  <Radio.Group onChange={onChangeQuarter} defaultValue={currentQuater} buttonStyle='solid'>
                    {quarterOptions.map((opt, index) => {
                      return (
                        <Radio.Button key={index} value={opt.value}>
                          {convertQuarterName(opt.value)}
                        </Radio.Button>
                      )
                    })}
                  </Radio.Group>
                </Col>
              </Row>

              <div className='tw-mt-2'>
                <Checkbox.Group value={checkedValues} onChange={onChangeSatOptions} className='tw-w-full'>
                  <div className='tw-flex tw-flex-wrap tw-w-full'>
                    {saturdayList.map((option, index) => {
                      return (
                        <div
                          key={index}
                          className='tw-mt-2 xs-tw-w-[50%] md:tw-w-[33%] xl:tw-w-[20%]'
                          style={{
                            display: saturdayListFilter.includes(option.saturdayDate) ? 'block' : 'none'
                          }}
                        >
                          <Checkbox value={option.saturdayDate} disabled={dayjs().isAfter(option.saturdayDate)}>
                            {dayjs(option.saturdayDate).format('DD/MM/YYYY')}
                          </Checkbox>
                        </div>
                      )
                    })}
                  </div>
                </Checkbox.Group>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2 */}
      <section className='tw-bg-white tw-p-3 tw-rounded-md tw-mb-4 box-style'>
        <div className='tw-flex'>
          {renderTitle('II. Quy định thời gian làm thêm và hệ số lương')}

          <div className='tw-ml-auto' onClick={() => updateCollapseRow(1)}>
            {!collapseRow[1] && <UpOutlined className='tw-cursor-pointer' />}
            {collapseRow[1] && <DownOutlined className='tw-cursor-pointer' />}
          </div>
        </div>

        {!collapseRow[1] && (
          <div className='tw-mt-4'>
            <div className='tw-mt-4'>
              <Row align={'middle'}>
                <Col>
                  <div className='tw-text-md tw-mb-2 tw-w-[300px]'>1. Giờ làm thêm trong tuần (Thứ 2- Thứ 6)</div>
                </Col>

                <Col>
                  <div className='tw-flex tw-flex-col tw-justify-center tw-gap-[15px]'>
                    {overtimeOptions.map((item, index) => {
                      return (
                        <Space key={index} className='tw-ml-4'>
                          <div className='time-box'>{item?.overTimeShift?.startTime}</div>
                          <span className='tw-font-bold'>-</span>
                          <div className='time-box'>{item?.overTimeShift?.endTime}</div>
                          <div className='time-circle'>x{item?.coefficientSalary}</div>
                        </Space>
                      )
                    })}
                  </div>
                </Col>
              </Row>
              <div className='tw-mt-[30px]'>
                {renderRow(
                  'doubleComma',
                  '2. Ngày làm thêm cuối tuần',
                  'Thứ 7',
                  'Chủ nhật',
                  `x${workingTimeInfo?.timeWorkSetup?.weekendTimeSetups[0]?.coefficient}`
                )}
              </div>
              <div className='tw-mt-[30px]'>{renderRow('doubleComma', '3. Ngày nghỉ lễ', 'Ngày lễ', '', `x3`)}</div>
            </div>
          </div>
        )}
      </section>

      {/* Section 3 */}
      <section className='tw-bg-white tw-p-3 tw-rounded-md tw-mb-4 box-style'>
        <div className='tw-flex'>
          {renderTitle('III. Lịch gửi email thông báo')}

          <div className='tw-ml-auto' onClick={() => updateCollapseRow(2)}>
            {!collapseRow[2] && <UpOutlined className='tw-cursor-pointer' />}
            {collapseRow[2] && <DownOutlined className='tw-cursor-pointer' />}
          </div>
        </div>

        {!collapseRow[2] && (
          <div className='tw-mt-4'>
            {renderRow(
              'single',
              '1. Thông báo đi muộn/ về sớm hàng ngày',
              workingTimeInfo?.policySetup?.reportViolateTime
            )}
            <div className='tw-mt-4'>
              {renderRow(
                'single',
                '2. Thông báo ngày công của tháng',
                workingTimeInfo?.policySetup?.reportMonthlyStatisticTime
              )}
            </div>
          </div>
        )}
      </section>

      {/* Section 4 */}
      <section className='tw-bg-white tw-p-3 tw-rounded-md tw-mb-4 box-style'>
        <div className='tw-flex'>
          {renderTitle('IV. Số ngày nghỉ phép mặc định')}
          <div className='tw-ml-auto' onClick={() => updateCollapseRow(3)}>
            {!collapseRow[3] && <UpOutlined className='tw-cursor-pointer' />}
            {collapseRow[3] && <DownOutlined className='tw-cursor-pointer' />}
          </div>
        </div>

        {!collapseRow[3] && (
          <div className='tw-flex tw-items-center tw-mt-4'>
            {renderRow(
              'single',
              'Số ngày nghỉ phép mặc định của năm',
              `${workingTimeInfo?.policySetup?.defaultLeaveDay * 24 * 60}`
            )}
            <div className='tw-ml-2'>phút ({workingTimeInfo?.policySetup?.defaultLeaveDay} ngày)</div>
          </div>
        )}
      </section>

      <div className='tw-w-full '>
        <Space className=' tw-float-right tw-mb-[20px]'>
          <Button type='default' onClick={() => navigate('/')}>
            Quay lại
          </Button>
          <Button type='primary' onClick={updateQuarter}>
            Lưu cấu hình
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default WorkingTimeConfig
