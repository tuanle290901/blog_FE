import { useEffect } from 'react'
import { Col, Progress, Row } from 'antd'
import './style.scss'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { getLeaveBalance } from '~/stores/features/leave-balance/leave-balance.slice'

const renderRow = (title: string, firstArg: string, secondArg: string) => {
  return (
    <Row className='tw-text-md tw-mt-3' align={'middle'}>
      <Col>
        <div className='tw-text-md tw-w-[300px]'>{title}</div>
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
    <div className='report-wrapper'>
      <div className='report-container'>
        <div className='report-title tw-text-lg tw-font-semibold'>Thông tin phép và làm thêm</div>
        <div className='report-description tw-text-md tw-mt-2 tw-italic tw-text-sky-700'>
          Tổng hợp thống kê thông tin phép và làm thêm trong tháng
        </div>

        <Row className='tw-mt-3' gutter={[32, 16]}>
          <Col xs={24} lg={8}>
            <div className='box-container'>
              <div className='border-top-gradient border-top-gradient-one' />
              <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số ngày nghỉ phép còn lại</div>
              <Progress
                type='circle'
                percent={
                  (Number(leaveBalanceInfo?.restLeaveBalance) / Number(leaveBalanceInfo?.totalLeaveBalance)) * 100
                }
                strokeColor={{
                  '0%': '#6e3ec4',
                  '100%': '#bb69d8'
                }}
                strokeWidth={10}
                strokeLinecap='round'
                status={'normal'}
                format={() => `${leaveBalanceInfo?.restLeaveBalance} ngày`}
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className='box-container'>
              <div className='border-top-gradient border-top-gradient-two' />
              <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>
                Số ngày phép đã dùng trong tháng
              </div>
              <Progress
                type='circle'
                percent={Number(leaveBalanceInfo?.usedLeaveBalance) ? 100 : 0}
                strokeColor={{
                  '0%': '#ef6f62',
                  '100%': '#f4a66a'
                }}
                strokeWidth={10}
                strokeLinecap='round'
                status={'normal'}
                format={() => `${Number(leaveBalanceInfo?.usedLeaveBalance)} ngày `}
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className='box-container'>
              <div className='border-top-gradient border-top-gradient-three' />
              <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Thời gian làm thêm trong tháng</div>
              <Progress
                type='circle'
                percent={Number(leaveBalanceInfo?.overtime) ? 100 : 0}
                strokeColor={{
                  '0%': '#f639c0',
                  '100%': '#f544c4'
                }}
                strokeWidth={10}
                strokeLinecap='round'
                status={'normal'}
                format={() => `${Number(leaveBalanceInfo?.overtime)} giờ `}
              />
            </div>
          </Col>
        </Row>

        <div className='tw-mt-[30px] report-description tw-text-md tw-italic tw-text-sky-700'>Thông tin chi tiết</div>
        {renderRow('Tổng số ngày nghỉ phép trong năm', leaveBalanceInfo?.totalLeaveBalance, 'ngày')}
        {renderRow('Số ngày nghỉ phép còn lại', leaveBalanceInfo?.restLeaveBalance, 'ngày')}
        {renderRow('Số ngày nghỉ phép đã dùng trong tháng', leaveBalanceInfo?.usedLeaveBalance, 'ngày')}
        {renderRow('Số giờ làm thêm trong tháng', leaveBalanceInfo?.overtime, 'giờ')}
      </div>
    </div>
  )
}

export default Index
