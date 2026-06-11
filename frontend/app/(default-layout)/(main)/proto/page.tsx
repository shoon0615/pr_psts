import { ProtoSearchParams } from '@/features/proto/types/proto.type'
import { makeQueryClient } from '@/shared/lib/react-query'
import { prefetchProtoList } from '@/features/proto/prefetch/proto.prefetch'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { ProtoList } from '@/features/proto/components/list'

export default async function ProtoListPage({
  searchParams
}: {
  searchParams: Promise<ProtoSearchParams>
}) {
  const params = await searchParams
  const queryClient = makeQueryClient()
  await prefetchProtoList(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProtoList />
    </HydrationBoundary>
  )
}
