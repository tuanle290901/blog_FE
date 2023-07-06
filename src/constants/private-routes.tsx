import { IRoutes } from '~/constants/public-routes.tsx'
import Dashboard from '~/pages/Dashboard'
import UserList from '~/pages/user-management/user-list.tsx'
import ApprovalProcess from '~/pages/setting/approval-process'
import UserHistory from '~/pages/user-management/user-history.tsx'
import { lazy } from 'react'
import Department from '~/pages/Department'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail',
    history: 'user/history/:id'
  },
  setting: {
    approvalProcess: 'approval-process'
  },
  department: {
    prefix: 'departments',
    prefixmany: 'departments/:departmentId'
  }
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
    name: PRIVATE_PATH.setting.approvalProcess,
    path: PRIVATE_PATH.setting.approvalProcess,
    component: ApprovalProcess,
    allowedRoles: []
  },
  {
    name: 'userHistory',
    path: PRIVATE_PATH.user.history,
    component: UserHistory,
    allowedRoles: []
  },
  {
    path: PRIVATE_PATH.department.prefix,
    name: 'department',
    component: Department,
    allowedRoles: []
  },
  {
    path: PRIVATE_PATH.department.prefixmany,
    name: 'department',
    component: Department,
    allowedRoles: []
  }
]
