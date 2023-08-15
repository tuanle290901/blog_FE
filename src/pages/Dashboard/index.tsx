import React, { useEffect, useState } from 'react'
import InfoItem from './component/InfoItem'
import IconWaveRed from '~/assets/images/dashboard/icon_wave_red.svg'
import IconWaveOrange from '~/assets/images/dashboard/icon_wave_orange.svg'
import IconWaveBlue from '~/assets/images/dashboard/icon_wave_blue.svg'
import Rankings from './component/Rankings'
import ViolateChart from './component/ViolateChart'
import { Button, Col, DatePicker, Row, Select, notification } from 'antd'
import './style.scss'
import { useTranslation } from 'react-i18next'
import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import {
  exportTimesheet,
  filterTimesheet,
  getEmployeeWorkingTime,
  getUserInGroup
} from '~/stores/features/timesheet/timesheet.slice'
import { IPaging, ISort } from '~/types/api-response.interface'
import { LocalStorage } from '~/utils/local-storage'
import { IUser } from '~/types/user.interface'
import { filterTypesOfLeave } from '~/stores/features/types-of-leave/types-of-leave.slice'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { RangePicker } = DatePicker
  const { Option } = Select
  const currentAuth: IUser | null = LocalStorage.getObject('currentAuth')
  const userGroup = currentAuth?.groupProfiles[0]?.groupCode
  const groupsSate = useAppSelector((state) => state.masterData.groups)
  const timesheetSate = useAppSelector((state) => state.timesheet)
  const usersInGroupSate = useAppSelector((state) => state.timesheet.userInGroup)
  const [selectedGroup, setSelectedGroup] = useState(userGroup)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isAllowedAccess, setIsAllowedAccess] = useState(
    currentAuth?.groupProfiles[0]?.role === 'SYSTEM_ADMIN' ? true : false
  )
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs())
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs())
  const [selectedTimeRange, setSelectedTimeRange] = useState('')

  const [searchValue, setSearchValue] = useState<{
    query: string
    group?: string | null
    userId?: string | null
    startDate?: string | null
    endDate?: string | null
    paging: IPaging
    sorts: ISort[]
    onlyShowWorkingDay?: boolean
  }>({
    query: '',
    paging: {
      page: 0,
      size: 10,
      total: 0,
      totalPage: 0
    },
    sorts: []
  })

  const handleSelectDate = (dataSelected: any) => {
    setSelectedStartDate(dayjs(dataSelected[0]))
    setSelectedEndDate(dayjs(dataSelected[1]))
    if (dayjs(dataSelected[0]).year() !== dayjs(dataSelected[1]).year()) {
      notification.warning({ message: 'Chỉ được chọn ngày trong cùng một năm' })
      return
    }
    if (dataSelected[0] && dataSelected[1]) {
      setSearchValue((prevState) => {
        return {
          ...prevState,
          paging: { ...prevState.paging, page: 0 },
          startDate: dayjs(dataSelected[0]).format('YYYY-MM-DD'),
          endDate: dayjs(dataSelected[1]).format('YYYY-MM-DD')
        }
      })
    }
  }

  const handleSelectToday = () => {
    setSelectedTimeRange('today')
    setSelectedStartDate(dayjs())
    setSelectedEndDate(dayjs())
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
      }
    })
  }

  const handleSelectThisMonth = () => {
    setSelectedTimeRange('this_month')
    setSelectedStartDate(dayjs().startOf('M'))
    setSelectedEndDate(dayjs())
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs().startOf('M').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
      }
    })
  }

  const handleSelectLastMonth = () => {
    setSelectedTimeRange('last_month')
    setSelectedStartDate(
      dayjs()
        .month(dayjs().month() - 1)
        .startOf('M')
    )
    setSelectedEndDate(
      dayjs()
        .month(dayjs().month() - 1)
        .endOf('M')
    )
    setSearchValue((prevState) => {
      return {
        ...prevState,
        paging: { ...prevState.paging, page: 0 },
        startDate: dayjs()
          .month(dayjs().month() - 1)
          .startOf('M')
          .format('YYYY-MM-DD'),
        endDate: dayjs()
          .month(dayjs().month() - 1)
          .endOf('M')
          .format('YYYY-MM-DD')
      }
    })
  }

  const handleSelectGroup = (value: string) => {
    setSelectedUser(null)
    setSelectedGroup(value)
  }

  useEffect(() => {
    dispatch(getEmployeeWorkingTime())
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, group: selectedGroup }
    })
    const promiseFilterTypesOfLeave = dispatch(
      filterTypesOfLeave({
        paging: null,
        sorts: null,
        query: null
      })
    )
    return () => {
      promiseFilterTypesOfLeave.abort()
    }
  }, [])
  useEffect(() => {
    const promise = dispatch(getUserInGroup(selectedGroup))
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, group: selectedGroup }
    })
    return () => promise.abort()
  }, [selectedGroup])

  useEffect(() => {
    setSearchValue((prevState) => {
      return { ...prevState, paging: { ...prevState.paging, page: 0 }, userId: selectedUser }
    })
  }, [selectedUser])

  useEffect(() => {
    const promise = dispatch(
      filterTimesheet({
        paging: searchValue.paging,
        sorts: searchValue.sorts,
        query: searchValue.query,
        groupCode: searchValue.group,
        startDate: searchValue.startDate,
        endDate: searchValue.endDate,
        userId: searchValue.userId,
        onlyShowWorkingDay: false
      })
    )
    return () => {
      promise.abort()
    }
  }, [searchValue])

  return (
    <div className='dashboard'>
      <p className='dashboard__title'>{t('dashboard.title')}</p>
      <Row gutter={[24, 16]} className='dashboard-filter'>
        <Col xs={24} xl={16}>
          <Row gutter={[16, 16]}>
            <Col>
              <Select
                className='tw-w-[200px]'
                showSearch
                placeholder={`${t('rootInit.requiredSelect')} ${t('rootInit.group')}`}
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label + '').toLowerCase().includes(input.toLowerCase())}
                onChange={(value) => handleSelectGroup(value)}
                defaultValue={userGroup}
              >
                {groupsSate?.length > 0 &&
                  groupsSate?.map((i) => (
                    <Option key={i?.code} label={i?.name} value={i?.code}>
                      {i?.name}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col>
              <RangePicker
                onChange={handleSelectDate}
                format='DD/MM/YYYY'
                placeholder={[t('timesheet.from'), t('timesheet.to')]}
                defaultValue={[dayjs(), dayjs()]}
                value={[selectedStartDate, selectedEndDate]}
                allowClear={false}
                disabledDate={(date) => {
                  return date.isAfter(new Date())
                }}
                renderExtraFooter={() => (
                  <div className='timesheet-filter-time__button'>
                    <Button
                      onClick={handleSelectToday}
                      size='small'
                      className={selectedTimeRange === 'today' ? 'selected' : ''}
                    >
                      {t('timesheet.today')}
                    </Button>
                    <Button
                      onClick={handleSelectThisMonth}
                      size='small'
                      className={selectedTimeRange === 'this_month' ? 'selected' : ''}
                    >
                      {t('timesheet.thisMonth')}
                    </Button>
                    <Button
                      onClick={handleSelectLastMonth}
                      size='small'
                      className={selectedTimeRange === 'last_month' ? 'selected' : ''}
                    >
                      {t('timesheet.lastMonth')}
                    </Button>
                  </div>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} xl={8}>
          <Row gutter={[12, 16]} className='tw-flex tw-justify-end tw-text-right'>
            <Col>
              <Button
                icon={<UploadOutlined />}
                className='timesheet-filter__export'
                onClick={() =>
                  dispatch(
                    exportTimesheet({
                      paging: searchValue.paging,
                      sorts: searchValue.sorts,
                      query: searchValue.query,
                      groupCode: searchValue.group,
                      startDate: searchValue.startDate,
                      endDate: searchValue.endDate,
                      userId: searchValue.userId
                    })
                  )
                }
              >
                {t('dashboard.exportData')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[24, 16]} className='dashboard-info'>
        <Col xs={24} xl={8}>
          <InfoItem
            title={t('dashboard.violateAmount')}
            count={52}
            unit={t('dashboard.bout')}
            percent={-20}
            image={IconWaveRed}
          />
        </Col>
        <Col xs={24} xl={8}>
          <InfoItem
            title={t('dashboard.onBussinessAmount')}
            count={12}
            unit={t('dashboard.day')}
            percent={-10}
            image={IconWaveOrange}
          />
        </Col>
        <Col xs={24} xl={8}>
          <InfoItem
            title={t('dashboard.LeaveAmount')}
            count={2}
            unit={t('dashboard.day')}
            percent={10}
            image={IconWaveBlue}
          />
        </Col>
      </Row>
      <Row gutter={[24, 16]} className='dashboard-statistic'>
        <Col xs={24} xl={8}>
          <Rankings />
        </Col>
        <Col xs={24} xl={16}>
          <div className='dashboard-statistic-chart'>
            <p className='dashboard-statistic-chart__title'>
              {t('dashboard.violateChartTitle')}
              <span className='tw-italic tw-ml-1'>
                {groupsSate?.length > 0 && groupsSate?.find((item) => item?.code === selectedGroup)?.name}
              </span>
            </p>
            <ViolateChart />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
