import { api } from '@/shared/lib/axios'
import { Snack } from '@/features/snack/types/snack.type'

const apiUrl = '/snacks'

export const jsonRepository = {
  findMany: () => api.get<Snack[]>(`${apiUrl}`).then(res => res.data),

  findUnique: (id: number) => api.get(`${apiUrl}/${id}`).then(res => res.data),

  create: () => api.post(`${apiUrl}`).then(res => res.data),

  update: (id: number) => api.put(`${apiUrl}/${id}`).then(res => res.data),

  delete: (id: number) => api.delete(`${apiUrl}/${id}`).then(res => res.data)
}

/* export const snackRepository = {
  findMany: () => prisma.snack.findMany(),

  findUnique: (id: number) => prisma.snack.findUnique(id),

  create: data => prisma.snack.create({ data }),

  update: (data, id: number) => prisma.snack.update(),

  delete: (id: number) => prisma.snack.delete(id),
} */
