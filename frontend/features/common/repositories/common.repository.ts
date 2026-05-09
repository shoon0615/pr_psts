import { api } from '@/shared/lib/axios'
import { Common } from '@/features/common/types/common.type'

const apiUrl = '/common'

const getCommon = (query: string, id?: number) =>
  api
    .get<Common[]>(id ? `${apiUrl}/${query}?id=${id}` : `${apiUrl}/${query}`)
    .then(res => res.data)

export const commonRepository = {
  // getCommon,
  // getBrands: () => getCommon('brand'),
  // getCategories: () => getCommon('category')
  getBrands: () =>
    api.get<Common[]>('/brands').then(res => {
      console.log('getBrands', res.data)
      return res.data
    }),
  getCategories: () => api.get<Common[]>('/categories').then(res => res.data)
}
