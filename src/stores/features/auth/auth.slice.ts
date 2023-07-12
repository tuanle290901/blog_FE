import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api.ts'
import { LoginPayload } from '~/types/login-payload.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'

export interface AuthStateInterface {
  loading: boolean
  userInfo: Record<string, any> // for user object
  accessToken: string | null // for storing the JWT
  error: any
  success: boolean
  switchGroup: any
}

const initialState: AuthStateInterface = {
  loading: false,
  userInfo: {}, // for user object
  accessToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
  switchGroup: {}
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken
    },
    logout: (state) => {
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
      .addCase(switchGroup.fulfilled, (state: AuthStateInterface, action) => {
        state.switchGroup = action.payload.data
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
            // TODO handle error
            console.log(action.meta)
          }
        }
      )
  }
})

export { login, fetchUserInfo, switchGroup }
export const { logout, setAccessToken } = authSlice.actions
export default authSlice.reducer
