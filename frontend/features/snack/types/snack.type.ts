import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  inferParserType
} from 'nuqs/server'
import { ApiResponse, PageResponse } from '@/shared/types/base.type'
import { CreateSnackInput } from '@/features/snack/schema/snack.schema'

/* const SORT_OPTIONS = ['title', 'price'] as const
sort: parseAsStringEnum([...SORT_OPTIONS]).withDefault('title'), */
export const SORT_OPTIONS = [
  { value: 'title', label: '이름순', order: 'asc' },
  { value: 'price', label: '가격순', order: 'desc' }
  /* { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'views', label: '조회수순' },
  { value: 'likes', label: '추천순' } */
] as const

// export type SortType = (typeof SORT_OPTIONS)[number]
export type SortType = (typeof SORT_OPTIONS)[number]['value']

export const snackSearchParamsSchema = {
  page: parseAsInteger.withDefault(1),
  // brand: parseAsString.withDefault(defaultValues.brand),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  contents: parseAsString.withDefault(''),
  sort: parseAsStringEnum(SORT_OPTIONS.map(option => option.value)).withDefault(
    'title'
  ),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc')
}

/* export const snackSearchParams = {
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(20),
  keyword: parseAsString.withDefault(''),
  sort: parseAsStringEnum(['createdAt', 'name', 'price']).withDefault('createdAt'),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc'),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  regions: parseAsArrayOf(parseAsString).withDefault([])
} */

/* type SnackSearchParams = CreateSnackInput & {
  page?: number
  size?: number
  sort?: string
} */

/**
 * @param page 페이지 번호
 * @param brand 브랜드
 * @param category 카테고리
 * @param price 가격
 * @param sort 정렬
 * @param order 순서
 */
// hook 에서 직접 추출도 가능하지만 객체 기준으로 타입을 뽑는 방식이 더 효율적
// export type SnackSearchParams = ReturnType<typeof useSnackSearchParams>['searchParams']
export type SnackSearchParams = inferParserType<typeof snackSearchParamsSchema>

export type SnackSearchParams2 = Omit<SnackSearchParams, 'sort' | 'order'> &
  Partial<Pick<SnackSearchParams, 'sort' | 'order'>>

export const snackSearchParamsCache = createSearchParamsCache(
  snackSearchParamsSchema
)

/**
 * @param id 상품 ID
 * @param title 상품명
 * @param brand 브랜드
 * @param category 카테고리
 * @param price 상품 가격
 * @param contents 상품 설명
 * @param img 상품 이미지(대표)
 */
export interface Snack {
  // id: number
  id: string
  title: string
  brand: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
  price: number
  contents?: string
  img: string
}

export type SnackListResponse = PageResponse<Snack>
export type SnackDetailResponse = ApiResponse<Snack>
