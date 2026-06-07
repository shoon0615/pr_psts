# Architecture

> Next.js App Router 기반 프로젝트의 폴더 구조, 책임 분리, 데이터 흐름을 정리한 문서입니다.  
> 이 문서는 특정 라이브러리 사용법보다 **프로젝트를 어떻게 나누고 연결할 것인가**에 초점을 둡니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 구조를 나누는가?](#3-왜-구조를-나누는가)
- [4. 실무 기준](#4-실무-기준)
- [5. 최상위 구조](#5-최상위-구조)
- [6. app 구조](#6-app-구조)
- [7. features 구조](#7-features-구조)
- [8. shared 구조](#8-shared-구조)
- [9. 레이어 책임 분리](#9-레이어-책임-분리)
- [10. 조회 흐름](#10-조회-흐름)
- [11. 변경 흐름](#11-변경-흐름)
- [12. 인증 흐름](#12-인증-흐름)
- [13. 도메인 구조 예시](#13-도메인-구조-예시)
- [14. 코드 스니핏](#14-코드-스니핏)
- [15. Caution](#15-caution)
- [16. Best Practice](#16-best-practice)
- [17. 요약](#17-요약)

---

# 1. 한눈에 보기

프로젝트는 크게 3개 영역으로 나눕니다.

```txt
app
→ 라우팅 / 페이지 진입점

features
→ 도메인 기능

shared
→ 전역 공통 요소
```

---

## 기본 구조

```txt
src/
├─ app/
├─ features/
└─ shared/
```

또는 `src/` 디렉터리를 사용하지 않는다면:

```txt
app/
features/
shared/
```

---

## 핵심 기준

| 영역 | 역할 | 예시 |
|---|---|---|
| app | 라우팅, 페이지, Route Handler | page.tsx, layout.tsx, route.ts |
| features | 도메인 기능 | snack, board, auth |
| shared | 공통 요소 | Button, axios, react-query provider |

---

# 2. 언제 사용하는가?

이 구조는 다음 상황에서 적합합니다.

- CRUD 기능이 여러 개 존재한다.
- 인증 기능이 있다.
- 검색/정렬/필터/페이징이 있다.
- React Query, RHF, Zod, Auth.js, Prisma를 함께 사용한다.
- 컴포넌트와 로직이 점점 섞이기 시작했다.
- `components`, `hooks`, `lib`만으로는 기능별 구분이 어려워졌다.

---

## 단순 프로젝트에서는?

작은 프로젝트에서는 아래처럼 단순하게 시작해도 됩니다.

```txt
app/
components/
lib/
```

하지만 기능이 늘어나면 다음 문제가 생깁니다.

```txt
components/
├─ snack-list.tsx
├─ board-list.tsx
├─ signin-form.tsx
├─ snack-form.tsx
├─ board-form.tsx
└─ ...
```

문제:

- 도메인 구분이 어려움
- 관련 파일을 찾기 어려움
- 기능 단위 이동/삭제가 어려움
- 공통 컴포넌트와 도메인 컴포넌트가 섞임

따라서 CRUD + 인증 프로젝트라면 `features` 기반 구조가 더 적합합니다.

---

# 3. 왜 구조를 나누는가?

목적은 파일을 많이 나누는 것이 아닙니다.

핵심은 **변경 이유가 같은 파일끼리 모으는 것**입니다.

```txt
Snack 기능이 바뀐다
→ features/snack 내부를 보면 됨

Board 기능이 바뀐다
→ features/board 내부를 보면 됨

공통 Button이 바뀐다
→ shared/components 내부를 보면 됨
```

---

## 구조 분리의 장점

| 장점 | 설명 |
|---|---|
| 탐색성 | 기능별로 파일을 찾기 쉬움 |
| 유지보수 | 변경 범위가 좁아짐 |
| 재사용성 | 공통과 도메인을 구분 가능 |
| 확장성 | snack → board → auth 확장 쉬움 |
| 책임 분리 | page, hook, service, repository 역할이 명확함 |

---

# 4. 실무 기준

## 권장 구조

```txt
app/
features/
shared/
```

---

## 권장 흐름

```txt
app
→ 페이지 진입점

features
→ 실제 기능 구현

shared
→ 공통 도구
```

---

## 권장하지 않는 구조

```txt
components/
hooks/
utils/
api/
types/
```

이 구조 자체가 틀린 것은 아닙니다.

다만 규모가 커지면 다음처럼 됩니다.

```txt
hooks/
├─ useSnack.ts
├─ useBoard.ts
├─ useAuth.ts
├─ useModal.ts
├─ usePagination.ts
└─ ...
```

도메인별 흐름을 따라가기 어렵습니다.

---

# 5. 최상위 구조

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

## app

Next.js App Router 라우팅 영역입니다.

```txt
app/
├─ layout.tsx
├─ page.tsx
├─ provider.tsx
├─ api/
└─ (default-layout)/
```

---

## features

도메인 기능 영역입니다.

```txt
features/
├─ snack/
├─ board/
└─ auth/
```

---

## shared

공통 영역입니다.

```txt
shared/
├─ components/
├─ hooks/
├─ lib/
├─ styles/
├─ types/
└─ utils/
```

---

# 6. app 구조

`app`은 URL과 가장 가까운 계층입니다.

여기에는 비즈니스 로직을 많이 넣지 않습니다.

---

## 기본 예시

```txt
app/
├─ layout.tsx
├─ provider.tsx
├─ page.tsx
├─ api/
│  ├─ snacks/
│  │  └─ route.ts
│  └─ boards/
│     └─ route.ts
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
      └─ mypage/
```

---

## app에 두는 것

| 파일 | 역할 |
|---|---|
| page.tsx | 페이지 진입점 |
| layout.tsx | 레이아웃 |
| loading.tsx | Suspense fallback |
| error.tsx | 에러 UI |
| not-found.tsx | 404 UI |
| route.ts | HTTP API endpoint |
| provider.tsx | 전역 Provider 조합 |

---

## app에 두지 않는 것

| 항목 | 이유 |
|---|---|
| 복잡한 form 로직 | features로 분리 |
| queryOptions | features의 queries로 분리 |
| service 로직 | features의 services로 분리 |
| repository 로직 | features의 repositories로 분리 |
| schema | features의 schema로 분리 |

---

# 7. features 구조

`features`는 실제 기능의 중심입니다.

도메인별로 나눕니다.

```txt
features/
├─ snack/
├─ board/
└─ auth/
```

---

## feature 내부 구조

```txt
features/snack/
├─ actions/
├─ components/
├─ hooks/
├─ prefetch/
├─ queries/
├─ repositories/
├─ schema/
├─ services/
└─ types/
```

---

## 각 폴더 역할

| 폴더 | 역할 |
|---|---|
| actions | Server Action |
| components | 도메인 전용 UI |
| hooks | 도메인 전용 hook |
| prefetch | Server prefetch 로직 |
| queries | queryKey, queryOptions |
| repositories | API/DB 접근 |
| schema | Zod schema |
| services | 비즈니스 로직 |
| types | 도메인 타입 |

---

## actions

변경 작업의 서버 진입점입니다.

사용 예:

- 생성
- 수정
- 삭제
- 로그인
- 로그아웃
- 회원가입

```txt
Client
  ↓ useMutation / form action
Server Action
  ↓ service
repository
  ↓ DB
```

---

## components

도메인 전용 UI를 둡니다.

예:

```txt
features/snack/components/
├─ snack-list.tsx
├─ snack-card.tsx
├─ snack-form.tsx
├─ snack-search.tsx
└─ snack-pagination.tsx
```

공통 UI는 여기에 두지 않습니다.

```txt
Button
Input
Dialog
Pagination UI
```

이런 컴포넌트는 `shared/components`로 이동합니다.

---

## hooks

도메인 전용 hook을 둡니다.

예:

```txt
features/snack/hooks/
└─ use-snack.ts
```

사용 목적:

- useSuspenseQuery 감싸기
- useMutation 감싸기
- 도메인별 상태 조합
- 컴포넌트에서 queryOptions 직접 노출 줄이기

---

## prefetch

Server Component에서 사용할 prefetch 로직을 둡니다.

```txt
features/snack/prefetch/
└─ snack.prefetch.ts
```

사용 목적:

- page.tsx 간결화
- 여러 query를 한 번에 prefetch
- SSR 초기 데이터 구성

---

## queries

React Query 관련 설정을 둡니다.

```txt
features/snack/queries/
└─ snack.query.ts
```

포함:

- queryKey
- queryOptions
- list options
- detail options

---

## repositories

외부 데이터 접근을 담당합니다.

대상:

- Route Handler
- json-server
- Prisma
- 외부 API

```txt
features/snack/repositories/
├─ snack.api.repository.ts
└─ snack.prisma.repository.ts
```

---

## services

비즈니스 로직을 담당합니다.

```txt
features/snack/services/
└─ snack.service.ts
```

예:

- 중복 검사
- 권한 확인
- 저장 전 데이터 가공
- 여러 repository 조합
- transaction 처리

---

## schema

Zod schema를 둡니다.

```txt
features/snack/schema/
└─ snack.schema.ts
```

사용 위치:

- RHF client validation
- Server Action validation
- Route Handler validation

---

## types

도메인 타입을 둡니다.

```txt
features/snack/types/
└─ snack.type.ts
```

예:

- DTO
- SearchParams
- FormInput
- Response 타입

---

# 8. shared 구조

`shared`는 도메인과 무관하게 재사용 가능한 요소를 둡니다.

```txt
shared/
├─ components/
├─ hooks/
├─ lib/
├─ styles/
├─ types/
└─ utils/
```

---

## shared/components

공통 UI 컴포넌트

```txt
shared/components/
├─ ui/
├─ form/
├─ layout/
└─ feedback/
```

예:

```txt
Button
Input
Dialog
ConfirmDialog
Pagination
EmptyState
ErrorState
LoadingSpinner
FormInput
FormSelect
FormTextarea
```

---

## shared/hooks

도메인과 무관한 공통 hook

예:

```txt
shared/hooks/
├─ use-mounted.ts
├─ use-disclosure.ts
└─ use-debounce.ts
```

---

## shared/lib

외부 라이브러리 설정

```txt
shared/lib/
├─ axios/
├─ react-query/
├─ auth/
├─ prisma/
└─ utils.ts
```

예:

- axios instance
- QueryClient provider
- Prisma client
- Auth 설정
- cn 유틸

---

## shared/types

전역 타입

예:

```txt
shared/types/
├─ api.type.ts
├─ pagination.type.ts
└─ common.type.ts
```

---

# 9. 레이어 책임 분리

## 전체 흐름

```txt
Component
  ↓
Hook
  ↓
Query / Action
  ↓
Service
  ↓
Repository
  ↓
DB / API
```

---

## 각 레이어 역할

| 레이어 | 역할 | 예시 |
|---|---|---|
| Component | 화면 출력, 이벤트 연결 | SnackList, SnackForm |
| Hook | UI와 데이터 로직 연결 | useSnackList, useCreateSnack |
| Query | queryKey/queryFn 정의 | snackListQueryOptions |
| Action | 서버 변경 진입점 | createSnackAction |
| Service | 비즈니스 규칙 | createSnack |
| Repository | 데이터 접근 | prisma.snack.create |
| Schema | 입력/출력 검증 | createSnackSchema |
| Type | 타입 정의 | Snack, SnackSearchParams |

---

## 중요한 기준

### Component는 비즈니스 로직을 갖지 않습니다.

좋지 않은 예:

```tsx
function SnackForm() {
  async function submit(data) {
    const parsed = schema.parse(data)
    await prisma.snack.create({ data: parsed })
  }
}
```

문제:

- UI와 DB 로직이 섞임
- 재사용 어려움
- 테스트 어려움
- Client/Server 경계가 불명확

---

좋은 예:

```txt
SnackForm
  ↓
useCreateSnack
  ↓
createSnackAction
  ↓
snackService.create
  ↓
snackRepository.create
```

---

# 10. 조회 흐름

조회는 URL 기반 + React Query 기반으로 처리합니다.

---

## 기본 흐름

```txt
Page(Server)
  ↓ searchParams
prefetchSnackPage
  ↓ queryClient.prefetchQuery
HydrationBoundary
  ↓
SnackList(Client)
  ↓ useSuspenseQuery
snackListQueryOptions
  ↓ queryFn
snackRepository.list
  ↓
DB / API
```

---

## page.tsx 역할

```txt
- searchParams 받기
- params 검증
- prefetch 실행
- HydrationBoundary 구성
- Client Component 렌더링
```

page.tsx에서 상세한 UI/비즈니스 로직을 많이 작성하지 않습니다.

---

## list.tsx 역할

```txt
- useSuspenseQuery 호출
- list 출력
- empty state 처리
- UI 이벤트 연결
```

---

## query.ts 역할

```txt
- queryKey 관리
- queryOptions 관리
- queryFn 연결
```

---

## repository 역할

```txt
- 실제 API 호출
- 실제 DB 호출
- axios/fetch/prisma 접근
```

---

# 11. 변경 흐름

변경은 Server Action + useMutation 기반으로 처리합니다.

---

## 기본 흐름

```txt
Form(Client)
  ↓ RHF
Zod Validation
  ↓
useMutation
  ↓
Server Action
  ↓
Service
  ↓
Repository
  ↓
DB
  ↓
invalidateQueries
```

---

## Form Component 역할

```txt
- 입력 UI
- RHF 연결
- submit 이벤트 연결
- pending 상태 표시
```

---

## Action 역할

```txt
- 서버 진입점
- auth 확인
- schema 검증
- service 호출
- revalidate 또는 결과 반환
```

---

## Service 역할

```txt
- 비즈니스 규칙
- 권한 확인
- 데이터 가공
- 여러 repository 조합
```

---

## Repository 역할

```txt
- create
- update
- delete
- find
```

---

# 12. 인증 흐름

인증은 Auth.js를 중심으로 처리합니다.

---

## 로그인 흐름

```txt
SigninForm
  ↓ RHF + Zod
signIn('credentials')
  ↓
Auth.js
  ↓
authorize()
  ↓
userRepository.findByEmail
  ↓
bcrypt.compare
  ↓
jwt callback
  ↓
session callback
```

---

## 서버 접근 제어

```txt
Server Component / Server Action / Route Handler
  ↓
auth()
  ↓
session 확인
  ↓
role 확인
  ↓
allow / redirect / error
```

---

## 구조 예시

```txt
features/auth/
├─ actions/
│  └─ auth.action.ts
├─ components/
│  ├─ signin-form.tsx
│  └─ signup-form.tsx
├─ schema/
│  └─ auth.schema.ts
├─ services/
│  └─ auth.service.ts
├─ repositories/
│  └─ user.repository.ts
└─ types/
   └─ auth.type.ts
```

---

# 13. 도메인 구조 예시

## snack

```txt
features/snack/
├─ actions/
│  └─ snack.action.ts
├─ components/
│  ├─ snack-list.tsx
│  ├─ snack-card.tsx
│  ├─ snack-form.tsx
│  ├─ snack-search.tsx
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

## board

```txt
features/board/
├─ actions/
│  └─ board.action.ts
├─ components/
│  ├─ board-list.tsx
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

## auth

```txt
features/auth/
├─ actions/
├─ components/
├─ repositories/
├─ schema/
├─ services/
└─ types/
```

---

# 14. 코드 스니핏

## queryKey / queryOptions

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

## prefetch

```ts
// features/snack/prefetch/snack.prefetch.ts
import type { QueryClient } from '@tanstack/react-query'
import { snackListQueryOptions } from '../queries/snack.query'
import type { SnackSearchParams } from '../types/snack.type'

export async function prefetchSnackPage(
  queryClient: QueryClient,
  params: SnackSearchParams
) {
  await queryClient.prefetchQuery(snackListQueryOptions(params))
}
```

---

## page.tsx

```tsx
// app/(default-layout)/(main)/snack/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { prefetchSnackPage } from '@/features/snack/prefetch/snack.prefetch'
import { SnackList } from '@/features/snack/components/snack-list'
import { parseSnackSearchParams } from '@/features/snack/schema/snack.schema'

export default async function SnackPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = parseSnackSearchParams(await searchParams)

  const queryClient = new QueryClient()
  await prefetchSnackPage(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackList params={params} />
    </HydrationBoundary>
  )
}
```

---

## hook

```ts
// features/snack/hooks/use-snack.ts
'use client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createSnackAction } from '../actions/snack.action'
import { snackKeys, snackListQueryOptions } from '../queries/snack.query'
import type { CreateSnackInput, SnackSearchParams } from '../types/snack.type'

export function useSnackList(params: SnackSearchParams) {
  return useSuspenseQuery(snackListQueryOptions(params))
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
```

---

## Server Action

```ts
// features/snack/actions/snack.action.ts
'use server'

import { createSnackSchema } from '../schema/snack.schema'
import { snackService } from '../services/snack.service'

export async function createSnackAction(input: unknown) {
  const payload = createSnackSchema.parse(input)

  return snackService.create(payload)
}
```

---

## Service

```ts
// features/snack/services/snack.service.ts
import { snackRepository } from '../repositories/snack.repository'
import type { CreateSnackInput } from '../types/snack.type'

export const snackService = {
  async create(input: CreateSnackInput) {
    return snackRepository.create(input)
  }
}
```

---

## Repository

```ts
// features/snack/repositories/snack.repository.ts
import { api } from '@/shared/lib/axios'
import type { CreateSnackInput, Snack, SnackSearchParams } from '../types/snack.type'

export const snackRepository = {
  async list(params: SnackSearchParams): Promise<Snack[]> {
    const { data } = await api.get('/snacks', { params })
    return data
  },

  async create(input: CreateSnackInput): Promise<Snack> {
    const { data } = await api.post('/snacks', input)
    return data
  }
}
```

---

# 15. Caution

## 1. app에 모든 코드를 넣지 않기

`page.tsx`에 query, mutation, form, service 로직이 모두 들어가면 유지보수가 어렵습니다.

권장:

```txt
page.tsx
→ 조립

features
→ 구현
```

---

## 2. shared에 도메인 코드를 넣지 않기

좋지 않은 예:

```txt
shared/components/snack-form.tsx
```

`snack` 전용이면 `features/snack/components`가 맞습니다.

---

## 3. service와 repository를 혼동하지 않기

| 구분 | 역할 |
|---|---|
| service | 규칙, 조합, 권한, 가공 |
| repository | 데이터 접근 |

---

## 4. Server Action에 모든 로직을 넣지 않기

Server Action은 서버 진입점입니다.

```txt
Server Action
→ 검증
→ service 호출
```

정도로 유지하는 것이 좋습니다.

---

## 5. React Query를 Client State처럼 사용하지 않기

React Query는 Server State 관리 도구입니다.

```txt
API 데이터
→ React Query

모달 열림/닫힘
→ Zustand 또는 useState
```

---

# 16. Best Practice

## 권장

- `app`은 라우팅 중심으로 유지
- 도메인 코드는 `features`에 배치
- 공통 코드는 `shared`에 배치
- queryKey/queryOptions는 `queries`에서 관리
- DB/API 접근은 `repositories`에서 관리
- 비즈니스 규칙은 `services`에서 관리
- Form 검증 schema는 `schema`에서 관리
- page.tsx는 조립 역할만 수행
- Server Action은 얇게 유지
- Client/Server 경계를 명확히 유지

---

## 비권장

- page.tsx에 모든 로직 작성
- shared에 도메인 전용 컴포넌트 작성
- 컴포넌트에서 직접 DB/API 접근
- Server Action 안에 모든 비즈니스 로직 작성
- queryKey 문자열을 여러 곳에 하드코딩
- schema 없이 Form 처리
- auth 검증 없이 Server Action 실행

---

# 17. 요약

## 전체 구조

```txt
app
→ 라우팅 / 페이지

features
→ 도메인 기능

shared
→ 공통 기능
```

---

## 조회

```txt
Page
→ Prefetch
→ HydrationBoundary
→ useSuspenseQuery
→ Repository
```

---

## 변경

```txt
Form
→ useMutation
→ Server Action
→ Service
→ Repository
```

---

## 인증

```txt
Form
→ Auth.js
→ Session
→ auth()
```

---

## 핵심 원칙

```txt
페이지는 조립한다.

기능은 features에 둔다.

공통은 shared에 둔다.

데이터 접근은 repository에서 한다.

규칙은 service에서 처리한다.
```
