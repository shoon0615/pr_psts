'use client'

import { useTransition } from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from '@/shared/components/ui/native-select'
import { Spinner } from '@/shared/components/ui/spinner'

import {
  useSnackSearchParams,
  useSnackSearchOptions,
  useSnackList,
  useSnackListLoading
} from '@/features/snack/hooks/useSnack'
import { SnackSearchParams } from '@/features/snack/types/snack.type'

export default function SnackSearch() {
  const { searchParams, setSearchParams } = useSnackSearchParams()
  const { brands, categories } = useSnackSearchOptions()
  // const [isPending, startTransition] = useTransition()
  // const { isFetching } = useSnackList()
  const isFetching = useSnackListLoading()

  // 검색 실행
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as SnackSearchParams

    setSearchParams({
      ...data,
      page: 1
    })
  }

  // 검색 조건 초기화
  const onReset = () => {
    // setSearchParams(null)
    setSearchParams({
      brand: null,
      category: null,
      contents: null,
      page: 1
    })
  }

  return (
    <div className="mb-4">
      <form
        onSubmit={onSubmit}
        /* key를 통해 URL 파라미터 변경 시 폼 내부 UI 강제 동기화 (Reset 대응) */
        key={JSON.stringify(searchParams)}
        className="w-full">
        <Card>
          <CardContent className="p-4 pb-2">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
              <FieldGroup className="contents">
                {/* 브랜드 선택 */}
                <SearchField
                  label="브랜드"
                  name="brand">
                  <NativeSelect
                    name="brand"
                    defaultValue={searchParams.brand}>
                    <NativeSelectOption value="">전체</NativeSelectOption>
                    {brands.map(brand => (
                      <NativeSelectOption
                        key={brand.value}
                        value={brand.value}>
                        {brand.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </SearchField>

                {/* 카테고리 선택 */}
                <SearchField
                  label="카테고리"
                  name="category">
                  <NativeSelect
                    name="category"
                    defaultValue={searchParams.category}>
                    <NativeSelectOption value="">전체</NativeSelectOption>
                    {categories.map(category => (
                      <NativeSelectOption
                        key={category.value}
                        value={category.value}>
                        {category.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </SearchField>

                {/* 검색어 입력 */}
                <SearchField
                  label="검색어"
                  name="contents">
                  <Input
                    name="contents"
                    defaultValue={searchParams.contents || ''}
                    placeholder="검색어를 입력하세요"
                  />
                </SearchField>
              </FieldGroup>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center gap-2 pt-0 pb-3">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={isFetching}
              className="px-3">
              <RotateCcw className="mr-2 size-4" />
              초기화
            </Button>
            <Button
              type="submit"
              disabled={isFetching}
              className="px-4">
              {isFetching ? (
                <Spinner className="mr-2 size-4" />
              ) : (
                <Search className="mr-2 size-4" />
              )}
              검색
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

/**
 * 모듈화를 위한 서브 컴포넌트: 검색 필드 레이아웃
 */
function SearchField({
  label,
  name,
  children
}: {
  label: string
  name: string
  children: React.ReactNode
}) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {children}
    </Field>
  )
}
