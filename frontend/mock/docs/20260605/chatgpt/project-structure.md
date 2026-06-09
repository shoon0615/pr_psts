# Project Structure

## 목적

이 문서는 Next.js(App Router) 기반 CRUD 프로젝트에서 `snack`, `board`, `auth` 기능을 어떤 구조로 배치하고, 각 파일이 어떤 책임을 가지는지 정리한 최종 구조 문서다.

기준 기술 스택은 다음과 같다.

- Next.js App Router
- TypeScript
- React Query
- React Hook Form
- Zod
- shadcn/ui
- Auth.js / NextAuth
- json-server 또는 Route Handler 기반 API
- 추후 Prisma / DB 전환 가능 구조

---

# 최종 권장 구조

```text
src
├─ app
│  ├─ (default-layout)
│  │  ├─ (main)
│  │  │  ├─ snack
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ new
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  │
│  │  │  ├─ board
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ new
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  │
│  │  │  └─ mypage
│  │  │     └─ page.tsx
│  │  │
│  │  └─ (public)
│  │     ├─ signin
│  │     │  └─ page.tsx
│  │     └─ signup
│  │        └─ page.tsx
│  │
│  └─ api
│     ├─ snacks
│     │  ├─ route.ts
│     │  └─ [id]
│     │     └─ route.ts
│     ├─ boards
│     │  ├─ route.ts
│     │  └─ [id]
│     │     └─ route.ts
│     └─ auth
│        └─ [...nextauth]
│           └─ route.ts
│
├─ features
│  ├─ snack
│  ├─ board
│  └─ auth
│
├─ shared
│  ├─ components
│  ├─ constants
│  ├─ hooks
│  ├─ lib
│  ├─ providers
│  ├─ types
│  └─ utils
│
└─ service
```

---

# 핵심 원칙

## app

라우팅과 페이지 진입점만 담당한다.

`page.tsx`에서는 가능한 한 다음 작업만 수행한다.

- searchParams 파싱
- prefetch
- HydrationBoundary 구성
- feature 컴포넌트 렌더링

비즈니스 로직은 `app`에 두지 않는다.

---

## features

도메인별 기능을 관리한다.

```text
features/snack
features/board
features/auth
```

각 feature는 자기 기능의 컴포넌트, schema, query, mutation, service를 가진다.

---

## shared

여러 feature에서 재사용되는 공통 코드만 둔다.

예:

- Button
- Form
- Pagination
- EmptyState
- AlertDialog
- QueryProvider
- api client
- 공통 타입
- 공통 formatter

---

# Snack 구조

## 폴더 구조

```text
features/snack
├─ components
│  ├─ snack-list.tsx
│  ├─ snack-search.tsx
│  ├─ snack-form.tsx
│  ├─ snack-detail.tsx
│  ├─ snack-pagination.tsx
│  └─ snack-empty.tsx
│
├─ queries
│  ├─ snack-keys.ts
│  └─ snack-query-options.ts
│
├─ mutations
│  └─ use-snack-mutations.ts
│
├─ schemas
│  └─ snack.schema.ts
│
├─ services
│  └─ snack.service.ts
│
└─ types
   └─ snack.type.ts
```

---

## snack type

```ts
export type Snack = {
  id: string
  title: string
  brand: string
  category: string
  contents?: string
  price: number
  createdAt: string
  updatedAt?: string
}

export type SnackSearchParams = {
  page: number
  brand?: string
  category?: string
  contents?: string
  sort?: 'title' | 'price' | 'createdAt'
  order?: 'asc' | 'desc'
}

export type SnackListResponse = {
  data: Snack[]
  totalCount: number
}
```

---

## snack schema

```ts
import { z } from 'zod'

export const createSnackSchema = z.object({
  title: z
    .string()
    .min(2, '제목은 2자 이상 입력해주세요.')
    .max(32, '제목은 32자 이하로 입력해주세요.'),
  brand: z.string().min(1, '브랜드를 선택해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  contents: z.string().optional(),
  price: z.coerce
    .number()
    .min(0, '가격은 0원 이상이어야 합니다.')
})

export const updateSnackSchema = createSnackSchema.partial()

export type CreateSnackInput = z.infer<typeof createSnackSchema>
export type UpdateSnackInput = z.infer<typeof updateSnackSchema>
```

---

## snack query key

```ts
import type { SnackSearchParams } from '../types/snack.type'

export const snackKeys = {
  all: ['snacks'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, 'detail'] as const,
  detail: (id: string) => [...snackKeys.details(), id] as const
}
```

---

## snack service

```ts
import { api } from '@/shared/lib/api'
import { toQueryString } from '@/shared/utils/query-string'
import type {
  Snack,
  SnackListResponse,
  SnackSearchParams
} from '../types/snack.type'
import type {
  CreateSnackInput,
  UpdateSnackInput
} from '../schemas/snack.schema'

export const snackService = {
  getList: async (params: SnackSearchParams): Promise<SnackListResponse> => {
    const response = await api.get(`/snacks${toQueryString(params)}`)

    return {
      data: response.data,
      totalCount: Number(response.headers['x-total-count'] ?? 0)
    }
  },

  getDetail: async (id: string): Promise<Snack> => {
    const response = await api.get(`/snacks/${id}`)
    return response.data
  },

  create: async (input: CreateSnackInput): Promise<Snack> => {
    const response = await api.post('/snacks', input)
    return response.data
  },

  update: async (id: string, input: UpdateSnackInput): Promise<Snack> => {
    const response = await api.patch(`/snacks/${id}`, input)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/snacks/${id}`)
  }
}
```

---

## snack query options

```ts
import { queryOptions } from '@tanstack/react-query'
import { snackKeys } from './snack-keys'
import { snackService } from '../services/snack.service'
import type { SnackSearchParams } from '../types/snack.type'

export const snackListQueryOptions = (params: SnackSearchParams) =>
  queryOptions({
    queryKey: snackKeys.list(params),
    queryFn: () => snackService.getList(params)
  })

export const snackDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: snackKeys.detail(id),
    queryFn: () => snackService.getDetail(id)
  })
```

---

## snack list page

```tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { SnackSearch } from '@/features/snack/components/snack-search'
import { SnackList } from '@/features/snack/components/snack-list'
import { snackListQueryOptions } from '@/features/snack/queries/snack-query-options'
import type { SnackSearchParams } from '@/features/snack/types/snack.type'

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SnackPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const params: SnackSearchParams = {
    page: Number(resolvedSearchParams.page ?? 1),
    brand: String(resolvedSearchParams.brand ?? ''),
    category: String(resolvedSearchParams.category ?? ''),
    contents: String(resolvedSearchParams.contents ?? ''),
    sort: 'createdAt',
    order: 'desc'
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(snackListQueryOptions(params))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackSearch />
      <SnackList params={params} />
    </HydrationBoundary>
  )
}
```

---

## snack list component

```tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { snackListQueryOptions } from '../queries/snack-query-options'
import type { SnackSearchParams } from '../types/snack.type'

type SnackListProps = {
  params: SnackSearchParams
}

export function SnackList({ params }: SnackListProps) {
  const { data } = useSuspenseQuery(snackListQueryOptions(params))

  if (data.data.length === 0) {
    return <div>등록된 스낵이 없습니다.</div>
  }

  return (
    <ul>
      {data.data.map(snack => (
        <li key={snack.id}>
          {snack.title} / {snack.price.toLocaleString('ko-KR')}원
        </li>
      ))}
    </ul>
  )
}
```

---

# Board 구조

## 폴더 구조

```text
features/board
├─ components
│  ├─ board-list.tsx
│  ├─ board-search.tsx
│  ├─ board-form.tsx
│  ├─ board-detail.tsx
│  ├─ board-pagination.tsx
│  └─ board-empty.tsx
│
├─ queries
│  ├─ board-keys.ts
│  └─ board-query-options.ts
│
├─ mutations
│  └─ use-board-mutations.ts
│
├─ schemas
│  └─ board.schema.ts
│
├─ services
│  └─ board.service.ts
│
└─ types
   └─ board.type.ts
```

---

## board type

```ts
export type Board = {
  id: string
  title: string
  contents: string
  authorId: string
  authorName?: string
  hits: number
  published: boolean
  createdAt: string
  updatedAt?: string
}

export type BoardSearchParams = {
  page: number
  keyword?: string
  published?: boolean
  sort?: 'createdAt' | 'title' | 'hits'
  order?: 'asc' | 'desc'
}

export type BoardListResponse = {
  data: Board[]
  totalCount: number
}
```

---

## board schema

```ts
import { z } from 'zod'

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(2, '제목은 2자 이상 입력해주세요.')
    .max(100, '제목은 100자 이하로 입력해주세요.'),
  contents: z
    .string()
    .min(1, '내용을 입력해주세요.'),
  published: z.boolean().default(true)
})

export const updateBoardSchema = createBoardSchema.partial()

export type CreateBoardInput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>
```

---

## board service

```ts
import { api } from '@/shared/lib/api'
import { toQueryString } from '@/shared/utils/query-string'
import type {
  Board,
  BoardListResponse,
  BoardSearchParams
} from '../types/board.type'
import type {
  CreateBoardInput,
  UpdateBoardInput
} from '../schemas/board.schema'

export const boardService = {
  getList: async (params: BoardSearchParams): Promise<BoardListResponse> => {
    const response = await api.get(`/boards${toQueryString(params)}`)

    return {
      data: response.data,
      totalCount: Number(response.headers['x-total-count'] ?? 0)
    }
  },

  getDetail: async (id: string): Promise<Board> => {
    const response = await api.get(`/boards/${id}`)
    return response.data
  },

  create: async (input: CreateBoardInput): Promise<Board> => {
    const response = await api.post('/boards', input)
    return response.data
  },

  update: async (id: string, input: UpdateBoardInput): Promise<Board> => {
    const response = await api.patch(`/boards/${id}`, input)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`)
  }
}
```

---

# Auth 구조

## 폴더 구조

```text
features/auth
├─ components
│  ├─ signin-form.tsx
│  ├─ signup-form.tsx
│  ├─ user-menu.tsx
│  └─ auth-guard.tsx
│
├─ actions
│  └─ auth.action.ts
│
├─ schemas
│  └─ auth.schema.ts
│
├─ services
│  └─ user.service.ts
│
└─ types
   └─ auth.type.ts
```

---

## auth schema

```ts
import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.')
})

export const signupSchema = signinSchema
  .extend({
    displayName: z
      .string()
      .min(2, '이름은 2자 이상 입력해주세요.')
      .max(30, '이름은 30자 이하로 입력해주세요.'),
    passwordConfirm: z.string().min(8, '비밀번호 확인을 입력해주세요.')
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  })

export type SigninInput = z.infer<typeof signinSchema>
export type SignupInput = z.infer<typeof signupSchema>
```

---

## auth action

```ts
'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/shared/lib/auth'
import { signinSchema } from '../schemas/auth.schema'

export async function signInWithCredentials(input: unknown) {
  const parsed = signinSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: '입력값을 확인해주세요.'
    }
  }

  try {
    await signIn('credentials', {
      ...parsed.data,
      redirectTo: '/snack'
    })

    return {
      ok: true,
      message: '로그인되었습니다.'
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: '이메일 또는 비밀번호를 확인해주세요.'
      }
    }

    throw error
  }
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/signin'
  })
}
```

---

## signin form

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  signinSchema,
  type SigninInput
} from '../schemas/auth.schema'
import { signInWithCredentials } from '../actions/auth.action'

export function SigninForm() {
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: SigninInput) => {
    const result = await signInWithCredentials(values)

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      <input type="password" {...form.register('password')} />
      <button type="submit">로그인</button>
    </form>
  )
}
```

주의할 점:

`redirectTo`를 사용하는 `signIn()`은 성공 시 redirect가 발생할 수 있다.  
따라서 성공 메시지 toast가 실제로 보이지 않을 수 있다.

성공 toast까지 반드시 보여야 한다면 `redirect: false` 전략을 별도로 검토해야 한다.

---

# Shared 구조

## shared/lib/api.ts

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api',
  timeout: 5000
})
```

---

## shared/utils/query-string.ts

```ts
import qs from 'qs'

export function removeEmptyQueryParams<T extends object>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}

export function toQueryString<T extends object>(params: T) {
  return qs.stringify(removeEmptyQueryParams(params), {
    addQueryPrefix: true,
    arrayFormat: 'repeat'
  })
}
```

주의:

`0`을 제거하고 싶지 않다면 `!value` 조건을 사용하면 안 된다.  
`0`은 falsy 값이므로 의도치 않게 제거된다.

---

## shared/components/empty-state.tsx

```tsx
type EmptyStateProps = {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-md border">
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      ) : null}
    </div>
  )
}
```

---

## shared/components/pagination.tsx

```tsx
type PaginationProps = {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onChange
}: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <div className="flex gap-2">
      {pages.map(page => (
        <button
          key={page}
          type="button"
          disabled={page === currentPage}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  )
}

function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
```

---

# Route Handler 예시

## app/api/snacks/route.ts

```ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const params = Object.fromEntries(searchParams.entries())

  const response = await fetch(
    `http://localhost:3173/snacks?${searchParams.toString()}`,
    {
      cache: 'no-store'
    }
  )

  const data = await response.json()
  const totalCount = response.headers.get('x-total-count') ?? '0'

  return NextResponse.json(data, {
    headers: {
      'x-total-count': totalCount
    }
  })
}
```

---

# 실무 기준 판단

## app 내부 `_components` 사용

가능하다.

하지만 해당 페이지에서만 사용하는 컴포넌트일 때 적합하다.

예:

```text
app/snack/_components/snack-page-header.tsx
```

여러 페이지에서 재사용될 가능성이 있으면 `features/snack/components`가 더 적합하다.

---

## feature 내부 service

가능하다.

프론트 API 호출 단위에서는 `features/snack/services/snack.service.ts`가 자연스럽다.

단, DB 직접 접근이나 Prisma 접근은 서버 전용 영역으로 분리하는 것이 좋다.

예:

```text
service/user.service.ts
service/snack.service.ts
```

---

## Server Action 사용 기준

### 적합

- 로그인
- 로그아웃
- 회원가입
- 단순 form submit
- 서버에서만 처리해야 하는 작업

### Route Handler가 더 적합

- React Query 조회
- 외부 API 프록시
- REST 형태 CRUD
- 클라이언트에서 여러 곳에서 호출하는 API

---

# 최종 요약

이 프로젝트에서는 다음 기준을 권장한다.

```text
app      = route / page / layout
features = domain feature
shared   = reusable common code
service  = server-only business logic
api      = route handler
```

Snack, Board, Auth는 모두 feature 단위로 분리한다.

CRUD 조회는 React Query + Route Handler 중심으로 구성한다.

CRUD 변경은 Mutation + Route Handler 또는 Server Action 중 상황에 맞게 선택한다.

Auth는 Auth.js의 특성상 Server Action과 Auth 설정을 중심으로 구성한다.

공통 UI는 shared/components에 두고, 도메인 전용 UI는 features/{domain}/components에 둔다.
