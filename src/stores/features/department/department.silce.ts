import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { DataType, IDepartment } from '~/types/department.interface'

export interface IDepartmentState {
  listData: any[]
  editingDepartment: IDepartment | null
  loading: boolean
  currentRequestId: string | null
}
const initialState: IDepartmentState = {
  listData: [],
  editingDepartment: null,
  loading: false,
  currentRequestId: null
}

export const getListDepartments = createAsyncThunk('departments/getAll', async (_, thunkAPI) => {
  try {
    const response = await HttpService.get('/org/group/get-tree', {
      signal: thunkAPI.signal
    })
    return response?.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getUserById = createAsyncThunk('users/getById', async (userId: string, thunkAPI) => {
  // TODO implement
  return userId
})

export const createDepartment = createAsyncThunk('departments/create', async (body: IDepartment, thunkAPI) => {
  try {
    const response = await HttpService.post('/org/group/create', body, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export const updateDepartment = createAsyncThunk('departments/update', async (body: IDepartment, thunkAPI) => {
  try {
    const response = await HttpService.post('/org/group/update/info', body, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    startEditingDepartment: (state, action: PayloadAction<string>) => {
      const code = action.payload
      const foundDepartment = state.listData.find((data) => data.code === code)
      state.editingDepartment = foundDepartment as IDepartment
    },
    cancelEditingDepartment: (state) => {
      state.editingDepartment = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDepartment.pending, (state) => {
        state.loading = true
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(getListDepartments.fulfilled, (state, action) => {
        state.listData = [action.payload]
      })
      .addCase(updateDepartment.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const updatedDepartment = action.payload
        state.listData = updateDepartmentInTree(state.listData, updatedDepartment)
        state.editingDepartment = action.payload as IDepartment
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

const updateDepartmentInTree = (listData: DataType[], updatedDepartment: DataType): DataType[] => {
  return listData.map((department: DataType) => {
    if (department.code === updatedDepartment.code) {
      return {
        ...updatedDepartment
      }
    } else if (department.children && department.children.length > 0) {
      return {
        ...department,
        children: updateDepartmentInTree(department.children, updatedDepartment)
      }
    }
    return department
  })
}

export const { startEditingDepartment, cancelEditingDepartment } = departmentSlice.actions
export const departmentSelectors = {
  selectListData: (state: IDepartmentState) => state.listData,
  selectDepartmentLoading: (state: IDepartmentState) => state.loading
}
export default departmentSlice.reducer
