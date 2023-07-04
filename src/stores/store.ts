import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authReducer from '~/stores/features/auth/authSlice.ts'

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    auth: authReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
