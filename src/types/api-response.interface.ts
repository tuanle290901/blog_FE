export interface IApiResponse<DataType> {
  data: DataType
  message: string
  status: number
  meta: Meta
}
export interface Meta {
  page: number
  size: number
  total: number
  totalPage: number
}
