// import { parseAsInteger, parseAsString, inferParserType } from 'nuqs'
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  inferParserType
} from 'nuqs/server'

export const snackSearchParamsSchema = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  contents: parseAsString.withDefault('')
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
 */
// hook 에서 직접 추출도 가능하지만 객체 기준으로 타입을 뽑는 방식이 더 효율적
// export type SnackSearchParams = ReturnType<typeof useSnackSearchParams>['searchParams']
export type SnackSearchParams = inferParserType<typeof snackSearchParamsSchema>

export const snackSearchParamsCache = createSearchParamsCache(
  snackSearchParamsSchema
)

/**
 * @param id 상품 ID
 * @param title 상품명
 * @param brand 브랜드
 * @param price 상품 가격
 * @param contents 상품 설명
 * @param img 상품 이미지(대표)
 */
export interface Snack {
  // id: number
  id: string
  title: string
  brand: string
  price: number
  contents?: string
  img: string
}
