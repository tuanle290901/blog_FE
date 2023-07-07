import { SETTING } from '~/utils/Constant'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import { FulfilledAction, PendingAction, RejectedAction } from '~/stores/async-thunk.type.ts'
import { ErrorResponse } from '~/types/error-response.interface'
import { DropItem } from '~/types/setting-request-process'

export interface IRequestProcess {
  loading: boolean
  departments: DropItem[]
  droppedItems: any
}

const initialState: IRequestProcess = {
  loading: false,
  departments: [],
  droppedItems: {
    requestOne: [],
    requestTwo: [],
    requestThree: []
  }
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

const requestProcessSlice = createSlice({
  name: 'requestProcess',
  initialState,
  reducers: {
    addDroppedItem: (state, action: PayloadAction<{ targetKey: string; item: DropItem }>) => {
      const { targetKey, item } = action.payload
      const droppedItems = state.droppedItems

      if (
        (targetKey === SETTING.REQUEST_PROCESS.REQUEST_THREE &&
          droppedItems[SETTING.REQUEST_PROCESS.REQUEST_TWO].length === 0) ||
        (targetKey === SETTING.REQUEST_PROCESS.REQUEST_TWO &&
          droppedItems[SETTING.REQUEST_PROCESS.REQUEST_ONE].length === 0)
      ) {
        notification.error({ message: 'Vui lòng cập nhật các bước duyệt trước' })
        return
      }

      if (droppedItems[targetKey].map((item: DropItem) => item.id).includes(item.id)) {
        notification.error({ message: `${item.name} đã tồn tại` })
        return
      }
      if (droppedItems[targetKey].length >= 3) {
        notification.error({ message: `Tối đa 3 đơn vị cho một bước duyệt` })
        return
      }
      state.droppedItems[targetKey].push(item)
    },
    removeDroppedItem: (state, action) => {
      const { targetKey, id } = action.payload
      state.droppedItems[targetKey] = state.droppedItems[targetKey].filter((item: DropItem) => item.id !== id)
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

            const { status, message } = action.payload as ErrorResponse
            if (status === 401) {
              notification.error({ message: message })
            }
          }
        }
      )
  }
})

export const { addDroppedItem, removeDroppedItem } = requestProcessSlice.actions
export { fetchDepartments }
export default requestProcessSlice.reducer
