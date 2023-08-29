import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import HttpService from '~/config/api.ts'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface.ts'
import { COMMON_ERROR_CODE } from '~/constants/app.constant.ts'
import { IPosition } from '~/types/position.interface.ts'
import { IUserTitle } from '~/types/user.interface.ts'

export interface IPositionState {
  positionList: IPosition[]
  editingPosition: IPosition | null
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
}
const initialState: IPositionState = {
  positionList: [],
  editingPosition: null,
  loading: false,
  currentRequestId: null,
  meta: { page: 0, size: 10, total: 0, totalPage: 0 }
}

export const searchPosition = createAsyncThunk(
  'position/search',
  async (params: { query: string; paging: IPaging; sorts: ISort[] }, thunkAPI) => {
    try {
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts,
        criteria: [
          {
            field: 'name_title',
            operator: 'LIKE_IGNORE_CASE',
            value: params.query
          }
        ]
      }
      return (await HttpService.post('org/title/filter', body, {
        signal: thunkAPI.signal
      })) as IApiResponse<IPosition[]>
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)
export const createPosition = createAsyncThunk('position/create', async (body: Partial<IPosition>, thunkAPI) => {
  try {
    return (await HttpService.post('org/title/create', body, {
      signal: thunkAPI.signal
    })) as IApiResponse<IPosition[]>
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
export const updatePosition = createAsyncThunk('position/update', async (body: Partial<IPosition>, thunkAPI) => {
  try {
    return (await HttpService.put('org/title/update/' + body.id, body, {
      signal: thunkAPI.signal
    })) as IApiResponse<IPosition[]>
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
export const deletePosition = createAsyncThunk('position/delete', async (body: Partial<IPosition>, thunkAPI) => {
  try {
    return (await HttpService.put('org/title/delete?id=' + body.id, {
      signal: thunkAPI.signal
    })) as any
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    startEditingPosition: (state, action: PayloadAction<string>) => {
      const positionId = action.payload
      const foundPosition = state.positionList.find((position) => position.id === positionId)
      state.editingPosition = foundPosition as IPosition
    },
    cancelEditingPosition: (state) => {
      state.editingPosition = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPosition.fulfilled, (state, action) => {
        state.positionList = action.payload.data
        state.meta = action.payload.meta
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
export const { startEditingPosition, cancelEditingPosition } = positionSlice.actions
export default positionSlice.reducer
