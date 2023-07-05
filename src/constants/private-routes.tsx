import { IRoutes } from '~/constants/public-routes.tsx'
import Dashboard from '~/pages/Dashboard'
import UserList from '~/pages/user-management/user-list.tsx'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail'
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
  }
]
