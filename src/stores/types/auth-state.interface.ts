export interface AuthStateInterface {
  loading: boolean
  userInfo: Record<string, any> // for user object
  userToken: string | null // for storing the JWT
  error: any
  success: boolean
}
