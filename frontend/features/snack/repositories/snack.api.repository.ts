// import 'server-only'

import { jsonApi as api } from '@/shared/lib/axios/core'
import { Snack } from '@/features/snack/types/snack.type'
import { SnackSearchParams } from '@/features/snack/types/snack.type'
import { toQueryString } from '@/shared/lib/utils'
import { CreateSnackInput } from '@/features/snack/schema/snack.schema'

const apiUrl = '/snacks'

export const snackRepository = {
  findAll: () => api.get<Snack[]>(`${apiUrl}`).then(res => res.data),

  findMany: (params: SnackSearchParams) =>
    api.get<Snack[]>(`${apiUrl}${toQueryString(params)}`).then(res => res.data),

  findUnique: (id: string) => api.get(`${apiUrl}/${id}`).then(res => res.data),

  create: (params: CreateSnackInput) =>
    api.post(`${apiUrl}`, params).then(res => res.data),

  update: (id: string) => api.put(`${apiUrl}/${id}`).then(res => res.data),

  delete: (id: string) => api.delete(`${apiUrl}/${id}`).then(res => res.data)
}

/* if (!response.ok) {
  throw new Error('Failed to create snack')
}
return response.json() */
