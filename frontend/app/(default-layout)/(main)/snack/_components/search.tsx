'use client'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  createSnackSchema,
  CreateSnackInput
} from '@/features/snack/schema/snack.schema'
import { Form, FormSelect } from '@/shared/components/ui/custom/form'

import {
  useSnackSearchParams,
  useSnackSearchOptions,
  useSnackSearchOptions2
} from '@/features/snack/hooks/useSnack'

import { SubmitErrorHandler } from 'react-hook-form'

export default function SnackSearch() {
  console.log('SnackSearch')
  const { searchParams, setSearchParams } = useSnackSearchParams()

  // TODO: useHook 을 통해 return {} 로 변환??
  // const { data: brands = [] } = useQuery(brandQueryOptions())
  // const { data: categories = [] } = useQuery(categoryQueryOptions())

  // const { brands, categories, isLoading, isError } = useSnackSearchOptions()
  const { brands, categories } = useSnackSearchOptions2()
  console.log('brands', brands)
  console.log('categories', categories)

  const defaultValues = {
    brand: '',
    category: 'seoul'
  }

  function onSubmit(formData: CreateSnackInput) {
    console.log('formData', formData)

    setSearchParams({
      page: 1,
      brand: formData.brand,
      category: formData.category
    })
  }

  const onError: SubmitErrorHandler<CreateSnackInput> = formData => {
    console.log('Validation Errors:', formData)
  }

  return (
    <div className="mb-4">
      <Form
        schema={createSnackSchema}
        onSubmit={onSubmit}
        onError={onError}
        id="form-rhf-demo2"
        className="w-full">
        {/* options={{ defaultValues: searchParams }} */}
        {methods => (
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                <FormSelect
                  name="brand"
                  label="브랜드"
                  placeholder="- 선택 -"
                  items={brands}
                />

                <FormSelect
                  name="category"
                  label="카테고리"
                  placeholder="- 선택 -"
                  // items={categories}
                  items={[
                    { label: '중앙', value: 'central' },
                    { label: '서울', value: 'seoul' },
                    { label: '부산', value: 'busan' }
                  ]}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <Button className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  검색
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Form>
    </div>
  )
}
