import { jsonApi as api } from '@/shared/lib/axios/core'
import { CommonJson as Common } from '@/features/common/types/common.type'

const convertLabel = async (list: Common[]) =>
  list.map(data => ({
    label: data?.label ?? data.name,
    value: data?.value ?? data.id
  })) // as Common[]

export const commonRepository = {
  // getBrands: (): Promise<Common[]> =>
  getBrands: () =>
    api
      .get('/brands')
      .then(res => res.data)
      .then(convertLabel),
  getCategories: () =>
    api.get<Common[]>('/categories').then(res => convertLabel(res.data))
}
