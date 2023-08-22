import { useEffect } from 'react'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { setUserInfo } from '../features/auth/auth.slice'
import { useAppDispatch, useAppSelector } from '../hook'
import useLocalStorage from './useLocaStorage'
import { UserProfile } from '~/types/user-profile.interface'
import { IUser } from '~/types/user.interface.ts'

const initialState = {}
const KEY = LOCAL_STORAGE.AUTH_INFO

export const useUserInfo = () => {
  const [local, setLocal] = useLocalStorage(KEY, initialState)
  const userInfo = useAppSelector((state) => state.auth.userInfo) as IUser
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (Object.keys(local).length > 0 && (!userInfo || (userInfo && Object.keys(userInfo).length === 0))) {
      dispatch(setUserInfo({ userInfo: local }))
    }
  }, [local, userInfo, dispatch])

  const setUserProfileInfo = (userProfileInfo: IUser) => {
    setLocal(userProfileInfo)
    setUserInfo(userProfileInfo)
    dispatch(setUserInfo({ userInfo: userProfileInfo }))
  }

  return {
    userInfo,
    setUserProfileInfo
  }
}
