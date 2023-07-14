import { Outlet } from 'react-router-dom'
import bgLogin from '~/assets/images/login/bg-login.png'
import iconPlay from '~/assets/images/login/icon-play.png'

const AuthLayout: React.FC = () => {
  return (
    <div className='auth-container'>
      <div className='auth-inner-container tw-w-full tw-h-full'>
        <div className='auth-container__left tw-w-1/2 tw-hidden lg:tw-block'>
          <div className='inner-container'>
            <img src={bgLogin} alt='' className='tw-w-full tw-h-full tw-absolute' />
            <div className='tw-w-full tw-h-full tw-absolute modal-inner md:tw-p-[10px] xl:tw-pl-[50px]'>
              <div className='tw-flex tw-items-center tw-w-full'>
                <img src={iconPlay} alt='' /> <span className='tw-text-4xl tw-text-white'>Hệ thống quản lý </span>
              </div>
              <div className='tw-flex tw-items-center tw-w-full'>
                <span className='tw-text-4xl tw-text-sky-600'>chấm công bằng khuôn mặt</span>
              </div>
              <div className='tw-hidden xl:tw-block login-title-note tw-mt-[20px]'>
                <div className='tw-mb-[10px]'>Quản lý, phê duyệt yêu cầu làm thêm, nghỉ bù</div>
                <div>Thống kê, tổng hợp thông tin chấm công</div>
              </div>
            </div>
          </div>
        </div>
        <div className='auth-container__right tw-w-full lg:tw-w-1/2'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
