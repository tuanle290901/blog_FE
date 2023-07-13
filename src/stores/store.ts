import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authReducer from '~/stores/features/auth/auth.slice.ts'
import userSlice from '~/stores/features/user/user.slice.ts'
import userHistory from '~/stores/features/user/user-history.slice.ts'
import ticketProcess from '~/stores/features/setting/ticket-process.slice'
import departmentSlice from './features/department/department.silce'
import positionSlice from '~/stores/features/position/position.slice.ts'
import masterDataSlice from '~/stores/features/master-data/master-data.slice.ts'
export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    auth: authReducer,
    user: userSlice,
    userHistory: userHistory,
    department: departmentSlice,
    ticketProcess,
    masterData: masterDataSlice,
    position: positionSlice
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
