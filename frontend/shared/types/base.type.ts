export interface Base extends BaseId, BaseDetail {}

export interface BaseId {
  id: string
}

export interface BaseDetail {
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string
  deletedAt: string
}

export type ApiResponse<T> = {
  data: T
  message: string
}
