// import 'server-only'

import { api } from '@/shared/lib/axios'
import { Snack } from '@/features/snack/types/snack.type'
import { SnackSearchParams } from '@/features/snack/queries/snack.query'
import { toQueryString } from '@/shared/lib/utils'

const apiUrl = '/snacks'

export const snackRepository = {
  findMany: () => api.get<Snack[]>(`${apiUrl}`).then(res => res.data),

  findMany2: (params: SnackSearchParams) =>
    api.get<Snack[]>(`${apiUrl}${toQueryString(params)}`).then(res => res.data),
  findUnique: (id: number) => api.get(`${apiUrl}/${id}`).then(res => res.data),

  create: () => api.post(`${apiUrl}`).then(res => res.data),

  update: (id: number) => api.put(`${apiUrl}/${id}`).then(res => res.data),

  delete: (id: number) => api.delete(`${apiUrl}/${id}`).then(res => res.data)
}

/* if (!response.ok) {
  throw new Error('Failed to create snack')
}
return response.json() */
