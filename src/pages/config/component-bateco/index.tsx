import type { RadioChangeEvent } from 'antd'
import { Checkbox, Col, Radio, Row, Space } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import '../index.scss'
import { SAT_LIST_OPTIONS } from './fake-data'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { getWorkingTimeSettingInfo } from '~/stores/features/working-time-config/working-time-config.slice'
import { DailyOverTimeSetup, IWorkingInfo, SaturdayWorkingConfig } from '~/types/working-time.interface'

const currentQuater = `Q${Math.floor((new Date().getMonth() + 3) / 3)}`

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

const renderRow = (type: string, title: string, firstArg: string, secondArg: string, thirdArg: string) => {
  return (
    <Row className='tw-text-base' align={'middle'}>
      <Col>
        <div className='tw-text-base tw-w-[300px]'>{title}</div>
      </Col>
      <Col className='tw-ml-4'>
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
              <span className='tw-font-bold'>,</span>
              <div className='time-box'>{secondArg}</div>
              <div className='time-circle'>{thirdArg}</div>
            </>
          )}
        </Space>
      </Col>
    </Row>
  )
}

const Index = () => {
  const dispatch = useAppDispatch()
  const workingTimeInfo: IWorkingInfo = useAppSelector((item) => item.workingTime.workingTimeInfo)
  console.log(workingTimeInfo, 'working time info')
  const [checkedValues, setCheckedValues] = useState<CheckboxValueType[]>([])
  const [selectedQuarter, setSelectedQuarter] = useState<string>(currentQuater)
  const [saturdayList, setSaturdayList] = useState<SaturdayWorkingConfig[]>([])

  const quarterOptions: { value: string; lastDate: string }[] = [
    {
      value: 'Q1',
      lastDate: workingTimeInfo?.year ? `${workingTimeInfo.year}-03-31` : `${dayjs().get('year')}-03-31`
    },
    { value: 'Q2', lastDate: workingTimeInfo?.year ? `${workingTimeInfo.year}-06-30` : `${dayjs().get('year')}-06-30` },
    { value: 'Q3', lastDate: workingTimeInfo?.year ? `${workingTimeInfo.year}-09-30` : `${dayjs().get('year')}-09-30` },
    { value: 'Q4', lastDate: workingTimeInfo?.year ? `${workingTimeInfo.year}-12-31` : `${dayjs().get('year')}-12-31` }
  ]

  const overtimeOptions: DailyOverTimeSetup[] = workingTimeInfo?.timeWorkSetup?.dailyOverTimeSetups || []

  const onChangeQuarter = (e: RadioChangeEvent) => {
    setSelectedQuarter(e.target.value)
  }

  const onChangeSatOptions = (checkedValues: CheckboxValueType[]) => {
    setCheckedValues(checkedValues)
  }

  useEffect(() => {
    dispatch(getWorkingTimeSettingInfo())
  }, [])

  useEffect(() => {
    if (workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups?.length > 0 && selectedQuarter) {
      const saturdayList =
        workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups?.find((item) => item.quarter === selectedQuarter)
          ?.saturdayWorkingConfigs || []
      const saturdayDateWorking = saturdayList.filter((option) => option.working).map((item) => item.saturdayDate)
      setSaturdayList(saturdayList)
      setCheckedValues(saturdayDateWorking)
    }
  }, [workingTimeInfo, selectedQuarter])

  return (
    <div className='tw-h-[calc(100%-48px)] tw-m-3 tw-p-3 '>
      <div className='tw-bg-white tw-p-4 tw-rounded-md tw-mb-4 box-style'>
        <div className='tw-flex tw-items-center tw-justify-between'>{renderTitle('I. Thời gian làm hành chính')}</div>

        <div className='tw-mt-2'>
          {renderRow(
            'double',
            '1. Giờ làm việc hành chính (Thứ 2 - Thứ 6)',
            workingTimeInfo?.timeWorkSetup?.workingTime?.startTime,
            workingTimeInfo?.timeWorkSetup?.workingTime?.endTime,
            ''
          )}
          <div className='tw-text-base tw-mt-4'>
            <Row align={'middle'} justify={'space-between'}>
              <Col>
                {renderRow(
                  'double',
                  '2. Lịch làm việc thứ 7',
                  workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups.find((item) => item.quarter === selectedQuarter)
                    ?.startTime || '',
                  workingTimeInfo?.timeWorkSetup?.timeWorkQuaterSetups.find((item) => item.quarter === selectedQuarter)
                    ?.endTime || '',
                  ''
                )}
              </Col>
              <Col>
                <Radio.Group onChange={onChangeQuarter} defaultValue={currentQuater} buttonStyle='solid'>
                  {quarterOptions.map((opt, index) => {
                    return (
                      <Radio.Button key={index} value={opt.value} disabled={dayjs().isAfter(opt.lastDate)}>
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
                      <div key={index} className='tw-mt-2 xs-tw-w-[50%] md:tw-w-[33%] xl:tw-w-[20%]'>
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
      </div>

      {/* Section 2 */}
      <section className='tw-bg-white tw-p-3 tw-rounded-md tw-mb-4 box-style'>
        {renderTitle('II. Quy định thời gian làm thêm và hệ số lương')}
        <div className='tw-mt-4'>
          <div className='tw-mt-4'>
            <Row align={'middle'}>
              <Col>
                <div className='tw-text-base tw-w-[300px]'>1. Giờ làm thêm trong tuần (Thứ 2- Thứ 6)</div>
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
            <div className='tw-mt-4'>
              {renderRow(
                'doubleComma',
                '2. Ngày làm thêm cuối tuần',
                'Thứ 7',
                'Chủ nhật',
                `x${workingTimeInfo?.timeWorkSetup?.weekendTimeSetups[0]?.coefficient}`
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className='tw-bg-white tw-p-3 tw-rounded-md tw-mb-4 box-style'>
        {renderTitle('III. Lịch gửi email thông báo')}
        <div className='tw-mt-4'>
          {renderRow(
            'single',
            '1. Thông báo đi muộn/ về sớm hàng ngày',
            workingTimeInfo?.policySetup?.reportViolateTime,
            '',
            ''
          )}
          <div className='tw-mt-4'>
            {renderRow(
              'single',
              '2. Thông báo ngày công của tháng',
              workingTimeInfo?.policySetup?.reportMonthlyStatisticTime,
              '',
              ''
            )}
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className='tw-bg-white tw-p-3 tw-rounded-md tw-mb-4 box-style'>
        {renderTitle('IV. Số ngày nghỉ phép mặc định')}
        <div className='tw-flex tw-items-center tw-mt-4'>
          {renderRow(
            'single',
            'Số ngày nghỉ phép mặc định của năm',
            `${workingTimeInfo?.policySetup?.defaultLeaveDay}`,
            '',
            ''
          )}
          <div className='tw-ml-2'>(ngày)</div>
        </div>
      </section>
    </div>
  )
}

export default Index
