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
  DEACTIVE: 'DEACTIVE',
  NOT_GOOD: 'NOT_GOOD'
}

export const LEAVE_TYPE_MAP: LeaveTypes = {
  SICK: 'Nghỉ ốm (Có bảo hiểm)',
  COMPENSATORY: 'Nghỉ bù',
  ANNUAL: 'Nghỉ phép theo năm',
  UNPAID: 'Nghỉ không lương',
  MATERNITY: 'Nghỉ thai sản (Có bảo hiểm)',
  PATERNITY: 'Nghỉ thai sản cho người thân (Có bảo hiểm)',
  WORK_FROM_HOME: 'Làm việc ở nhà',
  WEDDING: 'Nghỉ cưới (Có bảo hiểm)',
  UNEXPECTED: 'Nghỉ đột xuất',
  COMPASSIONATE: 'Nghỉ hiếu',
  OTHER: 'Lý do khác'
}

export enum TicketStatusEnum {
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING'
}

export const TICKET_STATUS: TicketStatusType = {
  SUBMITTED: 'Đã gửi',
  PROCESSING: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
  FINISHED: 'Hoàn thành',
  PENDING: 'Đợi xử lý'
}

export const TICKET_STATUS_FILTER = {
  SUBMITTED: 'Đã gửi',
  PROCESSING: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy'
}

export const VALIDATE_FORM = {
  MAX_LENGTH_INPUT: 256,
  MAX_LENGTH_TEXTAREA: 2048,
  MAX_LENGTH_PASSWORD: 20,
  MAX_LENGTH_FULLNAME: 32
}
