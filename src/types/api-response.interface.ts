export interface IApiResponse<DataType> {
  data: DataType
  message: string
  status: number
  meta: IPaging
}
export interface IPaging {
  page: number
  size: number
  total: number
  totalPage: number
}
export interface ISort {
  field: string
  direction: 'DESC' | 'ASC'
}
