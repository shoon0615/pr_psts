import { api } from '@/shared/lib/axios/core'
import { ProtoSearchParams } from '@/features/proto/types/proto.type'

// import { SnackSearchParams, SnackListResponse, SnackDetailResponse } from '@/features/snack/types/snack.type'
// import { CreateSnackInput } from '@/features/snack/schema/snack.schema'

const apiUrl = 'proto'

export const protoKeys = {
  all: [`${apiUrl}`] as const,
  lists: () => [...protoKeys.all, 'list'] as const,
  list: (params: ProtoSearchParams) => [...protoKeys.lists(), params] as const,
  detail: (id: string) => [...protoKeys.all, 'detail', id] as const
}

export const protoListQueryOptions = (params: ProtoSearchParams) => ({
  queryKey: protoKeys.list(params),
  queryFn: () => api.get(`/${apiUrl}`, { params }).then(res => res.data),
  placeholderData: previousData => previousData
})

export const protoDetailQueryOptions = (id: string) => ({
  queryKey: protoKeys.detail(id),
  queryFn: () => api.get(`/${apiUrl}/${id}`).then(res => res.data)
})
