export interface IHoliday {
  id: string | null
  name: string
  startDate: string
  endDate: string
  note?: string
}

export interface IHolidaySchedule {
  loading: boolean
  holidayList: IHoliday[]
  currentRequestId: string | null
}
