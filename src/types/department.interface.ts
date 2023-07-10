export interface IModelState {
  openModal: boolean
  type: string
  data: any
  dataParent: any[]
}

export interface IDepartmentModal {
  onClose: () => void
  onOk: () => void
  showModal: boolean
  typeModel: string
  data: any
  dataParent: any[]
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

export interface IDepartment {
  code: string
  address: string
  name: string
  id: string
  publishDate: Date
  contactEmail: string
  contactPhoneNumber: string
  status: string
  type: string
}
