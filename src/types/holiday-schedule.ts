export interface IHoliday {
  id: string | null
  code: string
  name: string
  startAt: string
  endAt: string
  type: 'HOLIDAY'
  note?: string
}

export interface IHolidaySchedule {
  loading: boolean
  holidayList: IHoliday[]
  currentRequestId: string | null
}
