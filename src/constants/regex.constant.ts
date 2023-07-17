export const EMAIL_REG = /\S+@\S+\.\S+/
export const PHONE_NUMBER_REG = /^0\d{9}$/
export const REGEX_PORT =
  /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/

export const REGEX_TRIM = /^[^\s]+(\s+[^\s]+)*$/
export const REGEX_EMAIL = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
export const REGEX_USERNAME = /^[a-zA-Z]*$/
export const REGEX_PHONE_NUMBER = /^(?!(?:\D*0)+\D*$)\(?([0-9]{3})\)?[-. ]?[0-9]{4}[-. ]?[0-9]{3,4}$/
export const REGEX_IP_ADDRESS =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

export const REGEX_NUMBER_AND_SPACE = /^(?=.*\d)[\d ]+$/
