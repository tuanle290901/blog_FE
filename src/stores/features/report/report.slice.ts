import { ThunkDispatch, createSlice } from '@reduxjs/toolkit'
import { saveAs } from 'file-saver'
import HttpService from '~/config/api'
import { excelBlob } from './fake-data'

const initialState: any = {
  downloaded: false,
  currentRequestId: null
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setDownloaded: (state, action) => {
      state.downloaded = action.payload
    }
  }
})

export const downloadExcelFile =
  (payload: { groupCode: string; startTime: string; endTime: string }) => async (dispatch: any) => {
    try {
      // const response = await HttpService.post('/api/excel', payload, { responseType: 'blob' })
      const response = excelBlob
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
      saveAs(blob, 'Bao-cao.csv')
      dispatch(setDownloaded(true))
    } catch (error) {
      console.error('Lỗi khi tải xuống tệp Excel:', error)
      dispatch(setDownloaded(false))
    }
  }

export const { setDownloaded } = reportSlice.actions
export default reportSlice.reducer
