import Initialize from '~/pages/Initialize'
import LoginComponent from '~/pages/login'
import { ROLE } from '~/constants/app.constant.ts'

export interface IRoutes {
  path: string
  name: string
  component: any
  allowedRoles: ROLE[]
}

export const PUBLIC_PATH = {
  login: 'login',
  notfound: '404',
  unauthorized: 'unauthorized',
  initialize: 'initialize'
}

export const PUBLIC_ROUTES: IRoutes[] = [
  {
    name: 'login',
    path: PUBLIC_PATH.login,
    component: LoginComponent,
    allowedRoles: []
  },
  {
    name: 'initialize',
    path: PUBLIC_PATH.initialize,
    component: Initialize,
    allowedRoles: []
  }
]
