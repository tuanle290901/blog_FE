import { Input } from 'antd'
import React, { ClipboardEvent, KeyboardEvent, ReactNode } from 'react'
import { VALIDATE_FORM } from '~/utils/Constant'

interface ICommonInput {
  id?: string
  classNameProps?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  defaultValue?: string
  allowClear?: boolean
  maxLength?: number
  prefix?: ReactNode
  suffix?: ReactNode
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void
  onChange?: (e: React.FocusEvent<HTMLInputElement, Element>) => void
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void
  typeProps?: object
  styleProps?: object
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void
  autoComplete?: string
}

const CommonInput: React.FC<ICommonInput> = (props) => {
  const {
    id,
    classNameProps,
    placeholder,
    value,
    disabled,
    defaultValue,
    allowClear,
    maxLength,
    prefix,
    suffix,
    onPaste,
    onChange,
    onPressEnter,
    typeProps,
    styleProps,
    onBlur,
    autoComplete
  } = props

  const handleBlur =
    typeof onBlur === 'function'
      ? (e: React.FocusEvent<HTMLInputElement, Element> | ClipboardEvent<HTMLInputElement>) =>
          onBlur(e as React.FocusEvent<HTMLInputElement, Element>)
      : undefined
  const handlePressEnter: ((e: KeyboardEvent<HTMLInputElement>) => void) | undefined =
    typeof onPressEnter === 'function' ? (e: KeyboardEvent<HTMLInputElement>) => onPressEnter(e) : undefined
  const handlePaste = typeof onPaste === 'function' ? (e: ClipboardEvent<HTMLInputElement>) => onPaste(e) : undefined

  const handleChange =
    typeof onChange === 'function' ? (e: React.FocusEvent<HTMLInputElement, Element>) => onChange(e) : undefined
  return (
    <Input
      {...typeProps}
      style={styleProps}
      id={id}
      className={classNameProps}
      placeholder={placeholder}
      value={value}
      autoComplete={autoComplete}
      disabled={disabled}
      defaultValue={defaultValue}
      allowClear={allowClear}
      onPaste={handlePaste}
      onChange={handleChange}
      onPressEnter={handlePressEnter}
      prefix={prefix}
      suffix={suffix}
      onBlur={handleBlur}
      maxLength={maxLength || VALIDATE_FORM.MAX_LENGTH_INPUT}
    />
  )
}

export default CommonInput
