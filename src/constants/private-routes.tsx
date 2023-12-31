import { IRoutes } from '~/constants/public-routes.tsx'
import HolidayScheduleConfig from '~/pages/config/component-bateco/HolidayScheduleConfig'
import CommonTimeConfigBateco from '~/pages/config/component-bateco/WorkingTimeConfig'
import DeviceList from '~/pages/device-management/device-list.tsx'
import TicketDefinitionList from '~/pages/setting/ticket-defination-new'
import TicketDefinationNew from '~/pages/setting/ticket-defination-new/TicketDefinitionCreate'
import Timesheet from '~/pages/timesheet'
import UserHistory from '~/pages/user-management/user-history.tsx'
import UserList from '~/pages/user-management/user-list.tsx'

import { ROLE } from '~/constants/app.constant.ts'
import Department from '~/pages/Department'
import Benefit from '~/pages/benefit'
import LeaveRequest from '~/pages/leave-request'
import PositionList from '~/pages/position-management/position-list.tsx'
import Report from '~/pages/report'
import Statistical from '~/pages/statistical'
import TypesOfLeave from '~/pages/types-of-leave-management/types-of-leave-list'

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
  dashboard: '/dashboard',
  setting: {
    ticketProcessDefinition: 'ticket-process-definition',
    ticketProcessDefinitionNew: 'ticket-definition',
    ticketDefinitionById: 'ticket-definition/:id',
    ticketDefinitionCreate: 'ticket-definition/create-revison/:ticketType',
    ticketDefinitionView: 'ticket-definition/view-revison/:ticketType/:rev'
  },
  department: {
    prefix: 'department'
  },
  devices: '/devices',
  config: {
    prefix: '/working-time',
    holidaySchedule: '/holiday-schedule',
    benefit: '/benefit'
  },
  timeManagement: {
    prefix: '/work-time',
    requests: '/work-time/requests'
  },
  position: '/positions',
  typesOfleave: '/types-of-leave',
  report: 'report',
  leaveRequest: '/request',
  requestDetail: '/request/:code',
  statistical: 'statistical'
}

export const PRIVATE_ROUTES: IRoutes[] = [
  {
    name: '/',
    path: PRIVATE_PATH.home,
    component: Timesheet,
    allowedRoles: []
  },
  // {
  //   name: 'dashboard',
  //   path: PRIVATE_PATH.dashboard,
  //   component: Dashboard,
  //   allowedRoles: []
  // },
  {
    name: 'users',
    path: PRIVATE_PATH.user.prefix,
    component: UserList,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  // {
  //   name: 'ticket-definition-list',
  //   path: PRIVATE_PATH.setting.ticketProcessDefinition,
  //   component: TicketDefination,
  //   allowedRoles: [ROLE.SYSTEM_ADMIN]
  // },
  {
    name: 'ticket-definition',
    path: PRIVATE_PATH.setting.ticketProcessDefinitionNew,
    component: TicketDefinitionList,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'ticket-definition/:id',
    path: PRIVATE_PATH.setting.ticketDefinitionById,
    component: TicketDefinationNew,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'ticket-definition/create-revision',
    path: PRIVATE_PATH.setting.ticketDefinitionCreate,
    component: TicketDefinationNew,
    allowedRoles: [ROLE.SYSTEM_ADMIN]
  },
  {
    name: 'ticket-definition/view-revision',
    path: PRIVATE_PATH.setting.ticketDefinitionView,
    component: TicketDefinationNew,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'userHistory',
    path: PRIVATE_PATH.user.history,
    component: UserHistory,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER]
  },
  {
    name: 'timesheet',
    path: PRIVATE_PATH.timesheet,
    component: Timesheet,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  { name: 'devices', path: PRIVATE_PATH.devices, component: DeviceList, allowedRoles: [ROLE.SYSTEM_ADMIN] },
  {
    path: PRIVATE_PATH.department.prefix,
    name: 'department',
    component: Department,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER]
  },
  {
    name: 'working-time',
    path: PRIVATE_PATH.config.prefix,
    component: CommonTimeConfigBateco,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'holiday-schedule',
    path: PRIVATE_PATH.config.holidaySchedule,
    component: HolidayScheduleConfig,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'positions',
    path: PRIVATE_PATH.position,
    component: PositionList,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER]
  },
  {
    name: 'typesOfleave',
    path: PRIVATE_PATH.typesOfleave,
    component: TypesOfLeave,
    allowedRoles: []
  },
  {
    name: 'report',
    path: PRIVATE_PATH.report,
    component: Report,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER]
  },
  {
    name: 'leaveRequest',
    path: PRIVATE_PATH.leaveRequest,
    component: LeaveRequest,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'requestDetail',
    path: PRIVATE_PATH.requestDetail,
    component: LeaveRequest,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'statistical',
    path: PRIVATE_PATH.statistical,
    component: Statistical,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  },
  {
    name: 'benefit',
    path: PRIVATE_PATH.config.benefit,
    component: Benefit,
    allowedRoles: [ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.SUB_MANAGER, ROLE.OFFICER]
  }
]
