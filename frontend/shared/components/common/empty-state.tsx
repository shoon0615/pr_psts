import {
  Empty,
  EmptyContent,
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
  title = '검색 결과가 없습니다.',
  description = '다른 검색어로 다시 시도해 보세요.',
  icon = 'search',
  action
}: EmptyStateProps) {
  const Icon = icon === 'search' ? SearchX : PackageOpen
  return (
    <Empty className="h-96">
      <Icon className="text-muted-foreground size-12" />
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button
            onClick={action.onClick}
            variant="outline"
            className="mt-4">
            {action.label}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
