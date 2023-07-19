import { Dayjs } from 'dayjs'

export interface IWorkingTimeConfig {
  id?: string
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  common: ICommonConfig
  groupCode: string | null
  workingDailySetups: IWorkingDailySetup[]
}

export interface IWorkingDailySetup {
  isActive?: boolean
  dayOfWeek: string
  endTime: string | null | Dayjs
  startTime: string | null | Dayjs
  weekIndexInMonth: number[]
}

export interface ICommonConfig {
  affectCompensatoryInMonth: number
  defaultLeaveDay: number
  endPayrollCutoffDay: {
    day: number
    monthType: string
  }
  overTimeSetting: IOverTimeSetting
  startPayrollCutoffDay: {
    day: number
    monthType: string
  }
}

export interface IOverTimeSetting {
  endTime: string
  startTime: string
}

export const DEFAULT_CONFIG: IWorkingTimeConfig = {
  groupCode: null,
  common: {
    affectCompensatoryInMonth: 3,
    startPayrollCutoffDay: {
      monthType: 'FOR_THIS_MONTH',
      day: 1
    },
    endPayrollCutoffDay: {
      monthType: 'FOR_THIS_MONTH',
      day: 5
    },
    defaultLeaveDay: 12,
    overTimeSetting: {
      startTime: '21:00',
      endTime: '23:00'
    }
  },
  workingDailySetups: [
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'MONDAY',
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'TUESDAY',
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'WEDNESDAY',
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'THURSDAY',
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'FRIDAY',
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '12:00',
      dayOfWeek: 'SATURDAY',
      weekIndexInMonth: [1]
    }
  ]
}
