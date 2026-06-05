'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { SnackForm } from '@/features/snack/components/snack-form'
import { useCreateSnack } from '@/features/snack/hooks/useSnack'
import { snackDefaultValues } from '@/features/snack/schema/snack.schema'
import { toast } from 'sonner'
import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'

export default function SnackNewPage() {
  const router = useRouter()
  const { mutateAsync: createSnack, isPending } = useCreateSnack()

  const handleSubmit = async (values: any) => {
    try {
      await createSnack(values)
      toast.success('등록되었습니다.')
      router.push('/snack')
    } catch (error) {
      toast.error('등록에 실패했습니다.')
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">새 간식 등록</CardTitle>
        </CardHeader>
        <CardContent>
          {/* useSnackSearchOptions를 내부에서 사용하는 SnackForm을 위해 Loader(Suspense)로 감쌉니다. */}
          <Loader>
            <SnackForm
              mode="create"
              defaultValues={snackDefaultValues}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </Loader>
        </CardContent>
      </Card>
    </div>
  )
}
