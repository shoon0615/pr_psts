# Next.js + shadcn/ui + nuqs + React Query 필터/정렬/페이지네이션 예제

> 기준: Next.js App Router, shadcn/ui, nuqs, TanStack React Query, axios, zod  
> 목적: 검색 조건, 정렬, 페이지네이션을 URL query string과 동기화하고 React Query 캐싱을 적용하는 구조

---

## 1. 사용 라이브러리 선택 기준

| 라이브러리              | 용도                                     | 적용 여부 |
| ----------------------- | ---------------------------------------- | --------- |
| `shadcn/ui`             | Button, Select, Card, Pagination UI 구성 | 필수      |
| `nuqs`                  | URL query string 상태 관리               | 권장      |
| `@tanstack/react-query` | 목록 데이터 조회, 캐싱, 로딩 상태 관리   | 권장      |
| `axios`                 | API 요청 클라이언트                      | 선택/권장 |
| `zod`                   | Route Handler 또는 서버 입력값 검증      | 권장      |
| `qs`                    | 복잡한 query string 직렬화               | 선택      |

이 예제에서는 `nuqs`를 메인으로 사용합니다.  
`qs`는 아래처럼 배열/중첩 객체 query가 필요할 때만 추가하는 편이 좋습니다.

```ts
// 예: category=1&category=2 또는 filter[brand]=lotte 같은 구조가 필요할 때
import qs from 'qs'

const query = qs.stringify(
  {
    page: 1,
    category: ['cookie', 'chocolate'],
    filter: {
      brand: 'lotte'
    }
  },
  { arrayFormat: 'repeat' }
)
```

단순 검색, 정렬, 페이지네이션은 `nuqs`만으로 충분합니다.

---

## 2. 설치

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools nuqs axios zod
```

shadcn/ui 컴포넌트 예시:

```bash
npx shadcn@latest add button card input select pagination badge skeleton
```

---

## 3. 전체 폴더 구조 예시

```txt
src/
├─ app/
│  ├─ api/
│  │  └─ snacks/
│  │     └─ route.ts
│  ├─ snack/
│  │  └─ page.tsx
│  ├─ layout.tsx
│  └─ providers.tsx
├─ features/
│  └─ snack/
│     ├─ api/
│     │  └─ snack.api.ts
│     ├─ components/
│     │  ├─ snack-filter.tsx
│     │  ├─ snack-list.tsx
│     │  ├─ snack-pagination.tsx
│     │  └─ snack-sort.tsx
│     ├─ hooks/
│     │  ├─ use-snack-query.ts
│     │  └─ use-snack-search-params.ts
│     ├─ schemas/
│     │  └─ snack-search.schema.ts
│     └─ types/
│        └─ snack.type.ts
└─ lib/
   ├─ axios.ts
   └─ react-query.ts
```

---

## 4. React Query Provider 설정

### `src/lib/react-query.ts`

```ts
import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  })
}
```

### `src/app/providers.tsx`

```tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useState } from 'react'
import { makeQueryClient } from '@/lib/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>{children}</NuqsAdapter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Snack List',
  description: 'Filter and pagination example'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

## 5. axios 설정

### `src/lib/axios.ts`

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
})
```

같은 Next.js 앱의 Route Handler를 호출한다면 `baseURL` 없이 `/api/snacks`로 요청해도 됩니다.

---

## 6. 검색 파라미터 타입과 zod 스키마

### `src/features/snack/types/snack.type.ts`

```ts
export type SnackSort = 'createdAt' | 'name' | 'price'
export type SortOrder = 'asc' | 'desc'

export type SnackSearchParams = {
  page: number
  pageSize: number
  keyword: string
  brand: string
  category: string
  sort: SnackSort
  order: SortOrder
}

export type Snack = {
  id: number
  name: string
  brand: string
  category: string
  price: number
  createdAt: string
}

export type SnackListResponse = {
  items: Snack[]
  totalCount: number
  totalPages: number
  page: number
  pageSize: number
}
```

### `src/features/snack/schemas/snack-search.schema.ts`

```ts
import { z } from 'zod'

export const snackSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  keyword: z.string().default(''),
  brand: z.string().default(''),
  category: z.string().default(''),
  sort: z.enum(['createdAt', 'name', 'price']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export type SnackSearchSchema = z.infer<typeof snackSearchSchema>
```

---

## 7. nuqs로 URL 상태 관리

### `src/features/snack/hooks/use-snack-search-params.ts`

```ts
'use client'

import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates
} from 'nuqs'

export const snackSearchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  keyword: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  sort: parseAsStringEnum(['createdAt', 'name', 'price']).withDefault(
    'createdAt'
  ),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
}

export function useSnackSearchParams() {
  const [searchParams, setSearchParams] = useQueryStates(
    snackSearchParamsParsers,
    {
      shallow: false,
      clearOnDefault: true
    }
  )

  const resetSearchParams = () => {
    setSearchParams({
      page: 1,
      pageSize: 10,
      keyword: '',
      brand: '',
      category: '',
      sort: 'createdAt',
      order: 'desc'
    })
  }

  return {
    searchParams,
    setSearchParams,
    resetSearchParams
  }
}
```

### 핵심 포인트

```ts
shallow: false
```

`searchParams` 변경 시 Next.js 서버 컴포넌트 영역까지 다시 반영하고 싶을 때 사용합니다.

```ts
clearOnDefault: true
```

기본값과 같은 query는 URL에서 제거합니다.

예:

```txt
/snack?page=1&keyword=&sort=createdAt
```

위처럼 지저분해지는 것을 줄이고 `/snack`에 가깝게 유지할 수 있습니다.

---

## 8. API 요청 함수

### `src/features/snack/api/snack.api.ts`

```ts
import { api } from '@/lib/axios'
import type { SnackListResponse, SnackSearchParams } from '../types/snack.type'

export const snackKeys = {
  all: ['snacks'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const
}

export async function getSnacks(params: SnackSearchParams) {
  const response = await api.get<SnackListResponse>('/api/snacks', {
    params
  })

  return response.data
}
```

axios는 기본적으로 단순 객체 params를 query string으로 변환합니다.  
배열이나 중첩 객체가 있다면 `qs`를 paramsSerializer로 연결할 수 있습니다.

```ts
import qs from 'qs'

export const api = axios.create({
  paramsSerializer: params =>
    qs.stringify(params, {
      arrayFormat: 'repeat',
      skipNulls: true
    })
})
```

---

## 9. React Query Hook

### `src/features/snack/hooks/use-snack-query.ts`

```ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { getSnacks, snackKeys } from '../api/snack.api'
import type { SnackSearchParams } from '../types/snack.type'

export function useSnackListQuery(params: SnackSearchParams) {
  return useQuery({
    queryKey: snackKeys.list(params),
    queryFn: () => getSnacks(params),
    placeholderData: previousData => previousData
  })
}
```

### `placeholderData`를 쓰는 이유

페이지나 필터가 바뀔 때 이전 목록을 잠깐 유지할 수 있습니다.  
사용자 입장에서는 화면이 매번 비는 느낌이 줄어듭니다.

---

## 10. Route Handler 예제

실제 프로젝트에서는 DB, Prisma, 외부 API 등으로 대체하면 됩니다.

### `src/app/api/snacks/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { snackSearchSchema } from '@/features/snack/schemas/snack-search.schema'
import type { Snack } from '@/features/snack/types/snack.type'

const mockSnacks: Snack[] = [
  {
    id: 1,
    name: '초코칩 쿠키',
    brand: 'lotte',
    category: 'cookie',
    price: 1800,
    createdAt: '2026-05-01'
  },
  {
    id: 2,
    name: '감자칩',
    brand: 'orion',
    category: 'chip',
    price: 2200,
    createdAt: '2026-05-02'
  },
  {
    id: 3,
    name: '웨하스',
    brand: 'haitai',
    category: 'wafer',
    price: 1500,
    createdAt: '2026-05-03'
  }
]

export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams)
  const params = snackSearchSchema.parse(rawParams)

  const filtered = mockSnacks
    .filter(item => {
      if (params.keyword && !item.name.includes(params.keyword)) return false
      if (params.brand && item.brand !== params.brand) return false
      if (params.category && item.category !== params.category) return false
      return true
    })
    .sort((a, b) => {
      const aValue = a[params.sort]
      const bValue = b[params.sort]

      if (aValue < bValue) return params.order === 'asc' ? -1 : 1
      if (aValue > bValue) return params.order === 'asc' ? 1 : -1
      return 0
    })

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const items = filtered.slice(start, end)
  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / params.pageSize)

  return NextResponse.json({
    items,
    totalCount,
    totalPages,
    page: params.page,
    pageSize: params.pageSize
  })
}
```

---

## 11. 필터 컴포넌트

### `src/features/snack/components/snack-filter.tsx`

```tsx
'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useSnackSearchParams } from '../hooks/use-snack-search-params'

const ALL = 'all'

export function SnackFilter() {
  const { searchParams, setSearchParams, resetSearchParams } =
    useSnackSearchParams()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const keyword = String(formData.get('keyword') ?? '')

    setSearchParams({
      keyword,
      page: 1
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto_auto]">
          <Input
            name="keyword"
            placeholder="과자명 검색"
            defaultValue={searchParams.keyword}
          />

          <Select
            value={searchParams.brand || ALL}
            onValueChange={value => {
              setSearchParams({
                brand: value === ALL ? '' : value,
                page: 1
              })
            }}>
            <SelectTrigger>
              <SelectValue placeholder="브랜드" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>전체 브랜드</SelectItem>
              <SelectItem value="lotte">롯데</SelectItem>
              <SelectItem value="orion">오리온</SelectItem>
              <SelectItem value="haitai">해태</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={searchParams.category || ALL}
            onValueChange={value => {
              setSearchParams({
                category: value === ALL ? '' : value,
                page: 1
              })
            }}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>전체 카테고리</SelectItem>
              <SelectItem value="cookie">쿠키</SelectItem>
              <SelectItem value="chip">칩</SelectItem>
              <SelectItem value="wafer">웨하스</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            검색
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetSearchParams}>
            초기화
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### shadcn/ui Select 빈 값 주의

shadcn/ui Select의 `SelectItem value=""`는 사용할 수 없습니다.  
그래서 위 예제처럼 `all` 같은 별도 값을 두고 내부 상태에서는 `''`로 변환하는 방식을 사용합니다.

```tsx
const ALL = 'all'

<SelectItem value={ALL}>전체</SelectItem>
```

---

## 12. 정렬 컴포넌트

### `src/features/snack/components/snack-sort.tsx`

```tsx
'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useSnackSearchParams } from '../hooks/use-snack-search-params'

export function SnackSort() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <div className="flex items-center gap-2">
      <Select
        value={searchParams.sort}
        onValueChange={value => {
          setSearchParams({
            sort: value as typeof searchParams.sort,
            page: 1
          })
        }}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">등록일</SelectItem>
          <SelectItem value="name">이름</SelectItem>
          <SelectItem value="price">가격</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.order}
        onValueChange={value => {
          setSearchParams({
            order: value as typeof searchParams.order,
            page: 1
          })
        }}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="정렬 방향" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">내림차순</SelectItem>
          <SelectItem value="asc">오름차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

---

## 13. 목록 컴포넌트

### `src/features/snack/components/snack-list.tsx`

```tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSnackListQuery } from '../hooks/use-snack-query'
import { useSnackSearchParams } from '../hooks/use-snack-search-params'

export function SnackList() {
  const { searchParams } = useSnackSearchParams()
  const { data, isLoading, isFetching, isError } =
    useSnackListQuery(searchParams)

  if (isLoading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-20 w-full"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border p-6 text-sm text-red-500">
        목록 조회 중 문제가 발생했습니다.
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border p-6 text-sm">
        조회된 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {isFetching && (
        <p className="text-muted-foreground text-sm">목록을 갱신하는 중...</p>
      )}

      {data.items.map(item => (
        <Card key={item.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-muted-foreground text-sm">
                {item.brand} · {item.category}
              </p>
            </div>
            <Badge variant="secondary">{item.price.toLocaleString()}원</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## 14. 페이지네이션 컴포넌트

### `src/features/snack/components/snack-pagination.tsx`

```tsx
'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { useSnackListQuery } from '../hooks/use-snack-query'
import { useSnackSearchParams } from '../hooks/use-snack-search-params'

export function SnackPagination() {
  const { searchParams, setSearchParams } = useSnackSearchParams()
  const { data } = useSnackListQuery(searchParams)

  if (!data || data.totalPages <= 1) return null

  const currentPage = searchParams.page
  const totalPages = data.totalPages

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  function movePage(page: number) {
    if (page < 1 || page > totalPages) return
    setSearchParams({ page })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={event => {
              event.preventDefault()
              movePage(currentPage - 1)
            }}
          />
        </PaginationItem>

        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={event => {
                event.preventDefault()
                movePage(page)
              }}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={event => {
              event.preventDefault()
              movePage(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

### 페이지가 많을 때

실무에서는 모든 페이지 번호를 한 번에 렌더링하지 않고 아래처럼 일부만 보여주는 함수를 따로 둡니다.

```ts
export function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
```

그리고 `pages`를 아래처럼 바꿉니다.

```ts
const pages = getPaginationRange(currentPage, totalPages)
```

---

## 15. Page 구성

### `src/app/snack/page.tsx`

```tsx
import { SnackFilter } from '@/features/snack/components/snack-filter'
import { SnackList } from '@/features/snack/components/snack-list'
import { SnackPagination } from '@/features/snack/components/snack-pagination'
import { SnackSort } from '@/features/snack/components/snack-sort'

export default function SnackPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">과자 목록</h1>
        <p className="text-muted-foreground text-sm">
          필터, 정렬, 페이지네이션이 URL query string과 동기화됩니다.
        </p>
      </div>

      <SnackFilter />

      <div className="flex justify-end">
        <SnackSort />
      </div>

      <SnackList />

      <SnackPagination />
    </main>
  )
}
```

---

## 16. Server Component prefetch를 추가하고 싶다면

위 예제는 Client Component에서 React Query를 바로 호출하는 가장 단순한 구조입니다.

초기 진입 시 서버에서 미리 데이터를 가져오고 싶다면 아래 흐름을 사용합니다.

```txt
Server Component page.tsx
→ queryClient.prefetchQuery()
→ dehydrate(queryClient)
→ HydrationBoundary
→ Client Component에서 useQuery()
```

예시:

```tsx
import {
  HydrationBoundary,
  QueryClient,
  dehydrate
} from '@tanstack/react-query'
import { SnackList } from '@/features/snack/components/snack-list'
import { getSnacks, snackKeys } from '@/features/snack/api/snack.api'
import { snackSearchSchema } from '@/features/snack/schemas/snack-search.schema'

export default async function SnackPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const params = snackSearchSchema.parse(rawParams)

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: snackKeys.list(params),
    queryFn: () => getSnacks(params)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackList />
    </HydrationBoundary>
  )
}
```

다만 이 방식은 `getSnacks()`가 서버에서도 호출 가능해야 합니다.  
상대 경로 `/api/snacks`를 axios로 서버에서 호출하면 base URL 문제가 생길 수 있으므로, 실무에서는 아래 둘 중 하나를 선택합니다.

1. 서버에서는 service/repository를 직접 호출한다.
2. 서버 호출용 fetcher와 클라이언트 호출용 axios fetcher를 분리한다.

초기 학습/작은 프로젝트에서는 Client Query 방식으로 시작해도 충분합니다.

---

## 17. 실무 기준 권장 흐름

### 단순 목록 페이지

```txt
nuqs + React Query + shadcn/ui
```

권장합니다.

- URL 공유 가능
- 뒤로 가기/앞으로 가기 자연스러움
- 필터/정렬/페이지네이션 상태가 명확함
- React Query 캐싱으로 같은 조건 재조회 비용 감소

### 필터 조건이 많고 복잡한 경우

```txt
nuqs + React Query + zod + qs
```

`brand=lotte&category=cookie` 정도면 `qs`는 굳이 필요 없습니다.  
다만 아래 구조라면 `qs`를 고려합니다.

```txt
category=chip&category=cookie
price[min]=1000&price[max]=5000
sort[0][field]=createdAt&sort[0][order]=desc
```

### 폼 검증까지 강하게 필요한 경우

```txt
react-hook-form + zod + nuqs + React Query
```

검색 폼이 단순하면 `react-hook-form`까지는 과합니다.  
등록/수정 폼에는 `react-hook-form`을 쓰고, 검색 폼은 일반 `<form>`과 `FormData` 또는 controlled input으로 처리해도 충분합니다.

---

## 18. 핵심 정리

```txt
검색 조건 상태: nuqs
목록 조회/캐싱: React Query
UI: shadcn/ui
API 요청: axios 또는 fetch
서버 입력 검증: zod
복잡한 query string: qs 선택 적용
```

이 조합이면 게시판, 상품 목록, 과자 목록 같은 CRUD 기반 목록 화면에서 필터/정렬/페이지네이션을 안정적으로 구성할 수 있습니다.

---

## 19. 추천 패턴

### Query Key

```ts
export const snackKeys = {
  all: ['snacks'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const
}
```

검색 조건이 query key에 들어가야 조건별 캐싱이 분리됩니다.

### 필터 변경 시 page 초기화

```ts
setSearchParams({
  brand: 'lotte',
  page: 1
})
```

필터가 바뀌었는데 기존 `page=5`를 유지하면 빈 결과가 나올 수 있습니다.

### 정렬 변경 시 page 초기화

```ts
setSearchParams({
  sort: 'price',
  order: 'asc',
  page: 1
})
```

정렬 기준이 바뀌면 사용자가 보는 목록의 의미가 달라지므로 보통 1페이지로 돌립니다.

### 초기화

```ts
setSearchParams({
  page: 1,
  pageSize: 10,
  keyword: '',
  brand: '',
  category: '',
  sort: 'createdAt',
  order: 'desc'
})
```

`clearOnDefault: true`를 쓰면 기본값에 해당하는 query는 URL에서 제거됩니다.

---

## 20. 주의할 점

### 1. `SelectItem value=""` 사용 금지

shadcn/ui Select는 빈 문자열 value를 허용하지 않습니다.

```tsx
// 비권장
<SelectItem value="">전체</SelectItem>

// 권장
<SelectItem value="all">전체</SelectItem>
```

그리고 상태로 넣을 때만 `''`로 변환합니다.

```ts
brand: value === 'all' ? '' : value
```

### 2. 검색/필터/정렬 변경 시 `page: 1`

기존 페이지를 유지하면 빈 목록이 나올 수 있습니다.

### 3. React Query key에 params 객체 포함

```ts
queryKey: snackKeys.list(params)
```

이렇게 해야 query string 조건별로 캐시가 나뉩니다.

### 4. 서버와 클라이언트의 params schema 일치

`nuqs` parser와 `zod` schema의 기본값이 다르면 예상치 못한 결과가 나올 수 있습니다.

예:

```ts
// nuqs 기본값
pageSize: 10

// zod 기본값도 동일하게
pageSize: z.coerce.number().default(10)
```

---

## 21. 결론

이 예제의 기본 조합은 아래와 같습니다.

```txt
Next.js App Router
+ shadcn/ui
+ nuqs
+ TanStack React Query
+ axios
+ zod
```

`qs`는 기본 예제에는 필수는 아니지만, 배열/중첩 query string을 다루는 순간 추가할 가치가 있습니다.

---

실무 기준

보통 둘 중 하나만 선택합니다.

1. Link 기반

```tsx
<PaginationPrevious href={`?page=${page - 1}`} />
```

- SEO 필요
- 페이지 번호 링크 공유 가능
- 검색 엔진 크롤링 가능

2. nuqs 기반

```tsx
<PaginationPrevious
  onClick={() =>
    setSearchParams({
      page: page - 1
    })
  }
/>
```

- React Query 조합
- 필터/정렬/검색과 함께 관리
- 현재 사용 중인 구조와 가장 잘 맞음

3. event.preventDefault()

```tsx
<PaginationPrevious
  href={`?page=${page - 1}`}
  onClick={() => {
    setSearchParams({
      ...searchParams,
      page: page - 1
    })
  }}
/>
```

이렇게 하면 클릭 시

1. setSearchParams() 실행
2. <Link> 네비게이션 실행

두 개의 URL 변경 로직이 동시에 동작합니다.

```tsx
<PaginationPrevious
  // href="#"
  onClick={event => {
    event.preventDefault()
    setSearchParams({
      ...searchParams,
      page: searchParams.page - 1
    })
  }}
/>
```

> 내부적으로 Link → 최종적으로 <a \/> 태그가 렌더링
>
> > 즉, 현재 코드에서는 없어도 동작할 가능성이 높지만, href="#" 의 기본 동작을 명확히 차단하려면 넣는 것이 맞습니다.
