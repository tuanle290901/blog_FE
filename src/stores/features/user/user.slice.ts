import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '~/types/user.interface.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { mockUserData } from '~/stores/features/user/mock-user-data.ts'

export interface IUserState {
  userList: IUser[]
  editingUser: IUser | null
  loading: boolean
  currentRequestId: string | null
}
const initialState: IUserState = {
  userList: [],
  editingUser: null,
  loading: false,
  currentRequestId: null
}

export const getListUser = createAsyncThunk('users/getAll', async (_, thunkAPI) => {
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
      .addCase(getListUser.fulfilled, (state, action) => {
        state.userList = action.payload
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
export default userSlice.reducer
