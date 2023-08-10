import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api.ts'
import { COMMON_ERROR_CODE } from '~/constants/app.constant.ts'
import { IApiResponse } from '~/types/api-response.interface.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { IUserTitle } from '~/types/user.interface.ts'

export interface IGroup {
  code: string
  name: string
}
export interface IGroupState {
  groups: IGroup[]
  listUserTitle: IUserTitle[]
  groupRootName: any
  loading: boolean
  currentRequestId: string | null
  error: Record<string, any> | null
}
const initialState: IGroupState = {
  groups: [],
  listUserTitle: [],
  groupRootName: null,
  loading: false,
  currentRequestId: null,
  error: null
}
export const getAllGroup = createAsyncThunk('master-data/getAll', async (_, thunkAPI) => {
  try {
    const response: IApiResponse<IGroup[]> = await HttpService.get('/org/group/groups-by-grant', {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})

export const getGroupRootName = createAsyncThunk('master-data/getGroupRootName', async (_, thunkAPI) => {
  try {
    const response: IApiResponse<IGroup[]> = await HttpService.get('/org/group/group-root-name', {
      signal: thunkAPI.signal
    })
    return response
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})

export const getTitle = createAsyncThunk('masterData/getAllTitle', async (_, thunkAPI) => {
  return (await HttpService.post(
    'org/title/filter',
    {},
    {
      signal: thunkAPI.signal
    }
  )) as IApiResponse<IUserTitle[]>
})
const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroup.fulfilled, (state, action) => {
        state.groups = action.payload.data
      })
      .addCase(getTitle.fulfilled, (state, action) => {
        state.listUserTitle = action.payload.data
      })
      .addCase(getGroupRootName.fulfilled, (state, action) => {
        state.groupRootName = action.payload.data
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
            //   TODO handle error
          }
        }
      )
      .addDefaultCase((state, action) => {
        // console.log(`action type: ${action.type}`, current(state))
      })
  }
})
export default masterDataSlice.reducer
