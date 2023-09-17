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
import { convertBlobToString } from '~/utils/helper'

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
  meta: { page: 0, size: 15, total: 0, totalPage: 0 },
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

export const syncTimeAttendanceManual = createAsyncThunk(
  'time-attendance/sync-time-attendance-manual',
  async (body: { fromDate: string; toDate: string }, thunkAPI) => {
    try {
      const response: any = await HttpService.post(
        '/internal/attmachine/integration/syn-time-attendance-manual',
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

export const filterTimesheet = createAsyncThunk(
  'time-attendance/filter',
  async (
    params: {
      query: string
      onlyShowWorkingDay?: boolean | null
      groupCode?: string | null
      userName?: string | null
      startDate?: string | null
      endDate?: string | null
      status?: string | null
      paging: IPaging
      sorts: ISort[]
    },
    thunkAPI
  ) => {
    try {
      const defaultSorts = [
        {
          direction: 'DESC',
          field: 'date'
        },
        {
          direction: 'DESC',
          field: 'startTime'
        }
      ]
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts?.length > 0 ? params.sorts : defaultSorts
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
      if (!params.query && params.userName) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                field: 'user_name',
                operator: 'IS',
                value: params.userName
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
      if (!params.query && params.userName && params.groupCode) {
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
                field: 'user_name',
                operator: 'IS',
                value: params.userName
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
      if (params.onlyShowWorkingDay) {
        body.criteria[0].children.push({
          field: 'report_data.date_type',
          operator: 'LIKE_IGNORE_CASE',
          value: 'WORKING_DATE'
        })
      }

      if (params.status) {
        body.criteria[0].children.push({
          field: 'report_data.payroll_amount',
          operator: params.status,
          value: 8,
          type: 'DOUBLE'
        })
      }

      if (!params.onlyShowWorkingDay) {
        const index = body.criteria[0].children.findIndex((item: any) => item.field === 'report_data.date_type')
        if (index > -1) {
          body.criteria[0].children.splice(index, 1)
        }
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

export const exportTimesheet = createAsyncThunk(
  'export-time-attendance/export-search-attendance',
  async (
    params: {
      query: string
      onlyShowWorkingDay?: boolean | null
      groupCode?: string | null
      userName?: string | null
      startDate?: string | null
      endDate?: string | null
      paging: IPaging
      sorts: ISort[]
    },
    thunkAPI
  ) => {
    try {
      const defaultSorts = [
        {
          direction: 'DESC',
          field: 'date'
        },
        {
          direction: 'DESC',
          field: 'startTime'
        }
      ]
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts?.length > 0 ? params.sorts : defaultSorts
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
      if (!params.query && params.userName) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                field: 'user_name',
                operator: 'IS',
                value: params.userName
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
      if (!params.query && params.userName && params.groupCode) {
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
                field: 'user_name',
                operator: 'IS',
                value: params.userName
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
      if (params.onlyShowWorkingDay) {
        body.criteria[0].children.push({
          field: 'report_data.date_type',
          operator: 'LIKE_IGNORE_CASE',
          value: 'WORKING_DATE'
        })
      }
      if (!params.onlyShowWorkingDay) {
        const index = body.criteria[0].children.findIndex((item: any) => item.field === 'report_data.date_type')
        if (index > -1) {
          body.criteria[0].children.splice(index, 1)
        }
      }
      const response: any = await HttpService.post('/export-time-attendance/export-search-attendance', body, {
        responseType: 'blob',
        signal: thunkAPI.signal
      })
      if (response?.size > 0) {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        if (params.startDate === params.endDate || (!params.startDate && !params.endDate)) {
          saveAs(blob, `Dữ liệu chấm công ngày ${params.startDate || dayjs().format('YYYY-MM-DD')}.xlsx`)
        } else {
          saveAs(blob, `Dữ liệu chấm công từ ngày ${params.startDate} đến ngày ${params.endDate}.xlsx`)
        }
      } else {
        notification.warning({ message: 'Chỉ được chọn khoảng thời gian không quá 31 ngày' })
      }
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        const dataResponse = await convertBlobToString(error.response.data)
        if (dataResponse) {
          notification.error({ message: dataResponse.message })
        }
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
