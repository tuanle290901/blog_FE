import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authReducer from '~/stores/features/auth/auth.slice.ts'
import userSlice from '~/stores/features/user/user.slice.ts'
import userHistory from '~/stores/features/user/user-history.slice.ts'
import departmentSilce from './features/department/department.silce'

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    auth: authReducer,
    user: userSlice,
    userHistory: userHistory,
    department: departmentSilce
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
