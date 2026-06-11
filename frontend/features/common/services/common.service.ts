// import { commonRepository as repository } from '@/features/common/repositories/common.api.repository'
import { commonRepository as repository } from '@/features/common/repositories/common.json.repository'

export const commonService = {
  getBrands: () => repository.getBrands(),
  getCategories: () => repository.getCategories()
}
