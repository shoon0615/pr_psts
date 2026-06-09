// features/snack/prefetch/snack.prefetch.ts

import { QueryClient } from '@tanstack/react-query'
import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'
import { SnackSearchParams } from '@/features/snack/types/snack.type'
import {
  snackListQueryOptions,
  snackDetailQueryOptions
} from '@/features/snack/queries/snack.query'

export async function prefetchSnackPage(
  queryClient: QueryClient,
  params: SnackSearchParams
) {
  // await Promise.allSettled([
  await Promise.all([
    queryClient.prefetchQuery(brandQueryOptions()),
    queryClient.prefetchQuery(categoryQueryOptions()),
    queryClient.prefetchQuery(snackListQueryOptions(params))
  ])
}

export async function prefetchSnackDetail(
  queryClient: QueryClient,
  id: string
) {
  await Promise.all([
    queryClient.prefetchQuery(brandQueryOptions()),
    queryClient.prefetchQuery(categoryQueryOptions()),
    queryClient.prefetchQuery(snackDetailQueryOptions(id))
  ])
}
