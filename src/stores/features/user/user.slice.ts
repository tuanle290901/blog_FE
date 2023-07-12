import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '~/types/user.interface.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { mockUserData } from '~/stores/features/user/mock-user-data.ts'
import HttpService from '~/config/api.ts'
import { IApiResponse, Meta } from '~/types/IApiResponse.interface.ts'
import { COMMON_ERROR_CODE } from '~/constants/app.constant.ts'

export interface IUserState {
  userList: IUser[]
  editingUser: IUser | null
  loading: boolean
  currentRequestId: string | null
  meta: Meta
}
const initialState: IUserState = {
  userList: [],
  editingUser: null,
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 }
}

export const getListUser = createAsyncThunk('users/getAll', async (payload: any, thunkAPI) => {
  // const response = await HttpService.get<IUser[]>('/api/user/getall', {
  //   signal: thunkAPI.signal
  // })
  // return response.data
  const fakeApi = new Promise<IUser[]>((resolve, reject) => {
    setTimeout(() => {
      resolve(mockUserData)
    }, 1000)
  })
  return await fakeApi
})
export const searchUser = createAsyncThunk('users/search', async (payload: any, thunkAPI) => {
  try {
    const response: IApiResponse<IUser[]> = await HttpService.post('/system-user/filter', payload, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})

export const getUserById = createAsyncThunk('users/getById', async (userId: string, thunkAPI) => {
  // TODO implement
  return userId
})
export const createUser = createAsyncThunk('users/create', (body: IUser, thunkAPI) => {
  // TODO implement
  return body
})
export const updateUser = createAsyncThunk('users/create', (body: { userId: string; newUser: IUser }, thunkAPI) => {
  // TODO implement
  return body
})
export const deleteUser = createAsyncThunk('users/create', (userId: string, thunkAPI) => {
  return userId
})
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    startEditingUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      const foundUser = state.userList.find((user) => user.id === userId)
      state.editingUser = foundUser as IUser
    },
    cancelEditingUser: (state) => {
      state.editingUser = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUser.fulfilled, (state, action) => {
        state.userList = action.payload.data
        state.meta = action.payload.meta
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
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
            state.currentRequestId = null
            //   TODO handle error
          }
        }
      )
      .addDefaultCase((state, action) => {
        // console.log(`action type: ${action.type}`, current(state))
      })
  }
})
export const { startEditingUser, cancelEditingUser } = userSlice.actions
export default userSlice.reducer
