import { useEffect } from 'react'
import { Col, Progress, Row } from 'antd'
import './style.scss'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { getLeaveBalance } from '~/stores/features/leave-balance/leave-balance.slice'

const mappingOvertimeKey = (key: string) => {
  switch (key) {
    case 'ShiftOne':
      return 'Ca 1 (17h - 22h):'
    case 'ShiftTwo':
      return 'Ca 2 (22h - 06h):'
    case 'ShiftThree':
      return 'Ca 3 (06h - 08h):'
    case 'Weekend':
      return 'Ngày nghỉ:'
    case 'Holiday':
      return 'Ngày lễ:'
    default:
      return ''
  }
}

const renderRow = (title: string, firstArg: string | number, secondArg: string, level?: 'parent' | 'child') => {
  return (
    <Row className='tw-text-md tw-mt-3' align={'middle'}>
      <Col>
        <div className={`tw-text-md tw-w-[220px] ${level === 'child' ? 'tw-indent-[50px]' : 'tw-font-semibold'}`}>
          {title}
        </div>
      </Col>
      <Col className='tw-ml-4 tw-flex tw-items-center'>
        <div className='time-box'>{firstArg}</div>
        <div className='tw-ml-[10px]'>{secondArg}</div>
      </Col>
    </Row>
  )
}

const Index = () => {
  const dispatch = useAppDispatch()
  const leaveBalanceInfo = useAppSelector((item) => item.leaveBalacnce.leaveBalanceData)

  useEffect(() => {
    dispatch(getLeaveBalance())
  }, [])

  return (
    <div className='statistical-wrapper'>
      <div className='statistical-container'>
        <div className='report-title tw-text-lg tw-font-semibold'>Thống kê thông tin dữ liệu trong tháng</div>
        <div className='report-description tw-text-md tw-mt-2 tw-italic tw-text-sky-700'>
          Tổng hợp thống kê thông tin vi phạm, thông tin phép của nhân viên trong tháng
        </div>

        {leaveBalanceInfo && (
          <>
            {' '}
            <Row className='tw-mt-3' gutter={[32, 16]}>
              <Col xs={24} lg={6}>
                <div className='box-container'>
                  <div className='border-top-gradient border-top-gradient-two' />
                  <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số giờ công tác</div>
                  <Progress
                    type='circle'
                    percent={Number(leaveBalanceInfo?.totalOverTimeHours) ? 100 : 0}
                    strokeColor={{
                      '0%': '#ef6f62',
                      '100%': '#f4a66a'
                    }}
                    strokeWidth={10}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() => `${Number((leaveBalanceInfo?.totalOverTimeHours ?? 0).toFixed(1))} giờ `}
                  />
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className='box-container'>
                  <div className='border-top-gradient border-top-gradient-one' />
                  <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số giờ nghỉ phép còn lại</div>
                  <Progress
                    type='circle'
                    percent={
                      (leaveBalanceInfo?.totalRemainLeaveHours /
                        (leaveBalanceInfo?.totalRemainLeaveHours + leaveBalanceInfo?.totalUsedLeaveHours)) *
                      100
                    }
                    strokeColor={{
                      '0%': '#c259e9',
                      '100%': '#d08ee7'
                    }}
                    strokeWidth={10}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() =>
                      `${Number(leaveBalanceInfo?.totalRemainLeaveHours)?.toFixed(1)}/${Number(
                        (leaveBalanceInfo?.totalRemainLeaveHours + leaveBalanceInfo?.totalUsedLeaveHours)?.toFixed(1)
                      )}`
                    }
                  />
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className='box-container'>
                  <div className='border-top-gradient border-top-gradient-four' />
                  <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số lần đi muộn/ về sớm</div>
                  <Progress
                    type='circle'
                    percent={Number(leaveBalanceInfo?.totalViolates) ? 100 : 0}
                    strokeColor={{
                      '0%': '#30A2FF',
                      '100%': '#a5e0f1'
                    }}
                    strokeWidth={10}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() => `${Number(leaveBalanceInfo?.totalViolates)} lần `}
                  />
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className='box-container'>
                  <div className='border-top-gradient border-top-gradient-three' />
                  <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số giờ làm thêm trong tháng</div>
                  <Progress
                    type='circle'
                    percent={Number(leaveBalanceInfo?.totalOverTimeHours) ? 100 : 0}
                    strokeColor={{
                      '0%': '#ecbf38',
                      '100%': 'rgb(238, 229, 172)'
                    }}
                    strokeWidth={10}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() => `${Number((leaveBalanceInfo?.totalOverTimeHours ?? 0).toFixed(1))} giờ `}
                  />
                </div>
              </Col>
            </Row>
            <div className='tw-mt-[30px] report-description tw-text-md tw-italic tw-text-sky-700'>
              Thông tin chi tiết trong tháng
            </div>
            <Row align={'top'} gutter={[32, 16]}>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow('Số giờ công tác', Number((leaveBalanceInfo?.totalOverTimeHours ?? 0).toFixed(1)), 'giờ')}
              </Col>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow(
                  'Số giờ nghỉ phép còn lại',
                  Number((leaveBalanceInfo?.totalRemainLeaveHours ?? 0).toFixed(1)),
                  'giờ'
                )}
                {renderRow(
                  'Số giờ nghỉ phép đã dùng',
                  Number((leaveBalanceInfo?.totalUsedLeaveHours ?? 0).toFixed(1)),
                  'giờ'
                )}
              </Col>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow('Số lần đi muộn/ về sớm', leaveBalanceInfo?.totalViolates, 'lần')}
                {renderRow('Đi muộn:', leaveBalanceInfo?.totalLateCome, 'lần', 'child')}
                {renderRow('Về sớm:', leaveBalanceInfo?.totalEarlyBack, 'lần', 'child')}
              </Col>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow('Số giờ làm thêm', Number((leaveBalanceInfo?.totalOverTimeHours ?? 0).toFixed(1)), 'giờ')}
                {leaveBalanceInfo?.overTimeInfoList?.map((item, index) => {
                  return <div key={index}>{renderRow(mappingOvertimeKey(item.key), item.value, 'giờ', 'child')}</div>
                })}
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  )
}

export default Index
