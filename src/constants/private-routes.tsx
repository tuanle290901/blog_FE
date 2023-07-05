import { IRoutes } from '~/constants/public-routes.tsx'
import Department from '~/pages/Department'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail'
  },
  department: {
    prefix: '/departments',
    prefixmany: '/departments/:departmentId'
  }
}
export const PRIVATE_ROUTES: IRoutes[] = [
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
