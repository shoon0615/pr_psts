import { ReadonlyURLSearchParams } from 'next/navigation'
import qs from 'qs'

/** @deprecated 검색용 유틸 → `nuqs` 라이브러리로 대체  */
/* export const searchUtils = {
  isEmpty: (searchParams: ReadonlyURLSearchParams, key: string) =>
    searchParams.get(key) ?? ''
} */
export const getSearchParam = (
  searchParams: ReadonlyURLSearchParams,
  key: string
) => searchParams.get(key) ?? ''

/** @deprecated type 만 가능(interface 불가) */
type QueryValue = string | number | boolean | null | undefined

// type QueryParams = Record<string, QueryValue>
type QueryParams = Record<string, unknown>

const removeEmptyQueryParams = <T extends QueryParams>(params: T) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}

export const toQueryString = <T extends QueryParams>(params: T) => {
  return qs.stringify(removeEmptyQueryParams(params), {
    // skipNulls: true,   // null, undefined 만 제거하고 '' 는 제거되지 않음
    addQueryPrefix: true
  })
}
