import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { IApiResponse } from '~/types/api-response.interface'
import { IHoliday, IHolidaySchedule } from '~/types/holiday-schedule'

const initialState: IHolidaySchedule = {
  loading: false,
  holidayList: [],
  currentRequestId: null
}

export const getListHoliday = createAsyncThunk('holidaySchedule/filter', async (_, thunkAPI) => {
  try {
    const payload = {}
    const response: IApiResponse<IHoliday[]> = await HttpService.post('/event/filter', payload, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const addOneHolidaySchedule = createAsyncThunk('holidaySchedule/create', async (payload: IHoliday, thunkAPI) => {
  try {
    const response: IApiResponse<IHoliday> = await HttpService.post('/event/create', payload, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateHolidaySchedule = createAsyncThunk(`holidaySchedule/update`, async (payload: IHoliday, thunkAPI) => {
  try {
    const response: IApiResponse<IHoliday> = await HttpService.put(`/event/update/${payload.id}`, payload, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteHolidaySchedule = createAsyncThunk(`holidaySchedule/delete`, async (id: string, thunkAPI) => {
  try {
    const response: IApiResponse<IHoliday> = await HttpService.delete(`/event/delete/${id}`, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
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
