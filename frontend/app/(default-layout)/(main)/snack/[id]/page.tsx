import React from 'react'
import { makeQueryClient } from '@/shared/lib/react-query'
import { prefetchSnackDetail } from '@/features/snack/prefetch/snack.prefetch'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { SnackDetailContent } from './_components/detail-content'
import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'

export default async function SnackDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const queryClient = makeQueryClient()
  
  // 상세 정보와 필요한 옵션들을 서버에서 프리페치합니다.
  await prefetchSnackDetail(queryClient, id)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">간식 상세 정보</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Loader>
          <SnackDetailContent id={id} />
        </Loader>
      </HydrationBoundary>
    </div>
  )
}
