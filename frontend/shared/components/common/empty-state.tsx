'use client'

import React from 'react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/shared/components/shadcn/ui/empty'
import { SearchX, PackageOpen } from 'lucide-react'
import { Button } from '@/shared/components/shadcn/ui/button'

type EmptyStateProps = {
  title?: string
  description?: string
  icon?: 'search' | 'package'
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = '데이터가 없습니다.',
  description = '조건을 변경하거나 새로운 데이터를 등록해 보세요.',
  icon = 'package',
  action
}: EmptyStateProps) {
  const Icon = icon === 'search' ? SearchX : PackageOpen

  return (
    <Empty className="h-[400px]">
      <Icon className="text-muted-foreground size-12" />
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="mt-4">
          {action.label}
        </Button>
      )}
    </Empty>
  )
}
