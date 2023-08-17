import { Ticket } from '~/types/setting-ticket-process'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ROLE } from '~/constants/app.constant.ts'
import { IDepartmentTitle } from '~/types/department.interface'
import { GroupProfile } from '~/types/user.interface.ts'
import { TicketStatusEnum } from './Constant'
dayjs.extend(utc)

export const ACTION_TYPE = {
  Created: 'created',
  Updated: 'updated',
  View: 'view'
}

export const convertUTCToLocaleDate = (dateStr: string) => {
  if (!dateStr) return ''
  // const now = new Date()
  // const localOffset = now.getTimezoneOffset()
  // const utcOffset = localOffset / 60
  // const formatDate = dayjs(dateStr).utcOffset(-utcOffset, true).format()
  const formatDate = dayjs(dateStr).format('DD/MM/YYYY')
  return formatDate.toString()
}

export const convertUTCToLocaleTime = (timeStr: string) => {
  if (!timeStr) return null
  const formatDate = dayjs(`${dayjs().format('YYYY-MM-DD')}T${timeStr}+07:00`).format('HH:mm:ss')
  return formatDate.toString()
}

export const hasPermission = (allowedRoles: ROLE[], groupProfiles?: GroupProfile[]) => {
  let isHasPermission = false
  if (allowedRoles.length === 0) {
    isHasPermission = true
  }
  for (const role of allowedRoles) {
    const foundRole = groupProfiles?.find((group) => group.role === role)
    if (foundRole) {
      isHasPermission = true
      break
    }
  }
  return isHasPermission
}

export const hasPermissionAndGroup = (
  allowedRoles: ROLE[],
  groupProfiles?: GroupProfile[],
  groupParrent?: IDepartmentTitle[]
) => {
  let isHasPermission = false
  if (allowedRoles.length === 0) {
    isHasPermission = false
  }

  if ((groupParrent && groupParrent.length === 0) || (groupParrent && groupParrent[0].code === undefined)) {
    isHasPermission = false
  } else {
    for (const role of allowedRoles) {
      const foundRole = groupProfiles?.find((group) => group.role === role)
      if (foundRole) {
        if (foundRole.role === ROLE.SYSTEM_ADMIN) {
          isHasPermission = true
          break
        } else if (
          groupParrent &&
          groupParrent.find(
            (data) =>
              data.code === foundRole.groupCode || (data.code === foundRole.groupCode && data.parentCode === null)
          )
        ) {
          isHasPermission = true
          break
        } else {
          isHasPermission = false
          break
        }
      }
    }
  }

  return isHasPermission
}

export const convertBlobToString = async (bobData: Blob) => {
  const responseStr = (await new Response(bobData).text()) as string
  if (responseStr) {
    return JSON.parse(responseStr)
  }
  return null
}

export const convertMonthToLocaleVi = (month: string) => {
  switch (month.toLowerCase()) {
    case 'jan':
      return 'Tháng 01'
    case 'feb':
      return 'Tháng 02'
    case 'mar':
      return 'Tháng 03'
    case 'apr':
      return 'Tháng 04'
    case 'may':
      return 'Tháng 05'
    case 'jun':
      return 'Tháng 06'
    case 'jul':
      return 'Tháng 07'
    case 'aug':
      return 'Tháng 08'
    case 'sep':
      return 'Tháng 09'
    case 'oct':
      return 'Tháng 10'
    case 'nov':
      return 'Tháng 11'
    case 'dec':
      return 'Tháng 12'
  }
}

export const tagColorMapping = (status?: string | number) => {
  switch (status) {
    case TicketStatusEnum.SUBMITTED:
      return 'processing'
    case TicketStatusEnum.FINISHED:
      return '#16a34a'
    case TicketStatusEnum.PROCESSING:
      return '#108ee9'
    case TicketStatusEnum.CONFIRMED:
      return '#16a34a'
    case TicketStatusEnum.REJECTED:
      return 'red'
    case TicketStatusEnum.CANCELLED:
      return 'warning'
    default:
      return 'default'
  }
}

export const roundHoursToDays = (hours: number) => {
  const days = Math.round(hours / 24)
  return days
}
