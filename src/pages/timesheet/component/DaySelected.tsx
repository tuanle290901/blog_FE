import { Col, Row } from 'antd'
import React from 'react'
import { IAttendance } from '~/types/attendance.interface'
import dayjs from 'dayjs'

const DaySelected: React.FC<{ data: IAttendance[] }> = ({ data }) => {
  const handleGenderColor = (status: string) => {
    switch (status) {
      case 'ontime':
        return 'tw-bg-[#389E0D]'
      case 'waiting':
        return 'tw-bg-[#096DD9]'
      case 'early':
        return 'tw-bg-[#D46B08]'
      case 'late':
        return 'tw-bg-[#D46B08]'
      default:
        return 'tw-bg-[#BFBFBF]'
    }
  }

  const handleGenderDayOfWeek = (day: number) => {
    switch (day) {
      case 0:
        return 'CN'
      case 1:
        return 'T2'
      case 2:
        return 'T3'
      case 3:
        return 'T4'
      case 4:
        return 'T5'
      case 5:
        return 'T6'
      case 6:
        return 'T7'
      default:
        return '--'
    }
  }

  return (
    <div>
      <div className='timesheet-listday'>
        {data.map((item) => (
          <div key={item.id} className={`${handleGenderColor(item.status)} timesheet-listday-item`}>
            <p className='tw-mb-1'>{handleGenderDayOfWeek(dayjs(item.date).day())}</p>
            <p className='tw-text-[18px]'>{dayjs(item.date).date()}</p>
          </div>
        ))}
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className='timesheet-workday'>
            <p>Số ngày công</p>
            <span>22</span>
          </div>
        </Col>
        <Col xs={24} lg={12} className='tw-flex'>
          <div className='tw-flex tw-ml-auto'>
            <div className='timesheet-statistic'>
              <p>Đúng giờ:</p>
              <span>17</span>
            </div>
            <div className='timesheet-statistic timesheet-statistic__violate'>
              <p>Vi phạm:</p>
              <span>4</span>
            </div>
            <div className='timesheet-statistic timesheet-statistic__waiting'>
              <p>Đang chờ:</p>
              <span>1</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DaySelected
