/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
export interface ILeaveBalace {
  absenceInfoList: AbsenceInfoList[]
  overTimeInfoList: OverTimeInfoList[]
  totalAbsenceHours: number
  totalEarlyBack: number
  totalLateCome: number
  totalOverTimeHours: number
  totalRemainLeaveHours: number
  totalUsedLeaveHours: number
  totalViolates: number
  violateInfoList: ViolateInfoList[]
  totalBusiness?: number
  totalRemainLeaveMinutes: number
  totalUsedLeaveMinutes: number
}
export interface AbsenceInfoList {
  key: string
  value: number
}
export interface OverTimeInfoList {
  key: string
  value: number
}
export interface ViolateInfoList {
  key: string
  value: number
}
export interface ILeaveBalanceState {
  leaveBalanceData: ILeaveBalace
  loading: boolean
  currentRequestId: string | null
}

const initialState: ILeaveBalanceState = {
  leaveBalanceData: {} as ILeaveBalace,
  loading: false,
  currentRequestId: null
}

export const getLeaveBalance = createAsyncThunk('time-attendance/getLeaveBalance', async (_, thunkAPI) => {
  try {
    const response: any = await HttpService.get('time-attendance/leave-balance', {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const findLeaveBalance = createAsyncThunk(
  'time-attendance/getLeaveBalance',
  async (userName: string, thunkAPI) => {
    try {
      const response: any = await HttpService.post(
        'time-attendance/leave-balance/find',
        { userName },
        {
          signal: thunkAPI.signal
        }
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const leaveBalanceSlice = createSlice({
  name: 'leaveBalance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(getLeaveBalance.fulfilled, (state, action) => {
      //   state.leaveBalanceData = action.payload
      // })
      .addCase(findLeaveBalance.fulfilled, (state, action) => {
        state.leaveBalanceData = action.payload
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
export default leaveBalanceSlice.reducer
