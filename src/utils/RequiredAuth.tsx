import React, { memo } from 'react'
import { Navigate } from 'react-router-dom'
import { useUserInfo } from '~/stores/hooks/useUserProfile.tsx'
import { hasPermission } from '~/utils/helper.ts'
import { ROLE } from '~/constants/app.constant.ts'

const RequireAuth: React.FC<{ allowedRoles: ROLE[]; children: any }> = ({ allowedRoles, children }) => {
  // TODO use state
  const { userInfo } = useUserInfo()
  if (userInfo && hasPermission(allowedRoles, userInfo.groupProfiles)) {
    return children
  }
  if (userInfo) {
    return <Navigate to='/unauthorized' replace />
  }
  return <Navigate to='/auth/login' replace />
}

export default memo(RequireAuth)
