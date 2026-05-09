'use client'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  createSnackSchema,
  CreateSnackInput
} from '@/features/snack/schema/snack.schema'
import {
  Form,
  FormSelect,
  FormDatePicker
} from '@/shared/components/ui/custom/form'

import { useRouter, useSearchParams } from 'next/navigation'
import { getSearchParam } from '@/shared/lib/dummy/utils'

/** @deprecated `nuqs` 라이브러리 사용 이전 */
export default function SnackSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // const queryParams: CreateSnackInput = {
  const queryParams = {
    keyword: getSearchParam(searchParams, 'keyword'),
    regionId: getSearchParam(searchParams, 'regionId'),
    statusId: getSearchParam(searchParams, 'statusId')
    // page: Number(searchParams.page ?? 1)
  }

  // react-query 는 searchParams 이라 setForm 으로 변해도 자동 검색 안됨
  const [form, setForm] = useState(queryParams)

  // TODO: useHook 을 통해 return {} 로 변환??
  // const { data: brands = [] } = useQuery(brandQueryOptions())
  // const { data: categories = [] } = useQuery(categoryQueryOptions())

  function onSubmit(formData: CreateSnackInput) {
    console.log('formData', formData)

    // Nullish 가 아닌 truthy/falsy 형식이라 0 이나 false 도 제외돼버리는 문제 발생
    /* const params = new URLSearchParams()
    if (form.keyword) params.set('keyword', form.keyword)
    if (form.regionId) params.set('regionId', form.regionId)
    if (form.statusId) params.set('statusId', form.statusId) */
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(form).filter(([, value]) => value) // 빈 값은 자동 제외
      )
    )

    router.push(`/snack?${params.toString()}`)
  }

  return (
    <div className="mb-4">
      <Form
        schema={createSnackSchema}
        onSubmit={onSubmit}
        id="form-rhf-demo2"
        // options={{ defaultValues }}
        className="w-full">
        {methods => (
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                <FormSelect
                  name="brand"
                  label="브랜드"
                  placeholder="- 선택 -"
                  items={[
                    { label: '중앙', value: 'central' },
                    { label: '서울', value: 'seoul' },
                    { label: '부산', value: 'busan' }
                  ]}
                />

                <FormSelect
                  name="category"
                  label="카테고리"
                  value={form.keyword} // defaultValues 로 대체
                  placeholder="- 선택 -"
                  items={[
                    { label: '중앙', value: 'central' },
                    { label: '서울', value: 'seoul' },
                    { label: '부산', value: 'busan' }
                  ]}
                  onValueChange={e => setForm({ ...form, keyword: e })}
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
