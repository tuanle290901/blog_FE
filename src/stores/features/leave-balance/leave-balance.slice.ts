/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'

export interface ILeaveBalace {
  totalLeaveBalance: string
  restLeaveBalance: string
  usedLeaveBalance: string
  overtime: string
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

const fakeData: ILeaveBalace = {
  totalLeaveBalance: '12',
  restLeaveBalance: '10',
  usedLeaveBalance: '1',
  overtime: '32'
}

export const getLeaveBalance = createAsyncThunk('leave-balance/get', async (_, thunkAPI) => {
  try {
    // const response: any = await HttpService.get('leave-balance/get', {
    //   signal: thunkAPI.signal
    // })
    return fakeData
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const leaveBalanceSlice = createSlice({
  name: 'leaveBalance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveBalance.fulfilled, (state, action) => {
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
