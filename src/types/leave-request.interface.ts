import { TicketProcessRevision } from './setting-ticket-process'

export interface TicketDefinationResponse {
  id: string
  name: string
  payrollAffected: boolean
  description?: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  clientId: string
  revisions: TicketProcessRevision[]
}

export type LeaveTypes = {
  [key: string]: string
}

export type TicketStatusType = {
  [key: string]: string
}
