import { IRoutes } from '~/constants/public-routes.tsx'
import LoginComponent from '~/pages/login'

export const PRIVATE_PATH = {
  home: '',
  user: {
    prefix: 'users',
    create: 'user/create',
    update: 'user/update',
    detail: 'user/detail'
  }
}
export const PRIVATE_ROUTES: IRoutes[] = [
  {
    name: 'login2',
    path: PRIVATE_PATH.home,
    component: LoginComponent,
    allowedRoles: []
  }
]
