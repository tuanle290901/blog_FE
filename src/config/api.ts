import axios from 'axios'
import { API_URL } from '~/config/config.ts'
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
  const token = LocalStorage.get('token')
  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } }
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
