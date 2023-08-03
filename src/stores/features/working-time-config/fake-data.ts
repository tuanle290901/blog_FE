import { IWorkingInfo } from '~/types/working-time.interface'

export const WorkingTimeInfo: IWorkingInfo = {
  year: '2023',
  groupCode: '2023',
  policySetup: {
    reportMethod: 'email',
    reportViolateTime: '20:00',
    reportMonthlyStatisticTime: '03:00',
    defaultLeaveDay: 12
  },
  timeWorkSetup: {
    workingTime: {
      startTime: '08:00',
      endTime: '08:00'
    },
    dailyOverTimeSetups: [
      {
        shiftNo: 1,
        overTimeShift: {
          startTime: '17:00',
          endTime: '22:00'
        },
        coefficientSalary: 1.5
      },
      {
        shiftNo: 2,
        overTimeShift: {
          startTime: '22:00',
          endTime: '06:00'
        },
        coefficientSalary: 2.0
      },
      {
        shiftNo: 3,
        overTimeShift: {
          startTime: '06:00',
          endTime: '08:00'
        },
        coefficientSalary: 1.5
      }
    ],
    weekendTimeSetups: [
      {
        coefficient: 2.0,
        dayOfWeek: 'SATURDAY'
      },
      {
        coefficient: 2.0,
        dayOfWeek: 'SUNDAY'
      }
    ],
    timeWorkQuaterSetups: [
      {
        startTime: '08:00',
        endTime: '17:00',
        saturdayWorkingConfigs: [
          {
            saturdayDate: '2023-01-07',
            working: true
          },
          {
            saturdayDate: '2023-01-14',
            working: false
          },
          {
            saturdayDate: '2023-01-21',
            working: true
          },
          {
            saturdayDate: '2023-01-28',
            working: false
          },
          {
            saturdayDate: '2023-02-04',
            working: true
          },
          {
            saturdayDate: '2023-02-11',
            working: false
          },
          {
            saturdayDate: '2023-02-18',
            working: true
          },
          {
            saturdayDate: '2023-02-25',
            working: false
          },
          {
            saturdayDate: '2023-03-04',
            working: true
          },
          {
            saturdayDate: '2023-03-11',
            working: false
          },
          {
            saturdayDate: '2023-03-18',
            working: true
          },
          {
            saturdayDate: '2023-03-25',
            working: false
          }
        ],
        quarter: 'Q1'
      },
      {
        startTime: '08:00',
        endTime: '17:00',
        saturdayWorkingConfigs: [
          {
            saturdayDate: '2023-04-01',
            working: false
          },
          {
            saturdayDate: '2023-04-08',
            working: false
          },
          {
            saturdayDate: '2023-04-15',
            working: false
          },
          {
            saturdayDate: '2023-04-22',
            working: false
          },
          {
            saturdayDate: '2023-04-29',
            working: false
          },
          {
            saturdayDate: '2023-05-06',
            working: false
          },
          {
            saturdayDate: '2023-05-13',
            working: false
          },
          {
            saturdayDate: '2023-05-20',
            working: false
          },
          {
            saturdayDate: '2023-05-27',
            working: false
          },
          {
            saturdayDate: '2023-06-03',
            working: false
          },
          {
            saturdayDate: '2023-06-10',
            working: false
          },
          {
            saturdayDate: '2023-06-17',
            working: false
          },
          {
            saturdayDate: '2023-06-24',
            working: false
          }
        ],
        quarter: 'Q2'
      },
      {
        startTime: '08:00',
        endTime: '17:00',
        saturdayWorkingConfigs: [
          {
            saturdayDate: '2023-07-01',
            working: false
          },
          {
            saturdayDate: '2023-07-08',
            working: false
          },
          {
            saturdayDate: '2023-07-15',
            working: false
          },
          {
            saturdayDate: '2023-07-22',
            working: false
          },
          {
            saturdayDate: '2023-07-29',
            working: false
          },
          {
            saturdayDate: '2023-08-05',
            working: false
          },
          {
            saturdayDate: '2023-08-12',
            working: false
          },
          {
            saturdayDate: '2023-08-19',
            working: false
          },
          {
            saturdayDate: '2023-08-26',
            working: false
          },
          {
            saturdayDate: '2023-09-02',
            working: false
          },
          {
            saturdayDate: '2023-09-09',
            working: false
          },
          {
            saturdayDate: '2023-09-16',
            working: false
          },
          {
            saturdayDate: '2023-09-23',
            working: false
          },
          {
            saturdayDate: '2023-09-30',
            working: false
          }
        ],
        quarter: 'Q3'
      },
      {
        startTime: '08:00',
        endTime: '17:00',
        saturdayWorkingConfigs: [
          {
            saturdayDate: '2023-11-04',
            working: false
          },
          {
            saturdayDate: '2023-11-11',
            working: true
          },
          {
            saturdayDate: '2023-11-18',
            working: true
          },
          {
            saturdayDate: '2023-11-25',
            working: true
          },
          {
            saturdayDate: '2023-12-02',
            working: true
          },
          {
            saturdayDate: '2023-12-09',
            working: true
          },
          {
            saturdayDate: '2023-12-16',
            working: true
          },
          {
            saturdayDate: '2023-12-23',
            working: true
          },
          {
            saturdayDate: '2023-12-30',
            working: true
          },
          {
            saturdayDate: '2024-01-06',
            working: true
          },
          {
            saturdayDate: '2024-01-13',
            working: true
          },
          {
            saturdayDate: '2024-01-20',
            working: true
          },
          {
            saturdayDate: '2024-01-27',
            working: true
          }
        ],
        quarter: 'Q4'
      }
    ]
  }
}
