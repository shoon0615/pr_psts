import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'qs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** timeout 유틸 */
export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

/** Object({}) 형태의 param 을 queryString 으로 전환 */
export const toQueryString = <T extends object>(params: T) => {
  return qs.stringify(removeEmptyQueryParams(params), {
    // skipNulls: true,   // null, undefined 만 제거하고 '' 는 제거되지 않음
    addQueryPrefix: true
  })
}

const removeEmptyQueryParams = <T extends object>(params: T) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}
