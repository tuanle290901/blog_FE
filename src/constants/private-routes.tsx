import { IRoutes } from '~/constants/public-routes.tsx'
import Dashboard from '~/pages/Dashboard'
import CommonTimeConfig from '~/pages/config/component/CommonTimeConfig.tsx'
import DeviceList from '~/pages/device-management/device-list.tsx'
import PersonalWokingTimeRequestList from '~/pages/personal-working-time-management/personal-woking-time-request-list.tsx'
import TicketDefinationNew from '~/pages/setting/ticket-defination-new'
import TicketDefination from '~/pages/setting/ticket-defination'
import Timesheet from '~/pages/timesheet'
import UserHistory from '~/pages/user-management/user-history.tsx'
import UserList from '~/pages/user-management/user-list.tsx'

import PositionList from '~/pages/position-management/position-list.tsx'
import Department from '~/pages/Department'
import TypesOfLeave from '~/pages/types-of-leave-management/types-of-leave-list'
import { ROLE } from '~/constants/app.constant.ts'

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
    ticketProcessDefinition: 'ticket-process-definition',
    ticketProcessDefinitionNew: 'ticket-process-definition-new'
  },
  department: {
    prefix: 'department'
  },
  devices: '/devices',
  config: {
    prefix: '/timeWorking'
  },
  timeManagement: {
    prefix: '/work-time',
    requests: '/work-time/requests'
  },
  position: '/positions',
  typesOfleave: '/types-of-leave'
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
    name: 'ticket-definition-list',
    path: PRIVATE_PATH.setting.ticketProcessDefinition,
    component: TicketDefination,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]
  },
  {
    name: 'ticket-definition-new',
    path: PRIVATE_PATH.setting.ticketProcessDefinitionNew,
    component: TicketDefinationNew,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]
  },
  {
    name: 'userHistory',
    path: PRIVATE_PATH.user.history,
    component: UserHistory,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]
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
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]
  },
  {
    name: 'config',
    path: PRIVATE_PATH.config.prefix,
    component: CommonTimeConfig,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]
  },
  {
    name: 'positions',
    path: PRIVATE_PATH.position,
    component: PositionList,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER]
  },
  {
    name: 'typesOfleave',
    path: PRIVATE_PATH.typesOfleave,
    component: TypesOfLeave,
    allowedRoles: []
  }
]
