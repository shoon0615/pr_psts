'use client'

import React from 'react'
import { SnackTable } from './snack-table'
import { SnackPagination } from './snack-pagination'
import { useSnackList } from '../hooks/useSnack'
import { EmptyState } from '@/shared/components/common/empty-state'
import { useRouter } from 'next/navigation'

/**
 * useSuspenseQuery를 사용하여 데이터를 가져오고 테이블과 페이징을 렌더링하는 클라이언트 컴포넌트입니다.
 */
export function SnackList() {
  const router = useRouter()
  const { data: response } = useSnackList()
  
  // ApiResponse<PageResponse> 구조에서 실제 데이터 추출
  const { list, totalCount } = response.data

  if (!list || list.length === 0) {
    return (
      <EmptyState
        title="등록된 간식이 없습니다."
        description="새로운 간식을 등록해 보세요."
        action={{
          label: '간식 등록하기',
          onClick: () => router.push('/snack/new')
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <SnackTable data={list} />
      <SnackPagination totalCount={totalCount} />
    </div>
  )
}
