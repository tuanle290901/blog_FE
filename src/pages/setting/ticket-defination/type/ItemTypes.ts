import { FormInstance } from 'antd'

export const ItemTypes = {
  BOX: 'box',
  ITEM: 'item',
  NO_DROP: 'no-drop'
}

export interface TicketInitial {
  name: string
  description?: string
  isFinished: boolean
}

export interface FormValues {
  [fieldName: string]: any
}

export interface ModalInitAttrProp {
  isModalInitAttrOpen: { key: string; status: boolean }
  initAttrForm: FormInstance
  handleCancelModalInitAttr: () => void
  onFinishInitAttr: (formValues: FormValues) => void
  onFinishInitAttrFail: (formValues: FormValues) => void
  onChangeType: (value: string, index: number) => void
}

export interface FormInitProp {
  form: FormInstance
  onContinue: (formValue: TicketInitial) => void
}
