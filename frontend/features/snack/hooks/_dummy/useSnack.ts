'use client'

// route 이용 방법(HTTP 요청)
import { api } from '@/shared/lib/axios/axios'

// server actions 이용 방법
import { createSnack } from '@/features/snack/actions/snack.action'

// service 이용 방법
import {
  selectAllSnack,
  insertSnack
} from '@/features/snack/services/snack.service'

import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
  inferParserType,
  debounce
} from 'nuqs'

import {
  // SnackSearchParams,
  snackListQueryOptions
} from '@/features/snack/queries/snack.query'

import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'

/* export function useSnackList(params: SnackSearchParams) {
  return useQuery(snackListQueryOptions(params))
} */

export function useSnackList2() {
  const { searchParams } = useSnackSearchParams()
  // return useQuery(snackListQueryOptions(searchParams))
  return useSuspenseQuery(snackListQueryOptions(searchParams))
}

export function useSnacks() {
  return useSuspenseQuery({
    queryKey: ['snack'],
    // queryFn: api.get<Snack[]>(`${apiUrl}`).then(res => res.data)
    queryFn: selectAllSnack
  })
}

function useCreateSnack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSnack,
    onSuccess: () => {
      // queryClient.invalidateQueries(['snack'])   // 자동 refetch
    }
    /* onMutate: async newSnack => {
      // 낙관적 업데이트
      await queryClient.cancelQueries(['snack'])

      const prev = queryClient.getQueryData(['snack'])

      queryClient.setQueryData(['snack'], old => [...old, newSnack])

      return { prev }
    } */
  })

  // <button onClick={() => mutation.mutate({ title: 'hi' })}>등록</button>
}

/* export function useCreateSnack2() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn: snackService.create,
    mutationFn: insertSnack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snackKeys.lists()
      })
    }
  })
} */

/**
 * @param keyword 상품 ID
 * @param brand 브랜드
 * @param category 카테고리
 * @param page 페이지 번호
 */
// export interface SnackSearchParamsInterface {
export type SnackSearchParamsInterface = {
  keyword?: string
  brand?: string
  category?: string
  page?: number
}

export const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault('')
}

export function useSnackSearchParams() {
  // const [searchParams, setSearchParams] = useQueryStates(snackSearchParams)
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams, {
    shallow: false
  })

  return {
    searchParams,
    setSearchParams
  }
}

// hook 에서 직접 추출도 가능하지만 객체 기준으로 타입을 뽑는 방식이 더 효율적
// export type SnackSearchParamsType = ReturnType<typeof useSnackSearchParams>['searchParams']
export type SnackSearchParamsType = inferParserType<typeof snackSearchParams>

export function useSnackSearchOptions() {
  const brandsQuery = useQuery(brandQueryOptions())
  const categoriesQuery = useQuery(categoryQueryOptions())

  return {
    brands: brandsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    isLoading: brandsQuery.isLoading || categoriesQuery.isLoading,
    isError: brandsQuery.isError || categoriesQuery.isError
  }
}

export function useSnackSearchOptions2() {
  const brandsQuery = useSuspenseQuery(brandQueryOptions())
  const categoriesQuery = useSuspenseQuery(categoryQueryOptions())

  return {
    /* brands: brandsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    isLoading: brandsQuery.isLoading || categoriesQuery.isLoading,
    isError: brandsQuery.isError || categoriesQuery.isError */
    brands: brandsQuery.data,
    categories: categoriesQuery.data
  }
}
