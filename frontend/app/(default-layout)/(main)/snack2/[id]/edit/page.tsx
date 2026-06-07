import { makeQueryClient } from '@/shared/lib/react-query'
import { prefetchSnackDetail } from '@/features/snack/prefetch/snack.prefetch'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import SnackForm from '@/app/(default-layout)/(main)/snack2/_components/form'

export default async function SnackEdit({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const queryClient = makeQueryClient()
  await prefetchSnackDetail(queryClient, id)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <Loader>
        <SnackForm />
      </Loader> */}
      <SnackForm />
    </HydrationBoundary>
  )
}
