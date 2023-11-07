import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import authReducer from '~/stores/features/auth/auth.slice.ts'
import masterDataSlice from '~/stores/features/master-data/master-data.slice.ts'
import positionSlice from '~/stores/features/position/position.slice.ts'
import ticketProcess from '~/stores/features/setting/ticket-process.slice'
import userHistory from '~/stores/features/user/user-history.slice.ts'
import userSlice from '~/stores/features/user/user.slice.ts'
import workingTimeConfigSlice from '~/stores/features/working-time-config/working-time-config.slice.ts'
import BenefitSlice from './features/benefit/benefit.silce'
import departmentSlice from './features/department/department.silce'
import devicesSlice from './features/device/device.slice'
import holidaySchedule from './features/holiday-schedule/holiday-schedule.slice'
import leaveBalacnce from './features/leave-balance/leave-balance.slice'
import leaveRequestSlice from './features/leave-request/leave-request.slice'
import timesheetSlice from './features/timesheet/timesheet.slice'
import typesOfLeaveSlice from './features/types-of-leave/types-of-leave.slice'
export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    auth: authReducer,
    user: userSlice,
    userHistory: userHistory,
    timesheet: timesheetSlice,
    department: departmentSlice,
    ticketProcess,
    masterData: masterDataSlice,
    position: positionSlice,
    device: devicesSlice,
    typesOfLeave: typesOfLeaveSlice,
    leaveRequest: leaveRequestSlice,
    workingTime: workingTimeConfigSlice,
    holidaySchedule,
    leaveBalacnce,
    benefit: BenefitSlice
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
