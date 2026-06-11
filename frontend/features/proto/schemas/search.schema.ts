import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server'

export const SORT_OPTIONS = [
  // { value: 'latest', label: '최신순' },
  { value: 'title', label: '이름순', order: 'asc' },
  { value: 'price', label: '가격순', order: 'desc' }
] as const

const DEFAULT_SORT_OPTION = SORT_OPTIONS[0]

/**
 * @param page 페이지
 * @param brand 브랜드
 * @param category 카테고리
 * @param sort 정렬
 * @param order 순서
 */
export const protoSearchSchema = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  sort: parseAsStringEnum(SORT_OPTIONS.map(option => option.value)).withDefault(
    DEFAULT_SORT_OPTION.value
  ),
  order: parseAsStringEnum(['asc', 'desc']).withDefault(
    DEFAULT_SORT_OPTION.order
  )
}
