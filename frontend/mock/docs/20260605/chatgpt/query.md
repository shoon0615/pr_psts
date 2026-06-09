# Query

> Next.js App Router 기반 프로젝트에서 TanStack Query를 사용해 서버 상태(Server State)를 관리하는 기준을 정리한 문서입니다.  
> 이 문서는 `조회`, `캐싱`, `prefetch`, `hydration`, `mutation`, `invalidate` 흐름을 CRUD 기준으로 설명합니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 사용하는가?](#3-왜-사용하는가)
- [4. React Query → TanStack Query](#4-react-query--tanstack-query)
- [5. 실무 기준](#5-실무-기준)
- [6. Query와 Mutation](#6-query와-mutation)
- [7. Query Key](#7-query-key)
- [8. Query Options](#8-query-options)
- [9. useQuery](#9-usequery)
- [10. useSuspenseQuery](#10-usesuspensequery)
- [11. prefetchQuery](#11-prefetchquery)
- [12. HydrationBoundary](#12-hydrationboundary)
- [13. useMutation](#13-usemutation)
- [14. invalidateQueries](#14-invalidatequeries)
- [15. Optimistic Update](#15-optimistic-update)
- [16. Next.js App Router 적용 구조](#16-nextjs-app-router-적용-구조)
- [17. CRUD 적용 예제](#17-crud-적용-예제)
- [18. 코드 스니핏](#18-코드-스니핏)
- [19. Caution](#19-caution)
- [20. Best Practice](#20-best-practice)
- [21. 요약](#21-요약)

---

# 1. 한눈에 보기

TanStack Query는 API/DB에서 가져온 데이터를 클라이언트에서 캐싱하고 동기화하는 라이브러리입니다.

```txt
Server State
→ TanStack Query
```

---

## 상태별 담당 기술

| 상태 | 담당 기술 | 예시 |
|---|---|---|
| Server State | TanStack Query | 목록, 상세, 사용자 데이터 |
| Form State | React Hook Form | 입력값, 에러, submit 상태 |
| Client State | Zustand | 모달, 사이드바, 테마 |
| URL State | nuqs | 검색, 정렬, 필터, 페이징 |

---

## 핵심 기준

| 작업 | 권장 방식 |
|---|---|
| 목록 조회 | useSuspenseQuery |
| 상세 조회 | useSuspenseQuery |
| 초기 데이터 | prefetchQuery |
| 서버 데이터 전달 | HydrationBoundary |
| 생성/수정/삭제 | useMutation |
| 변경 후 갱신 | invalidateQueries |
| 낙관적 업데이트 | onMutate / onError / onSettled |

---

# 2. 언제 사용하는가?

TanStack Query는 다음과 같은 서버 데이터를 다룰 때 사용합니다.

- 목록 데이터
- 상세 데이터
- 사용자 정보
- 검색 결과
- 페이징 결과
- 서버에서 계산된 데이터
- API 응답 데이터

---

## 사용하는 경우

```txt
DB/API에서 가져온 데이터
→ TanStack Query
```

예:

- Snack 목록
- Board 목록
- Board 상세
- MyPage 사용자 정보
- 카테고리 목록
- 브랜드 목록

---

## 사용하지 않는 경우

다음은 TanStack Query가 아니라 다른 도구가 더 적합합니다.

| 상황 | 권장 |
|---|---|
| input 값 | React Hook Form |
| modal open 상태 | Zustand 또는 useState |
| sidebar open 상태 | Zustand |
| query string 상태 | nuqs |
| 일회성 계산값 | useMemo 또는 일반 함수 |

---

# 3. 왜 사용하는가?

기존 방식은 보통 다음 흐름입니다.

```tsx
useEffect(() => {
  fetch('/api/snacks')
    .then(res => res.json())
    .then(setData)
}, [])
```

이 방식은 작은 예제에서는 괜찮지만 실무에서는 반복 코드가 많아집니다.

---

## 기존 방식의 문제

| 문제 | 설명 |
|---|---|
| loading 중복 | 매 컴포넌트마다 loading state 작성 |
| error 중복 | 매 요청마다 try/catch 작성 |
| cache 없음 | 같은 데이터를 여러 번 요청 |
| refetch 관리 어려움 | 변경 후 목록 갱신을 직접 처리 |
| race condition | 빠른 검색/페이지 이동 시 응답 순서 문제 |
| SSR 연동 불편 | 서버 prefetch와 클라이언트 캐시 연결이 번거로움 |

---

## TanStack Query가 해결하는 것

```txt
fetch
+
loading
+
error
+
cache
+
refetch
+
mutation
+
invalidate
```

---

# 4. React Query → TanStack Query

예전 문서나 블로그에서는 `React Query`라는 이름을 많이 볼 수 있습니다.

현재 공식 명칭은 `TanStack Query`입니다.

```txt
React Query
↓
TanStack Query
```

---

## 실무에서 중요한 이유

검색할 때 두 이름이 모두 나옵니다.

```txt
react-query useQuery
tanstack query useQuery
@tanstack/react-query
```

현재 Next.js + React 프로젝트에서는 보통 다음 패키지를 사용합니다.

```bash
npm install @tanstack/react-query
```

Next.js App Router에서 streaming hydration을 사용할 경우:

```bash
npm install @tanstack/react-query-next-experimental
```

---

# 5. 실무 기준

## 조회

```txt
Server Component
  ↓
prefetchQuery
  ↓
HydrationBoundary
  ↓
Client Component
  ↓
useSuspenseQuery
```

---

## 변경

```txt
Client Component
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

---

## 권장 패턴

| 역할 | 위치 |
|---|---|
| queryKey | features/{domain}/queries |
| queryOptions | features/{domain}/queries |
| prefetch | features/{domain}/prefetch |
| hook | features/{domain}/hooks |
| API/DB 접근 | features/{domain}/repositories |
| 변경 작업 | features/{domain}/actions |

---

# 6. Query와 Mutation

## Query

서버 데이터를 조회합니다.

```txt
GET
조회
캐싱
refetch
```

예:

- 목록 조회
- 상세 조회
- 카테고리 조회
- 사용자 정보 조회

---

## Mutation

서버 데이터를 변경합니다.

```txt
POST
PATCH
DELETE
변경
invalidate
```

예:

- 생성
- 수정
- 삭제
- 좋아요
- 북마크
- 회원정보 수정

---

## 비교

| 구분 | Query | Mutation |
|---|---|---|
| 목적 | 조회 | 변경 |
| 대표 hook | useQuery / useSuspenseQuery | useMutation |
| 캐싱 | 자동 | 직접 갱신 필요 |
| 주 사용 HTTP | GET | POST / PATCH / DELETE |
| 성공 후 처리 | 데이터 사용 | invalidate / redirect / toast |

---

# 7. Query Key

Query Key는 캐시의 주소입니다.

```ts
['snacks']
```

TanStack Query는 queryKey를 기준으로 캐시를 구분합니다.

---

## 나쁜 예

```ts
useSuspenseQuery({
  queryKey: ['list'],
  queryFn: fetchSnacks
})
```

문제:

- 어떤 도메인의 list인지 모름
- 다른 list와 충돌 가능
- invalidate 범위 제어 어려움

---

## 좋은 예

```ts
export const snackKeys = {
  all: ['snacks'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, 'detail'] as const,
  detail: (id: string) => [...snackKeys.details(), id] as const
}
```

---

## Query Key 설계 기준

| key | 의미 |
|---|---|
| all | 도메인 전체 |
| lists | 목록 계열 |
| list(params) | 특정 검색 조건 목록 |
| details | 상세 계열 |
| detail(id) | 특정 상세 |

---

## 검색 조건은 queryKey에 포함

```ts
queryKey: snackKeys.list(params)
```

이렇게 해야 검색/정렬/페이징이 바뀔 때 다른 캐시로 인식됩니다.

---

# 8. Query Options

Query Options는 queryKey와 queryFn을 하나로 묶은 설정입니다.

---

## 사용하는 이유

```txt
useSuspenseQuery
prefetchQuery
invalidateQueries
```

에서 같은 설정을 재사용하기 위함입니다.

---

## 예시

```ts
export const snackListQueryOptions = (params: SnackSearchParams) =>
  queryOptions({
    queryKey: snackKeys.list(params),
    queryFn: () => snackRepository.list(params)
  })
```

---

## 장점

- page.tsx와 client component가 같은 query 설정 사용
- queryKey 중복 제거
- queryFn 중복 제거
- 타입 추론 개선
- prefetch와 useSuspenseQuery 연결 쉬움

---

# 9. useQuery

`useQuery`는 가장 기본적인 조회 hook입니다.

```tsx
const { data, isLoading, isFetching, error } = useQuery(options)
```

---

## 언제 사용하는가?

다음 상황에서는 `useQuery`를 사용할 수 있습니다.

- Suspense를 사용하지 않는 화면
- data undefined 처리를 직접 하고 싶은 경우
- enabled 조건이 필요한 경우
- lazy query가 필요한 경우

---

## 예시

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { snackListQueryOptions } from '../queries/snack.query'

export function SnackList({ params }: { params: SnackSearchParams }) {
  const { data, isLoading, isError } = useQuery(snackListQueryOptions(params))

  if (isLoading) return <p>조회 중...</p>
  if (isError) return <p>조회 실패</p>

  return (
    <ul>
      {(data ?? []).map(snack => (
        <li key={snack.id}>{snack.title}</li>
      ))}
    </ul>
  )
}
```

---

## 주의

`useQuery`의 `data`는 undefined일 수 있습니다.

따라서 실무에서 SSR prefetch + Suspense를 사용하는 조회 페이지라면 `useSuspenseQuery`가 더 깔끔합니다.

---

# 10. useSuspenseQuery

`useSuspenseQuery`는 Suspense와 함께 사용하는 조회 hook입니다.

```tsx
const { data } = useSuspenseQuery(options)
```

---

## 장점

- data undefined 처리가 줄어듦
- Suspense fallback과 잘 맞음
- Server prefetch와 조합하기 좋음
- 목록/상세 페이지에 적합

---

## 기본 흐름

```txt
Suspense
  ↓
useSuspenseQuery
  ↓
queryFn
  ↓
data
```

---

## 예시

```tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { snackListQueryOptions } from '../queries/snack.query'
import type { SnackSearchParams } from '../types/snack.type'

export function SnackList({ params }: { params: SnackSearchParams }) {
  const { data } = useSuspenseQuery(snackListQueryOptions(params))

  if (data.length === 0) {
    return <p>등록된 간식이 없습니다.</p>
  }

  return (
    <ul>
      {data.map(snack => (
        <li key={snack.id}>{snack.title}</li>
      ))}
    </ul>
  )
}
```

---

# 11. prefetchQuery

`prefetchQuery`는 Client Component가 실행되기 전에 Server Component에서 데이터를 미리 가져오는 방식입니다.

---

## 왜 사용하는가?

```txt
Server에서 미리 조회
↓
HTML 생성
↓
Client에서 캐시 재사용
```

장점:

- 초기 화면 표시 개선
- SEO에 유리
- Client에서 같은 요청 반복 감소
- App Router Server Component와 잘 맞음

---

## 예시

```ts
import type { QueryClient } from '@tanstack/react-query'
import { snackListQueryOptions } from '../queries/snack.query'
import type { SnackSearchParams } from '../types/snack.type'

export async function prefetchSnackList(
  queryClient: QueryClient,
  params: SnackSearchParams
) {
  await queryClient.prefetchQuery(snackListQueryOptions(params))
}
```

---

# 12. HydrationBoundary

Server에서 만든 Query Cache를 Client로 전달하기 위해 사용합니다.

---

## 흐름

```txt
Server QueryClient
  ↓
dehydrate(queryClient)
  ↓
HydrationBoundary
  ↓
Client Query Cache
```

---

## 예시

```tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { prefetchSnackList } from '@/features/snack/prefetch/snack.prefetch'
import { SnackList } from '@/features/snack/components/snack-list'

export default async function SnackPage({ searchParams }) {
  const params = parseSnackSearchParams(await searchParams)

  const queryClient = new QueryClient()
  await prefetchSnackList(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackList params={params} />
    </HydrationBoundary>
  )
}
```

---

# 13. useMutation

`useMutation`은 서버 데이터를 변경할 때 사용합니다.

---

## 적용 대상

- 생성
- 수정
- 삭제
- 좋아요
- 북마크
- 마이페이지 수정

---

## 예시

```tsx
const { mutateAsync, isPending } = useMutation({
  mutationFn: createSnackAction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
  }
})
```

---

## mutate vs mutateAsync

| 방식 | 특징 |
|---|---|
| mutate | 콜백 기반 |
| mutateAsync | Promise 기반, async/await 가능 |

실무에서는 submit 이후 toast, reset, redirect 등을 순서대로 처리해야 하는 경우가 많으므로 `mutateAsync`가 편합니다.

---

# 14. invalidateQueries

Mutation 성공 후 기존 캐시를 stale 상태로 만들고 재조회하게 합니다.

---

## 기본 흐름

```txt
Mutation 성공
  ↓
invalidateQueries
  ↓
관련 Query stale 처리
  ↓
화면에서 refetch
```

---

## 예시

```ts
queryClient.invalidateQueries({
  queryKey: snackKeys.lists()
})
```

---

## 수정 후 상세까지 갱신

```ts
queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
queryClient.invalidateQueries({ queryKey: snackKeys.detail(id) })
```

---

# 15. Optimistic Update

Optimistic Update는 서버 응답을 기다리기 전에 UI를 먼저 바꾸는 방식입니다.

---

## 언제 사용하는가?

적합:

- 좋아요
- 북마크
- 체크박스
- 토글
- 정렬 순서 변경

주의:

- 생성/수정/삭제처럼 실패 시 복구가 복잡한 작업은 신중하게 사용

---

## 흐름

```txt
onMutate
  ↓
기존 캐시 백업
  ↓
UI 먼저 변경
  ↓
요청 실패 시 onError에서 롤백
  ↓
onSettled에서 invalidate
```

---

## 예시

```ts
const mutation = useMutation({
  mutationFn: toggleLikeAction,

  onMutate: async id => {
    await queryClient.cancelQueries({ queryKey: snackKeys.lists() })

    const previous = queryClient.getQueryData(snackKeys.lists())

    queryClient.setQueryData(snackKeys.lists(), old => {
      // optimistic update
      return old
    })

    return { previous }
  },

  onError: (_error, _variables, context) => {
    if (context?.previous) {
      queryClient.setQueryData(snackKeys.lists(), context.previous)
    }
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
  }
})
```

---

# 16. Next.js App Router 적용 구조

## 조회 구조

```txt
app/(main)/snack/page.tsx
  ↓
features/snack/prefetch/snack.prefetch.ts
  ↓
features/snack/queries/snack.query.ts
  ↓
features/snack/repositories/snack.repository.ts
```

---

## Client 구조

```txt
features/snack/components/snack-list.tsx
  ↓
features/snack/hooks/use-snack.ts
  ↓
features/snack/queries/snack.query.ts
```

---

## 변경 구조

```txt
features/snack/components/snack-form.tsx
  ↓
features/snack/hooks/use-snack.ts
  ↓
features/snack/actions/snack.action.ts
  ↓
features/snack/services/snack.service.ts
  ↓
features/snack/repositories/snack.repository.ts
```

---

# 17. CRUD 적용 예제

## 목록 조회

```txt
Page(Server)
  ↓
prefetchQuery
  ↓
HydrationBoundary
  ↓
SnackList(Client)
  ↓
useSuspenseQuery
```

---

## 상세 조회

```txt
[id]/page.tsx
  ↓
prefetchDetail
  ↓
SnackDetail
  ↓
useSuspenseQuery
```

---

## 생성

```txt
SnackForm
  ↓
useCreateSnack
  ↓
useMutation
  ↓
createSnackAction
  ↓
invalidateQueries(lists)
```

---

## 수정

```txt
SnackEditForm
  ↓
useUpdateSnack
  ↓
updateSnackAction
  ↓
invalidateQueries(lists)
  ↓
invalidateQueries(detail)
```

---

## 삭제

```txt
DeleteButton
  ↓
useDeleteSnack
  ↓
deleteSnackAction
  ↓
invalidateQueries(lists)
```

---

# 18. 코드 스니핏

## Query Key / Options

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

## Prefetch

```ts
// features/snack/prefetch/snack.prefetch.ts
import type { QueryClient } from '@tanstack/react-query'
import {
  snackDetailQueryOptions,
  snackListQueryOptions
} from '../queries/snack.query'
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

## Hook

```ts
// features/snack/hooks/use-snack.ts
'use client'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
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
import type {
  CreateSnackInput,
  SnackSearchParams,
  UpdateSnackInput
} from '../types/snack.type'

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

## Page

```tsx
// app/(default-layout)/(main)/snack/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { SnackList } from '@/features/snack/components/snack-list'
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
      <SnackList params={params} />
    </HydrationBoundary>
  )
}
```

---

# 19. Caution

## 1. React Query를 전역 상태 관리로 오해하지 않기

React Query는 API/DB 데이터 관리 도구입니다.

```txt
서버 데이터
→ TanStack Query

UI 상태
→ Zustand / useState
```

---

## 2. queryKey에 검색 조건을 빼먹지 않기

나쁜 예:

```ts
queryKey: ['snacks']
```

검색 조건이 바뀌어도 같은 캐시로 인식될 수 있습니다.

좋은 예:

```ts
queryKey: snackKeys.list(params)
```

---

## 3. queryKey에 매번 새 객체를 무분별하게 넣지 않기

검색 params는 schema로 정규화한 안정적인 객체를 사용하는 것이 좋습니다.

---

## 4. Mutation 후 invalidate 누락하지 않기

생성/수정/삭제 후 캐시를 갱신하지 않으면 화면이 오래된 데이터를 보여줄 수 있습니다.

---

## 5. Server Action 안에서 hook 호출 불가

나쁜 예:

```ts
'use server'

export async function action() {
  const queryClient = useQueryClient()
}
```

hook은 Client Component 또는 custom hook에서만 사용합니다.

---

## 6. prefetch와 useSuspenseQuery의 queryKey 불일치 주의

Server에서 prefetch한 queryKey와 Client에서 사용하는 queryKey가 다르면 캐시를 재사용하지 못합니다.

---

# 20. Best Practice

## 권장

- queryKey factory 사용
- queryOptions 함수 분리
- prefetch와 useSuspenseQuery에서 같은 queryOptions 사용
- 목록/상세 조회는 useSuspenseQuery 우선 검토
- mutation 성공 후 invalidateQueries 사용
- 검색/정렬/페이징 params는 queryKey에 포함
- repository에서 API/DB 접근 격리
- custom hook으로 컴포넌트에서 query 세부사항 숨기기
- optimistic update는 토글류에 제한적으로 사용

---

## 비권장

- useEffect + fetch로 서버 상태 직접 관리
- queryKey 문자열 하드코딩
- 컴포넌트마다 queryFn 중복 작성
- mutation 후 캐시 갱신 누락
- React Query에 modal/sidebar 상태 저장
- prefetch queryKey와 client queryKey 다르게 작성
- Server Action에서 hook 사용
- Client Component에서 Prisma 직접 호출

---

# 21. 요약

## 역할

```txt
TanStack Query
→ Server State 관리
```

---

## 조회

```txt
Page(Server)
  ↓
prefetchQuery
  ↓
HydrationBoundary
  ↓
useSuspenseQuery
```

---

## 변경

```txt
useMutation
  ↓
Server Action
  ↓
invalidateQueries
```

---

## 핵심 기준

```txt
Query Key는 캐시 주소다.

Query Options는 재사용 단위다.

Prefetch와 useSuspenseQuery는 같은 options를 사용한다.

Mutation 후 invalidateQueries를 수행한다.

Server State와 Client State를 섞지 않는다.
```
