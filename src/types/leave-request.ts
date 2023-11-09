import { TicketStatusEnum } from '~/utils/Constant'

export interface ILeaveRequest {
  id: string
  groupCode: string
  status: string
  ticketCode: string
  ticketDefinitionId: string
  createdAt: string
  createdBy: string
  definitionRevision: number
  updatedAt: string
  updatedBy: string
  processStatus: { [key: string]: any }
}

export interface ILeaveRequestForm {
  id?: string
  initialAttrs: { [key: string]: string }
  revision: number | string
  ticketDefinitionId: string
}

export interface ILeaveRequestEditForm {
  attrs: { [key: string]: string }
  id: string
}

export interface ILeaveRequestUpdateStatusForm {
  ticketId: string
  nodeId: number | string | undefined
  attrs: { [key: string]: string }
  status: TicketStatusEnum.FINISHED | TicketStatusEnum.REJECTED
}

export interface ICountLeaveRequest {
  approved: number
  rejected: number
  submitted: number
}
