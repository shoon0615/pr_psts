# Search

> Next.js App Router 기반 프로젝트에서 검색, 필터, 정렬, 페이징을 URL 기반으로 처리하는 기준을 정리한 문서입니다.  
> 이 문서는 `searchParams`, `useSearchParams`, `qs`, `nuqs`의 역할을 분리하고 CRUD 목록 화면에 적용하는 방식을 설명합니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 URL 기반으로 관리하는가?](#3-왜-url-기반으로-관리하는가)
- [4. 실무 기준](#4-실무-기준)
- [5. URLSearchParams / searchParams / useSearchParams](#5-urlsearchparams--searchparams--usesearchparams)
- [6. qs](#6-qs)
- [7. nuqs](#7-nuqs)
- [8. shallow 기준](#8-shallow-기준)
- [9. history 기준](#9-history-기준)
- [10. 검색 흐름](#10-검색-흐름)
- [11. 정렬 흐름](#11-정렬-흐름)
- [12. 페이징 흐름](#12-페이징-흐름)
- [13. CRUD 적용 예제](#13-crud-적용-예제)
- [14. 코드 스니핏](#14-코드-스니핏)
- [15. Caution](#15-caution)
- [16. Best Practice](#16-best-practice)
- [17. 요약](#17-요약)

---

# 1. 한눈에 보기

검색, 필터, 정렬, 페이징은 가능하면 URL에 남기는 것이 좋습니다.

```txt
검색 조건
  ↓
URL query string
  ↓
page.tsx searchParams
  ↓
queryKey
  ↓
React Query
```

---

## 역할 분리

| 역할 | 기술 | 사용 위치 |
|---|---|---|
| Server에서 query 읽기 | searchParams prop | page.tsx |
| Client에서 URL query 읽기 | useSearchParams | Client Component |
| Query String 문자열 생성 | qs | repository, util |
| URL 상태 관리 | nuqs | Search, Sort, Pagination |
| 서버 상태 조회 | TanStack Query | List, Detail |

---

## 핵심 기준

```txt
URL에 남아야 하는 상태
→ nuqs / searchParams

API 요청 query string 생성
→ qs

Server Component에서 초기 params 파싱
→ searchParams + Zod

Client 목록 조회
→ params 기반 queryKey
```

---

# 2. 언제 사용하는가?

URL 기반 상태는 다음에 사용합니다.

- 검색어
- 카테고리 필터
- 브랜드 필터
- 정렬 기준
- 정렬 방향
- 현재 페이지
- 페이지 크기
- 탭 상태
- 공유 가능한 목록 조건

---

## URL에 남기는 것이 좋은 상태

| 상태 | 이유 |
|---|---|
| 검색어 | 새로고침/공유/뒤로가기 유지 |
| 필터 | 목록 조건 복원 |
| 정렬 | 같은 결과 재현 |
| 페이지 | 페이지 이동 유지 |
| 탭 | 특정 탭 링크 공유 가능 |

---

## URL에 남기지 않아도 되는 상태

| 상태 | 권장 |
|---|---|
| 모달 open | Zustand / useState |
| 드롭다운 open | local state |
| 입력 중인 임시값 | RHF / useState |
| hover 상태 | CSS |
| sidebar open | Zustand |

---

# 3. 왜 URL 기반으로 관리하는가?

검색 조건을 컴포넌트 state에만 저장하면 다음 문제가 있습니다.

```txt
검색
  ↓
목록 변경
  ↓
새로고침
  ↓
검색 조건 사라짐
```

---

## URL 기반의 장점

| 장점 | 설명 |
|---|---|
| 새로고침 유지 | URL에 조건이 남아 있음 |
| 공유 가능 | 같은 검색 결과 링크 전달 가능 |
| 뒤로가기 지원 | 브라우저 history와 연결 |
| SSR 연동 | page.tsx에서 searchParams 사용 가능 |
| React Query 연동 | queryKey에 params 포함 가능 |

---

## 예시

```txt
/snack?page=2&keyword=초코&brand=lotte&sort=price&order=asc
```

이 URL만으로 다음 상태를 복원할 수 있습니다.

- 2페이지
- 검색어: 초코
- 브랜드: lotte
- 가격 오름차순

---

# 4. 실무 기준

## 추천 구조

```txt
page.tsx
  ↓ searchParams
schema
  ↓ parse
prefetch
  ↓ queryKey
HydrationBoundary
  ↓
Search / Sort / Pagination
  ↓ nuqs
List
  ↓ useSuspenseQuery
```

---

## 파일 위치

```txt
features/snack/
├─ components/
│  ├─ snack-search.tsx
│  ├─ snack-sort.tsx
│  └─ snack-pagination.tsx
├─ schema/
│  └─ snack.schema.ts
├─ hooks/
│  └─ use-snack-search-params.ts
└─ types/
   └─ snack.type.ts
```

---

## 기술별 사용 기준

| 상황 | 권장 |
|---|---|
| Server에서 URL query 읽기 | page.tsx searchParams |
| Client에서 URL query 읽기 | nuqs 또는 useSearchParams |
| Client에서 URL query 변경 | nuqs |
| API 요청 query string 생성 | qs |
| 타입 파싱 | Zod 또는 nuqs parser |
| 목록 재조회 | params를 queryKey에 포함 |

---

# 5. URLSearchParams / searchParams / useSearchParams

## URLSearchParams

브라우저 기본 API입니다.

```ts
const params = new URLSearchParams()
params.set('keyword', '초코')
params.set('page', '1')
```

장점:

- 표준 API
- 별도 라이브러리 불필요

단점:

- 타입 파싱 직접 처리
- 기본값 처리 직접 작성
- 배열/중첩 객체 처리 불편
- React 상태처럼 쓰려면 코드가 늘어남

---

## searchParams prop

Next.js App Router에서 `page.tsx`가 받을 수 있는 URL query 값입니다.

```tsx
export default async function Page({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
}
```

사용 위치:

```txt
Server Component
→ page.tsx
```

적합:

- 초기 검색 조건 파싱
- 서버 prefetch
- SEO/SSR 목록 조회

---

## useSearchParams

Client Component에서 현재 URL query를 읽는 hook입니다.

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SearchInfo() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword')

  return <p>{keyword}</p>
}
```

주의:

- 읽기 중심
- 변경하려면 useRouter, usePathname, URLSearchParams 조합 필요
- 타입 파싱은 직접 처리해야 함

---

# 6. qs

`qs`는 query string을 생성하거나 파싱하는 라이브러리입니다.

```bash
npm install qs
```

---

## 언제 사용하는가?

주로 API 요청 URL을 만들 때 사용합니다.

```txt
object
  ↓
qs.stringify
  ↓
?page=1&keyword=초코
```

---

## 기본 예시

```ts
import qs from 'qs'

const queryString = qs.stringify(
  {
    page: 1,
    keyword: '초코',
    category: 'cookie'
  },
  {
    addQueryPrefix: true
  }
)
```

결과:

```txt
?page=1&keyword=%EC%B4%88%EC%BD%94&category=cookie
```

---

## 빈 값 제거

`skipNulls`는 `null` 제거에는 유용하지만 빈 문자열 `''`은 제거하지 않습니다.

실무에서는 직접 제거 함수를 두는 것이 명확합니다.

```ts
export function removeEmptyQueryParams<T extends Record<string, unknown>>(
  params: T
) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}
```

---

## 0 주의

다음처럼 작성하면 안 됩니다.

```ts
if (!value) return false
```

이유:

```txt
0
false
''
null
undefined
```

가 모두 제거됩니다.

페이지, 가격처럼 `0`이 유효한 값이라면 문제가 됩니다.

---

## 배열 처리

```ts
qs.stringify(
  {
    category: ['cookie', 'bread']
  },
  {
    arrayFormat: 'repeat'
  }
)
```

결과:

```txt
category=cookie&category=bread
```

---

## repository에서 사용

```ts
import qs from 'qs'
import { api } from '@/shared/lib/axios'
import { removeEmptyQueryParams } from '@/shared/utils/query'
import type { SnackSearchParams } from '../types/snack.type'

export async function getSnacks(params: SnackSearchParams) {
  const queryString = qs.stringify(removeEmptyQueryParams(params), {
    addQueryPrefix: true,
    arrayFormat: 'repeat'
  })

  const { data } = await api.get(`/snacks${queryString}`)
  return data
}
```

---

# 7. nuqs

`nuqs`는 URL query string을 React state처럼 관리하기 위한 라이브러리입니다.

```bash
npm install nuqs
```

---

## 언제 사용하는가?

Client Component에서 검색/정렬/페이징 상태를 URL과 동기화할 때 사용합니다.

```txt
React State
  ↕
URL Query String
```

---

## 기본 예시

```tsx
'use client'

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

export const snackSearchParsers = {
  page: parseAsInteger.withDefault(1),
  keyword: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault('')
}

export function useSnackSearchParams() {
  return useQueryStates(snackSearchParsers, {
    history: 'replace',
    shallow: false
  })
}
```

---

## qs와 nuqs 차이

| 구분 | qs | nuqs |
|---|---|---|
| 목적 | query string 문자열 변환 | URL 상태 관리 |
| React 의존 | 없음 | 있음 |
| 사용 위치 | util, repository | Client Component |
| 타입 파싱 | 직접 또는 Zod | parser 제공 |
| URL 변경 | 직접 router 처리 | setter 제공 |
| 상태 관리 | 안 함 | 함 |

---

# 8. shallow 기준

nuqs의 `shallow`은 URL 변경이 서버까지 영향을 줄지 결정합니다.

---

## shallow: true

```txt
URL만 Client에서 변경
Server Component 재실행 없음
```

적합:

- Client에서 React Query만 재조회하는 구조
- Server Component prefetch가 필요 없는 경우
- UI 상태성 query

---

## shallow: false

```txt
URL 변경
  ↓
Next navigation
  ↓
page.tsx searchParams 갱신
  ↓
Server Component 재실행 가능
  ↓
prefetch 재실행
```

적합:

- page.tsx searchParams를 기준으로 prefetch하는 경우
- 서버에서 검색 조건을 다시 읽어야 하는 경우
- SSR/RSC 흐름과 검색 조건을 맞추는 경우

---

## 실무 기준

현재 프로젝트처럼:

```txt
Page(Server)
  ↓ searchParams
prefetchQuery
  ↓
HydrationBoundary
```

구조라면 `shallow: false`가 더 자연스럽습니다.

반면:

```txt
Client only
  ↓
useSuspenseQuery
  ↓
Route Handler
```

구조라면 `shallow: true`도 가능합니다.

---

# 9. history 기준

## replace

현재 history를 교체합니다.

```txt
검색/필터/정렬/페이징
→ replace 권장
```

이유:

- 검색어 입력마다 뒤로가기 history가 쌓이지 않음
- 목록 조건 변경에 적합

---

## push

새 history를 추가합니다.

```txt
단계 이동
탭 이동
상세 페이지 이동
```

---

## 실무 기준

| 상황 | history |
|---|---|
| 검색어 변경 | replace |
| 필터 변경 | replace |
| 정렬 변경 | replace |
| 페이지 변경 | replace 또는 push |
| 상세 페이지 이동 | push |
| 탭이 의미 있는 URL 상태 | push 가능 |

---

# 10. 검색 흐름

## submit 기반 검색

검색 버튼을 눌렀을 때만 URL을 변경합니다.

```txt
Input 입력
  ↓
submit
  ↓
setSearchParams
  ↓
URL 변경
  ↓
queryKey 변경
  ↓
목록 재조회
```

적합:

- 일반 CRUD 검색
- 서버 요청을 줄이고 싶은 경우
- 사용자가 명시적으로 검색 버튼을 누르는 UX

---

## debounce 기반 검색

입력 후 일정 시간 뒤 URL을 변경합니다.

```txt
Input 입력
  ↓ debounce
URL 변경
  ↓
목록 재조회
```

적합:

- 자동 완성
- 실시간 검색
- 필터 UI

주의:

- 요청 빈도 관리 필요
- history는 replace 권장

---

# 11. 정렬 흐름

정렬은 보통 URL 상태로 관리합니다.

```txt
Sort Select
  ↓
setSearchParams({ sort, order, page: 1 })
  ↓
URL 변경
  ↓
queryKey 변경
  ↓
목록 재조회
```

---

## 정렬 변경 시 page 초기화

정렬 기준이 바뀌면 보통 1페이지로 이동합니다.

```ts
setSearchParams({
  sort: 'price',
  order: 'asc',
  page: 1
})
```

이유:

- 기존 페이지가 새 정렬 결과에서 의미 없을 수 있음
- UX가 더 예측 가능함

---

# 12. 페이징 흐름

```txt
Pagination Button
  ↓
setSearchParams({ page })
  ↓
URL 변경
  ↓
queryKey 변경
  ↓
목록 재조회
```

---

## 페이지 범위

페이지 계산은 공통 유틸로 분리할 수 있습니다.

```ts
export function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
```

---

# 13. CRUD 적용 예제

## Snack 목록

```txt
/snack?page=1&keyword=초코&sort=price&order=asc
```

흐름:

```txt
SnackPage
  ↓
parseSnackSearchParams
  ↓
prefetchSnackList
  ↓
SnackSearch / SnackSort / SnackPagination
  ↓
useSnackSearchParams
```

---

## Board 목록

```txt
/board?page=1&keyword=공지&sort=createdAt&order=desc
```

Board는 보통 다음 검색 조건을 갖습니다.

- keyword
- page
- sort
- order

---

# 14. 코드 스니핏

## Search Params Schema

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

export type SnackSearchParams = z.infer<typeof snackSearchParamsSchema>

export function parseSnackSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): SnackSearchParams {
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

## nuqs Hook

```ts
// features/snack/hooks/use-snack-search-params.ts
'use client'

import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates
} from 'nuqs'

export const snackSearchParsers = {
  page: parseAsInteger.withDefault(1),
  keyword: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  sort: parseAsStringEnum(['createdAt', 'title', 'price']).withDefault('createdAt'),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
}

export function useSnackSearchParams() {
  const [params, setParams] = useQueryStates(snackSearchParsers, {
    history: 'replace',
    shallow: false,
    scroll: false,
    clearOnDefault: true
  })

  return {
    params,
    setParams
  }
}
```

---

## Search Component

```tsx
// features/snack/components/snack-search.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useSnackSearchParams } from '../hooks/use-snack-search-params'

type SearchFormValues = {
  keyword: string
}

export function SnackSearch() {
  const { params, setParams } = useSnackSearchParams()

  const form = useForm<SearchFormValues>({
    defaultValues: {
      keyword: params.keyword
    }
  })

  function onSubmit(values: SearchFormValues) {
    setParams({
      keyword: values.keyword,
      page: 1
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('keyword')} placeholder="검색어" />
      <button type="submit">검색</button>
    </form>
  )
}
```

---

## Sort Component

```tsx
// features/snack/components/snack-sort.tsx
'use client'

import { useSnackSearchParams } from '../hooks/use-snack-search-params'

export function SnackSort() {
  const { params, setParams } = useSnackSearchParams()

  return (
    <select
      value={`${params.sort}:${params.order}`}
      onChange={event => {
        const [sort, order] = event.target.value.split(':') as [
          'createdAt' | 'title' | 'price',
          'asc' | 'desc'
        ]

        setParams({
          sort,
          order,
          page: 1
        })
      }}
    >
      <option value="createdAt:desc">최신순</option>
      <option value="title:asc">이름순</option>
      <option value="price:asc">가격 낮은순</option>
      <option value="price:desc">가격 높은순</option>
    </select>
  )
}
```

---

## Pagination Component

```tsx
// features/snack/components/snack-pagination.tsx
'use client'

import { useSnackSearchParams } from '../hooks/use-snack-search-params'

export function SnackPagination({
  currentPage,
  totalPages
}: {
  currentPage: number
  totalPages: number
}) {
  const { setParams } = useSnackSearchParams()

  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <nav>
      {pages.map(page => (
        <button
          key={page}
          disabled={page === currentPage}
          onClick={() => setParams({ page })}
        >
          {page}
        </button>
      ))}
    </nav>
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

## qs Utility

```ts
// shared/utils/query.ts
import qs from 'qs'

export function removeEmptyQueryParams<T extends Record<string, unknown>>(
  params: T
) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}

export function toQueryString(params: Record<string, unknown>) {
  return qs.stringify(removeEmptyQueryParams(params), {
    addQueryPrefix: true,
    arrayFormat: 'repeat'
  })
}
```

---

## Repository

```ts
// features/snack/repositories/snack.repository.ts
import { api } from '@/shared/lib/axios'
import { toQueryString } from '@/shared/utils/query'
import type { SnackSearchParams } from '../schema/snack.schema'

export const snackRepository = {
  async list(params: SnackSearchParams) {
    const queryString = toQueryString(params)
    const { data } = await api.get(`/snacks${queryString}`)
    return data
  }
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
import { SnackSearch } from '@/features/snack/components/snack-search'
import { SnackSort } from '@/features/snack/components/snack-sort'
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
      <SnackSearch />
      <SnackSort />
      <SnackList params={params} />
    </HydrationBoundary>
  )
}
```

---

# 15. Caution

## 1. 빈 값 제거에서 0을 제거하지 않기

나쁜 예:

```ts
Boolean(value)
```

이 방식은 `0`도 제거합니다.

권장:

```ts
value !== '' && value !== null && value !== undefined
```

---

## 2. searchParams는 문자열 기반이다

URL query는 기본적으로 문자열입니다.

```txt
?page=1
```

여기서 `1`은 숫자가 아니라 문자열입니다.

권장:

```ts
z.coerce.number()
```

또는 nuqs parser:

```ts
parseAsInteger
```

---

## 3. useSearchParams는 읽기 중심이다

URL을 변경하려면 직접 router를 조합하거나 nuqs를 사용하는 것이 편합니다.

---

## 4. shallow 값을 무조건 false로 두지 않기

`shallow: false`는 Server Component 재실행이 필요한 구조에서 적합합니다.

Client Query만으로 충분하다면 `shallow: true`도 가능합니다.

---

## 5. 정렬/필터 변경 시 page 초기화

정렬 조건이 바뀌었는데 기존 page를 유지하면 빈 결과가 나올 수 있습니다.

권장:

```ts
setParams({ sort, order, page: 1 })
```

---

## 6. 검색 입력과 URL 상태를 즉시 동기화할지 결정하기

| 방식 | 특징 |
|---|---|
| submit | 요청 수 적음, 명확함 |
| debounce | UX 부드러움, 요청 관리 필요 |
| 즉시 반영 | 필터 UI에 적합, history 관리 필요 |

---

# 16. Best Practice

## 권장

- 검색/정렬/필터/페이징은 URL에 저장
- page.tsx에서 searchParams를 Zod로 파싱
- Client에서는 nuqs로 URL 상태 관리
- API 요청 query string은 qs로 생성
- 빈 값 제거 유틸을 공통화
- 정렬/필터 변경 시 page를 1로 초기화
- queryKey에 정규화된 params 포함
- history는 검색/필터에서 replace 우선
- shallow는 구조에 맞춰 선택
- 검색 submit 방식과 debounce 방식을 명확히 구분

---

## 비권장

- 검색 조건을 useState에만 저장
- page 값을 문자열 그대로 사용
- `!value`로 빈 값 제거
- URLSearchParams 로직을 컴포넌트마다 반복
- queryKey에서 params 누락
- 정렬 변경 후 기존 page 유지
- shallow 의미를 모른 채 false/true 고정
- modal/sidebar 상태를 URL에 저장

---

# 17. 요약

## 역할 분리

```txt
searchParams
→ Server에서 URL query 읽기

useSearchParams
→ Client에서 URL query 읽기

nuqs
→ Client에서 URL query 상태 관리

qs
→ API 요청 query string 생성

Zod
→ searchParams 검증/변환

React Query
→ params 기반 서버 상태 조회
```

---

## 추천 흐름

```txt
URL
  ↓
page.tsx searchParams
  ↓
Zod parse
  ↓
prefetchQuery
  ↓
HydrationBoundary
  ↓
Client Search UI
  ↓
nuqs
  ↓
queryKey 변경
  ↓
목록 재조회
```

---

## 핵심 기준

```txt
공유/복원되어야 하는 상태는 URL에 둔다.

URL 값은 문자열이므로 검증/변환한다.

검색/정렬/페이징 params는 queryKey에 포함한다.

API 요청 query string 생성은 qs로 공통화한다.

Client URL 상태 관리는 nuqs로 단순화한다.
```
