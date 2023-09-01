import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api.ts'
import { COMMON_ERROR_CODE } from '~/constants/app.constant.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { IApiResponse } from '~/types/api-response.interface.ts'
import { IWorkingInfo, IWorkingTimeConfig } from '~/types/working-time.interface.ts'

export interface IWorkingTimeConfigState {
  listWKTC: IWorkingTimeConfig[]
  currentWorkingTimeConfig?: IWorkingTimeConfig | null
  currentRequestId: string | null
  loading: boolean
  workingTimeInfo: IWorkingInfo
}
const initialState: IWorkingTimeConfigState = {
  listWKTC: [],
  currentWorkingTimeConfig: null,
  currentRequestId: null,
  loading: false,
  workingTimeInfo: {} as IWorkingInfo
}
export const createWorkingTime = createAsyncThunk(
  'workingTimeConfig/create',
  async (payload: IWorkingTimeConfig, thunkAPI) => {
    try {
      const response: IApiResponse<IWorkingTimeConfig> = await HttpService.post(
        '/group-working-time-setup/create',
        payload,
        {
          signal: thunkAPI.signal
        }
      )
      return response.data
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)
export const getAllWorkingTimeSetting = createAsyncThunk('workingTimeConfig/getAll', async (_, thunkAPI) => {
  try {
    const response: IApiResponse<
      {
        id: string
        createdAt: string
        createdBy: string
        updatedAt: string
        updatedBy: string
        dataType: string
        data: IWorkingTimeConfig
      }[]
    > = await HttpService.get('/group-working-time-setup/get-all', {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})

export const getWorkingTimeSettingInfo = createAsyncThunk(
  'workingTimeConfig/getByYear',
  async (year: string, thunkAPI) => {
    try {
      const response = await HttpService.get(`/group-working-time-setup/get-by-year?year=${year}`, {
        signal: thunkAPI.signal
      })
      return response.data
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const updateWorkingTime = createAsyncThunk(
  'workingTimeConfig/updateOne',
  async (payload: IWorkingInfo, thunkAPI) => {
    try {
      const response = await HttpService.put('/group-working-time-setup/update', payload, {
        signal: thunkAPI.signal
      })
      return response.data
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        throw error.response.data
      }
      throw error.response.data
    }
  }
)

const workingTimeConfigSlice = createSlice({
  name: 'workingTimeConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWorkingTimeSettingInfo.fulfilled, (state, action) => {
        state.workingTimeInfo = action.payload
      })
      .addCase(getAllWorkingTimeSetting.fulfilled, (state, action) => {
        state.listWKTC = action.payload.map((item) => {
          const result: IWorkingTimeConfig = {
            id: item.id,
            common: item.data.common,
            workingDailySetups: item.data.workingDailySetups,
            groupCode: item.data.groupCode
          }
          return result
        })
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
export default workingTimeConfigSlice.reducer
