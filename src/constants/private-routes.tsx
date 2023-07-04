import { IRoutes } from '~/constants/public-routes.tsx'

export const PRIVATE_PATH = {
  home: '/',
  user: {
    prefix: '/users',
    create: '/user/create',
    update: 'user/update',
    detail: 'user/detail'
  }
}
export const PRIVATE_ROUTES: IRoutes[] = []
