import { WEEK_DAY } from '~/constants/app.constant.ts'

export interface IWorkingTimeConfig {
  id: string
  groupCode: string
  affectCompensatoryInMonth: number
  startPayrollCutoffDay: number
  endPayrollCutoffDay: number
  defaultLeaveDay: number
  workOT: {
    startTimeOT: string
    endTimeOT: string
  }
  workingDays: IWorkingDayConfig[]
}
export interface IShift {
  startTimeShift?: string
  endTimeShift?: string
}
export interface IWorkingDayConfig {
  day: WEEK_DAY
  always: boolean
  weeks: number[]
  isActive: boolean
  shifts: IShift[]
}

export const fakeData: IWorkingTimeConfig = {
  id: 'working-time-id',
  groupCode: 'master-data-code',
  affectCompensatoryInMonth: 3,
  startPayrollCutoffDay: 1,
  endPayrollCutoffDay: 5,
  defaultLeaveDay: 12,
  workOT: {
    startTimeOT: '17:30',
    endTimeOT: '22:30'
  },
  workingDays: [
    {
      day: WEEK_DAY.MONDAY,
      always: true,
      weeks: [],
      isActive: true,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    },
    {
      day: WEEK_DAY.TUESDAY,
      always: true,
      weeks: [],
      isActive: true,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    },
    {
      day: WEEK_DAY.WEDNESDAY,
      always: true,
      weeks: [],
      isActive: true,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    },
    {
      day: WEEK_DAY.THURSDAY,
      always: true,
      weeks: [],
      isActive: true,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    },
    {
      day: WEEK_DAY.FRIDAY,
      always: true,
      weeks: [],
      isActive: true,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    },
    {
      day: WEEK_DAY.SATURDAY,
      always: true,
      weeks: [],
      isActive: false,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    },
    {
      day: WEEK_DAY.SUNDAY,
      always: true,
      weeks: [],
      isActive: false,
      shifts: [
        {
          startTimeShift: '08:30',
          endTimeShift: '12:00'
        },
        {
          startTimeShift: '13:00',
          endTimeShift: '17:30'
        }
      ]
    }
  ]
}
