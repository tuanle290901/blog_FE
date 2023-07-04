import { createSlice } from '@reduxjs/toolkit'
import { AuthStateInterface } from '~/stores/types/auth-state.interface.ts'

const initialState: AuthStateInterface = {
  loading: false,
  userInfo: {}, // for user object
  userToken: null, // for storing the JWT
  error: null,
  success: false // for monitoring the registration process.
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getUserInfo: () => {
      //   TODO implement
    }
  },
  extraReducers: {}
})

export default authSlice.reducer
