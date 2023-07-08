import { IRoutes } from '~/constants/public-routes.tsx'
import Dashboard from '~/pages/Dashboard'
import UserList from '~/pages/user-management/user-list.tsx'
import ApprovalProcess from '~/pages/setting/request-process'
import UserHistory from '~/pages/user-management/user-history.tsx'
import { lazy } from 'react'
import Timesheet from '~/pages/timesheet'
import Department from '~/pages/Department'
import DeviceList from '~/pages/device-management/device-list.tsx'
import Config from '~/pages/config/index.tsx'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail',
    history: 'user/history/:id'
  },
  timesheet: '/timesheet',
  setting: {
    requestProcess: 'request-process'
  },
  department: {
    prefix: 'department',
    prefixmany: 'department/:departmentId'
  },
  devices: '/devices',
  config: {
    prefix: '/timeWorking'
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
    name: PRIVATE_PATH.setting.requestProcess,
    path: PRIVATE_PATH.setting.requestProcess,
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
    name: 'timesheet',
    path: PRIVATE_PATH.timesheet,
    component: Timesheet,
    allowedRoles: []
  },
  { name: 'devices', path: PRIVATE_PATH.devices, component: DeviceList, allowedRoles: [] },
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
  },
  {
    name: 'config',
    path: PRIVATE_PATH.config.prefix,
    component: Config,
    allowedRoles: []
  }
]
