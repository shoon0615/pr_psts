# Project

> 최종 프로젝트 구조와 실제 구현 스니핏을 정리한 문서입니다.  
> README.md가 전체 로드맵이고, architecture.md가 구조 설계라면, project.md는 **Snack / Board / Auth를 실제로 어떻게 구현할지 보여주는 프로토타입 문서**입니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 최종 프로젝트 목표](#2-최종-프로젝트-목표)
- [3. 최종 폴더 구조](#3-최종-폴더-구조)
- [4. 공통 설계 기준](#4-공통-설계-기준)
- [5. Snack 도메인](#5-snack-도메인)
- [6. Board 도메인](#6-board-도메인)
- [7. Auth 도메인](#7-auth-도메인)
- [8. 공통 컴포넌트](#8-공통-컴포넌트)
- [9. 공통 유틸 / 라이브러리](#9-공통-유틸--라이브러리)
- [10. 최종 데이터 흐름](#10-최종-데이터-흐름)
- [11. Caution](#11-caution)
- [12. Best Practice](#12-best-practice)
- [13. 요약](#13-요약)

---

# 1. 한눈에 보기

최종 프로젝트는 다음 3개 도메인을 중심으로 구성합니다.

```txt
Snack
→ 상품/간식 CRUD 예제

Board
→ 게시판 CRUD 예제

Auth
→ 로그인/회원가입/마이페이지
```

---

## 도메인별 역할

| 도메인 | 역할 | 주요 기능 |
|---|---|---|
| snack | CRUD 학습용 메인 예제 | 목록, 상세, 생성, 수정, 삭제, 검색, 정렬, 페이징 |
| board | 게시판 확장 예제 | 목록, 상세, 작성, 수정, 삭제, 작성자 권한 |
| auth | 회원 기능 | 로그인, 회원가입, 로그아웃, 마이페이지, 세션 |

---

## 기술 연결

| 영역 | 기술 |
|---|---|
| Page | Next.js App Router |
| Form | React Hook Form + Zod |
| Query | TanStack Query |
| Search | qs + nuqs |
| Auth | Auth.js |
| State | Zustand |
| DB | Prisma 또는 json-server |
| UI | shadcn/ui |

---

# 2. 최종 프로젝트 목표

## 구현 목표

```txt
1. Snack CRUD
2. Board CRUD
3. Auth
4. 검색/필터/정렬/페이징
5. 공통 Form 컴포넌트
6. 공통 Query 패턴
7. 공통 Confirm Dialog
8. Toast 처리
9. Empty / Loading / Error 상태 처리
10. 최종 배포 가능한 구조
```

---

## 학습 목표

이 프로젝트를 통해 다음 패턴을 반복 학습합니다.

```txt
조회
→ Server Prefetch
→ HydrationBoundary
→ useSuspenseQuery

변경
→ RHF
→ Zod
→ useMutation
→ Server Action
→ invalidateQueries

검색
→ URL
→ nuqs
→ searchParams
→ queryKey

인증
→ Auth.js
→ auth()
→ session
→ role
```

---

# 3. 최종 폴더 구조

## 전체 구조

```txt
frontend/
├─ app/
├─ features/
├─ shared/
├─ mock/
├─ public/
├─ package.json
├─ tsconfig.json
└─ next.config.ts
```

---

## app 구조

```txt
app/
├─ layout.tsx
├─ provider.tsx
├─ page.tsx
├─ api/
│  ├─ snacks/
│  │  ├─ route.ts
│  │  └─ [id]/
│  │     └─ route.ts
│  ├─ boards/
│  │  ├─ route.ts
│  │  └─ [id]/
│  │     └─ route.ts
│  └─ auth/
│     └─ [...nextauth]/
│        └─ route.ts
└─ (default-layout)/
   └─ (main)/
      ├─ snack/
      │  ├─ page.tsx
      │  ├─ new/
      │  │  └─ page.tsx
      │  └─ [id]/
      │     ├─ page.tsx
      │     └─ edit/
      │        └─ page.tsx
      ├─ board/
      │  ├─ page.tsx
      │  ├─ new/
      │  │  └─ page.tsx
      │  └─ [id]/
      │     ├─ page.tsx
      │     └─ edit/
      │        └─ page.tsx
      ├─ signin/
      │  └─ page.tsx
      ├─ signup/
      │  └─ page.tsx
      └─ mypage/
         └─ page.tsx
```

---

## features 구조

```txt
features/
├─ snack/
│  ├─ actions/
│  ├─ components/
│  ├─ hooks/
│  ├─ prefetch/
│  ├─ queries/
│  ├─ repositories/
│  ├─ schema/
│  ├─ services/
│  └─ types/
├─ board/
│  ├─ actions/
│  ├─ components/
│  ├─ hooks/
│  ├─ prefetch/
│  ├─ queries/
│  ├─ repositories/
│  ├─ schema/
│  ├─ services/
│  └─ types/
└─ auth/
   ├─ actions/
   ├─ components/
   ├─ repositories/
   ├─ schema/
   ├─ services/
   └─ types/
```

---

## shared 구조

```txt
shared/
├─ components/
│  ├─ ui/
│  ├─ form/
│  ├─ feedback/
│  └─ layout/
├─ hooks/
├─ lib/
│  ├─ axios/
│  ├─ auth/
│  ├─ prisma/
│  └─ react-query/
├─ styles/
├─ types/
└─ utils/
```

---

# 4. 공통 설계 기준

## 조회 기준

```txt
Page(Server)
  ↓
prefetch
  ↓
HydrationBoundary
  ↓
Client Component
  ↓
useSuspenseQuery
```

적용:

- Snack 목록
- Snack 상세
- Board 목록
- Board 상세
- 마이페이지 데이터

---

## 변경 기준

```txt
Form(Client)
  ↓
RHF + Zod
  ↓
useMutation
  ↓
Server Action
  ↓
Service
  ↓
Repository
  ↓
DB/API
  ↓
invalidateQueries
```

적용:

- Snack 생성/수정/삭제
- Board 생성/수정/삭제
- 회원가입
- 마이페이지 수정

---

## 검색 기준

```txt
Search UI
  ↓
nuqs
  ↓
URL query string
  ↓
page.tsx searchParams
  ↓
queryKey
  ↓
useSuspenseQuery
```

적용:

- Snack 검색/정렬/페이징
- Board 검색/정렬/페이징

---

## 인증 기준

```txt
auth()
  ↓
session 확인
  ↓
권한 확인
  ↓
allow / redirect / throw
```

적용:

- 글 작성
- 글 수정
- 글 삭제
- 마이페이지 접근

---

# 5. Snack 도메인

Snack은 CRUD와 검색/정렬/페이징을 연습하기 좋은 메인 도메인입니다.

---

## Snack 기능

| 기능 | 설명 |
|---|---|
| 목록 | 간식 목록 조회 |
| 상세 | 간식 상세 조회 |
| 생성 | 간식 등록 |
| 수정 | 간식 정보 수정 |
| 삭제 | 간식 삭제 |
| 검색 | 이름/내용 검색 |
| 필터 | 브랜드/카테고리 필터 |
| 정렬 | 가격/이름/생성일 정렬 |
| 페이징 | 페이지 단위 조회 |

---

## Snack 폴더 구조

```txt
features/snack/
├─ actions/
│  └─ snack.action.ts
├─ components/
│  ├─ snack-list.tsx
│  ├─ snack-card.tsx
│  ├─ snack-detail.tsx
│  ├─ snack-form.tsx
│  ├─ snack-search.tsx
│  ├─ snack-sort.tsx
│  └─ snack-pagination.tsx
├─ hooks/
│  └─ use-snack.ts
├─ prefetch/
│  └─ snack.prefetch.ts
├─ queries/
│  └─ snack.query.ts
├─ repositories/
│  └─ snack.repository.ts
├─ schema/
│  └─ snack.schema.ts
├─ services/
│  └─ snack.service.ts
└─ types/
   └─ snack.type.ts
```

---

## Snack 타입

```ts
// features/snack/types/snack.type.ts
export type Snack = {
  id: string
  title: string
  brand: string
  category: string
  contents?: string
  price: number
  createdAt: string
  updatedAt: string
}

export type SnackSearchParams = {
  page: number
  keyword?: string
  brand?: string
  category?: string
  sort?: 'createdAt' | 'title' | 'price'
  order?: 'asc' | 'desc'
}

export type CreateSnackInput = {
  title: string
  brand: string
  category: string
  contents?: string
  price: number
}

export type UpdateSnackInput = Partial<CreateSnackInput>
```

---

## Snack Schema

```ts
// features/snack/schema/snack.schema.ts
import { z } from 'zod'

export const snackSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  keyword: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  category: z.string().optional().default(''),
  sort: z.enum(['createdAt', 'title', 'price']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const createSnackSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력해주세요.'),
  brand: z.string().min(1, '브랜드를 선택해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  contents: z.string().optional(),
  price: z.coerce.number().min(0, '가격은 0원 이상이어야 합니다.')
})

export const updateSnackSchema = createSnackSchema.partial()

export function parseSnackSearchParams(
  searchParams: Record<string, string | string[] | undefined>
) {
  return snackSearchParamsSchema.parse({
    page: firstValue(searchParams.page),
    keyword: firstValue(searchParams.keyword),
    brand: firstValue(searchParams.brand),
    category: firstValue(searchParams.category),
    sort: firstValue(searchParams.sort),
    order: firstValue(searchParams.order)
  })
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}
```

---

## Snack Query

```ts
// features/snack/queries/snack.query.ts
import { queryOptions } from '@tanstack/react-query'
import { snackRepository } from '../repositories/snack.repository'
import type { SnackSearchParams } from '../types/snack.type'

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

---

## Snack Prefetch

```ts
// features/snack/prefetch/snack.prefetch.ts
import type { QueryClient } from '@tanstack/react-query'
import { snackDetailQueryOptions, snackListQueryOptions } from '../queries/snack.query'
import type { SnackSearchParams } from '../types/snack.type'

export async function prefetchSnackList(
  queryClient: QueryClient,
  params: SnackSearchParams
) {
  await queryClient.prefetchQuery(snackListQueryOptions(params))
}

export async function prefetchSnackDetail(
  queryClient: QueryClient,
  id: string
) {
  await queryClient.prefetchQuery(snackDetailQueryOptions(id))
}
```

---

## Snack Repository

```ts
// features/snack/repositories/snack.repository.ts
import { api } from '@/shared/lib/axios'
import type {
  CreateSnackInput,
  Snack,
  SnackSearchParams,
  UpdateSnackInput
} from '../types/snack.type'

export const snackRepository = {
  async list(params: SnackSearchParams): Promise<Snack[]> {
    const { data } = await api.get('/snacks', { params })
    return data
  },

  async detail(id: string): Promise<Snack> {
    const { data } = await api.get(`/snacks/${id}`)
    return data
  },

  async create(input: CreateSnackInput): Promise<Snack> {
    const { data } = await api.post('/snacks', input)
    return data
  },

  async update(id: string, input: UpdateSnackInput): Promise<Snack> {
    const { data } = await api.patch(`/snacks/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/snacks/${id}`)
  }
}
```

---

## Snack Service

```ts
// features/snack/services/snack.service.ts
import { snackRepository } from '../repositories/snack.repository'
import type { CreateSnackInput, UpdateSnackInput } from '../types/snack.type'

export const snackService = {
  async create(input: CreateSnackInput) {
    return snackRepository.create(input)
  },

  async update(id: string, input: UpdateSnackInput) {
    return snackRepository.update(id, input)
  },

  async remove(id: string) {
    return snackRepository.remove(id)
  }
}
```

---

## Snack Action

```ts
// features/snack/actions/snack.action.ts
'use server'

import { createSnackSchema, updateSnackSchema } from '../schema/snack.schema'
import { snackService } from '../services/snack.service'

export async function createSnackAction(input: unknown) {
  const payload = createSnackSchema.parse(input)
  return snackService.create(payload)
}

export async function updateSnackAction(id: string, input: unknown) {
  const payload = updateSnackSchema.parse(input)
  return snackService.update(id, payload)
}

export async function deleteSnackAction(id: string) {
  return snackService.remove(id)
}
```

---

## Snack Hook

```ts
// features/snack/hooks/use-snack.ts
'use client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  createSnackAction,
  deleteSnackAction,
  updateSnackAction
} from '../actions/snack.action'
import {
  snackDetailQueryOptions,
  snackKeys,
  snackListQueryOptions
} from '../queries/snack.query'
import type { CreateSnackInput, SnackSearchParams, UpdateSnackInput } from '../types/snack.type'

export function useSnackList(params: SnackSearchParams) {
  return useSuspenseQuery(snackListQueryOptions(params))
}

export function useSnackDetail(id: string) {
  return useSuspenseQuery(snackDetailQueryOptions(id))
}

export function useCreateSnack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSnackInput) => createSnackAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
    }
  })
}

export function useUpdateSnack(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateSnackInput) => updateSnackAction(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
      queryClient.invalidateQueries({ queryKey: snackKeys.detail(id) })
    }
  })
}

export function useDeleteSnack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSnackAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
    }
  })
}
```

---

## Snack Page

```tsx
// app/(default-layout)/(main)/snack/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { SnackList } from '@/features/snack/components/snack-list'
import { SnackSearch } from '@/features/snack/components/snack-search'
import { prefetchSnackList } from '@/features/snack/prefetch/snack.prefetch'
import { parseSnackSearchParams } from '@/features/snack/schema/snack.schema'

export default async function SnackPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = parseSnackSearchParams(await searchParams)

  const queryClient = new QueryClient()
  await prefetchSnackList(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackSearch params={params} />
      <SnackList params={params} />
    </HydrationBoundary>
  )
}
```

---

## Snack List

```tsx
// features/snack/components/snack-list.tsx
'use client'

import { useSnackList } from '../hooks/use-snack'
import type { SnackSearchParams } from '../types/snack.type'

export function SnackList({ params }: { params: SnackSearchParams }) {
  const { data } = useSnackList(params)

  if (data.length === 0) {
    return <p>등록된 간식이 없습니다.</p>
  }

  return (
    <ul>
      {data.map(snack => (
        <li key={snack.id}>
          {snack.title} / {snack.price.toLocaleString('ko-KR')}원
        </li>
      ))}
    </ul>
  )
}
```

---

# 6. Board 도메인

Board는 게시글 CRUD와 작성자 권한을 학습하기 위한 도메인입니다.

---

## Board 기능

| 기능 | 설명 |
|---|---|
| 목록 | 게시글 목록 |
| 상세 | 게시글 상세 |
| 작성 | 로그인 사용자 작성 |
| 수정 | 작성자 또는 관리자 수정 |
| 삭제 | 작성자 또는 관리자 삭제 |
| 검색 | 제목/내용 검색 |
| 권한 | 본인 글만 수정/삭제 |

---

## Board 폴더 구조

```txt
features/board/
├─ actions/
│  └─ board.action.ts
├─ components/
│  ├─ board-list.tsx
│  ├─ board-card.tsx
│  ├─ board-detail.tsx
│  ├─ board-form.tsx
│  └─ board-search.tsx
├─ hooks/
│  └─ use-board.ts
├─ prefetch/
│  └─ board.prefetch.ts
├─ queries/
│  └─ board.query.ts
├─ repositories/
│  └─ board.repository.ts
├─ schema/
│  └─ board.schema.ts
├─ services/
│  └─ board.service.ts
└─ types/
   └─ board.type.ts
```

---

## Board 타입

```ts
// features/board/types/board.type.ts
export type Board = {
  id: string
  title: string
  contents: string
  authorId: string
  authorName: string
  hits: number
  createdAt: string
  updatedAt: string
}

export type BoardSearchParams = {
  page: number
  keyword?: string
  sort?: 'createdAt' | 'hits' | 'title'
  order?: 'asc' | 'desc'
}

export type CreateBoardInput = {
  title: string
  contents: string
}

export type UpdateBoardInput = Partial<CreateBoardInput>
```

---

## Board Schema

```ts
// features/board/schema/board.schema.ts
import { z } from 'zod'

export const boardSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  keyword: z.string().optional().default(''),
  sort: z.enum(['createdAt', 'hits', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const createBoardSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력해주세요.').max(100),
  contents: z.string().min(1, '내용을 입력해주세요.')
})

export const updateBoardSchema = createBoardSchema.partial()
```

---

## Board Action

```ts
// features/board/actions/board.action.ts
'use server'

import { auth } from '@/shared/lib/auth'
import { createBoardSchema, updateBoardSchema } from '../schema/board.schema'
import { boardService } from '../services/board.service'

export async function createBoardAction(input: unknown) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  const payload = createBoardSchema.parse(input)

  return boardService.create({
    ...payload,
    authorId: session.user.id
  })
}

export async function updateBoardAction(id: string, input: unknown) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  const payload = updateBoardSchema.parse(input)

  return boardService.update(id, payload, {
    userId: session.user.id,
    role: session.user.role
  })
}

export async function deleteBoardAction(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  return boardService.remove(id, {
    userId: session.user.id,
    role: session.user.role
  })
}
```

---

## Board Service

```ts
// features/board/services/board.service.ts
import { boardRepository } from '../repositories/board.repository'
import type { CreateBoardInput, UpdateBoardInput } from '../types/board.type'

type Actor = {
  userId: string
  role?: string
}

export const boardService = {
  async create(input: CreateBoardInput & { authorId: string }) {
    return boardRepository.create(input)
  },

  async update(id: string, input: UpdateBoardInput, actor: Actor) {
    const board = await boardRepository.detail(id)

    if (board.authorId !== actor.userId && actor.role !== 'admin') {
      throw new Error('수정 권한이 없습니다.')
    }

    return boardRepository.update(id, input)
  },

  async remove(id: string, actor: Actor) {
    const board = await boardRepository.detail(id)

    if (board.authorId !== actor.userId && actor.role !== 'admin') {
      throw new Error('삭제 권한이 없습니다.')
    }

    return boardRepository.remove(id)
  }
}
```

---

# 7. Auth 도메인

Auth는 로그인, 회원가입, 로그아웃, 마이페이지를 담당합니다.

---

## Auth 기능

| 기능 | 설명 |
|---|---|
| 로그인 | Credentials 로그인 |
| 회원가입 | 계정 생성 |
| 로그아웃 | 세션 종료 |
| 마이페이지 | 내 정보 조회/수정 |
| 권한 | role 기반 접근 제어 |

---

## Auth 폴더 구조

```txt
features/auth/
├─ actions/
│  └─ auth.action.ts
├─ components/
│  ├─ signin-form.tsx
│  ├─ signup-form.tsx
│  └─ mypage-form.tsx
├─ repositories/
│  └─ user.repository.ts
├─ schema/
│  └─ auth.schema.ts
├─ services/
│  └─ auth.service.ts
└─ types/
   └─ auth.type.ts
```

---

## Auth Schema

```ts
// features/auth/schema/auth.schema.ts
import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.')
})

export const signupSchema = signinSchema
  .extend({
    displayName: z.string().min(2, '이름은 2자 이상 입력해주세요.'),
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

## Auth Action

```ts
// features/auth/actions/auth.action.ts
'use server'

import { signIn, signOut } from '@/shared/lib/auth'
import { signupSchema } from '../schema/auth.schema'
import { authService } from '../services/auth.service'

export async function signInWithCredentials(input: {
  email: string
  password: string
}) {
  await signIn('credentials', {
    ...input,
    redirectTo: '/snack'
  })
}

export async function signUpAction(input: unknown) {
  const payload = signupSchema.parse(input)
  await authService.signup(payload)
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/signin'
  })
}
```

---

## Auth Service

```ts
// features/auth/services/auth.service.ts
import bcrypt from 'bcryptjs'
import { userRepository } from '../repositories/user.repository'
import type { SignupInput } from '../schema/auth.schema'

export const authService = {
  async signup(input: SignupInput) {
    const exists = await userRepository.findByEmail(input.email)

    if (exists) {
      throw new Error('이미 가입된 이메일입니다.')
    }

    const passwordHash = await bcrypt.hash(input.password, 10)

    return userRepository.create({
      email: input.email,
      name: input.displayName,
      passwordHash
    })
  }
}
```

---

## User Repository

```ts
// features/auth/repositories/user.repository.ts
import { prisma } from '@/shared/lib/prisma'

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  create(input: {
    email: string
    name: string
    passwordHash: string
  }) {
    return prisma.user.create({
      data: input
    })
  }
}
```

---

# 8. 공통 컴포넌트

## FormInput

```tsx
// shared/components/form/form-input.tsx
'use client'

import { useController, type FieldValues, type Path, type Control } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'

type FormInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: string
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text'
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({ control, name })

  return (
    <div>
      <label>{label}</label>
      <Input {...field} type={type} placeholder={placeholder} />
      {error?.message && <p>{error.message}</p>}
    </div>
  )
}
```

---

## ConfirmDialog

```tsx
// shared/components/feedback/confirm-dialog.tsx
'use client'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  pending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  pending,
  onOpenChange,
  onConfirm
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div role="dialog">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button onClick={() => onOpenChange(false)}>취소</button>
      <button disabled={pending} onClick={onConfirm}>
        {pending ? '처리 중...' : '확인'}
      </button>
    </div>
  )
}
```

---

# 9. 공통 유틸 / 라이브러리

## Axios Instance

```ts
// shared/lib/axios/index.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'
})
```

---

## React Query Provider

```tsx
// shared/lib/react-query/react-query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { useState } from 'react'

export function ReactQueryProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: false,
            refetchOnWindowFocus: false
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
```

---

# 10. 최종 데이터 흐름

## Snack 조회

```txt
/snack?page=1&sort=price
  ↓
app/(main)/snack/page.tsx
  ↓
parseSnackSearchParams
  ↓
prefetchSnackList
  ↓
HydrationBoundary
  ↓
SnackList
  ↓
useSnackList
  ↓
snackListQueryOptions
  ↓
snackRepository.list
```

---

## Snack 생성

```txt
SnackForm
  ↓
RHF
  ↓
Zod
  ↓
useCreateSnack
  ↓
createSnackAction
  ↓
snackService.create
  ↓
snackRepository.create
  ↓
invalidateQueries
```

---

## Board 수정

```txt
BoardForm
  ↓
useUpdateBoard
  ↓
updateBoardAction
  ↓
auth()
  ↓
boardService.update
  ↓
권한 확인
  ↓
boardRepository.update
```

---

## 로그인

```txt
SigninForm
  ↓
signinSchema
  ↓
signInWithCredentials
  ↓
signIn('credentials')
  ↓
authorize()
  ↓
session
```

---

# 11. Caution

## 1. project.md의 코드는 방향성 스니핏이다

이 문서의 코드는 최종 구조를 이해하기 위한 기준입니다.

프로젝트 적용 시에는 다음 항목을 실제 환경에 맞춰 조정해야 합니다.

- json-server
- Prisma
- Route Handler
- Server Action
- Auth.js 설정
- UI 컴포넌트

---

## 2. Snack과 Board 구조를 무조건 복사하지 않기

Snack과 Board는 비슷하지만 완전히 같지는 않습니다.

| 도메인 | 차이 |
|---|---|
| Snack | 상품 CRUD 중심 |
| Board | 작성자 권한 중심 |
| Auth | 세션/사용자 중심 |

---

## 3. Auth Store를 Zustand로 만들지 않기

세션 정보는 Auth.js가 기준입니다.

```txt
Auth Session
→ Auth.js

UI 상태
→ Zustand
```

---

## 4. React Query와 Zustand 역할을 섞지 않기

```txt
API 데이터
→ React Query

UI 상태
→ Zustand
```

---

## 5. Server Action에 권한 검증 누락하지 않기

특히 Board 수정/삭제는 반드시 서버에서 검증해야 합니다.

---

# 12. Best Practice

## 권장

- Snack으로 CRUD 기본 패턴을 먼저 완성
- Board에서 Auth/권한 패턴 확장
- Auth는 모든 변경 작업의 기반으로 연결
- queryKey는 도메인별 factory로 관리
- schema는 client/server에서 공통 사용
- Server Action은 얇게 유지
- 권한 검증은 service에서 처리
- API/DB 접근은 repository로 격리
- 공통 UI는 shared에 배치
- 도메인 UI는 features에 배치

---

## 비권장

- page.tsx에 모든 로직 작성
- 컴포넌트에서 직접 API 호출
- 컴포넌트에서 직접 Prisma 호출
- Auth Session을 Zustand에 복제
- queryKey 문자열을 여러 곳에 하드코딩
- Form마다 schema 중복 작성
- Board 수정/삭제 권한을 Client에서만 검증
- 공통 컴포넌트와 도메인 컴포넌트를 섞어두기

---

# 13. 요약

## 최종 도메인

```txt
Snack
→ CRUD 기본

Board
→ CRUD + 권한

Auth
→ 로그인/회원가입/세션
```

---

## 최종 구조

```txt
app
→ 라우팅

features
→ 도메인 기능

shared
→ 공통 기능
```

---

## 최종 흐름

```txt
조회
→ Page
→ Prefetch
→ useSuspenseQuery

변경
→ RHF
→ useMutation
→ Server Action

인증
→ Auth.js
→ auth()
→ session

상태
→ React Query / RHF / Zustand 역할 분리
```

---

## project.md의 목적

이 문서는 최종 프로젝트의 기준점입니다.

각 기술의 상세 설명은 다음 문서에서 다룹니다.

```txt
form.md
query.md
auth.md
search.md
state.md
prisma.md
```
