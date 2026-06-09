'use client'

import React from 'react'
import {
  Form,
  FormInput,
  FormSelect,
  FormTextarea
} from '@/shared/components/shadcn/custom/form'
import { SubmitButton } from '@/shared/components/common/submit-button'
import { Button } from '@/shared/components/shadcn/ui/button'
import { useRouter } from 'next/navigation'
import {
  createSnackSchema,
  CreateSnackInput
} from '@/features/snack/schema/snack.schema'
import { useSnackSearchOptions } from '@/features/snack/hooks/useSnack'

type SnackFormProps = {
  mode: 'create' | 'update'
  defaultValues: CreateSnackInput | UpdateSnackInput
  onSubmit: (values) => void
  isPending?: boolean
}

export function SnackForm({
  mode,
  defaultValues,
  onSubmit,
  isPending
}: SnackFormProps) {
  const router = useRouter()
  const { brands, categories } = useSnackSearchOptions()

  return (
    <Form
      schema={createSnackSchema}
      options={{ defaultValues }}
      onSubmit={onSubmit}>
      {() => (
        <div className="space-y-4">
          <FormInput
            name="title"
            label="이름"
            placeholder="과자 이름을 입력하세요"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="brand"
              label="브랜드"
              placeholder="브랜드 선택"
              items={brands}
            />
            <FormSelect
              name="category"
              label="카테고리"
              placeholder="카테고리 선택"
              items={categories}
            />
          </div>

          <FormInput
            name="price"
            label="가격"
            type="number"
            placeholder="가격을 입력하세요"
          />

          <FormTextarea
            name="contents"
            label="설명"
            placeholder="상세 설명을 입력하세요"
            className="h-32 resize-none"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}>
              취소
            </Button>
            <SubmitButton
              isPending={isPending}
              label={mode === 'create' ? '등록' : '수정'}
            />
          </div>
        </div>
      )}
    </Form>
  )
}
