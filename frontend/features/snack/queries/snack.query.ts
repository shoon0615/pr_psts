// features/Snack/queries/Snack.query.ts

import {
  selectAllSnack,
  selectAllSnack2
} from '@/features/snack/services/snack.service'

/**
 * @param keyword 상품 ID
 * @param regionId 상품명
 * @param statusId 브랜드
 * @param page 상품 가격
 */
// export interface SnackSearchParams {
export type SnackSearchParams = {
  keyword?: string
  regionId?: string
  statusId?: string
  page?: number
}

export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  // list: (params: SnackSearchParams) => [...snackKeys.all, 'list', params] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  detail: (id: number) => [...snackKeys.all, 'detail', id] as const
  // brands: () => ['common', 'brand'] as const
}

export const snackListQueryOptions = (params: SnackSearchParams) => ({
  queryKey: snackKeys.list(params),
  // queryFn: () => snackService.getSnacks(params)
  // queryFn: () => selectAllSnack()
  queryFn: () => selectAllSnack2(params)
})
