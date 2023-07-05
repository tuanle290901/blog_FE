import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api.ts'
import { LoginPayload } from '~/types/login-payload.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { fetchUserInfo } from '../user/user.slice'

export interface AuthStateInterface {
  loading: boolean
  userInfo: Record<string, any> // for user object
  accessToken: string | null // for storing the JWT
  error: any
  success: boolean
}

const initialState: AuthStateInterface = {
  loading: false,
  userInfo: {}, // for user object
  accessToken: null, // for storing the JWT
  error: null,
  success: false // for monitoring the registration process.
}
const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  const response = await HttpService.post<{ token: string }>('/api/auth/login', payload, {
    signal: thunkAPI.signal
  })
  thunkAPI.dispatch(fetchUserInfo())
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state: AuthStateInterface, action) => {
        state.accessToken = action.payload.token
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
      ),
      builder
        .addCase(fetchUserInfo.fulfilled, (state: AuthStateInterface, action) => {
          state.userInfo = action.payload.userInfo
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
export { login }
export const { logout, setAccessToken } = authSlice.actions
export default authSlice.reducer
