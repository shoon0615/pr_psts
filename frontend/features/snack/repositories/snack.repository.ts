import { api } from '@/shared/lib/axios'

const apiUrl = '/snacks'

export const jsonRepository = {
  /** TODO: */
  /* findMany:findMany(query = ''): Promise<Type> => api.get(`${apiUrl}?${query}`).then(res => res.data),
  await selectNotices('_expand=brand&_expand=category') */

  // findMany: () => api.get(`${apiUrl}`).then(res => res.data),

  findMany: () =>
    api.get(`${apiUrl}`).then(res => {
      console.log('data', res)
      return res.data
    }),

  findUnique: (id: number) => api.get(`${apiUrl}`).then(res => res.data),

  create: () => api.get(`${apiUrl}`).then(res => res.data),

  update: (id: number) => api.get(`${apiUrl}`).then(res => res.data),

  delete: (id: number) => api.get(`${apiUrl}`).then(res => res.data)
}

/* export const snackRepository = {
  findMany: () => prisma.snack.findMany(),

  findUnique: (id: number) => prisma.snack.findUnique(id),

  create: data => prisma.snack.create({ data }),

  update: (data, id: number) => prisma.snack.update(),

  delete: (id: number) => prisma.snack.delete(id),
} */
