'use client'

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useIsFetching
} from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { snackSearchParamsSchema } from '@/features/snack/types/snack.type'
import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'
import {
  snackKeys,
  snackListQueryOptions,
  snackDetailQueryOptions
} from '@/features/snack/queries/snack.query'
import {
  createSnack,
  modifySnack,
  removeSnack
} from '@/features/snack/actions/snack.action'
import { CreateSnackInput } from '@/features/snack/schema/snack.schema'

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

/** 조회(목록) */
export function useSnackList() {
  const { searchParams } = useSnackSearchParams()
  return useSuspenseQuery(snackListQueryOptions(searchParams))
}

export function useSnackListLoading() {
  const { searchParams } = useSnackSearchParams()
  return (
    useIsFetching({
      queryKey: snackListQueryOptions(searchParams).queryKey
    }) > 0
  )
}

/** 조회(상세) */
export function useSnackDetail(id: string) {
  return useSuspenseQuery(snackDetailQueryOptions(id))
}

export function useSnackDetail2(id: string) {
  return {
    data: useSuspenseQuery(snackDetailQueryOptions(id)).data,
    ...useSnackSearchOptions()
  }
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

/** 수정 */
export function useModifySnack(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateSnackInput) => modifySnack(id, params),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: snackKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: snackKeys.detail(id)
        })
      ])
    }
  })
}

/**
 * TODO:
 * - Hook이 특정 id에 묶이지 않음
 * - 여러 row 수정에도 재사용 가능
 * - bulk action에도 사용 가능
 * - React Query 공식 예제 스타일과 유사
 * @returns
 */
export function useModifySnack2() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: CreateSnackInput }) =>
      modifySnack(id, params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: snackKeys.detail(variables.id)
      })
    }
  })
}

/** 삭제 */
export function useRemoveSnack(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeSnack,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
    }
  })
}
