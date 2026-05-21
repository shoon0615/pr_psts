'use client'

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { snackSearchParamsSchema } from '@/features/snack/types/snack.type'
import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'
import {
  snackKeys,
  snackListQueryOptions
} from '@/features/snack/queries/snack.query'
import { createSnack } from '@/features/snack/actions/snack.action'

/** 검색 */
export function useSnackSearchParams() {
  const [searchParams, setSearchParams] = useQueryStates(
    snackSearchParamsSchema
  )

  return {
    searchParams,
    setSearchParams
  }
}

export function useSnackSearchOptions() {
  const brandsQuery = useSuspenseQuery(brandQueryOptions())
  const categoriesQuery = useSuspenseQuery(categoryQueryOptions())

  return {
    brands: brandsQuery.data,
    categories: categoriesQuery.data
  }
}

/** 조회 */
export function useSnackList() {
  const { searchParams } = useSnackSearchParams()
  return useSuspenseQuery(snackListQueryOptions(searchParams))
}

/** 생성 */
export function useCreateSnack() {
  const queryClient = useQueryClient()
  return useMutation({
    // networkMode: 'always',   // queryConfig 에서 전역 적용으로 변경
    mutationFn: createSnack,
    /* onMutate: async newSnack => {
      // 낙관적 업데이트
      await queryClient.cancelQueries(['snack'])

      const prev = queryClient.getQueryData(['snack'])

      queryClient.setQueryData(['snack'], old => [...old, newSnack])

      return { prev }
    } */
    onSuccess: async () => {
      /**
       * 이 key 로 시작하는 목록들은 전부 무효화 + 자동 refetch
       * @example ['snack', 'list']
       * @example ['snack', 'list', { page: 1, brand: '', category: '' }]
       * @example ['snack', 'list', { page: 2, brand: '001', category: '' }]
       */
      await queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
    }
    /* onError: (error, newUser, context) => {
      console.log('onError', error, newUser, context)
    } */
    /* onSettled: (data, error, newUser, context) => {
      console.log('onSettled', data, error, newUser, context)
    } */
  })
}
