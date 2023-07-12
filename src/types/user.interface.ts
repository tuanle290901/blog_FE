export interface IUser {
  id?: string
  address?: string
  avatarBase64: string
  birthday?: string
  email: string
  formalDate?: string
  fullName?: string
  groupProfiles: GroupProfile[]
  historyNo?: number
  joinDate?: string
  note?: string
  notificationMethods?: string[]
  ownWeekWorkingTimeSetup?: OwnWeekWorkingTimeSetup[]
  phoneNumber: string
  status?: string
  userName: string
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
