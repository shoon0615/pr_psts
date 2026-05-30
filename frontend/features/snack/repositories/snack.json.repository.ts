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
    return api
      .get<Snack[]>(`${apiUrl}${toQueryString(apiParams)}`)
      .then(res => res.data)
  },

  findUnique: (id: string) =>
    // api.get(`${apiUrl}/${id}`).then(res => res.data),
    api.get(`${apiUrl}?id=${id}`).then(res => res.data),

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
  page?: number
  _expand?: string | string[]
}

const toJsonApiParams = (params: SnackSearchParams): SnackApiParams => {
  const expand: string[] = []

  /* const apiParams: SnackApiParams = {
    page: params.page,
    contents: params.contents
  } */
  const apiParams: SnackApiParams = { ...params }

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
