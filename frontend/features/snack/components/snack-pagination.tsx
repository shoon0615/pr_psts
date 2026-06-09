'use client'

import React from 'react'
import { CommonPagination } from '@/shared/components/common/common-pagination'
import { useSnackSearchParams } from '@/features/snack/hooks/useSnack'

export function SnackPagination({ totalCount }: { totalCount: number }) {
  const { searchParams, setSearchParams } = useSnackSearchParams()
  const PAGE_SIZE = 10

  return (
    <CommonPagination
      currentPage={searchParams.page}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
      onPageChange={page => {
        setSearchParams({ page })
      }}
    />
  )
}
