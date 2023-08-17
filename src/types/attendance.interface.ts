export interface IAttendance {
  id: string
  userId: string
  userName: string
  date: string
  startTime: string
  endTime: string
  fullName: string
  reportData: IReportData
}
export interface IReportData {
  violates: string[]
  absenceType: string | null
  absenceAmount: number
  workingAmount: number
  note: string | null
  noneWorkingDay?: boolean
  dateType: string
}

export interface IViolate {
  violateType: string
  confirmed: boolean
}

export interface IPayloadUpdateAttendance {
  date: string
  id: string
  reportData: IReportData
  userId: string
}
