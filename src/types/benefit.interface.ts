import { IPaging, ISort } from './api-response.interface'

export interface IBenefit {
  userName: string
  balance: number
  joinDate: string
}

export interface IBenefitFilter {
  year: number
  paging: IPaging
  sorts: ISort[]
  search: string
}

export interface IBenefitUpdate {
  initYearLeaveBalanceMinutes: number
  joinDate: string
  userName: string
  year: string
}
