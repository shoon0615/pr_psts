import { api } from '@/shared/lib/axios/core'
import { Common } from '@/features/common/types/common.type'

const apiUrl = '/common'

const getCommon = (query: string, id?: number) =>
  api
    .get<Common[]>(id ? `${apiUrl}/${query}?id=${id}` : `${apiUrl}/${query}`)
    .then(res => res.data)

export const protoRepository = {
  getCommon,
  getBrands: () => getCommon('brand'),
  getCategories: () => getCommon('category')
}
