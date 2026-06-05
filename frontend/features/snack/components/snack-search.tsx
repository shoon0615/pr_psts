'use client'

import React from 'react'
import { FormInput, FormSelect } from '@/shared/components/ui/custom/form'
import { CommonSearchForm } from '@/shared/components/common/common-search-form'
import { useSnackSearchParams, useSnackSearchOptions, useSnackListLoading } from '@/features/snack/hooks/useSnack'

export function SnackSearch() {
  const { searchParams, setSearchParams } = useSnackSearchParams()
  const { brands, categories } = useSnackSearchOptions()
  const isFetching = useSnackListLoading()

  const defaultValues = {
    brand: searchParams.brand || '',
    category: searchParams.category || '',
    contents: searchParams.contents || ''
  }

  return (
    <CommonSearchForm
      isFetching={isFetching}
      defaultValues={defaultValues}
      onSubmit={values => {
        setSearchParams({
          ...values,
          page: 1
        })
      }}
      onReset={() => {
        setSearchParams({
          brand: '',
          category: '',
          contents: '',
          page: 1
        })
      }}
    >
      {() => (
        <>
          <FormSelect
            name="brand"
            label="브랜드"
            placeholder="전체"
            items={brands}
          />
          <FormSelect
            name="category"
            label="카테고리"
            placeholder="전체"
            items={categories}
          />
          <FormInput
            name="contents"
            label="검색어"
            placeholder="검색어를 입력하세요"
          />
        </>
      )}
    </CommonSearchForm>
  )
}
