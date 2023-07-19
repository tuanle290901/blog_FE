import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
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
  if (!dateStr) return null
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
