'use client'

import React from 'react'
import { Form } from '@/shared/components/ui/custom/form'
import { Button } from '@/shared/components/ui/button'
import { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'
import { z } from 'zod'

type CommonSearchFormProps<TValues extends FieldValues> = {
  isFetching?: boolean
  onSubmit: (values: TValues) => void
  onReset?: () => void
  children: (methods: UseFormReturn<TValues>) => React.ReactNode
  submitLabel?: string
  resetLabel?: string
  defaultValues?: DefaultValues<TValues>
  schema?: z.ZodType<TValues>
}

export function CommonSearchForm<TValues extends FieldValues>({
  isFetching,
  onSubmit,
  onReset,
  children,
  submitLabel = '검색',
  resetLabel = '초기화',
  defaultValues,
  schema
}: CommonSearchFormProps<TValues>) {
  // 스키마가 없는 경우를 대비해 기본 스키마 생성
  const formSchema = schema || z.any()

  return (
    <Form
      schema={formSchema}
      onSubmit={onSubmit}
      options={{ defaultValues }}
      className="rounded-md border p-4">
      {methods => (
        <>
          <div className="grid gap-3 md:grid-cols-3">{children(methods)}</div>

          <div className="mt-4 flex justify-end gap-2">
            {onReset && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  methods.reset()
                  onReset()
                }}>
                {resetLabel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isFetching}>
              {isFetching ? `${submitLabel} 중...` : submitLabel}
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
