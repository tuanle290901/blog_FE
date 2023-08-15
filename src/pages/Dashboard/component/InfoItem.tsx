import React from 'react'
import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

interface Idata {
  title: string
  count: number
  percent: number
  image: string
  unit: string
}

const InfoItem: React.FC<Idata> = (data) => {
  const { t } = useTranslation()
  return (
    <div className='dashboard-info-item'>
      <p className='tw-mb-[30px]'>
        <span className='tw-font-bold'>{data.title}</span>
        <span className='tw-text-[#BFBFBF] tw-ml-[5px]'>/ {t('dashboard.month')}</span>
      </p>
      <Row gutter={[10, 10]} className='tw-justify-between tw-items-end'>
        <Col xs={24} lg={12}>
          <p className='tw-text-[35px] tw-font-bold tw-mb-[15px]'>
            {data.count} {data.unit}
          </p>
          <p>
            <span className={`${data.percent > 0 ? 'tw-text-[#52C41A]' : 'tw-text-[#F5222D]'} tw-font-bold`}>
              {data.percent > 0 ? `+` : ''}
              {data.percent}%
            </span>
            <span className='tw-text-[#BFBFBF] tw-ml-[5px]'>({t('dashboard.comparedWithPreviousMonth')})</span>
          </p>
        </Col>
        <Col xs={24} lg={12} className='tw-text-right'>
          <img className='tw-w-[100%] tw-max-w-[250px]' src={data.image} alt='' />
        </Col>
      </Row>
    </div>
  )
}

export default InfoItem
