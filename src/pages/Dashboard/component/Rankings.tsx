import React from 'react'
import IconRankGold from '~/assets/images/dashboard/icon_rank_gold.svg'
import IconRankSilver from '~/assets/images/dashboard/icon_rank_silver.svg'
import IconRankCopper from '~/assets/images/dashboard/icon_rank_copper.svg'
import DefaultImage from '~/assets/images/default-img.png'
import { useTranslation } from 'react-i18next'

interface IViolateRanking {
  rank: number
  fullname: string
  image: string
  department: string
  totalLate: number
  totalEarly: number
}

const Rankings: React.FC = () => {
  const { t } = useTranslation()
  const rankingsData: IViolateRanking[] = [
    {
      rank: 1,
      fullname: 'Nguyễn Thúc Thùy Tiên',
      image: 'string',
      department: 'Phòng kế toán',
      totalLate: 2,
      totalEarly: 3
    },
    {
      rank: 2,
      fullname: 'Nguyễn Trọng Hưng',
      image: 'string',
      department: 'Công ty HTSC',
      totalLate: 2,
      totalEarly: 2
    },
    {
      rank: 3,
      fullname: 'Đào Bá Lộc',
      image: 'string',
      department: 'Ban KD-DA',
      totalLate: 2,
      totalEarly: 1
    },
    {
      rank: 4,
      fullname: 'Trần Trung Trực',
      image: 'string',
      department: 'Phòng Kinh tế',
      totalLate: 1,
      totalEarly: 2
    },
    {
      rank: 5,
      fullname: 'Hoàng Trọng Lân',
      image: 'string',
      department: 'Phòng Kế toán',
      totalLate: 1,
      totalEarly: 1
    },
    {
      rank: 6,
      fullname: 'Lê Quang Huy',
      image: 'string',
      department: 'Công ty HTSC',
      totalLate: 1,
      totalEarly: 0
    },
    {
      rank: 7,
      fullname: 'Đinh Quang Đức',
      image: 'string',
      department: 'Công ty HTSC',
      totalLate: 0,
      totalEarly: 1
    }
    // ,{
    //   rank: 8,
    //   fullname: 'Đinh Quang Đức',
    //   image: 'string',
    //   department: 'Công ty HTSC',
    //   totalLate: 0,
    //   totalEarly: 1
    // },
    // {
    //   rank: 9,
    //   fullname: 'Đinh Quang Đức',
    //   image: 'string',
    //   department: 'Công ty HTSC',
    //   totalLate: 0,
    //   totalEarly: 1
    // },
    // {
    //   rank: 10,
    //   fullname: 'Đinh Quang Đức',
    //   image: 'string',
    //   department: 'Công ty HTSC',
    //   totalLate: 0,
    //   totalEarly: 1
    // }
  ]
  return (
    <div className='dashboard-statistic-rank'>
      <p className='dashboard-statistic-rank__title'>{t('dashboard.violateRankTitle')}</p>
      <div className='rank-table'>
        <div className='rank-table-header'>
          <span className='rank-table-header__no'>{t('dashboard.rank')}</span>
          <span className='rank-table-header__name'>{t('dashboard.fullname')}</span>
          <span className='rank-table-header__amount'>{t('dashboard.amount')}</span>
        </div>
        <div className={`rank-table-body ${rankingsData?.length > 7 ? 'rank-table-body--scroll' : ''}`}>
          {rankingsData?.map((item) => (
            <div className='rank-table-body-item' key={item?.rank}>
              <div className='rank-table-body-item__no'>
                {item?.rank < 4 ? (
                  <img
                    src={item?.rank === 1 ? IconRankGold : item?.rank === 2 ? IconRankSilver : IconRankCopper}
                    alt=''
                    className='tw-w-full'
                  />
                ) : (
                  `${item?.rank}.`
                )}
              </div>
              <div className='rank-table-body-item__name'>
                <img className='tw-w-[auto] tw-h-[35px]' src={DefaultImage} alt='' />
                <div className='tw-ml-2'>
                  <p className='tw-mb-[5px]'>{item?.fullname}</p>
                  <p className='tw-italic tw-text-[12px]'>{item?.department}</p>
                </div>
              </div>
              <div className='rank-table-body-item__amount'>
                <span className='tw-mr-[5px]'>{item?.totalLate + item?.totalEarly}</span>(
                <span className='tw-text-[#FF4D4F]'>{item?.totalLate}</span>/
                <span className='tw-text-[#36CFC9]'>{item?.totalEarly}</span>)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Rankings
