import { EDIT_TYPE, USER_STATUS } from '~/constants/app.constant.ts'

export interface IUser {
  id?: string
  address?: string
  avatarBase64: string
  birthday?: string | null
  email: string | null
  password: string
  formalDate?: string | null
  fullName?: string
  groupProfiles: GroupProfile[]
  historyNo?: number
  joinDate?: string | null
  note?: string
  notificationMethods?: string[]
  ownWeekWorkingTimeSetup?: OwnWeekWorkingTimeSetup[]
  phoneNumber: string | null
  userName: string
  editType: EDIT_TYPE
  status: USER_STATUS
  createWithRemainLeaveMinutes: number
  workForTime: string
}
export interface GroupProfile {
  title: string
  groupCode: string
  groupName?: string
  role: string
}
export interface OwnWeekWorkingTimeSetup {
  workDays: []
}
export interface IUserTitle {
  id?: string
  createdAt?: string
  createdBy?: any
  updatedAt?: string
  updatedBy?: string
  code: string
  nameTitle: string
  description?: string
}
