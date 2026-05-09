import { commonService } from '@/features/common/services/common.service'
import { queryOptions } from '@tanstack/react-query'

export const commonKeys = {
  all: ['common'] as const,
  brands: () => [...commonKeys.all, 'brand'] as const,
  categories: () => [...commonKeys.all, 'category'] as const
}

export const brandQueryOptions = () =>
  queryOptions({
    queryKey: commonKeys.brands(),
    queryFn: () => commonService.getBrands(),
    staleTime: 1000 * 60 * 30
  })

export const categoryQueryOptions = () =>
  queryOptions({
    queryKey: commonKeys.categories(),
    queryFn: () => commonService.getCategories(),
    staleTime: 1000 * 60 * 30
  })
