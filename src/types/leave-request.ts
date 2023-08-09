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
  processStatus: { [key: string]: string }
}

export interface ILeaveRequestForm {
  id?: string
  initialAttrs: { [key: string]: string }
  revision: number
  ticketDefinitionId: string
}

export interface ILeaveRequestEditForm {
  attrs: { [key: string]: string }
  id: string
}

export interface ILeaveRequestUpdateStatusForm {
  ticketId: string
  nodeId: number
  attrs: { [key: string]: string }
  status: TicketStatusEnum.CONFIRMED | TicketStatusEnum.REJECTED
}
