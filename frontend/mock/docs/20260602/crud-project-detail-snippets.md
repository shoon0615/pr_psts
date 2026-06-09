# CRUD 서비스 프로젝트 상세 구조 및 스니핏 리포트

이 문서는 Next.js + `qs` + `nuqs` + `React Query` + `React Hook Form` + `Zod` 기반 CRUD 서비스의 상세 구현 예시입니다.
예시는 `snack` 도메인을 기준으로 작성했습니다.

## 1. 설치 권장 라이브러리

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools axios qs nuqs zod react-hook-form @hookform/resolvers sonner zustand
pnpm add -D @types/qs
```

실서비스 DB까지 포함한다면 다음을 추가합니다.

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

인증까지 포함한다면 회원 문서 기준으로 다음을 검토합니다.

```bash
pnpm add next-auth bcryptjs
pnpm add -D @types/bcryptjs
```

## 2. 타입과 스키마

### 2.1 검색 파라미터 스키마

```ts
// features/snack/schemas/snack-search-params.schema.ts
import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs'

export const snackSearchParamsSchema = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  keyword: parseAsString.withDefault(''),
  sort: parseAsStringEnum(['createdAt', 'title', 'price']).withDefault(
    'createdAt'
  ),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
}
```

### 2.2 API 요청 검증 스키마

```ts
// features/snack/schemas/snack-api.schema.ts
import { z } from 'zod'

export const snackApiSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  brand: z.string().optional().default(''),
  category: z.string().optional().default(''),
  keyword: z.string().optional().default(''),
  sort: z.enum(['createdAt', 'title', 'price']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export type SnackSearchParams = z.infer<typeof snackApiSearchParamsSchema>
```

### 2.3 생성/수정 폼 스키마

```ts
// features/snack/schemas/snack-form.schema.ts
import { z } from 'zod'

export const snackFormSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력해주세요.').max(32),
  brand: z.string().min(1, '브랜드를 선택해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  contents: z.string().optional(),
  price: z.coerce.number().int().min(0, '가격은 0원 이상이어야 합니다.'),
  published: z.boolean().default(true)
})

export type SnackFormInput = z.infer<typeof snackFormSchema>
```

## 3. Query String 유틸

```ts
// shared/lib/qs.ts
import qs from 'qs'

export const removeEmptyQueryParams = <T extends object>(params: T) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}

export const toQueryString = <T extends object>(params: T) => {
  return qs.stringify(removeEmptyQueryParams(params), {
    addQueryPrefix: true,
    arrayFormat: 'repeat'
  })
}
```

주의할 점은 `0`은 유효한 값일 수 있으므로 `!value`로 필터링하지 않는 것입니다.

## 4. Repository

```ts
// features/snack/repositories/snack.repository.ts
import { api } from '@/shared/lib/axios/api'
import { toQueryString } from '@/shared/lib/qs'
import type { SnackFormInput } from '../schemas/snack-form.schema'
import type { SnackSearchParams } from '../schemas/snack-api.schema'

export type Snack = {
  id: string
  title: string
  brand: string
  category: string
  contents?: string
  price: number
  published: boolean
  createdAt: string
}

export type SnackListResponse = {
  data: Snack[]
  meta: {
    page: number
    perPage: number
    totalCount: number
    totalPages: number
  }
}

export const snackRepository = {
  list: async (params: SnackSearchParams) => {
    const queryString = toQueryString(params)
    const res = await api.get<SnackListResponse>(`/snacks${queryString}`)
    return res.data
  },

  detail: async (id: string) => {
    const res = await api.get<Snack>(`/snacks/${id}`)
    return res.data
  },

  create: async (input: SnackFormInput) => {
    const res = await api.post<Snack>('/snacks', input)
    return res.data
  },

  update: async (id: string, input: SnackFormInput) => {
    const res = await api.put<Snack>(`/snacks/${id}`, input)
    return res.data
  },

  remove: async (id: string) => {
    await api.delete(`/snacks/${id}`)
  }
}
```

## 5. Query Keys와 Query Options

```ts
// features/snack/queries/snack.query.ts
import { queryOptions } from '@tanstack/react-query'
import { snackRepository } from '../repositories/snack.repository'
import type { SnackSearchParams } from '../schemas/snack-api.schema'

export const snackKeys = {
  all: ['snacks'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, 'detail'] as const,
  detail: (id: string) => [...snackKeys.details(), id] as const
}

export const snackListQueryOptions = (params: SnackSearchParams) =>
  queryOptions({
    queryKey: snackKeys.list(params),
    queryFn: () => snackRepository.list(params)
  })

export const snackDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: snackKeys.detail(id),
    queryFn: () => snackRepository.detail(id)
  })
```

## 6. Hooks

```ts
// features/snack/hooks/snack.hooks.ts
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { snackRepository } from '../repositories/snack.repository'
import type { SnackSearchParams } from '../schemas/snack-api.schema'
import type { SnackFormInput } from '../schemas/snack-form.schema'
import {
  snackDetailQueryOptions,
  snackKeys,
  snackListQueryOptions
} from '../queries/snack.query'

export const useSnackList = (params: SnackSearchParams) => {
  return useSuspenseQuery(snackListQueryOptions(params))
}

export const useSnackDetail = (id: string) => {
  return useSuspenseQuery(snackDetailQueryOptions(id))
}

export const useCreateSnack = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SnackFormInput) => snackRepository.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
      toast.success('등록되었습니다.')
      router.replace('/snack')
    },
    onError: () => {
      toast.error('등록에 실패했습니다.')
    }
  })
}

export const useUpdateSnack = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SnackFormInput) => snackRepository.update(id, input),
    onSuccess: async data => {
      queryClient.setQueryData(snackKeys.detail(id), data)
      await queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
      toast.success('수정되었습니다.')
      router.replace(`/snack/${id}`)
    },
    onError: () => {
      toast.error('수정에 실패했습니다.')
    }
  })
}

export const useDeleteSnack = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => snackRepository.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
      toast.success('삭제되었습니다.')
      router.replace('/snack')
    },
    onError: () => {
      toast.error('삭제에 실패했습니다.')
    }
  })
}
```

## 7. Prefetch

```ts
// features/snack/prefetch/snack.prefetch.ts
import { QueryClient } from '@tanstack/react-query'
import {
  snackDetailQueryOptions,
  snackListQueryOptions
} from '../queries/snack.query'
import type { SnackSearchParams } from '../schemas/snack-api.schema'

export const prefetchSnackList = async (
  queryClient: QueryClient,
  params: SnackSearchParams
) => {
  await queryClient.prefetchQuery(snackListQueryOptions(params))
}

export const prefetchSnackDetail = async (
  queryClient: QueryClient,
  id: string
) => {
  await queryClient.prefetchQuery(snackDetailQueryOptions(id))
}
```

## 8. 목록 페이지

```tsx
// app/(default-layout)/(main)/snack/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/lib/query-client'
import { snackApiSearchParamsSchema } from '@/features/snack/schemas/snack-api.schema'
import { prefetchSnackList } from '@/features/snack/prefetch/snack.prefetch'
import { SnackSearch } from '@/features/snack/components/snack-search'
import { SnackSort } from '@/features/snack/components/snack-sort'
import { SnackList } from '@/features/snack/components/snack-list'
import { SnackPagination } from '@/features/snack/components/snack-pagination'

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const rawSearchParams = await searchParams
  const params = snackApiSearchParamsSchema.parse(rawSearchParams)

  const queryClient = getQueryClient()
  await prefetchSnackList(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <SnackSearch />
        <SnackSort />
        <SnackList params={params} />
        <SnackPagination params={params} />
      </div>
    </HydrationBoundary>
  )
}
```

## 9. Search 컴포넌트

```tsx
// features/snack/components/snack-search.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useQueryStates } from 'nuqs'
import { snackSearchParamsSchema } from '../schemas/snack-search-params.schema'

export function SnackSearch() {
  const [searchParams, setSearchParams] = useQueryStates(
    snackSearchParamsSchema
  )

  const form = useForm({
    defaultValues: {
      brand: searchParams.brand,
      category: searchParams.category,
      keyword: searchParams.keyword
    }
  })

  const onSubmit = form.handleSubmit(values => {
    setSearchParams({
      ...values,
      page: 1
    })
  })

  const onReset = () => {
    form.reset({ brand: '', category: '', keyword: '' })
    setSearchParams({ brand: null, category: null, keyword: null, page: 1 })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-2">
      <input
        {...form.register('keyword')}
        placeholder="검색어"
      />
      <button type="submit">검색</button>
      <button
        type="button"
        onClick={onReset}>
        초기화
      </button>
    </form>
  )
}
```

## 10. Sort 컴포넌트

```tsx
// features/snack/components/snack-sort.tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParamsSchema } from '../schemas/snack-search-params.schema'

const SORT_OPTIONS = [
  { label: '최신순', sort: 'createdAt', order: 'desc' },
  { label: '이름순', sort: 'title', order: 'asc' },
  { label: '가격 높은순', sort: 'price', order: 'desc' },
  { label: '가격 낮은순', sort: 'price', order: 'asc' }
] as const

export function SnackSort() {
  const [params, setParams] = useQueryStates(snackSearchParamsSchema)

  const value = `${params.sort}:${params.order}`

  return (
    <select
      value={value}
      onChange={event => {
        const [sort, order] = event.target.value.split(':')
        setParams({
          sort: sort as typeof params.sort,
          order: order as typeof params.order,
          page: 1
        })
      }}>
      {SORT_OPTIONS.map(option => (
        <option
          key={`${option.sort}:${option.order}`}
          value={`${option.sort}:${option.order}`}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
```

## 11. List 컴포넌트

```tsx
// features/snack/components/snack-list.tsx
'use client'

import { useSnackList } from '../hooks/snack.hooks'
import type { SnackSearchParams } from '../schemas/snack-api.schema'

export function SnackList({ params }: { params: SnackSearchParams }) {
  const { data } = useSnackList(params)

  if (data.data.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        조회된 데이터가 없습니다.
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {data.data.map(snack => (
        <li
          key={snack.id}
          className="rounded-md border p-4">
          <p className="font-bold">{snack.title}</p>
          <p>{snack.price.toLocaleString('ko-KR')}원</p>
        </li>
      ))}
    </ul>
  )
}
```

## 12. Form 컴포넌트

```tsx
// features/snack/components/snack-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  snackFormSchema,
  type SnackFormInput
} from '../schemas/snack-form.schema'
import { useCreateSnack, useUpdateSnack } from '../hooks/snack.hooks'

type SnackFormProps = {
  mode: 'create' | 'edit'
  id?: string
  defaultValues?: SnackFormInput
}

const DEFAULT_VALUES: SnackFormInput = {
  title: '',
  brand: '',
  category: '',
  contents: '',
  price: 0,
  published: true
}

export function SnackForm({
  mode,
  id,
  defaultValues = DEFAULT_VALUES
}: SnackFormProps) {
  const createMutation = useCreateSnack()
  const updateMutation = useUpdateSnack(id ?? '')

  const form = useForm<SnackFormInput>({
    resolver: zodResolver(snackFormSchema),
    defaultValues
  })

  const onSubmit = form.handleSubmit(values => {
    if (mode === 'create') {
      createMutation.mutate(values)
      return
    }

    if (!id) return
    updateMutation.mutate(values)
  })

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4">
      <input
        {...form.register('title')}
        placeholder="제목"
      />
      <input
        {...form.register('brand')}
        placeholder="브랜드"
      />
      <input
        {...form.register('category')}
        placeholder="카테고리"
      />
      <textarea
        {...form.register('contents')}
        placeholder="내용"
      />
      <input
        inputMode="numeric"
        {...form.register('price')}
        placeholder="가격"
      />
      <button
        type="submit"
        disabled={form.formState.isSubmitting}>
        {mode === 'create' ? '등록' : '수정'}
      </button>
    </form>
  )
}
```

## 13. Route Handler 예시

```ts
// app/api/snacks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { snackApiSearchParamsSchema } from '@/features/snack/schemas/snack-api.schema'
import { snackFormSchema } from '@/features/snack/schemas/snack-form.schema'

export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams)
  const params = snackApiSearchParamsSchema.parse(rawParams)

  // TODO: service.list(params)
  return NextResponse.json({
    data: [],
    meta: {
      page: params.page,
      perPage: 10,
      totalCount: 0,
      totalPages: 0
    }
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const input = snackFormSchema.parse(body)

  // TODO: service.create(input)
  return NextResponse.json(
    { id: crypto.randomUUID(), ...input },
    { status: 201 }
  )
}
```

```ts
// app/api/snacks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { snackFormSchema } from '@/features/snack/schemas/snack-form.schema'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  // TODO: service.detail(id)
  return NextResponse.json({ id })
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()
  const input = snackFormSchema.parse(body)

  // TODO: service.update(id, input)
  return NextResponse.json({ id, ...input })
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  // TODO: service.remove(id)
  return NextResponse.json({ id })
}
```

## 14. CRUD 공통 컴포넌트 후보

| 컴포넌트              | 역할               | 재사용 기준                      |
| :-------------------- | :----------------- | :------------------------------- |
| `EmptyState`          | 데이터 없음 표시   | 목록, 검색 결과 없음, 권한 없음  |
| `ErrorState`          | 조회 실패 표시     | query error boundary와 함께 사용 |
| `ConfirmDialogButton` | 삭제 확인          | 삭제, 취소, 위험 작업            |
| `Pagination`          | 페이지 이동        | query string 유지 필요           |
| `DataTable`           | 표 기반 목록       | 관리자성 CRUD에 적합             |
| `Field`               | Form field wrapper | label, error message 통일        |
| `PriceText`           | 가격 표시          | `toLocaleString('ko-KR')` 래핑   |

## 15. 실무 적용 체크리스트

- [ ] list/detail/create/update/delete queryKey 규칙이 명확한가?
- [ ] 검색 조건 변경 시 page가 1로 초기화되는가?
- [ ] 삭제 후 상세 페이지에 남지 않고 목록으로 이동하는가?
- [ ] 수정 후 detail cache를 갱신하거나 invalidate하는가?
- [ ] `0`, `false` 같은 유효 값이 빈 값 제거 로직에서 제거되지 않는가?
- [ ] 등록/수정 폼의 `defaultValues` 타입이 Zod schema와 일치하는가?
- [ ] API 응답의 `meta.totalPages`가 Pagination과 일치하는가?
- [ ] `notFound()`와 일반 empty state를 구분했는가?

## 참고 기준

- Next.js App Router / Server Actions: https://nextjs.org/docs/app
- Next.js `useSearchParams`: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- TanStack Query SSR / Hydration: https://tanstack.com/query/v5/docs/framework/react/guides/ssr
- TanStack Query Advanced SSR: https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr
- nuqs: https://nuqs.dev/
- React Hook Form: https://react-hook-form.com/docs/useform
- React Hook Form Resolvers: https://github.com/react-hook-form/resolvers
- Zod: https://zod.dev/
- qs: https://github.com/ljharb/qs
- Prisma + Next.js: https://www.prisma.io/docs/guides/frameworks/nextjs
- Auth.js / NextAuth.js: https://authjs.dev/reference/nextjs
- Zustand: https://zustand.docs.pmnd.rs/
- Sonner: https://ui.shadcn.com/docs/components/sonner
