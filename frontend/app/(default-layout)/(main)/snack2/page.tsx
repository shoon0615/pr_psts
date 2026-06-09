import Search from '@/app/(default-layout)/(main)/snack2/_components/search'
import SearchLoader from '@/app/(default-layout)/(main)/snack2/_components/search-loader'
import Loader from '@/app/(default-layout)/(main)/snack2/_components/loader'
import List from '@/app/(default-layout)/(main)/snack2/_components/list'
import { Button } from '@/shared/components/shadcn/ui/button'
import { Field } from '@/shared/components/shadcn/ui/field'
import Link from 'next/link'

import { SnackSearchParams } from '@/features/snack/types/snack.type'
import { makeQueryClient } from '@/shared/lib/react-query'
import { prefetchSnackPage } from '@/features/snack/prefetch/snack.prefetch'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import Sort from '@/app/(default-layout)/(main)/snack2/_components/sort'

export default async function Snack({
  searchParams
}: {
  searchParams: Promise<SnackSearchParams>
}) {
  // const params = snackSearchParamsSchema.parse(await searchParams)
  const params = await searchParams
  // const queryClient = new QueryClient()
  // const queryClient = new QueryClient({ defaultOptions: queryConfig })
  const queryClient = makeQueryClient()
  // const queryClient = useQueryClient()   // client 기능이라 사용 불가
  await prefetchSnackPage(queryClient, params)

  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* Filter and Search Section */}
          {/* <SearchLoader /> */}
          <Search />
          {/* <Search searchParams={params} /> */}

          <div className="flex justify-end">
            <Sort />
          </div>

          <Field
            orientation="horizontal"
            className="justify-end">
            <Button
              type="button"
              variant="outline"
              className="mb-3 w-20 bg-gray-100 hover:bg-gray-200"
              asChild>
              <Link href="/snack2/new">등록</Link>
            </Button>
          </Field>

          {/* List Section */}
          <Loader>
            <List />
          </Loader>
        </HydrationBoundary>
      </div>
    </div>
  )
}
