'use client'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'

// service 에서 convert 하여 반환 처리
/* export function useBrands() {
  return useQuery({
    ...brandQueryOptions(),
    select: data =>
      data.map(item => ({
        label: item.name,
        value: item.id
      }))
  })
} */

export function useBrands() {
  return useQuery(brandQueryOptions())
}

export function useCategories() {
  return useQuery(categoryQueryOptions())
}
