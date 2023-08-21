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
  tickets: any[]
  ticketSelected: TicketDefRevisionCreateReq | null
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
  value?: any
}

export interface TicketTransfer {
  destIdx: number
  srcIdx: number
}

export interface TicketProcessNode {
  groupCode: string
  groupCodes: string[]
  attributes: TicketAttribute[]
  name?: string
  histories?: { executorId: string; createdAt: string }[]
  status?: string
  value?: string
  executors?: string
  createdAt?: string
}

export interface TicketProcessRevision {
  rev?: number
  startNodeIndex?: number
  endNodeIndex?: number
  continueTransferStrategy?: string[]
  stopTransferStrategy?: string
  strategy?: string[]
  createdAt?: string
  createdBy?: string
  processFlow: TicketTransfer[]
  processNodes: {
    [id: string]: TicketProcessNode
  }
}

export interface TicketDefRevisionCreateReq {
  id?: string
  name: string
  description?: string
  revision: TicketProcessRevision
  ticketDefId: string
}
