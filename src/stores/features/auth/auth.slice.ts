import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import HttpService from '~/config/api.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { ErrorResponse } from '~/types/error-response.interface'
import { LoginPayload } from '~/types/login-payload.ts'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { IUser } from '~/types/user.interface.ts'

export interface AuthStateInterface {
  loading: boolean
  userInfo: IUser | null // for user object
  accessToken: string | null // for storing the JWT
  error: any
  success: boolean
  switchGroup: any
  currentRequestId: string | null
  historyUrl: string | null
}

const initialState: AuthStateInterface = {
  loading: false,
  userInfo: null,
  accessToken: null,
  error: null,
  success: false, // for monitoring the registration process.
  switchGroup: {},
  currentRequestId: null,
  historyUrl: null
}
const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
    signal: thunkAPI.signal
  })
  return response.data
})

const fetchUserInfo = createAsyncThunk('auth/userInfo', async (_, thunkAPI) => {
  const response = await HttpService.get('/system-user/profile', {
    signal: thunkAPI.signal
  })
  return await response
})

const switchGroup = createAsyncThunk('auth/switchGroup', async (parmas: any, thunkAPI) => {
  const response = await HttpService.post('/system-user/switch-group', parmas, {
    signal: thunkAPI.signal
  })
  return response.data
})

export const clearLocalStorage = () => {
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
    setHistoryUrl: (state, action) => {
      const startIndex = action.payload.indexOf('request')
      if (startIndex !== -1) {
        const historyUrl = action.payload.substring(startIndex)
        state.historyUrl = historyUrl
      }
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.userInfo
    },
    logout: (state) => {
      clearLocalStorage()
      state.accessToken = null
      state.userInfo = null
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
      .addCase(switchGroup.fulfilled, (state: AuthStateInterface, action) => {
        state.switchGroup = action.payload.data
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false

            const errorResponse = action.payload as ErrorResponse
            if (errorResponse) {
              if (errorResponse?.status === 401) {
                notification.error({ message: errorResponse?.message })
              }
            }
            state.currentRequestId = null
          }
        }
      )
  }
})

export { login, fetchUserInfo, switchGroup }
export const { logout, setAccessToken, setUserInfo, setHistoryUrl } = authSlice.actions
export default authSlice.reducer
