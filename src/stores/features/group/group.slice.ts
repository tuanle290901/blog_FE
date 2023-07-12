import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '~/config/api.ts'
import { COMMON_ERROR_CODE } from '~/constants/app.constant.ts'
import { IApiResponse } from '~/types/IApiResponse.interface.ts'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'

export interface IGroup {
  code: string
  name: string
}
export interface IGroupState {
  groups: IGroup[]
  loading: boolean
  currentRequestId: string | null
  error: Record<string, any> | null
}
const initialState: IGroupState = {
  groups: [],
  loading: false,
  currentRequestId: null,
  error: null
}
export const getAllGroup = createAsyncThunk('group/getAll', async (_, thunkAPI) => {
  try {
    const response: IApiResponse<IGroup[]> = await HttpService.get('/org/group/groups', {
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
const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroup.fulfilled, (state, action) => {
        state.groups = action.payload.data
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
export default groupSlice.reducer
