import { useEffect, useState } from 'react'
import { Col, Progress, Row, Select, Space } from 'antd'
import './style.scss'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { findLeaveBalance, getLeaveBalance } from '~/stores/features/leave-balance/leave-balance.slice'
import { searchUser } from '~/stores/features/user/user.slice'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { ROLE } from '~/constants/app.constant'

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
        <div
          className={`tw-text-md tw-w-[180px] md:tw-w-[220px] ${
            level === 'child' ? 'tw-indent-[50px]' : 'tw-font-semibold'
          }`}
        >
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
  const userList = useAppSelector((item) => item.user.userList)
  const { userInfo } = useUserInfo()
  const [currenSelectUser, setCurrentSelectUser] = useState<string>('')
  const isSystemAdmin = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)

  useEffect(() => {
    dispatch(
      searchUser({
        paging: { page: 0, size: 100000, total: 100000, totalPage: 100000 },
        sorts: [],
        query: '',
        groupCode: null,
        status: null
      })
    )
  }, [])

  useEffect(() => {
    if (userInfo && userInfo.userName) {
      setCurrentSelectUser(userInfo.userName)
    }
  }, [userInfo])

  useEffect(() => {
    if (currenSelectUser) {
      dispatch(findLeaveBalance(currenSelectUser))
    }
  }, [currenSelectUser])

  return (
    <div className='statistical-wrapper'>
      <div className='statistical-container'>
        <Row justify='space-between'>
          <Col>
            <div className='report-title tw-text-lg tw-font-semibold'>Thống kê thông tin dữ liệu trong tháng</div>
          </Col>
          {isSystemAdmin && (
            <Col>
              <Space>
                <span>Nhân viên:</span>
                <Select
                  showSearch
                  value={currenSelectUser}
                  onChange={(val) => setCurrentSelectUser(val)}
                  className='tw-min-w-[380px]'
                  optionFilterProp='children'
                  filterOption={(input, option) => {
                    return (option?.label + '').toLowerCase().includes(input.toLowerCase())
                  }}
                  options={userList.map((user) => {
                    return {
                      label: user?.fullName + ' (' + user?.userName + ')',
                      value: user?.userName
                    }
                  })}
                />
              </Space>
            </Col>
          )}
        </Row>

        <div className='report-description tw-text-md tw-mt-2 tw-italic tw-text-sky-700'>
          Tổng hợp thống kê thông tin vi phạm, thông tin phép của nhân viên trong tháng
        </div>

        {leaveBalanceInfo?.totalRemainLeaveMinutes !== undefined && (
          <>
            <Row className='tw-mt-3' gutter={[32, 16]}>
              <Col xs={24} lg={6}>
                <div className='box-container'>
                  <div className='border-top-gradient border-top-gradient-two' />
                  <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>Số giờ công tác</div>
                  <Progress
                    size={150}
                    type='circle'
                    percent={Number(leaveBalanceInfo?.totalBusiness) ? 100 : 0}
                    strokeColor={{
                      '0%': '#ef6f62',
                      '100%': '#f4a66a'
                    }}
                    strokeWidth={8}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() => `${Number((leaveBalanceInfo?.totalBusiness ?? 0).toFixed(2))} giờ `}
                  />
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className='box-container'>
                  <div className='border-top-gradient border-top-gradient-one' />
                  <div className='tw-mb-[30px] tw-font-bold tw-text-sm tw-text-center'>
                    Số phút còn lại / Tổng số phút nghỉ phép năm
                  </div>
                  <Progress
                    size={150}
                    type='circle'
                    percent={
                      (leaveBalanceInfo?.totalRemainLeaveMinutes /
                        (leaveBalanceInfo?.totalRemainLeaveMinutes + leaveBalanceInfo?.totalUsedLeaveMinutes)) *
                      100
                    }
                    strokeColor={{
                      '0%': '#c259e9',
                      '100%': '#d08ee7'
                    }}
                    strokeWidth={8}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() =>
                      `${Number(leaveBalanceInfo?.totalRemainLeaveMinutes)?.toFixed(0)}/${Number(
                        (leaveBalanceInfo?.totalRemainLeaveMinutes + leaveBalanceInfo?.totalUsedLeaveMinutes)?.toFixed(
                          0
                        )
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
                    size={150}
                    type='circle'
                    percent={Number(leaveBalanceInfo?.totalViolates) ? 100 : 0}
                    strokeColor={{
                      '0%': '#30A2FF',
                      '100%': '#a5e0f1'
                    }}
                    strokeWidth={8}
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
                    size={150}
                    type='circle'
                    percent={Number(leaveBalanceInfo?.totalOverTimeHours) ? 100 : 0}
                    strokeColor={{
                      '0%': '#ecbf38',
                      '100%': 'rgb(238, 229, 172)'
                    }}
                    strokeWidth={8}
                    strokeLinecap='round'
                    status={'normal'}
                    format={() => `${Number((leaveBalanceInfo?.totalOverTimeHours ?? 0).toFixed(2))} giờ `}
                  />
                </div>
              </Col>
            </Row>
            <div className='tw-mt-[30px] report-description tw-text-md tw-italic tw-text-sky-700'>
              Thông tin chi tiết trong tháng
            </div>
            <Row align={'top'} gutter={[32, 16]}>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow('Số giờ công tác', Number((leaveBalanceInfo?.totalBusiness ?? 0).toFixed(2)), 'giờ')}
              </Col>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow(
                  'Số phút nghỉ phép còn lại',
                  Number((leaveBalanceInfo?.totalRemainLeaveMinutes ?? 0).toFixed(0)),
                  'phút'
                )}
                {renderRow(
                  'Số phút nghỉ phép đã dùng',
                  Number((leaveBalanceInfo?.totalUsedLeaveMinutes ?? 0).toFixed(0)),
                  'phút'
                )}
              </Col>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow('Số lần đi muộn/ về sớm', leaveBalanceInfo?.totalViolates, 'lần')}
                {renderRow('Đi muộn:', leaveBalanceInfo?.totalLateCome, 'lần', 'child')}
                {renderRow('Về sớm:', leaveBalanceInfo?.totalEarlyBack, 'lần', 'child')}
              </Col>
              <Col xs={24} xl={12} xxl={6}>
                {renderRow('Số giờ làm thêm', Number((leaveBalanceInfo?.totalOverTimeHours ?? 0).toFixed(2)), 'giờ')}
                {leaveBalanceInfo?.overTimeInfoList?.map((item, index) => {
                  return (
                    <div key={index}>
                      {renderRow(
                        mappingOvertimeKey(item.key),
                        Number(item.value ?? 0).toFixed(item.value ? 2 : 0),
                        'giờ',
                        'child'
                      )}
                    </div>
                  )
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
