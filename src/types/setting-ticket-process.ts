export interface TargetProps {
  targetKey: string
  onDrop: (item: DragItem, targetKey: string) => void
  dropItem: DropItem
  canDropItem: () => boolean
  isValidStep: () => boolean
}

export interface IApprovalStep {
  index: number
  key: string
  title: string
  data: DragItem[]
}

export interface Ticket {
  id: string
  title: string
}

export interface ITicketDef {
  loading: boolean
  createRevisionSuccess: boolean
  departments: DragItem[]
  approvalSteps: IApprovalStep[]
  currentRequestId: string | null
  tickets: Ticket[]
  ticketSelected: TicketDefRevisionCreateReq[]
}

export interface DragItem {
  id: string
  name: string
}

export interface DropItem {
  index: number
  key: string
  title: string
  data: DragItem[]
}

// For tiket definition create request
export interface TicketAttribute {
  name: string
  type: 'TEXT' | 'NUMBER' | 'DATE_TIME' | 'BOOLEAN' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE'
  required: boolean
  description?: string
  suggestion?: any[]
  options?: any[]
}

export interface TicketTransfer {
  destIdx: number
  srcIdx: number
}

export interface TicketProcessNode {
  groupCode: string
  attributes: TicketAttribute[]
}

export interface TicketProcessRevision {
  rev?: number
  startNodeIndex?: number
  endNodeIndex?: number
  continueTransferStrategy?: string[]
  stopTransferStrategy?: string
  strategy?: string
  createdAt?: string
  createdBy?: string
  processFlow: TicketTransfer[]
  processNodes: TicketProcessNode[]
}

export interface TicketDefRevisionCreateReq {
  name: string
  description?: string
  revision: TicketProcessRevision
  ticketDefId: string
}
