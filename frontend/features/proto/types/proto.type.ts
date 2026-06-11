import { z } from 'zod'
import { createSearchParamsCache, inferParserType } from 'nuqs/server'
import { PartialBy } from '@/shared/lib/utils'

import { protoFormSchema } from '@/features/proto/schemas/form.schema'
import { protoSearchSchema } from '@/features/proto/schemas/search.schema'

export type ProtoSearchParams = inferParserType<typeof protoSearchSchema>
// export type ProtoSearchParams = PartialBy<ProtoSearchParams, 'sort' | 'order'>

export const protoSearchParamsCache = createSearchParamsCache(protoSearchSchema)

export type ProtoFormData = z.infer<typeof protoFormSchema>

export const protoDefaultValues = {
  title: '',
  brand: '',
  category: '',
  contents: '',
  description: '',
  price: 0
} satisfies ProtoFormData
