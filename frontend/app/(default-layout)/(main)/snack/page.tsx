import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { SnackSearch } from '@/features/snack/components/snack-search'
import { SnackSort } from '@/features/snack/components/snack-sort'
import { SnackList } from '@/features/snack/components/snack-list'
import { Button } from '@/shared/components/shadcn/ui/button'

import { SnackSearchParams } from '@/features/snack/types/snack.type'
import { makeQueryClient } from '@/shared/lib/react-query'
import { prefetchSnackPage } from '@/features/snack/prefetch/snack.prefetch'
import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'

export default async function SnackPage({
  searchParams
}: {
  searchParams: Promise<SnackSearchParams>
}) {
  const params = await searchParams
  const queryClient = makeQueryClient()

  // 서버에서 모든 필요한 데이터를 미리 가져옵니다.
  await prefetchSnackPage(queryClient, params)

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">간식 관리</h1>
        <Button asChild>
          <Link href="/snack/new">
            <Plus className="mr-2 h-4 w-4" />새 간식 등록
          </Link>
        </Button>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="space-y-4">
          <Loader>
            <SnackSearch />
          </Loader>

          <div className="flex justify-end">
            <SnackSort />
          </div>

          {/* SnackList는 내부에서 useSuspenseQuery를 사용하므로 Loader(Suspense)로 감쌉니다. */}
          <Loader>
            <SnackList />
          </Loader>
        </div>
      </HydrationBoundary>
    </div>
  )
}
