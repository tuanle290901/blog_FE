import { useEffect } from 'react'
import useLocalStorage from './useLocaStorage'
import { useAppSelector } from '../hook'
import { setAccessToken } from '../features/auth/auth.slice'

const initialState = null
const KEY = 'accessToken'

export const useAccessToken = () => {
  const [local, setLocal] = useLocalStorage(KEY, initialState)
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  useEffect(() => {
    if (local && !accessToken) {
      setAccessToken(local)
    }

    if (!local && accessToken) {
      setLocal(accessToken)
    }
  }, [local, accessToken, setLocal])

  const removeAccessToken = () => {
    setAccessToken(null)
    setLocal(null)
  }

  return {
    accessToken,
    removeAccessToken
  }
}
