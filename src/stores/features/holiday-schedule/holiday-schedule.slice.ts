import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { IHoliday, IHolidaySchedule } from '~/types/HolidaySchedule'
import { HolidayList } from './fake-data'

const initialState: IHolidaySchedule = {
  loading: false,
  holidayList: [],
  currentRequestId: null
}

export const getListHoliday = createAsyncThunk('holidaySchedule/getAll', async (_, thunkAPI) => {
  // const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
  //   signal: thunkAPI.signal
  // })
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve(HolidayList)
    }, 100)
  })
  return await response
})

export const addOneHolidaySchedule = createAsyncThunk('holidaySchedule/create', async (payload: IHoliday, thunkAPI) => {
  // const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
  //   signal: thunkAPI.signal
  // })
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve({ sucess: true, data: 'Thêm mới thành công' })
    }, 100)
  })
  return await response
})

const holidaySchedule = createSlice({
  name: 'holidaySchedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListHoliday.fulfilled, (state: IHolidaySchedule, action) => {
        state.holidayList = action.payload
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
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

export default holidaySchedule.reducer
