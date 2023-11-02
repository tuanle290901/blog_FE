import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface'
import { IBalance } from '~/types/balance.interface'

export interface IBalanceState {
  listData: IBalance[]
  editingBalance: IBalance | null
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
}

const initialState: IBalanceState = {
  listData: [],
  editingBalance: null,
  loading: false,
  currentRequestId: null,
  meta: {
    page: 1,
    size: 10,
    total: 0,
    totalPage: 0
  }
}

export const searchBalance = createAsyncThunk(
  'balance/search',
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
      return (await HttpService.post(END_POINT_API.Balance.filter(), body, {
        signal: thunkAPI.signal
      })) as IApiResponse<IBalance[]>
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const updatePosition = createAsyncThunk('balance/update', async (body: Partial<IBalance>, thunkAPI) => {
  try {
    return (await HttpService.put(END_POINT_API.Balance.update(body.userName), body, {
      signal: thunkAPI.signal
    })) as IApiResponse<IBalance[]>
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    startEditingPosition: (state, action: PayloadAction<string>) => {
      const positionId = action.payload
      const foundPosition = state.listData.find((position) => position.userName === positionId)
      state.editingBalance = foundPosition as IBalance
    },
    cancelEditingPosition: (state) => {
      state.editingBalance = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBalance.fulfilled, (state, action) => {
        state.listData = action.payload.data
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
export const { startEditingPosition, cancelEditingPosition } = balanceSlice.actions
export default balanceSlice.reducer
