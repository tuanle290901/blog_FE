import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { DragItem, ITicketDef, Ticket, TicketDefRevisionCreateReq } from '~/types/setting-ticket-process'
import { ticketItem } from './fake-data'

const initialState: ITicketDef = {
  loading: false,
  departments: [],
  tickets: [],
  ticketSelected: null,
  createRevisionSuccess: false,
  currentRequestId: null,
  approvalSteps: [
    {
      index: 0,
      key: 'request0',
      title: 'Duyệt lần 1',
      data: []
    }
  ]
}

const fetchDepartments = createAsyncThunk('auth/departments', async (_, thunkAPI) => {
  // const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
  //   signal: thunkAPI.signal
  // })
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: 'manager',
            name: 'Quản lý trực tiếp'
          },
          {
            id: 'hr',
            name: 'HCNS'
          },
          {
            id: 'department',
            name: 'HTSC'
          }
        ],
        message: 'Lấy dữ liệu thành công.',
        status: 200
      })
    }, 1000)
  })
  return await response
})

const fetchListTicket = createAsyncThunk('tickets/getTickets', async (_, thunkAPI) => {
  // const response = await HttpService.post<{ accessToken: string }>('/auth/login', payload, {
  //   signal: thunkAPI.signal
  // })
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve(ticketItem)
    }, 100)
  })
  return await response
})

const createRevision = createAsyncThunk(
  'tickets/definitions',
  async (payload: TicketDefRevisionCreateReq, thunkAPI) => {
    const response = await HttpService.post<ITicketDef>('/tickets/definitions', payload, {
      signal: thunkAPI.signal
    })
    return await response
  }
)

const ticketProcessSlice = createSlice({
  name: 'ticketProcess',
  initialState,
  reducers: {
    getTicketById: (state, action) => {
      const item: any = state.tickets.find((t) => t.id === action.payload.id)
      state.ticketSelected = { ...item }
    },
    setDroppedItem: (state, action) => {
      state.approvalSteps = action.payload.data
    },
    addDroppedItem: (state, action: PayloadAction<{ targetKey: string; item: DragItem }>) => {
      const { targetKey, item } = action.payload
      const itemIndex = state.approvalSteps.findIndex((item) => item.key === targetKey)
      if (itemIndex !== -1) {
        const targetData = state.approvalSteps[itemIndex].data

        if (itemIndex > 1 && state.approvalSteps[itemIndex - 1].data.length === 0) {
          notification.error({ message: 'Vui lòng cập nhật thông tin bước duyệt trước đó' })
          return
        }

        if (targetData.length >= 1) {
          state.approvalSteps[itemIndex].data[0] = item
          // notification.error({ message: 'Giới hạn 1 đơn vị xét duyệt song song' })
          return
        }
        if (targetData.map((t) => t.id).includes(item.id)) {
          notification.error({ message: `${item.name} đã tồn tại` })
          return
        }
        state.approvalSteps[itemIndex].data.push(item)
      }
    },
    removeDroppedItem: (state, action) => {
      const { targetKey, id } = action.payload
      const itemIndex = state.approvalSteps.findIndex((item) => item.key === targetKey)
      if (itemIndex !== -1) {
        const removedIndex = state.approvalSteps[itemIndex].data.findIndex((childItem) => childItem.id === id)
        state.approvalSteps[itemIndex].data.splice(removedIndex, 1)
      }
    },
    addNewApprovalStep: (state) => {
      const nextNodeIndex = state.approvalSteps[state.approvalSteps.length - 1]?.index | 0
      state.approvalSteps.push({
        index: nextNodeIndex + 1,
        key: `request${nextNodeIndex + 1}`,
        title: `Duyệt lần ${nextNodeIndex + 1} `,
        data: []
      })
    },
    removeApprovalStep: (state, action) => {
      const { index } = action.payload
      state.approvalSteps.splice(index, 1)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state: ITicketDef, action) => {
        state.departments = action.payload.data
      })
      .addCase(createRevision.fulfilled, (state: ITicketDef, action) => {
        state.createRevisionSuccess = true
      })
      .addCase(fetchListTicket.fulfilled, (state: ITicketDef, action) => {
        state.tickets = action.payload.data
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = null
          }
        }
      )
  }
})

export const {
  addDroppedItem,
  removeDroppedItem,
  addNewApprovalStep,
  removeApprovalStep,
  getTicketById,
  setDroppedItem
} = ticketProcessSlice.actions
export { fetchDepartments, createRevision, fetchListTicket }
export default ticketProcessSlice.reducer
