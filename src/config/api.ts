import axios from 'axios'
import { API_URL } from '~/config/config.ts'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { LocalStorage } from '~/utils/local-storage.ts'

const HttpService = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Cache: 'no-cache'
  }
})
HttpService.interceptors.request.use((config: any) => {
  const accessToken = LocalStorage.get(LOCAL_STORAGE.ACCESS_TOKEN)
  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${accessToken}` } }
})
HttpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //   TODO handle
    }
    if (error.response?.status === 500) {
      //   TODO show error
    }
    return error.response
  }
)
export default HttpService
