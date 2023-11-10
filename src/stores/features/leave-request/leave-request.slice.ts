/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface'
import {
  ICountLeaveRequest,
  ILeaveRequest,
  ILeaveRequestEditForm,
  ILeaveRequestForm,
  ILeaveRequestUpdateStatusForm
} from '~/types/leave-request'
import { TicketDefinationResponse } from '~/types/leave-request.interface'
import dayjs, { Dayjs } from 'dayjs'
import { ticketItem } from '../setting/ultil-data'
export interface ILeaveRequestState {
  listData: ILeaveRequest[]
  ticketItemSelected: ILeaveRequest
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
  editingLeaveRequest: ILeaveRequest | null
  filter: string
  ticketDefinationType: TicketDefinationResponse[]
  nodeId: number
  countLeaveRequest: ICountLeaveRequest
  isUpdateRequestStatusSuccess?: boolean
}

export interface TicketRequestPayload {
  startDate?: string
  endDate?: string
  page: number
  size: number
  sort: ISort[]
  requestedBy?: string[]
  statuses?: string[]
  ticketDef?: string[]
  onlyAssignToMe?: boolean
}

const initialState: ILeaveRequestState = {
  listData: [],
  ticketItemSelected: {} as ILeaveRequest,
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  editingLeaveRequest: null,
  filter: '',
  ticketDefinationType: [],
  nodeId: 0,
  countLeaveRequest: {
    approved: 0,
    rejected: 0,
    submitted: 0
  },
  isUpdateRequestStatusSuccess: false
}

export const filterLeaveRequest = createAsyncThunk('tickets/filter', async (params: TicketRequestPayload, thunkAPI) => {
  try {
    const response: any = await HttpService.post('/tickets/filter', params, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getTicketDetail = async (code: string) => {
  try {
    const response = await HttpService.get(`/tickets?code=${code}`)
    return response.data
  } catch (error) {
    throw new Error('error occur with get ticket detail')
  }
}

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
  async (body: ILeaveRequestUpdateStatusForm, thunkAPI) => {
    try {
      const response: IApiResponse<ILeaveRequest> = await HttpService.put(
        `${END_POINT_API.LeaveRequest.update()}`,
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

export const editLeaveRequest = createAsyncThunk(
  'leave-request/edit',
  async (body: ILeaveRequestEditForm, thunkAPI) => {
    try {
      const response: IApiResponse<ILeaveRequest> = await HttpService.put(
        `${END_POINT_API.LeaveRequest.edit()}`,
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
    const response: IApiResponse<any> = await HttpService.put(`${END_POINT_API.LeaveRequest.delete()}?ticketId=${id}`)
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const resetLeaveRequest = createAsyncThunk('leave-request/reset', async (id: string, thunkAPI) => {
  try {
    const response: IApiResponse<any> = await HttpService.put(`${END_POINT_API.LeaveRequest.reset()}?ticketId=${id}`)
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const getAllDefinationType = createAsyncThunk('tickets/definitions', async (_, thunkAPI) => {
  try {
    // const response: IApiResponse<TicketDefinationResponse> = await HttpService.get('tickets/definitions')
    return ticketItem.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const countLeaveRequest = createAsyncThunk('tickets/count', async (dateFilter: Dayjs, thunkAPI) => {
  try {
    const response: IApiResponse<any> = await HttpService.get(
      `tickets/count?yyyyMM=${dayjs(dateFilter).format('YYYYMM')}`
    )
    return response.data
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
    setNodeIdState: (state, action) => {
      state.nodeId = action.payload.nodeId
    },
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
    },
    onUpdateRequestStatus: (state, action) => {
      state.isUpdateRequestStatusSuccess = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterLeaveRequest.fulfilled, (state, action) => {
        state.listData = [...action.payload.data.content]
        state.meta = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          total: action.payload.data.totalElements,
          totalPage: action.payload.data.totalPages
        }
      })
      .addCase(getAllDefinationType.fulfilled, (state, action) => {
        state.ticketDefinationType = action.payload
      })
      .addCase(countLeaveRequest.fulfilled, (state, action) => {
        state.countLeaveRequest = action.payload
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
export const { startEditing, cancelEditing, setValueFilter, resetValueFilter, setNodeIdState, onUpdateRequestStatus } =
  leaveRequestSlice.actions
export default leaveRequestSlice.reducer
