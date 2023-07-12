import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import HttpService from '~/config/api.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { ErrorResponse } from '~/types/error-response.interface'

export interface TimesheetStateInterface {
  loading: boolean
  groups: []
  userInGroup: []
  error: any
  success: boolean
}

const initialState: TimesheetStateInterface = {
  loading: false,
  groups: [],
  userInGroup: [],
  error: null,
  success: false // for monitoring the registration process.
}

const getAllGroup = createAsyncThunk('org/group/groups', async (_, thunkAPI) => {
  const response = await HttpService.get('/org/group/groups', {
    signal: thunkAPI.signal
  })
  return response.data
})

const getUserInGroup = createAsyncThunk('system-user/groups', async (groupCode: string, thunkAPI) => {
  try {
    const response = await HttpService.get(`/system-user/groups/${groupCode}`, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroup.fulfilled, (state: TimesheetStateInterface, action) => {
        state.groups = action.payload
        state.success = true
      })
      .addCase(getUserInGroup.fulfilled, (state: TimesheetStateInterface, action) => {
        if (!action.payload.status) {
          state.userInGroup = action.payload
          state.success = true
        } else {
          state.userInGroup = []
          state.success = false
        }
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
        (state, _) => {
          state.loading = true
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading) {
            state.loading = false

            const { status, message } = action.payload as ErrorResponse
            if (status === 401) {
              notification.error({ message: message })
            }
          }
        }
      )
  }
})

export { getAllGroup, getUserInGroup }
export default timesheetSlice.reducer
