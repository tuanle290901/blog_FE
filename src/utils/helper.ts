export const ACTION_TYPE = {
  Created: 'created',
  Updated: 'updated',
  View: 'view'
}

export const REGEX_TRIM = /^[^\s]+(\s+[^\s]+)*$/
export const REGEX_EMAIL = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
export const REGEX_USERNAME = /^[a-zA-Z]*$/
export const REGEX_PHONE_NUMBER = /^(?!(?:\D*0)+\D*$)\(?([0-9]{3})\)?[-. ]?[0-9]{4}[-. ]?[0-9]{3,4}$/
export const REGEX_IP_ADDRESS =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

export const VALIDATE_FORM = {
  MAX_LENGTH_INPUT: 256,
  MAX_LENGTH_TEXTAREA: 2048,
  MAX_LENGTH_PASSWORD: 20
}
