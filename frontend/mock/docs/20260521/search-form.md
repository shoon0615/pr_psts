# Search Form

## next/form

검색 버튼을 눌렀을 때만 URL 변경

```tsx
export default async function SnackPage({ searchParams }) {
  const params = await searchParamsCache.parse(searchParams)

  return (
    <>
      <SnackSearchForm defaultValues={params} />
      <SnackList params={params} />
    </>
  )
}
```

```tsx
import Form from 'next/form'

export function SnackSearchForm({ defaultValues }) {
  return (
    <Form action="/snack">
      <input
        name="brand"
        defaultValue={defaultValues.brand}
      />
      <input
        name="category"
        defaultValue={defaultValues.category}
      />
      <input
        name="keyword"
        placeholder="검색어"
      />
      <select name="category">
        <option value="">전체</option>
        <option value="cookie">쿠키</option>
        <option value="chip">칩</option>
      </select>

      <button type="submit">검색</button>
    </Form>
  )
}
```

```
입력 중
/snack

검색 버튼 클릭 후
/snack?keyword=oreo&category=cookie
```

## nuqs

값이 바뀌는 순간 URL 변경

```tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'

export function SnackSearchForm() {
  const [params, setParams] = useQueryStates(snackSearchParams)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setParams({
      page: 1,
      brand: String(formData.get('brand') ?? ''),
      category: String(formData.get('category') ?? '')
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        name="brand"
        defaultValue={params.brand}
      />
      <input
        name="category"
        defaultValue={params.category}
      />

      <button type="submit">검색</button>
    </form>
  )
}
```

```tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'

export function SnackFilter() {
  const [params, setParams] = useQueryStates(snackSearchParams)

  return (
    <>
      <input
        value={params.keyword}
        onChange={e =>
          setParams({
            keyword: e.target.value,
            page: 1
          })
        }
      />

      <select
        value={params.category}
        onChange={e =>
          setParams({
            category: e.target.value,
            page: 1
          })
        }>
        <option value="">전체</option>
        <option value="cookie">쿠키</option>
        <option value="chip">칩</option>
      </select>
    </>
  )
}
```

```tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '../schema/snack-search-params'

export function SnackPagination() {
  const [params, setParams] = useQueryStates(snackSearchParams)

  return (
    <button
      onClick={() =>
        setParams({
          ...params,
          page: params.page + 1
        })
      }>
      다음
    </button>
  )
}
```

## shadcn/ui

```tsx
import Form from 'next/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'

type Props = {
  defaultValues?: {
    brand?: string
    category?: string
  }
}

export function SnackSearchForm({ defaultValues }: Props) {
  return (
    <Form
      action="/snack"
      className="flex gap-2">
      <Input
        name="brand"
        placeholder="브랜드"
        defaultValue={defaultValues?.brand ?? ''}
      />

      <Select
        name="category"
        defaultValue={defaultValues?.category ?? ''}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="cookie">쿠키</SelectItem>
          <SelectItem value="chip">칩</SelectItem>
          <SelectItem value="chocolate">초콜릿</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit">검색</Button>
    </Form>
  )
}
```

---

# Edit Form

```tsx
export default async function EditSnackPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const snack = await getSnack(Number(id))

  return (
    <EditSnackForm
      id={Number(id)}
      defaultValues={{
        name: snack.name,
        brandId: snack.brandId,
        categoryId: snack.categoryId,
        contents: snack.contents ?? ''
      }}
    />
  )
}
```

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { SnackForm } from '@/features/snack/components/snack-form'
import { useUpdateSnack } from '@/features/snack/hooks/use-update-snack'

export function EditSnackForm({ id, defaultValues }) {
  const router = useRouter()
  const { mutateAsync } = useUpdateSnack()

  async function handleSubmit(values) {
    await mutateAsync({ id, values })
    router.replace(`/snack/${id}`)
  }

  return (
    <SnackForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    />
  )
}
```
