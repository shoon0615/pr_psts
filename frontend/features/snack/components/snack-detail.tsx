'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Snack } from '@/features/snack/types/snack.type'
import { ConfirmDialogButton } from '@/shared/components/common/confirm-dialog-button'
import { useRemoveSnack } from '@/features/snack/hooks/useSnack'
import { toast } from 'sonner'

export function SnackDetail({ data }: { data: Snack }) {
  const router = useRouter()
  // const { id } = useParams<{ id: string }>()
  const { mutateAsync: removeSnack } = useRemoveSnack(data.id)

  const handleDelete = async () => {
    try {
      await removeSnack(data.id)
      toast.success('삭제되었습니다.')
      router.push('/snack')
    } catch (error) {
      toast.error('삭제에 실패했습니다.')
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{data.title}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/snack/${data.id}/edit`)}>
            수정
          </Button>
          <ConfirmDialogButton
            label="삭제"
            title="정말 삭제하시겠습니까?"
            description="이 작업은 되돌릴 수 없습니다."
            onConfirm={handleDelete}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[100px_1fr] gap-4">
          <span className="text-muted-foreground font-medium">브랜드</span>
          <span>{data.brand.name}</span>

          <span className="text-muted-foreground font-medium">카테고리</span>
          <span>{data.category.name}</span>

          <span className="text-muted-foreground font-medium">가격</span>
          <span>{data.price.toLocaleString()}원</span>

          <span className="text-muted-foreground font-medium">설명</span>
          <span className="whitespace-pre-wrap">{data.contents || '-'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
