import React, { memo } from 'react'
import { LocalStorage } from '~/utils/local-storage.ts'
import { Navigate } from 'react-router-dom'
const RequireAuth: React.FC<{ allowedRoles: Array<string>; children: any }> = ({ allowedRoles, children }) => {
  // TODO use state
  const user = LocalStorage.getObject<{ role: string }>('user') || { role: 'Guest' }
  if ((user && allowedRoles?.includes(user?.role)) || (allowedRoles.length === 0 && !!user)) {
    return children
  }
  if (user) {
    return <Navigate to='/unauthorized' replace />
  }
  return <Navigate to='/login' replace />
}

export default memo(RequireAuth)
