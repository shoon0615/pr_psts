// 'use cache'
// import 'server-only'

import { jsonApi as api } from '@/shared/lib/axios/core'
import { Snack } from '@/features/snack/types/snack.type'
import { SnackSearchParams } from '@/features/snack/types/snack.type'
import { toQueryString } from '@/shared/lib/utils'
import { CreateSnackInput } from '@/features/snack/schema/snack.schema'

const apiUrl = '/snacks'

export const snackRepository = {
  // cacheTag('snacks')

  findAll: () => api.get<Snack[]>(`${apiUrl}`).then(res => res.data),

  /* findMany: (params: SnackSearchParams) =>
    api.get<Snack[]>(`${apiUrl}${toQueryString(params)}`).then(res => res.data), */
  findMany: (params: SnackSearchParams) => {
    const apiParams = toJsonApiParams(params)
    console.log('url', `${apiUrl}${toQueryString(apiParams)}`)
    return (
      api
        .get(`${apiUrl}${toQueryString(apiParams)}`)
        // .then(res => res.data)
        .then(res => {
          // json-server 0.17.x
          const items = Number(res.headers['x-total-count'] ?? 0)
          return {
            data: res.data,
            items
          }

          // json-server 1.0.0 이상 → 응답에 page 포함
          /* {
          "first": 1,
          "prev": null,
          "next": 2,
          "last": 10,
          "pages": 10,
          "items": 95,
          "data": [...]
        } */
        })
    )
  },

  findUnique: (id: string) =>
    // api.get(`${apiUrl}/${id}`).then(res => res.data),
    api
      .get(`${apiUrl}?id=${id}&_expand=brand&_expand=category`)
      .then(res => res.data),

  /* create: (params: CreateSnackInput) =>
    api.post<Snack>(`${apiUrl}`, params).then(res => res.data), */
  create: (params: CreateSnackInput) =>
    api.post(`${apiUrl}`, toJsonApiParams2(params)).then(res => res.data),

  update: (id: string, params: CreateSnackInput) =>
    // api.put(`${apiUrl}/${id}`, params).then(res => res.data),
    api
      .patch(`${apiUrl}/${id}`, toJsonApiParams2(params))
      .then(res => res.data),

  delete: (id: string) => api.delete(`${apiUrl}/${id}`).then(res => res.data)
}

// /snacks?page=1&brand=001&category=001
// /snacks?_expand=brand&brandId=001

type SnackApiParams = {
  brandId?: string
  categoryId?: string
  contents?: string
  _page?: number
  _limit?: number
  _sort?: string
  _order?: string
  _expand?: string | string[]
}

const toJsonApiParams = (params: SnackSearchParams): SnackApiParams => {
  const expand: string[] = []

  /* const apiParams: SnackApiParams = {
    page: params.page,
    contents: params.contents
  } */
  // const apiParams: SnackApiParams = { ...params }

  // 구조 분해로 page, sort, order 제외
  const { page, sort, order, ...excludeParams } = params
  const apiParams: SnackApiParams = excludeParams

  if (params.brand) {
    expand.push('brand')
    apiParams.brandId = params.brand
  }

  if (params.category) {
    expand.push('category')
    apiParams.categoryId = params.category
  }

  if (expand.length > 0) {
    apiParams._expand = expand
  }

  // json-server 0.17.x
  apiParams._page = params.page
  apiParams._limit = 10 // default: 10

  // json-server 1.0.0 이상
  /* apiParams._page = params.page
  apiParams._per_page = 10 */

  if (params?.sort) {
    // json-server 0.17.x
    apiParams._sort = params.sort
    apiParams._order = params.order

    // json-server 1.0.0 이상 → order(desc: -)
    // apiParams._sort = (params.order === 'desc' ? '-' : '') + params.sort
  }

  return apiParams
}

const toJsonApiParams2 = (params: CreateSnackInput) => {
  const apiParams: Omit<CreateSnackInput, 'brand' | 'category'> & {
    brandId: string
    categoryId: string
  } = {
    brandId: params.brand,
    categoryId: params.category,
    ...params
  }
  // return apiParams

  const { brand: brandId, category: categoryId, ...rest } = params
  return {
    ...rest,
    brandId,
    categoryId
  }
}
