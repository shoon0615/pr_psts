'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SnackForm } from '@/features/snack/components/snack-form'
import { useSnackDetail, useModifySnack } from '@/features/snack/hooks/useSnack'
import { toast } from 'sonner'

export function SnackEditContent({ id }: { id: string }) {
  const router = useRouter()
  const { data: snack } = useSnackDetail(id)
  const { mutateAsync: modifySnack, isPending } = useModifySnack(id)

  const handleSubmit = async values => {
    try {
      await modifySnack(values)
      toast.success('수정되었습니다.')
      router.push(`/snack/${id}`)
    } catch (error) {
      toast.error('수정에 실패했습니다.')
    }
  }

  return (
    <SnackForm
      mode="update"
      defaultValues={{
        title: snack.title,
        brand: snack.brand.id,
        category: snack.category.id,
        contents: snack.contents || '',
        price: snack.price
      }}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  )
}
