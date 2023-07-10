import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import HttpService from '~/config/api.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { ErrorResponse } from '~/types/error-response.interface'
import { LoginPayload } from '~/types/login-payload.ts'
import { LOCAL_STORAGE } from '~/utils/Constant'

export interface AuthStateInterface {
  loading: boolean
  userInfo: Record<string, any> // for user object
  accessToken: string | null // for storing the JWT
  error: any
  success: boolean
}

const initialState: AuthStateInterface = {
  loading: false,
  userInfo: {},
  accessToken: null,
  error: null,
  success: false
}
const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
    signal: thunkAPI.signal
  })
  return response.data
})

const fetchUserInfo = createAsyncThunk('auth/userInfo', async (_, thunkAPI) => {
  // const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
  //   signal: thunkAPI.signal
  // })
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          id: '64717d50114e783f00873888',
          userName: 'admin',
          email: 'demo@htigroup.vn',
          fullName: 'Quản trị viên',
          phoneNumber: '0373130002',
          isChangedPass: true,
          role: 'Admin',
          status: 'Active',
          createdAt: '2023-05-27T10:47:28.417',
          createdBy: {
            fullName: 'SYSTEM'
          },
          updatedAt: '2023-06-19T17:11:40.978',
          updatedBy: {
            fullName: 'Root',
            email: 'demo.gps@htigroup.vn',
            username: 'root',
            phoneNumber: '0373130002',
            workUnitName: 'HTSC',
            role: 'SystemAdmin'
          }
        },
        message: 'Lấy dữ liệu thành công.',
        status: 200
      })
    }, 1000)
  })
  return await response
})

const clearLocalStorage = () => {
  Object.entries(LOCAL_STORAGE).forEach(([key, value]) => {
    if (key) {
      localStorage.removeItem(value)
    }
  })
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.userInfo
    },
    logout: (state) => {
      clearLocalStorage()
      state.accessToken = null
      state.userInfo = {}
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state: AuthStateInterface, action) => {
        state.accessToken = action.payload.accessToken
        state.success = true
      })
      .addCase(fetchUserInfo.fulfilled, (state: AuthStateInterface, action) => {
        state.userInfo = action.payload.data
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
        (state, _) => {
          state.loading = true
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading) {
            state.loading = false

            const errorResponse = action.payload as ErrorResponse
            if (errorResponse) {
              if (errorResponse?.status === 401) {
                notification.error({ message: errorResponse?.message })
              }
            }
            // notification.error({ message: 'Đã có lỗi xảy ra' })
          }
        }
      )
  }
})

export { fetchUserInfo, login }
export const { logout, setAccessToken, setUserInfo } = authSlice.actions
export default authSlice.reducer
