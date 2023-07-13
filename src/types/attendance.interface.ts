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
}
