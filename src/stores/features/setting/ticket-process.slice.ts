import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import HttpService from '~/config/api'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { DragItem, ITicketDef, SearchPayload, TicketDefRevisionCreateReq } from '~/types/setting-ticket-process'
import { ticketItem } from './ultil-data'
import dayjs from 'dayjs'
import axios from 'axios'

const initialState: ITicketDef = {
  loading: false,
  departments: [],
  tickets: [],
  ticketSelected: null,
  createRevisionSuccess: false,
  currentRequestId: null,
  listRevisionsByTicketType: [],
  revisionSelected: null,
  approvalSteps: [],
  currentRevision: null
}

const fetchListTicket = createAsyncThunk('tickets/getAll', async (_, thunkAPI) => {
  const response = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve(ticketItem)
    }, 100)
  })
  return response
})

export const getListRevisionByTicketType = createAsyncThunk(
  'tickets_definitions/getAll',
  async (payload: SearchPayload, thunkAPI) => {
    const response = await HttpService.post<any[]>('/tickets_definitions/search', payload, {
      signal: thunkAPI.signal
    })
    return response
  }
)

export const getOneRevisionByKey = createAsyncThunk(
  'tickets_definitions/get_one_by_key',
  async (payload: SearchPayload, thunkAPI) => {
    try {
      const response = await HttpService.post<any>('/tickets_definitions/get_one_by_key', payload, {
        signal: thunkAPI.signal
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const getOneRevisionByKey1 = async (payload: SearchPayload) => {
  try {
    const response = await HttpService.post<any>('/tickets_definitions/get_one_by_key', payload)
    return response
  } catch (err: any) {
    throw new Error(err)
  }
}

const createRevision = createAsyncThunk(
  'tickets_definitions/createRevision',
  async (payload: TicketDefRevisionCreateReq, thunkAPI) => {
    try {
      const response = await HttpService.post('tickets_definitions/save_one', payload, {
        signal: thunkAPI.signal
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const updateRevision = createAsyncThunk(
  'tickets_definitions/updateRevision',
  async (payload: TicketDefRevisionCreateReq, thunkAPI) => {
    try {
      const response = await HttpService.post('tickets_definitions/update_one', payload, {
        signal: thunkAPI.signal
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const deleteRevision = createAsyncThunk(
  'tickets_definitions/deleteRevision',
  async (payload: SearchPayload, thunkAPI) => {
    try {
      const response = await HttpService.post('tickets_definitions/delete_one', payload, {
        signal: thunkAPI.signal
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const approvalRevision = createAsyncThunk(
  'tickets_definitions/approveRevision',
  async (payload: SearchPayload, thunkAPI) => {
    try {
      const response = await HttpService.post('tickets_definitions/approval_one', payload, {
        signal: thunkAPI.signal
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const getRevisionApplied = createAsyncThunk(
  'tickets_definitions/getRevisionApplied',
  async (payload: { ticketType: string }, thunkAPI) => {
    try {
      const response = await HttpService.post('tickets_definitions/get_one_being_applied', payload, {
        signal: thunkAPI.signal
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

const ticketProcessSlice = createSlice({
  name: 'ticketProcess',
  initialState,
  reducers: {
    resetRevisionSelected: (state) => {
      state.revisionSelected = null
    },
    getTicketById: (state, action) => {
      const { id } = action.payload
      if (id) {
        const item: any = state.tickets.find((t) => t.id === action.payload.id)
        state.ticketSelected = { ...item }
      } else {
        state.ticketSelected = null
      }
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
      .addCase(createRevision.fulfilled, (state: ITicketDef, action) => {
        state.createRevisionSuccess = true
      })
      .addCase(fetchListTicket.fulfilled, (state: ITicketDef, action) => {
        state.tickets = action.payload.data
      })
      .addCase(getListRevisionByTicketType.fulfilled, (state: ITicketDef, action) => {
        const listRawData = action.payload.data
        listRawData.reduce((acc, current) => {
          const currentDate = dayjs(current.approvedAt).valueOf()
          const accDate = acc?.approvedAt ? dayjs(acc.approvedAt).valueOf() : null

          if (!acc || (accDate && currentDate > accDate)) {
            if (acc) {
              acc.status = false
            }
            if (current?.approvedAt) {
              current.status = true
            } else {
              current.status = false
            }
            return current
          }

          current.status = false

          return acc
        }, null)
        state.listRevisionsByTicketType = listRawData
      })
      .addCase(getOneRevisionByKey.fulfilled, (state: ITicketDef, action) => {
        state.revisionSelected = action.payload.data
      })
      .addCase(getRevisionApplied.fulfilled, (state: ITicketDef, action) => {
        state.currentRevision = action.payload.data
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
  setDroppedItem,
  resetRevisionSelected
} = ticketProcessSlice.actions
export { createRevision, fetchListTicket }
export default ticketProcessSlice.reducer
