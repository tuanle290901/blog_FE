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
  publishDate?: string | null | ''
}

export interface IDepartmentModal {
  onClose: () => void
  onOk: () => void
  showModal: boolean
  typeModel: string
  data?: DataType | null
  dataParent?: IDepartmentTitle[] | []
}

export interface ListDataUserGroup {
  fullName: string
  userName?: string
  avatarBase64?: string | null
  id?: string | ''
  groupProfiles?: GroupProfiles[] | []
}

export interface GroupProfiles {
  title?: string | ''
  groupCode?: string | ''
  groupName?: string | ''
  role?: string | ''
}
export interface DataMemberRender {
  listDataUp: ListDataUserGroup[]
  listDataDown: ListDataUserGroup[]
  listDataUpFilter?: ListDataUserGroup[]
  listDataDownFilter?: ListDataUserGroup[]
}

export interface IDepartment {
  code?: string | ''
  address: string
  name: string
  id?: string | ''
  publishDate: string
  contactEmail: string
  contactPhoneNumber: string
  parentCode?: string | ''
}

export interface IDepartmentTitle {
  name?: string | ''
  code?: string | ''
  parentCode?: string | ''
}

export interface updateUserRole {
  groupCode: string | null | undefined
  updateRoles: updateRoles[] | []
}

export interface updateRoles {
  role: string | null | undefined
  userName: string | null | undefined
}

export interface DataInfoDepartment {
  code: string
  managers: ListDataUserGroup[]
  name: string
  status: string
  subManagers: ListDataUserGroup[]
}
