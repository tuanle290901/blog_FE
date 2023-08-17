import { useEffect } from 'react'
import { Col, Progress, Row } from 'antd'
import './style.scss'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { getLeaveBalance } from '~/stores/features/leave-balance/leave-balance.slice'

const renderRow = (title: string, firstArg: string | number, secondArg: string, level?: 'parent' | 'child') => {
  return (
    <Row className='tw-text-md tw-mt-3' align={'middle'}>
      <Col>
        <div className={`tw-text-md tw-w-[250px] ${level === 'child' ? 'tw-indent-[50px]' : 'tw-font-semibold'}`}>
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
  console.log(leaveBalanceInfo)

  useEffect(() => {
    dispatch(getLeaveBalance())
  }, [])

  return (
    <div className='statistical-wrapper'>
      <div className='statistical-container'>
        <div className='report-title tw-text-lg tw-font-semibold'>Thông tin vi phạm và phép</div>
        <div className='report-description tw-text-md tw-mt-2 tw-italic tw-text-sky-700'>
          Tổng hợp thống kê thông tin vi phạm, thông tin phép của nhân viên trong tháng
        </div>

        <Row className='tw-mt-3' gutter={[32, 16]}>
          <Col xs={24} lg={8}>
            <div className='box-container'>
              <div className='border-top-gradient border-top-gradient-one' />
              <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số giờ nghỉ phép còn lại</div>
              <Progress
                type='circle'
                percent={
                  (leaveBalanceInfo?.totalAbsenceHours /
                    (leaveBalanceInfo?.totalUsedLeaveHours + leaveBalanceInfo?.totalAbsenceHours)) *
                  100
                }
                strokeColor={{
                  '0%': '#6e3ec4',
                  '100%': '#bb69d8'
                }}
                strokeWidth={10}
                strokeLinecap='round'
                status={'normal'}
                format={() =>
                  `${leaveBalanceInfo?.totalAbsenceHours}/${
                    leaveBalanceInfo?.totalUsedLeaveHours + leaveBalanceInfo?.totalAbsenceHours
                  }`
                }
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className='box-container'>
              <div className='border-top-gradient border-top-gradient-three' />
              <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số giờ làm thêm trong tháng</div>
              <Progress
                type='circle'
                percent={Number(leaveBalanceInfo?.totalOverTimeHours) ? 100 : 0}
                strokeColor={{
                  '0%': '#f639c0',
                  '100%': '#f544c4'
                }}
                strokeWidth={10}
                strokeLinecap='round'
                status={'normal'}
                format={() => `${Number(leaveBalanceInfo?.totalOverTimeHours)} giờ `}
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className='box-container'>
              <div className='border-top-gradient border-top-gradient-four' />
              <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số lần đi muộn/ về sớm</div>
              <Progress
                type='circle'
                percent={Number(leaveBalanceInfo?.totalViolates) ? 100 : 0}
                strokeColor={{
                  '0%': '#39f6f6',
                  '100%': '#83c9c9'
                }}
                strokeWidth={10}
                strokeLinecap='round'
                status={'normal'}
                format={() => `${Number(leaveBalanceInfo?.totalViolates)} lần `}
              />
            </div>
          </Col>
        </Row>

        <div className='tw-mt-[30px] report-description tw-text-md tw-italic tw-text-sky-700'>Thông tin chi tiết</div>
        <Row align={'top'} gutter={[32, 16]}>
          <Col xs={24} xl={12} xxl={8}>
            {renderRow('Số giờ nghỉ phép còn lại', leaveBalanceInfo?.totalAbsenceHours, 'giờ')}
            {renderRow('Số giờ nghỉ phép đã dùng trong tháng', leaveBalanceInfo?.totalUsedLeaveHours, 'giờ')}
          </Col>
          <Col xs={24} xl={12} xxl={8}>
            {renderRow('Số giờ làm thêm trong tháng', Number(leaveBalanceInfo?.totalOverTimeHours), 'giờ')}
            {renderRow('Ca 1 (17h - 22h):', 0, 'giờ', 'child')}
            {renderRow('Ca 2 (22h - 06h):', 0, 'giờ', 'child')}
            {renderRow('Ca 3 (06h - 08h):', 0, 'giờ', 'child')}
          </Col>
          <Col xs={24} xl={12} xxl={8}>
            {renderRow('Số lần đi muộn/ về sớm trong tháng', Number(leaveBalanceInfo?.totalViolates), 'lần')}
            {renderRow('Đi muộn:', leaveBalanceInfo?.totalLateCome, 'lần', 'child')}
            {renderRow('Về sớm:', leaveBalanceInfo?.totalEarlyBack, 'lần', 'child')}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Index
