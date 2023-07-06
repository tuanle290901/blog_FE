import { IRoutes } from '~/constants/public-routes.tsx'
import UserList from '~/pages/user-management/user-list.tsx'
import ApprovalProcess from '~/pages/setting/approval-process'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail'
  },
  setting: {
    approvalProcess: 'approval-process'
  }
}
export const PRIVATE_ROUTES: IRoutes[] = [
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
  }
]
