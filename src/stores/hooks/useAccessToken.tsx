import { useEffect } from 'react'
import useLocalStorage from './useLocaStorage'
import { useAppSelector } from '../hook'
import { setAccessToken } from '../features/auth/auth.slice'
import { LOCAL_STORAGE } from '~/utils/Constant'

const initialState = null
const KEY = LOCAL_STORAGE.ACCESS_TOKEN

export const useAccessToken = () => {
  const [local, setLocal] = useLocalStorage(KEY, initialState)
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  useEffect(() => {
    if (local && !accessToken) {
      setAccessToken(local)
    }
  }, [local, accessToken])

  const removeAccessToken = () => {
    setAccessToken(null)
    setLocal(null)
  }

  return {
    accessToken,
    removeAccessToken
  }
}
