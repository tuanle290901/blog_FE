import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { IDepartment } from '~/types/department.interface'

export interface IDepartmentState {
  listData: any[]
  editingUser: IDepartment | null
  loading: boolean
  currentRequestId: string | null
}
const initialState: IDepartmentState = {
  listData: [],
  editingUser: null,
  loading: false,
  currentRequestId: null
}

export const getListDepartments = createAsyncThunk('departments/getAll', async (params: any, thunkAPI) => {
  try {
    const response = await HttpService.get('/org/group/get-tree', params)
    return response.data
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(error)
  }
})

export const getUserById = createAsyncThunk('users/getById', async (userId: string, thunkAPI) => {
  // TODO implement
  return userId
})

export const createDepartment = createAsyncThunk('departments/create', async (body: IDepartment, thunkAPI) => {
  try {
    const response = await HttpService.post('/org/group/create', body)
    return response.data
  } catch (error) {
    // Handle any error that occurred during the API call
    console.log(error)
    return thunkAPI.rejectWithValue(error)
  }
})
// export const updateUser = createAsyncThunk('users/create', (body: { userId: string; newUser: IUser }, thunkAPI) => {
//   // TODO implement
//   return body
// })
// export const deleteUser = createAsyncThunk('users/create', (userId: string, thunkAPI) => {
//   return userId
// })
const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    startEditingUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      const foundUser = state.listData.find((data) => data.id === userId)
      state.editingUser = foundUser as IDepartment
    },
    cancelEditingUser: (state) => {
      state.editingUser = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDepartment.pending, (state) => {
        state.loading = true
        // state.error = null
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false
        // state.createdData = action.payload
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false
        // state.error = action.payload
      })
      .addCase(getListDepartments.fulfilled, (state, action) => {
        state.listData = [action.payload]
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
          }
        }
      )
      .addDefaultCase((state, action) => {
        // console.log(`action type: ${action.type}`, current(state))
      })
  }
})
export const { startEditingUser, cancelEditingUser } = departmentSlice.actions
// export const selectCreatedData = (state) => state.api.createdData
// export const selectApiLoading = (state) => state.api.loading
// export const selectApiError = (state) => state.api.error
export const departmentSelectors = {
  selectListData: (state: IDepartmentState) => state.listData,
  selectDepartmentLoading: (state: IDepartmentState) => state.loading
  // selectApiError: (state: IDepartmentState) => state.error
}
export default departmentSlice.reducer
