import axios, { AxiosError } from 'axios'
import { API_URL } from '~/config/config.ts'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { LocalStorage } from '~/utils/local-storage.ts'
import { Modal, notification } from 'antd'
import { clearLocalStorage } from '~/stores/features/auth/auth.slice.ts'

let isShowModal = false
let isShowNotification = false

function getRootURL(url: string) {
  const parsedURL = new URL(url)
  const parsedAPI_URL = new URL(API_URL)
  const protocol = parsedURL.protocol
  const hostname = parsedURL.hostname
  const pathname = parsedAPI_URL.pathname
  const port = parsedURL.port ? `:${parsedURL.port}` : ''
  return `${protocol}//${hostname}${port}${pathname}`
}

const HttpService = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? getRootURL(window.location.href) : API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
    // Cache: 'no-cache'
  }
})
HttpService.interceptors.request.use((config: any) => {
  const accessToken = LocalStorage.get(LOCAL_STORAGE.ACCESS_TOKEN)
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': LocalStorage.get('i18nextLng') || 'vi'
    }
  }
})
HttpService.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      !error.response?.config.url?.includes('login')
    ) {
      if (!isShowModal) {
        isShowModal = true
        Modal.warning({
          afterClose: () => {
            clearLocalStorage()
            window.location.href = '/auth/login'
          },
          centered: true,
          title: 'Cảnh báo',
          content: 'Phiên làm việc đã hết hạn vui lòng đăng nhập lại'
        })
      }
    }
    if (error.response?.status === 401) {
      notification.error({ message: error.response?.data?.message })
    }
    if (error.response?.status === 500) {
      notification.error({ message: 'Có một lỗi không xác định xảy ra vui lòng liên hệ bộ phận hỗ trợ kĩ thuật' })
    }
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      if (!isShowNotification) {
        isShowNotification = true
        notification.error({
          message: 'Kiểm tra lại kết nối mạng hoặc Kết nối đã vượt quá thời gian quy định',
          onClose: () => (isShowNotification = false)
        })
      }
    }
    throw error
  }
)
export default HttpService
