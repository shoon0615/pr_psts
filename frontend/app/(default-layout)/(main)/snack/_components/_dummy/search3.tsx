'use client'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'

import { Search } from 'lucide-react'
import { Spinner } from '@/shared/components/ui/spinner'

import { useFormStatus } from 'react-dom'
import { SnackSearchParams } from '@/features/snack/types/snack.type'

import {
  useSnackSearchParams,
  useSnackSearchOptions
} from '@/features/snack/hooks/useSnack'

export default function SnackSearch() {
  const { searchParams, setSearchParams } = useSnackSearchParams()
  const { brands, categories } = useSnackSearchOptions()

  /**
   * @deprecated `next/form` form action 과 `nuqs` setSearchParams 같이 사용 시, 충돌 발생
   * 1. `next/form` + `nuqs` 방식
   * - <Form action={function} />
   * - useTransition: pending
   * - setSearchParams: URL 이동
   */
  /* import { useTransition } from 'react'
  const [isPending, startTransition] = useTransition()
  function onSubmit(formData: FormData) {
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as SnackSearchParams
    setSearchParams(prev => ({
      // ...prev,
      ...data,
      page: 1
    })
  } */

  /**
   * @deprecated page 등의 withDefault | clearOnDefault 옵션 적용이 복잡해짐
   * 2. `next/form` 방식
   * - <Form action={url} />
   * - useFormStatus: pending
   * - submit: URL 이동
   */
  /* import Form from 'next/form'
  <Form
    // action={onSubmit}
    action="/snack"
    replace
    scroll={false}
    className="w-full">
    <input type="hidden" name="page" value="1" />
    ...
  </Form> */

  /**
   * 3. `nuqs` 방식
   * SubmitEvent 는 실무에서 event.currentTarget 타입 추론이 약해짐
   * FormEvent doesn't actually exist → IDE 에서만 경고
   */
  // function handleSubmit(event: SubmitEvent) {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // const formData: SnackSearchParams = new FormData(event.currentTarget)
    const formData = new FormData(event.currentTarget)
    setSearchParams(prev => ({
      ...formData,
      page: 1
    }))
  }

  return (
    <div className="mb-4">
      <form
        onSubmit={onSubmit}
        className="w-full">
        <Card>
          <CardContent className="p-4 pb-2">
            {/* 1. 브랜드/카테고리 가로 정렬 */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {/* <input type="hidden" name="page" value="1" /> */}
              <FieldGroup className="contents">
                <Field>
                  <FieldLabel htmlFor="brand">브랜드</FieldLabel>
                  <Select
                    name="brand"
                    // defaultValue={searchParams.brand || 'auto'}>
                    defaultValue={searchParams.brand}>
                    <SelectTrigger>
                      <SelectValue placeholder="- 선택 -" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="auto">- 선택 -</SelectItem>
                      <SelectSeparator />
                      {brands.map(brand => (
                        <SelectItem
                          key={brand.value}
                          value={brand.value}>
                          {brand.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">카테고리</FieldLabel>
                  <Select
                    name="category"
                    defaultValue={searchParams.category || 'auto'}>
                    <SelectTrigger>
                      <SelectValue placeholder="- 선택 -" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="auto">- 선택 -</SelectItem>
                      <SelectSeparator />
                      {categories.map(category => (
                        <SelectItem
                          key={category.value}
                          value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>
          </CardContent>

          {/* 2. 검색 버튼 CardFooter로 분리 및 중앙 정렬 */}
          <CardFooter className="flex justify-center pt-0 pb-2">
            <SearchButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export function SearchButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="px-4">
      {pending ? (
        <Spinner className="mr-2 size-4" />
      ) : (
        <Search className="mr-2 size-4" />
      )}
      검색
    </Button>
  )
}
