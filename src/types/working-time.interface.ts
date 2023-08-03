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
  always?: boolean
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
  endTime: string | null
  startTime: string | null
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
      isActive: true,
      always: true,
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'TUESDAY',
      isActive: true,
      always: true,
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'WEDNESDAY',
      isActive: true,
      always: true,
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'THURSDAY',
      isActive: true,
      always: true,
      weekIndexInMonth: [1, 2, 3, 4, 5]
    },
    {
      startTime: '08:30',
      endTime: '17:30',
      dayOfWeek: 'FRIDAY',
      isActive: true,
      always: false,
      weekIndexInMonth: [1]
    },
    {
      startTime: '08:30',
      endTime: '12:00',
      dayOfWeek: 'SATURDAY',
      isActive: false,
      always: false,
      weekIndexInMonth: [1]
    }
  ]
}

export interface IWorkingInfo {
  year: string
  groupCode: string
  policySetup: PolicySetup
  timeWorkSetup: TimeWorkSetup
}

export interface PolicySetup {
  reportMethod: string
  reportViolateTime: string
  reportMonthlyStatisticTime: string
  defaultLeaveDay: number
}

export interface TimeWorkSetup {
  workingTime: WorkingTime
  dailyOverTimeSetups: DailyOverTimeSetup[]
  weekendTimeSetups: WeekendTimeSetup[]
  timeWorkQuaterSetups: TimeWorkQuaterSetup[]
}

export interface WorkingTime {
  startTime: string
  endTime: string
}

export interface DailyOverTimeSetup {
  shiftNo: number
  overTimeShift: OverTimeShift
  coefficientSalary: number
}

export interface OverTimeShift {
  startTime: string
  endTime: string
}

export interface WeekendTimeSetup {
  coefficient: number
  dayOfWeek: string
}

export interface TimeWorkQuaterSetup {
  startTime: string
  endTime: string
  saturdayWorkingConfigs: SaturdayWorkingConfig[]
  quarter: string
}

export interface SaturdayWorkingConfig {
  saturdayDate: string
  working: boolean
}
