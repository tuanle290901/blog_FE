/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface'
import { ITypesOfLeave, ITypesOfLeaveForm } from '~/types/types-of-leave'

export interface ITypesOfLeaveState {
  listData: ITypesOfLeave[]
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
  editingTypesOfLeave: ITypesOfLeave | null
  filter: string
}

const initialState: ITypesOfLeaveState = {
  listData: [],
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  editingTypesOfLeave: null,
  filter: ''
}

export const filterTypesOfLeave = createAsyncThunk(
  'type-of-leave/filter',
  async (params: { query: string | null; paging: IPaging | null; sorts: ISort[] | null }, thunkAPI) => {
    try {
      let body: any = {
        page: params?.paging?.page,
        size: params?.paging?.size,
        sort: params?.sorts
      }
      if (!params?.query && !params?.paging && !params?.sorts) {
        body = {}
      }
      if (params.query) {
        body.criteria = [
          {
            field: 'name',
            operator: 'LIKE_IGNORE_CASE',
            value: params.query
          }
        ]
      }
      const response: IApiResponse<[]> = await HttpService.post('/type-of-leave/filter', body, {
        signal: thunkAPI.signal
      })
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createTypesOfLeave = createAsyncThunk(
  'type-of-leave/create',
  async (body: ITypesOfLeaveForm, thunkAPI) => {
    try {
      const response: IApiResponse<ITypesOfLeave> = await HttpService.post(END_POINT_API.TypesOfLeave.create(), body, {
        signal: thunkAPI.signal
      })
      return response
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      return error
    }
  }
)

export const updateTypesOfLeave = createAsyncThunk(
  'type-of-leave/update',
  async (body: ITypesOfLeaveForm, thunkAPI) => {
    try {
      const response: IApiResponse<ITypesOfLeave> = await HttpService.put(
        `${END_POINT_API.TypesOfLeave.update()}/${body.id}`,
        body,
        {
          signal: thunkAPI.signal
        }
      )
      return response
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      return error
    }
  }
)

export const deleteTypesOfLeave = createAsyncThunk('type-of-leave/delete', async (id: string, thunkAPI) => {
  try {
    const response: IApiResponse<any> = await HttpService.delete(`${END_POINT_API.TypesOfLeave.delete()}/${id}`)
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

const typesOfLeaveSlice = createSlice({
  name: 'typesOfLeave',
  initialState,
  reducers: {
    startEditing: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const foundUpdate = state.listData.find((data) => data.id === id)
      state.editingTypesOfLeave = foundUpdate as ITypesOfLeave
    },
    cancelEditing: (state) => {
      state.editingTypesOfLeave = null
    },
    setValueFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    },
    resetValueFilter: (state) => {
      state.filter = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTypesOfLeave.pending, (state) => {
        state.loading = true
      })
      .addCase(createTypesOfLeave.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createTypesOfLeave.rejected, (state) => {
        state.loading = false
      })
      .addCase(filterTypesOfLeave.fulfilled, (state, action) => {
        state.listData = [...action.payload.data]
        state.meta = {
          ...action?.payload?.meta
        }
      })
      .addCase(updateTypesOfLeave.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTypesOfLeave.fulfilled, (state, action) => {
        const dataUpdate = action.payload
        const index = state.listData.findIndex((item) => item.id === dataUpdate.id)
        state.listData[index] = dataUpdate
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

export const departmentSelectors = {
  selectListData: (state: ITypesOfLeaveState) => state.listData,
  selectTypesOfLeaveLoading: (state: ITypesOfLeaveState) => state.loading
}
export const { startEditing, cancelEditing, setValueFilter, resetValueFilter } = typesOfLeaveSlice.actions
export default typesOfLeaveSlice.reducer
