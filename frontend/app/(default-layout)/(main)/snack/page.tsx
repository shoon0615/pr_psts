import Search from '@/app/(default-layout)/(main)/snack/_components/search'
import SearchLoader from '@/app/(default-layout)/(main)/snack/_components/search-loader'
import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'
import List from '@/app/(default-layout)/(main)/snack/_components/list'

import {
  QueryClient,
  HydrationBoundary,
  dehydrate
} from '@tanstack/react-query'

// import { SnackSearchParams } from '@/features/snack/types/snack.type'
import { SnackSearchParams } from '@/features/snack/queries/snack.query'
import { prefetchSnackPage } from '@/features/snack/prefetch/snack.prefetch'
import { queryConfig } from '@/shared/lib/react-query'

export default async function Snack({
  searchParams
}: {
  // searchParams: Promise<Record<string, string | undefined>>
  searchParams: Promise<SnackSearchParams>
}) {
  const params = await searchParams
  const queryClient = new QueryClient({ defaultOptions: queryConfig })
  await prefetchSnackPage(queryClient, params)

  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* Filter and Search Section */}
          {/* <SearchLoader /> */}
          <Search />

          {/* List Section */}
          <Loader>
            <List />
          </Loader>
        </HydrationBoundary>
      </div>
    </div>
  )
}
