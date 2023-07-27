import { Outlet } from 'react-router-dom'
import bgLogin from '~/assets/images/login/bg-login.png'
import iconPlay from '~/assets/images/login/icon-play.png'

const AuthLayout: React.FC = () => {
  return (
    <div className='auth-container'>
      <div className='auth-inner-container tw-w-full tw-h-full'>
        <div className='auth-container__left tw-w-1/2 tw-hidden lg:tw-block'>
          <div className='inner-container'>
            <div className='tw-w-full tw-h-full tw-absolute login-background' />
            <div className='tw-w-full tw-h-full tw-absolute modal-inner md:tw-p-[10px] xl:tw-pl-[50px]'>
              <div>
                <div className='tw-flex tw-items-center tw-w-full'>
                  <span className='tw-text-4xl tw-text-white'>HỆ THỐNG QUẢN LÝ </span>
                </div>
                <div className='tw-flex tw-items-center tw-w-full'>
                  <span className='tw-text-4xl tw-mt-4 tw-mb-4' style={{ color: '#50BDFE' }}>
                    kết hợp
                  </span>
                  <span className='tw-text-4xl tw-mt-4 tw-ml-2 tw-mb-4 tw-text-white'> CHẤM CÔNG </span>
                </div>
                <div className='tw-flex tw-items-center tw-w-full'>
                  <span className='tw-text-4xl' style={{ color: '#50BDFE' }}>
                    bằng khuôn mặt
                  </span>
                </div>
              </div>
              <div className='tw-hidden xl:tw-block login-title-note tw-mt-[20px]'></div>
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
