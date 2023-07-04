import playIcon from '../assets/images/login/icon-play.png'
import { Outlet } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  return (
    <div className='auth-container'>
      <div className='auth-inner-container'>
        <div className='auth-container__left'>
          <div className='inner-container'>
            <div>
              <div className='tw-flex tw-items-center tw-pt-[10%] tw-mb-[20px]'>
                <img src={playIcon} alt='' /> <span className='text-title__one'>Hệ thống</span>
              </div>
              <div className='text-title__two tw-mb-[20px]'>quản lý chấm công</div>
              <div className='text-title__three tw-mb-[20px]'>bằng khuôn mặt</div>
            </div>

            <div className='tw-mt-[15%]'>
              <div className='tw-mt-[20px] text-title__four'>Quản lý, phê duyệt yêu cầu làm thêm, nghỉ bù</div>
              <div className='tw-mt-[20px] text-title__four'>Thống kê, tổng hợp thông tin chấm công</div>
            </div>
          </div>
        </div>
        <div className='auth-container__right'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
