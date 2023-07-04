import React from 'react'
import { useAppDispatch } from '~/stores/hook.ts'
import { Button } from 'antd'
import { login } from '~/stores/features/auth/auth.slice.ts'
import { LoginPayload } from '~/types/login-payload.ts'

const LoginComponent: React.FC = () => {
  const dispatch = useAppDispatch()
  const submitLogin = () => {
    const payload: LoginPayload = { email: 'admin2@gmail.com', password: '123456' }
    dispatch(login(payload))
  }
  return (
    <div className='tw-flex tw-item-centers tw-justify-center'>
      <Button onClick={submitLogin} type='primary'>
        {' '}
        Login{' '}
      </Button>
    </div>
  )
}
export default LoginComponent
