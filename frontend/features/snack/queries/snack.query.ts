// features/Snack/queries/Snack.query.ts

import { api } from '@/shared/lib/axios/core'
import { SnackSearchParams } from '@/features/snack/types/snack.type'

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
  // queryFn: () => api.get('/snack')
  queryFn: () => api.get('/snack', { params }).then(res => res.data)
})
