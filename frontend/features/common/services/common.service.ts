import { commonRepository as repository } from '@/features/common/repositories/common.repository'
import { Common } from '@/features/common/types/common.type'

const convertLabel = async (list: Common[]) =>
  list.map(data => ({
    label: data?.label ?? data.name,
    value: data?.value ?? data.id
  }))

export const commonService = {
  getBrands: () => repository.getBrands().then(convertLabel),
  getCategories: () => repository.getCategories().then(convertLabel)
}
