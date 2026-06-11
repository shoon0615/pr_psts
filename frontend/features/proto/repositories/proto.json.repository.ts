import { jsonApi as api } from '@/shared/lib/axios/core'
import {
  ProtoSearchParams,
  ProtoFormData
} from '@/features/proto/types/proto.type'
import { toQueryString } from '@/shared/lib/utils'
import {
  protoJsonSchema,
  protoJsonListSchema
} from '@/features/proto/schemas/form.schema'

const apiUrl = '/protos'
const pageSize = 10

export const protoRepository = {
  findAll: () => api.get(`${apiUrl}`).then(res => res.data),

  findMany: (params: ProtoSearchParams) => {
    const apiParams = toJsonSearchParams(params)
    return api.get(`${apiUrl}${toQueryString(apiParams)}`).then(res => {
      const totalElements = Number(res.headers['x-total-count'] ?? 0)
      return {
        // data: protoJsonListSchema.safeParse(res.data),
        // data: protoJsonListSchema.parse(res.data),
        data: res.data,
        page: params.page,
        pageSize,
        totalElements,
        totalPages: Math.ceil(totalElements / pageSize)
      }
    })
  },

  findUnique: (id: string) =>
    api
      .get(`${apiUrl}?id=${id}&_expand=brand&_expand=category`)
      // .then(res => protoJsonSchema.parse(res.data[0])),
      .then(res => res.data),

  insert: (params: ProtoFormData) =>
    api
      .post(`${apiUrl}`, toJsonCreateParams(params))
      // .then(res => protoJsonSchema.parse(res.data)),
      .then(res => res.data),

  update: (id: string, params: ProtoFormData) =>
    api
      .patch(`${apiUrl}/${id}`, toJsonCreateParams(params))
      .then(res => res.data),

  delete: (id: string) => api.delete(`${apiUrl}/${id}`).then(res => res.data)
}

/** --- 이하 json-server 전용 로직 --- */
type TProtoJsonParams = {
  brandId?: string
  categoryId?: string
  _page?: number
  _limit?: number
  _sort?: string
  _order?: string
  _expand?: string | string[]
}

const toJsonSearchParams = (params: ProtoSearchParams): TProtoJsonParams => {
  const expand: string[] = []
  const apiParams: TProtoJsonParams = {}

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

  apiParams._page = params.page
  apiParams._limit = pageSize

  if (params?.sort) {
    apiParams._sort = params.sort
    apiParams._order = params.order
  }

  return apiParams
}

const toJsonCreateParams = (params: ProtoFormData) => {
  const { brand: brandId, category: categoryId, ...rest } = params
  return {
    ...rest,
    brandId,
    categoryId
  }
}
