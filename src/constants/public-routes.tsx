import LoginComponent from '~/pages/login'

export interface IRoutes {
  path: string
  name: string
  component: any
  allowedRoles: Array<string>
}

export const PUBLIC_PATH = {
  login: '/login',
  notfound: '/404',
  unauthorized: '/unauthorized'
}

export const PUBLIC_ROUTES: IRoutes[] = [
  {
    name: 'login',
    path: PUBLIC_PATH.login,
    component: LoginComponent,
    allowedRoles: []
  }
]
