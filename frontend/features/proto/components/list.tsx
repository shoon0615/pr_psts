'use client'

import { useProtoList } from '@/features/proto/hooks/useProto'
import { EmptyState } from '@/shared/components/common/empty-state'

export function ProtoList() {
  const { data } = useProtoList()

  if (!data || data.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <div>123</div>
    </div>
  )
}
