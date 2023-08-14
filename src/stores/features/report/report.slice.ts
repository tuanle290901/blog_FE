import { ThunkDispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { saveAs } from 'file-saver'
import HttpService from '~/config/api'
import { excelBlob } from './fake-data'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type'

interface ExportFileState {
  loading: boolean
  downloaded: boolean
  msg: string
  currentRequestId: string | null
}

const initialState: ExportFileState = {
  loading: false,
  downloaded: false,
  msg: '',
  currentRequestId: null
}

const downloadFile = createAsyncThunk(
  '/time-attendance/export-month-statistic',
  async (payload: { month: string; year: string }, thunkAPI) => {
    const { month, year } = payload
    const response = await HttpService.get(`/time-attendance/export-month-statistic?month=${month}&year=${year}`, {
      signal: thunkAPI.signal,
      responseType: 'blob'
    })
    return response
  }
)

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setDownloaded: (state, action) => {
      state.downloaded = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadFile.fulfilled, (state: ExportFileState, action) => {
        state.downloaded = true
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
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
  }
})

export const downloadExcelFile = async (payload: { month: string; year: string }) => {
  const { month, year } = payload
  const response = await HttpService.get(`/export-time-attendance/export-month-statistic?month=${month}&year=${year}`, {
    responseType: 'blob'
  })
  return response
}

export const { setDownloaded } = reportSlice.actions
export { downloadFile }
export default reportSlice.reducer
