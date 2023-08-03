/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface'
import { ILeaveRequest, ILeaveRequestForm } from '~/types/leave-request'

export interface ILeaveRequestState {
  listData: ILeaveRequest[]
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
  editingLeaveRequest: ILeaveRequest | null
  filter: string
}

const initialState: ILeaveRequestState = {
  listData: [],
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  editingLeaveRequest: null,
  filter: ''
}

export const filterLeaveRequest = createAsyncThunk(
  'leave-request/filter',
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
      const response: IApiResponse<[]> = await HttpService.post('/leave-request/filter', body, {
        signal: thunkAPI.signal
      })
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createLeaveRequest = createAsyncThunk(
  'leave-request/create',
  async (body: ILeaveRequestForm, thunkAPI) => {
    try {
      const response: IApiResponse<ILeaveRequest> = await HttpService.post(END_POINT_API.LeaveRequest.create(), body, {
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

export const updateLeaveRequest = createAsyncThunk(
  'leave-request/update',
  async (body: ILeaveRequestForm, thunkAPI) => {
    try {
      const response: IApiResponse<ILeaveRequest> = await HttpService.put(
        `${END_POINT_API.LeaveRequest.update()}/${body.id}`,
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

export const deleteLeaveRequest = createAsyncThunk('leave-request/delete', async (id: string, thunkAPI) => {
  try {
    const response: IApiResponse<any> = await HttpService.delete(`${END_POINT_API.LeaveRequest.delete()}/${id}`)
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

const leaveRequestSlice = createSlice({
  name: 'leaveRequest',
  initialState,
  reducers: {
    startEditing: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const foundUpdate = state.listData.find((data) => data.id === id)
      state.editingLeaveRequest = foundUpdate as ILeaveRequest
    },
    cancelEditing: (state) => {
      state.editingLeaveRequest = null
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
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true
      })
      .addCase(createLeaveRequest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createLeaveRequest.rejected, (state) => {
        state.loading = false
      })
      .addCase(filterLeaveRequest.fulfilled, (state, action) => {
        state.listData = [...action.payload.data]
        state.meta = {
          ...action?.payload?.meta
        }
      })
      .addCase(updateLeaveRequest.pending, (state) => {
        state.loading = true
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
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
  selectListData: (state: ILeaveRequestState) => state.listData,
  selectLeaveRequestLoading: (state: ILeaveRequestState) => state.loading
}
export const { startEditing, cancelEditing, setValueFilter, resetValueFilter } = leaveRequestSlice.actions
export default leaveRequestSlice.reducer
