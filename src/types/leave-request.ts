export interface ILeaveRequest {
  id: string
  typeOfLeave: string
  startDate: string
  endDate: string
  requestMessage: string
  AmountTimeLeave: number
  requestDate: string
  status: string
  startTime?: string
  endTime?: string
}

export interface ILeaveRequestForm {
  id?: string
  typeOfLeave: string
  startDate: string
  endDate: string
  requestMessage: string
  AmountTimeLeave: number
  requestDate: string
  startTime?: string
  endTime?: string
}
