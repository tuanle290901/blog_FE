export interface SearchPayloadInterface {
  criteria?: Criteria[]
  page: number
  size: number
  sort?: Sort[]
}

export interface Criteria {
  children: Criteria[]
  field: string
  max: number
  min: number
  operator: string
  type: string
  value: string
  values: string[]
}

export interface Sort {
  direction: string
  field: string
}
