import { Outlet } from 'react-router-dom'
import iconFaceDetection from '~/assets/images/login/cham-cong-khuon-mat.png'

const AuthLayout: React.FC = () => {
  return (
    <div className='auth-container'>
      <div className='auth-inner-container tw-w-full tw-h-full'>
        <div className='auth-container__left tw-w-1/2 tw-hidden lg:tw-block'>
          <img src={iconFaceDetection} alt='' style={{ width: '100%', height: '100%' }} />
        </div>
        <div className='auth-container__right tw-w-full lg:tw-w-1/2'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
