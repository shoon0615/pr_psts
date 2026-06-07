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
  const snack = await getSnack(id)

  return (
    <EditSnackForm
      id={id}
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

```tsx
// Server Component
export default async function EditSnackForm({
  params
}: {
  params: Promise<{ id: string }>
}) {...}
```

> prefetch 를 통한 SEO 적용 가능 → 거의 대부분

```tsx
// Client Component
'use client'
import { useParams } from 'next/navigation'
export default function EditSnackForm() {
  const { id } = useParams()
  ...
}
```

> 조회/상세 페이지는 SEO 가 필요하고, 변경(생성/수정) 페이지는 SEO 가 필요없지만  
> useParams 로 받게되면 초기 데이터를 받을 수 없기에 굳이 필요치않은 로딩이 발생  
> 또한 변경 페이지에서 params 를 받는 이유도 SEO 때문이 아니라  
> 수정할 게시글 ID를 서버에서 조회하기 위해서인 경우가 대부분
>
> > 이미 Client Component 안쪽인데 props 로 id 를 넘기기 애매할 때 정도에만 사용

---

```ts
// useUpdateSnack
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateSnack } from '../services/snack-service'
import { snackKeys } from '../queries/snack-keys'

export function useUpdateSnack(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSnackInput) => updateSnack(id, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: snackKeys.lists()
        }),

        queryClient.invalidateQueries({
          queryKey: snackKeys.detail(id)
        })
      ])
    }
  })
}
```

```ts
// service
export async function updateSnack(id: number, data: UpdateSnackInput) {
  return repository.update(id, data)
}
```

```ts
// repository
export async function update(id: number, data: UpdateSnackInput) {
  const response = await api.patch(`/snacks/${id}`, data)
  return response.data
}
```

```tsx
// edit page
'use client'

export default function EditPage() {
  const params = useParams()
  const id = Number(params.id)

  const { data } = useSnack(id)
  const { mutateAsync } = useUpdateSnack(id)

  async function onSubmit(formData: UpdateSnackInput) {
    await mutateAsync(formData)
    router.replace('/snack')
  }

  return (
    <SnackForm
      defaultValues={data}
      onSubmit={onSubmit}
    />
  )
}
```

그런데 실무에서는 id를 Hook 생성 시점에 넘기는 방식보다 아래 방식도 많이 사용해.

내가 더 추천하는 방식

```ts
export function useUpdateSnack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSnackInput }) =>
      updateSnack(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: snackKeys.lists()
      })

      queryClient.invalidateQueries({
        queryKey: snackKeys.detail(variables.id)
      })
    }
  })
}
```

사용:

```tsx
const { mutateAsync } = useUpdateSnack()

await mutateAsync({
  id,
  data: formData
})
```

이 방식의 장점

```ts
const updateSnack = useUpdateSnack()
```

- Hook이 특정 id에 묶이지 않음
- 여러 row 수정에도 재사용 가능
- bulk action에도 사용 가능
- React Query 공식 예제 스타일과 유사

그래서 현재 네가 만들고 있는 게시판 규모라면 useUpdateSnack() + mutateAsync({ id, data }) 방식이 조금 더 실무적이라고 본다.
