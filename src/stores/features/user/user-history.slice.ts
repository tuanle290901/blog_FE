import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface IUserHistoryState {
  history: []
  loading: boolean
  currentRequest: string | null
}
const initialState: IUserHistoryState = {
  history: [],
  loading: false,
  currentRequest: null
}
export const getUserHistory = createAsyncThunk('userHistory/getAll', async (userId: string, thunkAPI) => {
  return []
})
const userHistorySlice = createSlice({
  name: 'userHistory',
  initialState,
  reducers: {}
})

export default userHistorySlice.reducer
