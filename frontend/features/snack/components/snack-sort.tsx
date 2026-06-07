'use client'

import React from 'react'
import { CommonSortSelect, SortOption } from '@/shared/components/common/common-sort-select'
import { useSnackSearchParams } from '@/features/snack/hooks/useSnack'
import { SORT_OPTIONS } from '@/features/snack/types/snack.type'

export function SnackSort() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  const handleSortChange = (value: string) => {
    setSearchParams({
      sort: value as any,
      page: 1
    })
  }

  return (
    <CommonSortSelect
      value={searchParams.sort}
      options={SORT_OPTIONS as any}
      onChange={handleSortChange}
    />
  )
}
