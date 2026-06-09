'use client'

import React from 'react'
import { Button } from '@/shared/components/shadcn/ui/button'
import { Loader2 } from 'lucide-react'

type SubmitButtonProps = {
  isPending?: boolean
  label?: string
  pendingLabel?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  onClick?: () => void
}

export function SubmitButton({
  isPending,
  label = '제출',
  pendingLabel = '처리 중...',
  variant = 'default',
  className,
  onClick
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      variant={variant}
      className={className}
      onClick={onClick}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? pendingLabel : label}
    </Button>
  )
}
