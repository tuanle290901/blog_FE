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
  absenceType?: string | null
  absenceAmount: number
  workingAmount: number
  payrollAmount: number
  note: string | null
  noneWorkingDay?: boolean
  dateType: string
  absenceInfoList: IAbsenceInfo[]
}

export interface IAbsenceInfo {
  ticketCode: string
  amount: number
  absenceType: string
  startDateTimeRegist: string
  endDateTimeRegist: string
}

export interface IPayloadUpdateAttendance {
  date: string
  id: string
  reportData: IReportData
  userId: string
}
