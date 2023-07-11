import { FormInstance } from 'antd'

export const ItemTypes = {
  BOX: 'box',
  NO_DROP: 'no-drop'
}

export interface FormValues {
  [fieldName: string]: any
}

export interface ModalInitAttrProp {
  isModalInitAttrOpen: boolean
  initAttrForm: FormInstance
  handleCancelModalInitAttr: () => void
  onFinishInitAttr: (formValues: FormValues) => void
  onFinishInitAttrFail: (formValues: FormValues) => void
  onChangeType: (value: string, index: number) => void
}
