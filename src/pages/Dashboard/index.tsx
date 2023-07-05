import React from 'react'
import { Button, Col, DatePicker, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { DownloadOutlined } from '@ant-design/icons'
import InfoItem from './component/InfoItem'
import IconWaveRed from '~/assets/images/dashboard/icon_wave_red.svg'
import IconWaveOrange from '~/assets/images/dashboard/icon_wave_orange.svg'
import IconWaveBlue from '~/assets/images/dashboard/icon_wave_blue.svg'
import './style.scss'
import Rankings from './component/Rankings'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { RangePicker } = DatePicker
  const departmentList = [
    {
      value: 'hcns',
      label: 'Phòng Hành chính nhân sự'
    },
    {
      value: 'ketoan',
      label: 'Phòng kế toán'
    }
  ]
  const handleExportExcel = (): void => {
    console.log('Export excel')
  }

  return (
    <div className='dashboard'>
      <p className='dashboard__title'>{t('dashboard.dashboard')}</p>
      <Row gutter={[24, 24]} className='dashboard-filter'>
        <Col xs={24} lg={8}>
          <Select
            showSearch
            allowClear
            placeholder='Lọc theo phòng ban'
            optionFilterProp='children'
            onChange={() => void {}}
            onClear={() => void {}}
            onSearch={() => void {}}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={departmentList}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RangePicker />
        </Col>
        <Col xs={24} lg={8} className='d-flex'>
          <Button onClick={handleExportExcel} type='primary' icon={<DownloadOutlined />}>
            Xuất file Excel
          </Button>
        </Col>
      </Row>
      <Row gutter={[24, 24]} className='dashboard-info'>
        <Col xs={24} xl={8}>
          <InfoItem title='Số lần đi muộn, về sớm' count={52} unit='lần' percent={-20} image={IconWaveRed} />
        </Col>
        <Col xs={24} xl={8}>
          <InfoItem title='Số ngày công tác' count={12} unit='ngày' percent={-10} image={IconWaveOrange} />
        </Col>
        <Col xs={24} xl={8}>
          <InfoItem title='Số ngày nghỉ phép' count={2} unit='ngày' percent={10} image={IconWaveBlue} />
        </Col>
      </Row>
      <Row gutter={[10, 10]} className='dashboard-statistic'>
        <Col xs={24} xl={8}>
          <Rankings />
        </Col>
        <Col xs={24} xl={16}>
          <div className='dashboard-statistic-chart'>
            <p className='dashboard-statistic-chart__title'>Biểu đồ đi muộn/về sớm theo phòng ban</p>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
