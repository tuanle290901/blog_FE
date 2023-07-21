import { Col, Row, Switch } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IReportData, IViolate } from '~/types/attendance.interface'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const ViolateAction: React.FC<{ data: IReportData }> = ({ data }) => {
  const [t] = useTranslation()
  const findViolate = (data: IViolate[] | null, violateType: string) => {
    if (!data) return false
    if (data?.findIndex((item: IViolate) => item?.violateType === violateType) > -1) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className='timesheet-violate'>
      {findViolate(data?.violate, 'LATE_COME') && (
        <div className='tw-flex'>
          <p className='timesheet-violate__lable'>{t('timesheet.lateForWork')}</p>
          <Switch
            className='tw-ml-auto'
            checkedChildren={
              <>
                <CheckOutlined /> Có lý do
              </>
            }
            unCheckedChildren='Không lý do'
            onChange={(value) => console.log('Xin đến muộn', value)}
          />
        </div>
      )}
      {findViolate(data?.violate, 'EARLY_BACK') && (
        <div className='tw-flex'>
          <p className='timesheet-violate__lable timesheet-violate__lable--early'>
            {t('timesheet.leavingTheCompanyEarly')}
          </p>
          <Switch
            className='tw-ml-auto'
            checkedChildren={
              <>
                <CheckOutlined /> Có lý do
              </>
            }
            unCheckedChildren='Không lý do'
            onChange={(value) => console.log('Xin về sớm', value)}
          />
        </div>
      )}
      {findViolate(data?.violate, 'FORGET_TIME_ATTENDANCE') && (
        <p className='timesheet-violate__lable timesheet-violate__lable--forget'>
          {t('timesheet.forgetTimeAttendance')}
        </p>
      )}
    </div>
  )
}

export default ViolateAction
