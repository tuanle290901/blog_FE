export interface FilterType {
  criteria: FilterCondition[]
  page: number
  size: number
  sort: SortCondition[]
}

interface FilterCondition {
  children: any[]
  field: string
  operator: string
  type: string
  value: any
  values: any[]
  max?: any
  min?: any
}

interface SortCondition {
  direction: 'ASC' | 'DESC'
  field: string
}
