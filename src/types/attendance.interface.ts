export interface IAttendance {
  id: string
  date: string
  timeStart: string
  timeEnd: string
  status: string
  userName?: string
  userId?: string
  startTime?: string
  endTime?: string
  violate?: []
  reportData: IReportData | any
}
export interface IReportData {
  violate: []
  absenceType: string | null
  absenceAmount: number | null
  workingAmount: number | null
  note: string | null
}
