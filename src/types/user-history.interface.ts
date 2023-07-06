import React from 'react'

export interface IUserHistory {
  id: React.Key
  updatedAt: string
  updatedBy: string
  message: string
  details: IUserHistoryDetail[]
}

export interface IUserHistoryDetail {
  key: React.Key
  fieldName: string
  oldValue: string
  newValue: string
}
