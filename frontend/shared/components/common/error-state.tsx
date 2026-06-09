'use client'

import React from 'react'
import { Button } from '@/shared/components/shadcn/ui/button'
import { AlertCircle } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  description?: string
  onReset?: () => void
}

export function ErrorState({
  title = '문제가 발생했습니다.',
  description = '잠시 후 다시 시도해 주세요.',
  onReset
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <AlertCircle className="text-destructive mb-4 h-12 w-12" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          className="mt-6">
          다시 시도
        </Button>
      )}
    </div>
  )
}
