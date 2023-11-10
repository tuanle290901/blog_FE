import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HttpStatusCode } from 'axios'
import HttpService from '~/config/api'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { DataType, IDepartment } from '~/types/department.interface'
import { IApiResponse } from '~/types/api-response.interface'

export interface IDepartmentState {
  listData: DataType[]
  editingDepartment: DataType | null
  loading: boolean
  currentRequestId: string | null
  listAll: DataType[]
}

const initialState: IDepartmentState = {
  listData: [],
  editingDepartment: null,
  loading: false,
  currentRequestId: null,
  listAll: []
}

export const getAllDepartments = createAsyncThunk('departments/getAlls', async (_, thunkAPI) => {
  try {
    const response = await HttpService.get('/org/group/get-all', {
      signal: thunkAPI.signal
    })
    return response?.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

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

export const createDepartment = createAsyncThunk('departments/create', async (body: IDepartment, thunkAPI: any) => {
  try {
    const response: IApiResponse<DataType> = await HttpService.post('/org/group/create', body, {
      signal: thunkAPI.signal
    })
    if (response.status === HttpStatusCode.Ok) {
      return response
    } else {
      return thunkAPI.rejectWithValue(response.data)
    }
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const updateDepartment = createAsyncThunk('departments/update', async (body: IDepartment, thunkAPI) => {
  try {
    const response: IApiResponse<DataType> = await HttpService.post('/org/group/update/info', body, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteDepartment = createAsyncThunk('departments/delete', async (departmentCode: string, thunkAPI) => {
  try {
    const response: IApiResponse<DataType> = await HttpService.delete(`/org/group/delete/${departmentCode}`, {
      signal: thunkAPI.signal
    })
    return response
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
      state.editingDepartment = foundDepartment as DataType
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
      .addCase(createDepartment.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createDepartment.rejected, (state) => {
        state.loading = false
      })
      .addCase(getListDepartments.fulfilled, (state, action) => {
        state.listData = [action.payload]
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        const requester = {
          code: '__REQUESTER_GROUP__',
          name: 'Quản lý trực tiếp'
        }
        state.listAll = [...action.payload, requester]
      })
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const updatedDepartment = action.payload.data
        state.listData = updateDepartmentInTree(state.listData, updatedDepartment)
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
  }
})

const updateDepartmentInTree = (listData: DataType[], updatedDepartment: DataType): DataType[] => {
  return listData.map((department: DataType) => {
    if (department.code === updatedDepartment.code) {
      return {
        ...department,
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
