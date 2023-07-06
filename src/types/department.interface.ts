export interface IModelState {
  openModal: boolean
  type: string
  data: any
}

export interface IDepartmentModal {
  onClose: () => void
  onOk: () => void
  showModal: boolean
  typeModel: string
  data: any
}

export interface ListDataType {
  name: string
  email?: string
  picture: string
  loading: boolean
  role: string
  id?: number
}

export interface DataMemberRender {
  listDataUp: ListDataType[]
  listDataDown: ListDataType[]
  listDataUpFilter?: ListDataType[]
  listDataDownFilter?: ListDataType[]
}
