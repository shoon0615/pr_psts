import React from 'react'
import { makeQueryClient } from '@/shared/lib/react-query'
import { prefetchSnackDetail } from '@/features/snack/prefetch/snack.prefetch'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/shadcn/ui/card'
import { SnackEditContent } from './_components/edit-content'
import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'

export default async function SnackEditPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const queryClient = makeQueryClient()

  // 서버에서 상세 데이터와 필요한 옵션들을 프리페치합니다.
  await prefetchSnackDetail(queryClient, id)

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">간식 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Loader>
              <SnackEditContent id={id} />
            </Loader>
          </HydrationBoundary>
        </CardContent>
      </Card>
    </div>
  )
}
