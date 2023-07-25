import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import HttpService from '~/config/api.ts'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { ErrorResponse } from '~/types/error-response.interface'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface.ts'
import dayjs from 'dayjs'
import { IUser } from '~/types/user.interface'
import { IGroup } from '../master-data/master-data.slice'
import { IPayloadUpdateAttendance } from '~/types/attendance.interface'
import { saveAs } from 'file-saver'
import { employeeWorkingTimeRes } from './fake-data'

export interface TimesheetStateInterface {
  loading: boolean
  groups: IGroup[]
  usersName: []
  userInGroup: IUser[]
  timesheetList: []
  meta: IPaging
  empWorkingTime: any
}

const initialState: TimesheetStateInterface = {
  loading: false,
  groups: [],
  usersName: [],
  userInGroup: [],
  timesheetList: [],
  meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  empWorkingTime: {}
}

const getAllGroup = createAsyncThunk('org/group/groups', async (_, thunkAPI) => {
  try {
    const response = await HttpService.get('/org/group/groups-by-grant', {
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

const getUserInGroup = createAsyncThunk('system-user/groups', async (groupCode: string | undefined, thunkAPI) => {
  try {
    const response = await HttpService.get(`/system-user/groups/${groupCode}/get-user-by-grant`, {
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

const getUsersName = createAsyncThunk('system-user/get-info', async (body: (string | undefined)[], thunkAPI) => {
  try {
    const response = await HttpService.post(`/system-user/get-info`, body, {
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

export const updateAttendanceStatistic = createAsyncThunk(
  'time-attendance/statistic-confirm',
  async (body: IPayloadUpdateAttendance[], thunkAPI) => {
    try {
      const response: IApiResponse<any> = await HttpService.post('/time-attendance/statistic-confirm', body, {
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

export const ExportExcel = createAsyncThunk('time-attendance/export-time-attendance', async () => {
  try {
    const response = ''
    const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    saveAs(blob, 'Bao-cao.csv')
  } catch (error) {
    console.error('Lỗi khi tải xuống tệp Excel:', error)
  }
})

const getEmployeeWorkingTime = createAsyncThunk('time-attendance/get-employee-working-time', async (_, thunkAPI) => {
  // const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
  //   signal: thunkAPI.signal
  // })
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve(employeeWorkingTimeRes)
    }, 100)
  })
  return await response
})

export const filterTimesheet = createAsyncThunk(
  'time-attendance/filter',
  async (
    params: {
      query: string
      groupCode?: string | null
      userId?: string | null
      startDate?: string | null
      endDate?: string | null
      paging: IPaging
      sorts: ISort[]
    },
    thunkAPI
  ) => {
    try {
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts
      }
      if (!params.query && params.groupCode) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                field: 'group_code',
                operator: 'IS',
                value: params.groupCode
              },
              {
                field: 'date',
                operator: 'BETWEEN',
                min: params.startDate || dayjs().format('YYYY-MM-DD'),
                max: params.endDate || dayjs().format('YYYY-MM-DD')
              }
            ]
          }
        ]
      }
      if (!params.query && params.userId) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                field: 'user_id',
                operator: 'IS',
                value: params.userId
              },
              {
                field: 'date',
                operator: 'BETWEEN',
                min: params.startDate || dayjs().format('YYYY-MM-DD'),
                max: params.endDate || dayjs().format('YYYY-MM-DD')
              }
            ]
          }
        ]
      }
      if (!params.query && params.userId && params.groupCode) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                field: 'group_code',
                operator: 'IS',
                value: params.groupCode
              },
              {
                field: 'user_id',
                operator: 'IS',
                value: params.userId
              },
              {
                field: 'date',
                operator: 'BETWEEN',
                min: params.startDate || dayjs().format('YYYY-MM-DD'),
                max: params.endDate || dayjs().format('YYYY-MM-DD')
              }
            ]
          }
        ]
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
                    field: 'full_name',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  },
                  {
                    field: 'user_name',
                    operator: 'LIKE_IGNORE_CASE',
                    value: params.query
                  }
                ]
              },
              {
                field: 'group_code',
                operator: 'IS',
                value: params.groupCode
              },
              {
                field: 'date',
                operator: 'BETWEEN',
                min: params.startDate || dayjs().format('YYYY-MM-DD'),
                max: params.endDate || dayjs().format('YYYY-MM-DD')
              }
            ]
          }
        ]
      }
      const response: IApiResponse<[]> = await HttpService.post('/time-attendance/filter', body, {
        signal: thunkAPI.signal
      })
      return response
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroup.fulfilled, (state: TimesheetStateInterface, action) => {
        state.groups = action?.payload
        state.meta = action.payload.meta
      })
      .addCase(getUsersName.fulfilled, (state: TimesheetStateInterface, action) => {
        state.usersName = action?.payload
        state.meta = action.payload.meta
      })
      .addCase(getUserInGroup.fulfilled, (state: TimesheetStateInterface, action) => {
        if (!action.payload.status) {
          state.userInGroup = action?.payload
          state.meta = action.payload.meta
        } else {
          state.userInGroup = []
          state.meta = action.payload.meta
        }
      })
      .addCase(filterTimesheet.fulfilled, (state: TimesheetStateInterface, action) => {
        state.timesheetList = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(getEmployeeWorkingTime.fulfilled, (state: TimesheetStateInterface, action) => {
        state.empWorkingTime = action.payload.data
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
        (state, _) => {
          state.loading = true
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state) => {
          if (state.loading) {
            state.loading = false
            //   TODO handle error
          }
        }
      )
  }
})

export { getAllGroup, getUserInGroup, getUsersName, getEmployeeWorkingTime }
export default timesheetSlice.reducer
