import { IRoutes } from '~/constants/public-routes.tsx'
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
    name: 'users',
    path: PRIVATE_PATH.user.prefix,
    component: UserList,
    allowedRoles: []
  }
]
