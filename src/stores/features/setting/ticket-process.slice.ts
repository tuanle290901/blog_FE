import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { DragItem, DropItem, ITicketDef, TicketDefRevisionCreateReq } from '~/types/setting-ticket-process'

const initialState: ITicketDef = {
  loading: false,
  departments: [],
  ticketCreateRequest: {} as TicketDefRevisionCreateReq,
  approvalSteps: [
    {
      index: 0,
      key: 'request0',
      title: 'Duyệt lần 0',
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
            id: 'department1',
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

const ticketProcessSlice = createSlice({
  name: 'ticketProcess',
  initialState,
  reducers: {
    addDroppedItem: (state, action: PayloadAction<{ targetKey: string; item: DragItem }>) => {
      const { targetKey, item } = action.payload
      const itemIndex = state.approvalSteps.findIndex((item) => item.key === targetKey)
      if (itemIndex !== -1) {
        const targetData = state.approvalSteps[itemIndex].data

        if (targetData.length >= 3) {
          notification.error({ message: 'Lớn hơn 3' })
          return
        }
        if (targetData.map((t) => t.id).includes(item.id)) {
          notification.error({ message: 'Đã tồn tại' })
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state: any, action) => {
        state.departments = action.payload.data
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction => action.type.endsWith('/pending'),
        (state, _) => {
          state.loading = true
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading) {
            state.loading = false
          }
        }
      )
  }
})

export const { addDroppedItem, removeDroppedItem } = ticketProcessSlice.actions
export { fetchDepartments }
export default ticketProcessSlice.reducer
