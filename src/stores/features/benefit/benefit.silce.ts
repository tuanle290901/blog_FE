import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'
import { IApiResponse, IPaging, ISort } from '~/types/api-response.interface'
import { IBenefit, IBenefitUpdate } from '~/types/benefit.interface'

export interface IBenefitState {
  listData: IBenefit[]
  editingBenefit: IBenefit | null
  loading: boolean
  currentRequestId: string | null
  meta: IPaging
}

const initialState: IBenefitState = {
  listData: [],
  editingBenefit: null,
  loading: false,
  currentRequestId: null,
  meta: {
    page: 1,
    size: 10,
    total: 0,
    totalPage: 0
  }
}

export const searchBenefit = createAsyncThunk(
  'benefit/search',
  async (params: { search: string; year: string; paging: IPaging; sorts: ISort[] }, thunkAPI) => {
    try {
      const body: any = {
        page: params.paging.page,
        size: params.paging.size,
        sort: params.sorts,
        criteria: [
          {
            field: 'year',
            operator: 'LIKE_IGNORE_CASE',
            value: params.year
          }
        ]
      }
      if (params.search.length > 0) {
        body.criteria = [
          {
            operator: 'AND_MULTIPLES',
            children: [
              {
                field: 'user_name',
                operator: 'LIKE_IGNORE_CASE',
                value: params.search
              },
              ...body.criteria
            ]
          }
        ]
      }
      return (await HttpService.post(END_POINT_API.Benefit.filter(), body, {
        signal: thunkAPI.signal
      })) as IApiResponse<IBenefit[]>
    } catch (error: any) {
      if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const updateBenefit = createAsyncThunk('benefit/update', async (body: Partial<IBenefitUpdate>, thunkAPI) => {
  try {
    const response: IApiResponse<IBenefit> = await HttpService.post(END_POINT_API.Benefit.update(), body, {
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

export const exportBenefit = async (payload: { year: string; paging: IPaging; sorts: ISort[] }) => {
  const body: any = {
    page: payload.paging.page,
    size: payload.paging.size,
    sort: payload.sorts,
    criteria: [
      {
        field: 'year',
        operator: 'IS',
        value: payload.year
      }
    ]
  }
  const response = await HttpService.post(END_POINT_API.Benefit.export(), body, {
    responseType: 'blob'
  })
  return response
}

export const importBenefit = createAsyncThunk('benefit/importBenefit', async (payload: File, thunkAPI) => {
  try {
    const form = new FormData()
    form.append('file', payload)
    const response = await HttpService.post(END_POINT_API.Benefit.import(), form, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(response)
    return response.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && !COMMON_ERROR_CODE.includes(error.response.status)) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    console.log(error)
    throw error
  }
})

const BenefitSlice = createSlice({
  name: 'benefit',
  initialState,
  reducers: {
    startEditingBenefit: (state, action: PayloadAction<string>) => {
      const userName = action.payload
      const foundBenefit = state.listData.find((benefit) => benefit.userName === userName)
      state.editingBenefit = foundBenefit as IBenefit
    },
    cancelEditingBenefit: (state) => {
      state.editingBenefit = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBenefit.pending, (state, action) => {
        state.loading = true
      })
      .addCase(searchBenefit.fulfilled, (state, action) => {
        state.loading = false
        state.listData = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(importBenefit.fulfilled, (state, action) => {
        //
      })
      .addCase(updateBenefit.fulfilled, (state, action) => {
        const dataUpdate = action.payload.data
        const index = state.listData.findIndex((item) => item.userName === dataUpdate.userName)
        state.listData[index] = dataUpdate
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
export const { startEditingBenefit, cancelEditingBenefit } = BenefitSlice.actions
export default BenefitSlice.reducer
