import React, { memo } from 'react'
import { LocalStorage } from '~/utils/local-storage.ts'
import { Navigate } from 'react-router-dom'
import { LOCAL_STORAGE } from './Constant'
const RequireAuth: React.FC<{ allowedRoles: Array<string>; children: any }> = ({ allowedRoles, children }) => {
  // TODO use state
  const user = LocalStorage.getObject<{ role: string }>(LOCAL_STORAGE.AUTH_INFO)
  if ((user && allowedRoles?.includes(user?.role)) || (allowedRoles.length === 0 && !!user)) {
    return children
  }
  if (user) {
    return <Navigate to='/unauthorized' replace />
  }
  return <Navigate to='/auth/login' replace />
}

export default memo(RequireAuth)
