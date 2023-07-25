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
    const categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']

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
      name: 'T2',
      data: formatData([0, 2, 3, 0, 2, 3, 0, 6, 8, 5, 0, 9, 6, 8, 5, 0, 9])
    },
    {
      name: 'T3',
      data: formatData([4, 5, 7, 8, 0, 8, 0, 2, 3, 0, 6, 8, 5, 0, 9, 6, 8])
    },
    {
      name: 'T4',
      data: formatData([0, 2, 6, 8, 2, 3, 0, 6, 8, 5, 0, 9, 7, 6, 1, 0, 0])
    },
    {
      name: 'T5',
      data: formatData([0, 5, 2, 3, 0, 6, 8, 5, 0, 9, 8, 8, 7, 6, 3, 5, 7])
    },
    {
      name: 'T6',
      data: formatData([0, 5, 0, 7, 2, 3, 0, 6, 8, 5, 0, 9, 8, 8, 5, 9, 0])
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
