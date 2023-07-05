import React from 'react'
import IconRankGold from '~/assets/images/dashboard/icon_rank_gold.svg'
import IconRankSilver from '~/assets/images/dashboard/icon_rank_silver.svg'
import IconRankCopper from '~/assets/images/dashboard/icon_rank_copper.svg'
interface Idata {
  rank: number
  fullname: number
  image: string
  department: string
  totalLate: number
  totalEarly: number
}

const Rankings: React.FC<Idata> = () => {
  const rankingsData = [
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
      totalLate: 1,
      totalEarly: 2
    },
    {
      rank: 3,
      fullname: 'Đào Bá Lộc',
      image: 'string',
      department: 'Ban KD-DA',
      totalLate: 1,
      totalEarly: 1
    },
    {
      rank: 4,
      fullname: 'Hoàng Trọng Lân',
      image: 'string',
      department: 'Phòng Kinh tế',
      totalLate: 1,
      totalEarly: 0
    }
  ]
  return (
    <div className='dashboard-statistic-rank'>
      <p className='dashboard-statistic-rank__title'>Bảng xếp hạng đi muộn/ về sớm</p>
      <div className='rank-table'>
        <div className='rank-table-header'>
          <span>Thứ hạng</span>
          <span>Họ tên</span>
          <span>Số lần</span>
        </div>
        <div className='rank-table-body'>
          {rankingsData?.map((item) => (
            <div className='rank-table-body-item' key={item?.rank}>
              <div>
                {item?.rank < 4 ? (
                  <img
                    src={item?.rank === 1 ? IconRankGold : item?.rank === 2 ? IconRankSilver : IconRankCopper}
                    alt=''
                  />
                ) : (
                  `${item?.rank}.`
                )}
              </div>
              <div className='tw-flex'>
                <img className='tw-w-[80px]' src={IconRankGold} alt='' />
                <div className='tw-text-left'>
                  <p className='tw-mb-[10px]'>{item?.fullname}</p>
                  <p className='tw-italic'>{item?.department}</p>
                </div>
              </div>
              <div>
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
