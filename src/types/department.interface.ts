export interface IModelState {
  openModal: boolean
  type: string
  data?: DataType | null
  dataParent?: IDepartmentTitle[] | []
}

export interface DataType {
  code: string
  name?: string | ''
  address?: string
  children?: DataType[]
  contactEmail?: string
  contactPhoneNumber?: string | ''
  parentCode?: string
  parentName?: string
  publishDate?: string
}

export interface IDepartmentModal {
  onClose: () => void
  onOk: () => void
  showModal: boolean
  typeModel: string
  data?: DataType | null
  dataParent?: IDepartmentTitle[] | []
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
  code?: string | ''
  address: string
  name: string
  id?: string | ''
  publishDate: Date
  contactEmail: string
  contactPhoneNumber: string
  parentCode?: string | ''
}

export interface IDepartmentTitle {
  name?: string | ''
  code?: string | ''
}
