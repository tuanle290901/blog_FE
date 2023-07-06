import { IRoutes } from '~/constants/public-routes.tsx'
import UserList from '~/pages/user-management/user-list.tsx'
import UserHistory from '~/pages/user-management/user-history.tsx'
import DeviceList from '~/pages/device-management/device-list.tsx'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail',
    history: 'user/history/:id'
  },
  devices: '/devices'
}

export const PRIVATE_ROUTES: IRoutes[] = [
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
    name: 'devices',
    path: PRIVATE_PATH.devices,
    component: DeviceList,
    allowedRoles: []
  }
]
