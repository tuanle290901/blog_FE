import { LeaveTypes, TicketStatusType } from '~/types/leave-request.interface'

export const LOCAL_STORAGE = {
  AUTH_INFO: 'currentAuth',
  ACCESS_TOKEN: 'accessToken'
}

export const SETTING = {
  REQUEST_PROCESS: {
    REQUEST_ONE: 'requestOne',
    REQUEST_TWO: 'requestTwo',
    REQUEST_THREE: 'requestThree'
  }
}

export const INPUT_TYPE = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATETIME: 'DATE_TIME',
  BOOLEAN: 'BOOLEAN',
  SINGLE_SELECT: 'SINGLE_CHOICE',
  MULTIPLE_SELECT: 'MULTIPLE_CHOICE'
}

export const ROlE_STORAGE = {
  SUB_MANAGER: 'SUB_MANAGER',
  MANAGER: 'MANAGER',
  OFFICER: 'OFFICER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN'
}

export const DEVICE_STATUS = {
  INITIAL: 'INITIAL',
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE'
}

export const LEAVE_TYPE_MAP: LeaveTypes = {
  SICK: 'Nghỉ ốm',
  COMPENSATORY: 'Nghỉ bù',
  ANNUAL: 'Nghỉ phép theo năm',
  UNPAID: 'Nghỉ không lương',
  MATERNITY: 'Nghỉ thai sản',
  PATERNITY: 'Nghỉ thai sản cho người thân',
  WORK_FROM_HOME: 'Làm việc ở nhà',
  WEDDING: 'Nghỉ cưới',
  UNEXPECTED: 'Nghỉ đột xuất',
  COMPASSIONATE: 'Nghỉ phép vì tang gia'
}

export enum TicketStatusEnum {
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

export const TICKET_STATUS: TicketStatusType = {
  SUBMITTED: 'Đã gửi',
  PROCESSING: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
  FINISHED: 'Hoàn thành'
}

export const VALIDATE_FORM = {
  MAX_LENGTH_INPUT: 256,
  MAX_LENGTH_TEXTAREA: 2048,
  MAX_LENGTH_PASSWORD: 20,
  MAX_LENGTH_FULLNAME: 32
}
