import { QueryClient } from '@tanstack/react-query'
import { ProtoSearchParams } from '@/features/proto/types/proto.type'
import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'
import {
  protoListQueryOptions,
  protoDetailQueryOptions
} from '@/features/proto/queries/proto.query'

export async function prefetchProtoList(
  queryClient: QueryClient,
  params: ProtoSearchParams
) {
  // await Promise.allSettled([
  await Promise.all([
    queryClient.prefetchQuery(brandQueryOptions()),
    queryClient.prefetchQuery(categoryQueryOptions()),
    queryClient.prefetchQuery(protoListQueryOptions(params))
  ])
}

export async function prefetchSnackDetail(
  queryClient: QueryClient,
  id: string
) {
  await Promise.all([
    queryClient.prefetchQuery(brandQueryOptions()),
    queryClient.prefetchQuery(categoryQueryOptions()),
    queryClient.prefetchQuery(protoDetailQueryOptions(id))
  ])
}
