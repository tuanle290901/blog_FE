import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IUser } from '~/types/user.interface.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import HttpService from '~/config/api.ts'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface.ts'
import { COMMON_ERROR_CODE, EDIT_TYPE } from '~/constants/app.constant.ts'

export interface IUserState {
  userList: IUser[]
  editingUser: IUser | null
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
}

const initialState: IUserState = {
  userList: [],
  editingUser: null,
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 }
}

export const searchUser = createAsyncThunk(
  'users/search',
  async (params: { query: string; groupCode?: string | null; paging: IPaging; sorts: ISort[] }, thunkAPI) => {
    try {
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts
      }
      if (params.query && params.groupCode) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                operator: 'OR_MULTIPLES',
                children: [
                  {
                    field: 'full_name',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  },
                  {
                    field: 'phone_number',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  },
                  {
                    field: 'email',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  }
                ]
              },
              {
                field: 'group_profiles.group_code',
                operator: 'IS',
                value: params.groupCode
              }
            ]
          }
        ]
      } else if (params.query && !params.groupCode) {
        body.criteria = [
          {
            operator: 'OR_MULTIPLES',
            children: [
              {
                field: 'full_name',
                operator: 'LIKE_IGNORE_CASE',
                value: params.query
              },
              {
                field: 'phone_number',
                operator: 'LIKE_IGNORE_CASE',
                value: params.query
              },
              {
                field: 'email',
                operator: 'LIKE_IGNORE_CASE',
                value: params.query
              }
            ]
          }
        ]
      } else if (params.groupCode && !params.query) {
        body.criteria = [
          {
            field: 'group_profiles.group_code',
            operator: 'IS',
            value: params.groupCode
          }
        ]
      }
      const response: IApiResponse<IUser[]> = await HttpService.post('/system-user/filter', body, {
        signal: thunkAPI.signal
      })
      return response
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const getUserById = createAsyncThunk('users/getById', async (userId: string, thunkAPI) => {
  // TODO implement
  return userId
})
export const createUser = createAsyncThunk('users/create', async (body: IUser, thunkAPI) => {
  try {
    const response: IApiResponse<IUser[]> = await HttpService.post('/system-user/create', body, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
export const updateUser = createAsyncThunk('users/update', async (body: { userId: string; user: IUser }, thunkAPI) => {
  try {
    const response: IApiResponse<IUser[]> = await HttpService.put(`/system-user/${body.userId}/update`, body.user, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
export const deleteUser = createAsyncThunk('users/create', (userId: string, thunkAPI) => {
  return userId
})
export const startEditingUser = createAsyncThunk('users/editUser', async (userId: string, thunkAPI) => {
  try {
    const response: IApiResponse<IUser> = await HttpService.get(`/system-user/${userId}`, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
export const importUser = createAsyncThunk('users/importUser', async (payload: File, thunkAPI) => {
  try {
    const form = new FormData()
    form.append('file', payload)
    const response = await HttpService.post('/system-user/import', form, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // startEditingUser: (state, action: PayloadAction<string>) => {
    //   const userId = action.payload
    //   const foundUser = state.userList.find((user) => user.id === userId)
    //   state.editingUser = foundUser as IUser
    // },
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
      .addCase(startEditingUser.fulfilled, (state, action) => {
        const editType = state.userList.find((item) => item.id === action.payload.id)?.editType || EDIT_TYPE.SELF
        state.editingUser = { ...action.payload, editType }
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
export const { cancelEditingUser } = userSlice.actions
export default userSlice.reducer
