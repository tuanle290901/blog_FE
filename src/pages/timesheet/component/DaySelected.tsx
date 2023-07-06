import { Col, Row } from 'antd'
import React from 'react'
import { IAttendance } from '~/types/attendance.interface'

const DaySelected: React.FC<{ data: IAttendance[] }> = ({ data }) => {
  return (
    <div>
      <div className='timesheet-listday'>
        {data.map((item) => (
          <div
            key={item.id}
            className={`${
              item.status === 'ontime'
                ? 'tw-bg-[#389E0D]'
                : item.status === 'waiting'
                ? 'tw-bg-[#096DD9]'
                : 'tw-bg-[#D46B08]'
            } timesheet-listday-item`}
          >
            <p className='tw-mb-1'>{item.date}</p>
            <p className='tw-text-[18px]'>{item.date}</p>
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
