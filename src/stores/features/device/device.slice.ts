/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HttpStatusCode } from 'axios'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface'
import { IDevice, IDeviceForm } from '~/types/device.interface'

export interface IDeviceState {
  listData: IDevice[]
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
  editingDevice: IDevice | null
  filter: string
}

const initialState: IDeviceState = {
  listData: [],
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  editingDevice: null,
  filter: ''
}

export const getListDevice = createAsyncThunk(
  'devices/getAll',
  async (params: { query: string; groupCode?: string | null; paging: IPaging; sorts: ISort[] }, thunkAPI) => {
    try {
      const defaultSorts = [
        {
          direction: 'ASC',
          field: 'status'
        },
        {
          direction: 'DESC',
          field: 'created_at'
        }
      ]
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts?.length > 0 ? params.sorts : defaultSorts
      }
      if (params.query && params.groupCode) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                operator: 'OR_MULTIPLES',
                children: [
                  {
                    field: 'name',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  },
                  {
                    field: 'ip_address',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  }
                ]
              },
              {
                field: 'group_profiles.group_code',
                operator: 'IS',
                value: params.groupCode
              }
            ]
          }
        ]
      } else if (params.query && !params.groupCode) {
        body.criteria = [
          {
            operator: 'OR_MULTIPLES',
            children: [
              {
                field: 'name',
                operator: 'LIKE_IGNORE_CASE',
                value: params.query
              },
              {
                field: 'ip_address',
                operator: 'LIKE_IGNORE_CASE',
                value: params.query
              }
            ]
          }
        ]
      } else if (params.groupCode && !params.query) {
        body.criteria = [
          {
            field: 'group_profiles.group_code',
            operator: 'IS',
            value: params.groupCode
          }
        ]
      }
      const response: IApiResponse<IDevice[]> = await HttpService.post(END_POINT_API.Devices.getPageSize(), body, {
        signal: thunkAPI.signal
      })
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createDevice = createAsyncThunk('devices/create', async (body: IDeviceForm, thunkAPI) => {
  try {
    const response: IApiResponse<IDevice> = await HttpService.post(END_POINT_API.Devices.create(), body, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const updateDevice = createAsyncThunk('devices/update', async (body: IDeviceForm, thunkAPI) => {
  try {
    const response: IApiResponse<IDevice> = await HttpService.put(END_POINT_API.Devices.update(), body, {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const deleteDevice = createAsyncThunk('devices/delete', async (id: string, thunkAPI) => {
  try {
    const response: IApiResponse<IDevice> = await HttpService.put(END_POINT_API.Devices.delete(id), {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

export const activeDevice = createAsyncThunk('devices/active', async (id: string, thunkAPI) => {
  try {
    const response: IApiResponse<IDevice> = await HttpService.put(END_POINT_API.Devices.active(id), {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    return error
  }
})

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    startEditingDevice: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const foundUpdate = state.listData.find((data) => data.id === id)
      state.editingDevice = foundUpdate as IDevice
    },
    cancelEditingDevice: (state) => {
      state.editingDevice = null
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
      .addCase(createDevice.pending, (state) => {
        state.loading = true
      })
      .addCase(createDevice.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createDevice.rejected, (state) => {
        state.loading = false
      })
      .addCase(getListDevice.fulfilled, (state, action) => {
        state.listData = [...action.payload.data]
        state.meta = {
          ...action?.payload?.meta
        }
      })
      .addCase(updateDevice.pending, (state) => {
        state.loading = true
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload
        const index = state.listData.findIndex((item) => item.id === updatedDevice.id)
        state.listData[index] = updatedDevice
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload.data
        const index = state.listData.findIndex((item) => item.id === updatedDevice.id)
        state.listData[index] = updatedDevice
      })
      .addCase(activeDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload.data
        const index = state.listData.findIndex((item) => item.id === updatedDevice.id)
        state.listData[index] = updatedDevice
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
  selectListData: (state: IDeviceState) => state.listData,
  selectDeviceLoading: (state: IDeviceState) => state.loading
}
export const { startEditingDevice, cancelEditingDevice, setValueFilter, resetValueFilter } = devicesSlice.actions
export default devicesSlice.reducer
