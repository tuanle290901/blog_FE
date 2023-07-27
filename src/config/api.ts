import axios, { AxiosError } from 'axios'
import { API_URL } from '~/config/config.ts'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { LocalStorage } from '~/utils/local-storage.ts'
import { Modal, notification } from 'antd'
import { clearLocalStorage } from '~/stores/features/auth/auth.slice.ts'

let isShowModal = false
let isShowNotification = false
const HttpService = axios.create({
  baseURL: API_URL,
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
  (response) => response.data,
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
    console.log(error, 'error response')
    if (error.response?.status === 401) {
      notification.error({ message: error.response?.data?.message })
    }
    if (error.response?.status === 500) {
      notification.error({ message: 'Có một lỗi không xác định xảy ra vui lòng liên hệ bộ phận hỗ trợ kĩ thuật' })
    }
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      if (!isShowNotification) {
        isShowNotification = true
        notification.error({ message: 'Kiểm tra lại kết nối mạng', onClose: () => (isShowNotification = false) })
      }
    }
    throw error
  }
)
export default HttpService
