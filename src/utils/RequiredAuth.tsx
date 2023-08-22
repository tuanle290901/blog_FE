import React, { memo } from 'react'
import { Navigate } from 'react-router-dom'
import { useUserInfo } from '~/stores/hooks/useUserProfile.tsx'
import { hasPermission } from '~/utils/helper.ts'
import { ROLE } from '~/constants/app.constant.ts'
import { LOCAL_STORAGE } from '~/utils/Constant.tsx'
import { LocalStorage } from '~/utils/local-storage.ts'
import { IUser } from '~/types/user.interface.ts'
import { useAppDispatch } from '~/stores/hook'
import { setHistoryUrl } from '~/stores/features/auth/auth.slice'

const RequireAuth: React.FC<{ allowedRoles: ROLE[]; children: any }> = ({ allowedRoles, children }) => {
  const userInfo = LocalStorage.getObject<IUser>(LOCAL_STORAGE.AUTH_INFO)
  const dispatch = useAppDispatch()
  if (userInfo && hasPermission(allowedRoles, userInfo.groupProfiles)) {
    return children
  }
  if (userInfo) {
    return <Navigate to='/unauthorized' replace />
  }
  dispatch(setHistoryUrl(window.location.href))
  return <Navigate to='/auth/login' replace />
}

export default memo(RequireAuth)
