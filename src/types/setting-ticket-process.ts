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
  listRevisionsByTicketType: any[]
  ticketSelected: TicketDefRevisionCreateReq | null
  revisionSelected: TicketDefRevisionCreateReq | null
  currentRevision: TicketDefRevisionCreateReq | null
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
  groupCode?: string
  groupCodes?: string[] | any
  attributes: TicketAttribute[]
  nodeIndex?: number | string | undefined
  name?: string
  histories?: { executorId: string; createdAt: string; actualGroup: string }[]
  status?: string
  value?: string
  executors?: string
  createdAt?: string
  type?: string
  position: {
    x: number
    y: number
  }
}

export interface TicketProcessRevision {
  id?: string
  rev?: string
  applyFromDate: string
  applyToDate?: string
  startNodeIndex?: number
  approvedAt?: string
  approvedBy?: string
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
  status?: boolean
  isNoLongerSupport?: boolean
}

export interface TicketDefRevisionCreateReq {
  id?: string
  ticketType: string
  name?: string
  description?: string
  revision: TicketProcessRevision
  ticketDefId: string
  revisions?: TicketProcessRevision[]
  createdAt?: string
  createdBy?: string
}

export interface SearchPayload {
  rev?: string | null
  ticketType?: string | null
}
