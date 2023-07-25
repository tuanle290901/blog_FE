import { Col, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IAttendance } from '~/types/attendance.interface'
import { ClockCircleOutlined } from '@ant-design/icons'
import ApexCharts from 'react-apexcharts'

const TimesheetChartForAdmin: React.FC<{ data: IAttendance[] }> = ({ data }) => {
  const [t] = useTranslation()

  const option: any = {
    chart: {
      height: 350,
      type: 'heatmap'
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: -1,
              to: 0,
              color: '#a7a7a7',
              name: '--'
            },
            {
              from: 2,
              to: 4,
              color: '#7cb3ff',
              name: '2-4h'
            },
            {
              from: 4,
              to: 6,
              color: '#4096ff',
              name: '4-6h'
            },
            {
              from: 6,
              to: 8,
              color: '#1677ff',
              name: '6-8h'
            }
          ]
        },
        position: 'bottom'
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#008FFB']
  }

  const formatData = (data: any) => {
    const newData = []
    const categories = [
      'Tuần 1',
      'Tuần 2',
      'Tuần 4',
      'Tuần 3',
      'Tuần 5',
      'Tuần 6',
      'Tuần 7',
      'Tuần 8',
      'Tuần 9',
      'Tuần 10',
      'Tuần 11',
      'Tuần 12',
      'Tuần 13',
      'Tuần 14',
      'Tuần 15',
      'Tuần 16',
      'Tuần 17',
      'Tuần 18',
      'Tuần 19',
      'Tuần 20',
      'Tuần 21',
      'Tuần 22',
      'Tuần 23',
      'Tuần 24'
    ]

    for (let i = 0; i < categories.length; i++) {
      newData.push({
        x: categories[i],
        y: data[i]
      })
    }
    return newData
  }

  const serie = [
    {
      name: 'Thứ 2',
      data: formatData([0, 2, 3, 0, 2, 3, 0, 6, 8, 3, 0, 6, 8, 5, 0, 9, 5, 0, 9, 6, 8, 5, 0, 9])
    },
    {
      name: 'Thứ 3',
      data: formatData([4, 5, 7, 8, 0, 8, 0, 2, 3, 0, 6, 8, 5, 0, 9, 6, 8, 6, 8, 3, 0, 6, 8, 5])
    },
    {
      name: 'Thứ 4',
      data: formatData([0, 2, 6, 8, 2, 3, 6, 8, 3, 0, 6, 8, 5, 0, 6, 8, 5, 0, 9, 7, 6, 1, 0, 0])
    },
    {
      name: 'Thứ 5',
      data: formatData([0, 5, 2, 3, 0, 6, 8, 5, 0, 9, 6, 8, 3, 0, 6, 8, 5, 8, 8, 7, 6, 3, 5, 7])
    },
    {
      name: 'Thứ 6',
      data: formatData([0, 5, 0, 7, 2, 3, 0, 6, 8, 5, 6, 8, 3, 0, 6, 8, 5, 0, 9, 8, 8, 5, 9, 0])
    },
    {
      name: 'Thứ 7',
      data: formatData([0, 5, 0, 7, 2, 3, 0, 6, 8, 3, 0, 6, 8, 5, 6, 8, 5, 0, 9, 8, 8, 5, 9, 0])
    },
    {
      name: 'CN',
      data: formatData([0, 0, 0, 0, 0, 0, 0, 6, 8, 3, 0, 6, 8, 5, 0, 0, 5, 0, 0, 0, 0, 5, 9, 0])
    }
  ]

  return (
    <div className='timesheet-chart'>
      <Row gutter={[12, 16]} className='tw-items-center tw-mb-2'>
        <Col xs={24} lg={10} xl={6} className='tw-font-bold'>
          Thống kê xác nhận công của tôi
        </Col>
        <Col xs={24} lg={6} xl={4}>
          <div className='tw-flex tw-items-center'>
            <ClockCircleOutlined className='tw-text-[#4CAF50]' />
            <div className='tw-text-center tw-ml-2'>
              <p className='tw-text-[18px] tw-font-bold tw-mb-1'>08:46</p>
              <p>Trung bình giờ đến</p>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={6} xl={4}>
          <div className='tw-flex tw-items-center'>
            <ClockCircleOutlined className='tw-text-[#F24E1E]' />
            <div className='tw-text-center tw-ml-2'>
              <p className='tw-text-[18px] tw-font-bold tw-mb-1'>17:04</p>
              <p>Trung bình giờ về</p>
            </div>
          </div>
        </Col>
      </Row>
      <ApexCharts options={option} series={serie} type='heatmap' height={200} />
    </div>
  )
}

export default TimesheetChartForAdmin
