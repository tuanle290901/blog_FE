import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ROLE } from '~/constants/app.constant.ts'
import { IGroup } from '~/stores/features/master-data/master-data.slice.ts'
import { IDepartmentTitle } from '~/types/department.interface'
import { GroupProfile } from '~/types/user.interface.ts'
dayjs.extend(utc)

export const ACTION_TYPE = {
  Created: 'created',
  Updated: 'updated',
  View: 'view'
}

export const VALIDATE_FORM = {
  MAX_LENGTH_INPUT: 256,
  MAX_LENGTH_TEXTAREA: 2048,
  MAX_LENGTH_PASSWORD: 20
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
