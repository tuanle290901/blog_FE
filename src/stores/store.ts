import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import authReducer from '~/stores/features/auth/auth.slice.ts'
import masterDataSlice from '~/stores/features/master-data/master-data.slice.ts'
import ticketProcess from '~/stores/features/setting/ticket-process.slice'
import userHistory from '~/stores/features/user/user-history.slice.ts'
import userSlice from '~/stores/features/user/user.slice.ts'
import departmentSilce from './features/department/department.silce'
import devicesSlice from './features/device/device.slice'

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    auth: authReducer,
    user: userSlice,
    userHistory: userHistory,
    department: departmentSilce,
    ticketProcess,
    masterData: masterDataSlice,
    device: devicesSlice
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
