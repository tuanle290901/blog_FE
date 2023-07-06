import { IRoutes } from '~/constants/public-routes.tsx'
import Dashboard from '~/pages/Dashboard'
import UserList from '~/pages/user-management/user-list.tsx'
import UserHistory from '~/pages/user-management/user-history.tsx'
import { lazy } from 'react'
import Timesheet from '~/pages/timesheet/timesheet'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail',
    history: 'user/history/:id'
  },
  timesheet: '/timesheet'
}

export const PRIVATE_ROUTES: IRoutes[] = [
  {
    name: 'dashboard',
    path: PRIVATE_PATH.home,
    component: Dashboard,
    allowedRoles: []
  },
  {
    name: 'users',
    path: PRIVATE_PATH.user.prefix,
    component: UserList,
    allowedRoles: []
  },
  {
    name: 'userHistory',
    path: PRIVATE_PATH.user.history,
    component: UserHistory,
    allowedRoles: []
  },
  {
    name: 'timesheet',
    path: PRIVATE_PATH.timesheet,
    component: Timesheet,
    allowedRoles: []
  }
]
