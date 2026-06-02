// features/Snack/queries/Snack.query.ts

import { api } from '@/shared/lib/axios/core'
import { SnackSearchParams } from '@/features/snack/types/snack.type'
import { CreateSnackInput } from '@/features/snack/schema/snack.schema'

export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  // list: (params: SnackSearchParams) => [...snackKeys.all, 'list', params] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  detail: (id: string) => [...snackKeys.all, 'detail', id] as const
  // brands: () => ['common', 'brand'] as const
}

export const snackListQueryOptions = (params: SnackSearchParams) => ({
  queryKey: snackKeys.list(params),
  // queryFn: () => api.get('/snack')
  queryFn: () => api.get('/snack', { params }).then(res => res.data),
  placeholderData: previousData => previousData
})

export const snackDetailQueryOptions = (id: string) => ({
  queryKey: snackKeys.detail(id),
  // queryFn: () => api.get<CreateSnackInput>(`/snack/${id}`).then(res => res.data)
  queryFn: () => api.get(`/snack/${id}`).then(res => res.data)
})
