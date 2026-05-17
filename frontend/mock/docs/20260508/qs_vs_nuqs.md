# qs vs nuqs

`qs` 와 `nuqs` 는 모두 URL Query String(쿼리스트링)을 다루기 위한 도구이지만,  
역할과 사용 위치가 다릅니다.

간단히 말하면 다음과 같습니다.

```txt
qs   = 객체와 query string 문자열을 변환하는 유틸리티
nuqs = Next.js/React에서 URL query string을 상태처럼 관리하는 라이브러리
```

---

# 1. qs

## 개념

`qs` 는 **query string 문자열을 파싱(parse)하거나 생성(stringify)하는 라이브러리**입니다.

즉, 아래 변환을 담당합니다.

```txt
객체 ↔ URL query string 문자열
```

예를 들어 다음 객체가 있다고 가정합니다.

```ts
const params = {
  page: 1,
  keyword: 'cookie',
  category: 'snack'
}
```

이를 URL query string 으로 바꾸면 다음과 같습니다.

```txt
page=1&keyword=cookie&category=snack
```

이런 변환을 편하게 해주는 도구가 `qs` 입니다.

---

## qs 의 주요 역할

| 역할 | 설명 |
|---|---|
| `stringify` | 객체를 query string 문자열로 변환 |
| `parse` | query string 문자열을 객체로 변환 |
| 배열 처리 | `ids=1&ids=2`, `ids[]=1&ids[]=2` 같은 형식 지원 |
| 중첩 객체 처리 | `{ filter: { brand: 'A' } }` 같은 구조 지원 |
| 빈 값 제거 | `skipNulls`, 직접 필터링 등으로 처리 가능 |
| 인코딩 처리 | 한글, 공백, 특수문자 URL 인코딩 처리 |

---

## qs 예제 1. 객체를 query string 으로 변환

```ts
import qs from 'qs'

const queryString = qs.stringify({
  page: 1,
  keyword: '초코',
  category: 'cookie'
})

console.log(queryString)
```

결과:

```txt
page=1&keyword=%EC%B4%88%EC%BD%94&category=cookie
```

URL 에 붙이면 다음과 같이 사용할 수 있습니다.

```ts
const url = `/api/snacks?${queryString}`
```

---

## qs 예제 2. query string 을 객체로 변환

```ts
import qs from 'qs'

const params = qs.parse('page=1&keyword=초코&category=cookie')

console.log(params)
```

결과:

```ts
{
  page: '1',
  keyword: '초코',
  category: 'cookie'
}
```

주의할 점은 `qs.parse()` 결과는 기본적으로 문자열 기반입니다.

```ts
page: '1'
```

즉, 숫자 `1` 이 아니라 문자열 `'1'` 로 들어옵니다.  
타입 변환은 직접 하거나 zod 같은 검증 도구와 함께 처리하는 것이 좋습니다.

---

## qs 예제 3. null 값 제거

```ts
import qs from 'qs'

const queryString = qs.stringify(
  {
    page: 1,
    keyword: '',
    brand: null,
    category: 'cookie'
  },
  {
    skipNulls: true
  }
)

console.log(queryString)
```

결과:

```txt
page=1&keyword=&category=cookie
```

`skipNulls: true` 는 `null` 은 제거하지만, 빈 문자열 `''` 은 제거하지 않습니다.

빈 문자열까지 제거하려면 직접 필터링하는 방식이 일반적입니다.

```ts
function removeEmptyParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined
    )
  )
}

const queryString = qs.stringify(
  removeEmptyParams({
    page: 1,
    keyword: '',
    brand: null,
    category: 'cookie'
  })
)

console.log(queryString)
```

결과:

```txt
page=1&category=cookie
```

---

## qs 예제 4. 배열 query string 처리

```ts
import qs from 'qs'

const queryString = qs.stringify({
  categories: ['cookie', 'bread', 'drink']
})

console.log(queryString)
```

기본 결과는 옵션에 따라 달라질 수 있습니다.

실무에서는 보통 `arrayFormat` 을 명시하는 것이 좋습니다.

```ts
const queryString = qs.stringify(
  {
    categories: ['cookie', 'bread', 'drink']
  },
  {
    arrayFormat: 'repeat'
  }
)

console.log(queryString)
```

결과:

```txt
categories=cookie&categories=bread&categories=drink
```

또는 `brackets` 방식을 사용할 수 있습니다.

```ts
const queryString = qs.stringify(
  {
    categories: ['cookie', 'bread', 'drink']
  },
  {
    arrayFormat: 'brackets'
  }
)

console.log(queryString)
```

결과:

```txt
categories[]=cookie&categories[]=bread&categories[]=drink
```

---

## qs 를 사용하는 위치

`qs` 는 보통 다음 위치에서 사용합니다.

```txt
Client Component
Server Component
Route Handler
Server Action
Service
Repository
```

프레임워크에 의존하지 않는 단순 유틸리티이므로 어디서든 사용할 수 있습니다.

---

## qs 실무 예제

### repository 에서 query string 생성

```ts
import qs from 'qs'
import { api } from '@/lib/api'

type SnackSearchParams = {
  page?: number
  keyword?: string
  brand?: string
  category?: string
}

function removeEmptyParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined
    )
  )
}

export async function getSnacks(params: SnackSearchParams) {
  const queryString = qs.stringify(removeEmptyParams(params), {
    addQueryPrefix: true
  })

  const response = await api.get(`/snacks${queryString}`)

  return response.data
}
```

사용 예:

```ts
await getSnacks({
  page: 1,
  keyword: '',
  brand: '',
  category: 'cookie'
})
```

요청 URL:

```txt
/snacks?page=1&category=cookie
```

---

# 2. nuqs

## 개념

`nuqs` 는 **Next.js / React 에서 URL query string 을 React 상태처럼 관리하기 위한 라이브러리**입니다.

즉, 아래와 같은 역할을 합니다.

```txt
URL query string ↔ React state
```

예를 들어 URL 이 다음과 같다면:

```txt
/snacks?page=2&brand=lotte&category=cookie
```

컴포넌트에서는 다음처럼 상태로 사용할 수 있습니다.

```ts
const [params, setParams] = useQueryStates(...)
```

즉, `useState` 처럼 다루지만 실제 값은 URL query string 과 연결됩니다.

---

## nuqs 의 주요 역할

| 역할 | 설명 |
|---|---|
| URL query 상태 관리 | query string 을 React state 처럼 사용 |
| 타입 파서 제공 | `parseAsString`, `parseAsInteger` 등 |
| 기본값 설정 | `.withDefault()` 지원 |
| URL 업데이트 | `setSearchParams()` 로 URL 변경 |
| Next.js App Router 연동 | searchParams, Server Component 재실행과 연결 가능 |
| history 제어 | `replace`, `push` 선택 가능 |
| shallow 제어 | 서버 재실행 여부 제어 |
| debounce/throttle | URL 업데이트 빈도 제한 |
| urlKeys | 내부 state 이름과 실제 URL key 분리 |

---

# 3. qs 와 nuqs 의 핵심 차이

| 구분 | qs | nuqs |
|---|---|---|
| 목적 | query string 문자열 변환 | URL query 를 React 상태로 관리 |
| 주요 기능 | `parse`, `stringify` | `useQueryState`, `useQueryStates` |
| React 의존성 | 없음 | 있음 |
| Next.js 연동 | 직접 없음 | App Router 연동 |
| 상태 관리 | 안 함 | 함 |
| URL 변경 | 직접 문자열 만들어 이동해야 함 | setter 로 URL 변경 |
| 타입 파싱 | 직접 처리 | parser 제공 |
| 기본값 | 직접 처리 | `.withDefault()` |
| shallow 제어 | 없음 | 있음 |
| 사용 위치 | service/repository/util | Client Component 중심 |

---

# 4. nuqs 기본 예제

## search params 정의

```ts
import {
  parseAsInteger,
  parseAsString,
  useQueryStates
} from 'nuqs'

export const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault('')
}
```

---

## Client Component 에서 사용

```tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from './search-params'

export function SnackSearchForm() {
  const [params, setParams] = useQueryStates(snackSearchParams)

  return (
    <div>
      <select
        value={params.brand}
        onChange={(event) => {
          setParams({
            brand: event.target.value,
            page: 1
          })
        }}
      >
        <option value="">전체 브랜드</option>
        <option value="lotte">롯데</option>
        <option value="orion">오리온</option>
      </select>

      <select
        value={params.category}
        onChange={(event) => {
          setParams({
            category: event.target.value,
            page: 1
          })
        }}
      >
        <option value="">전체 카테고리</option>
        <option value="cookie">쿠키</option>
        <option value="drink">음료</option>
      </select>
    </div>
  )
}
```

---

# 5. nuqs 의 shallow 옵션

## 기본값

`nuqs` 는 기본적으로 `shallow: true` 입니다.

```ts
useQueryStates(snackSearchParams)
```

이는 다음과 비슷합니다.

```ts
useQueryStates(snackSearchParams, {
  shallow: true
})
```

---

## shallow: true

```ts
const [params, setParams] = useQueryStates(snackSearchParams, {
  shallow: true
})
```

의미:

```txt
URL 은 변경된다.
하지만 Next.js Server Component 는 다시 실행되지 않는다.
```

즉, 클라이언트 상태만 바뀌는 느낌에 가깝습니다.

적합한 경우:

```txt
- 클라이언트에서만 필터링
- 탭 상태
- 모달 상태
- 정렬 UI만 변경
- 서버 재조회가 필요 없는 검색 조건
```

---

## shallow: false

```ts
const [params, setParams] = useQueryStates(snackSearchParams, {
  shallow: false
})
```

의미:

```txt
URL 이 변경된다.
Next.js 라우터에 변경이 전달된다.
Server Component 가 다시 실행될 수 있다.
page.tsx 의 searchParams 기반 로직도 다시 실행된다.
```

적합한 경우:

```txt
- URL 변경 시 서버에서 다시 조회해야 하는 검색
- page.tsx 에서 searchParams 를 받아 prefetchQuery 하는 구조
- 서버 컴포넌트에서 searchParams 기반으로 데이터가 달라지는 구조
- SSR 결과가 URL query 에 따라 달라져야 하는 화면
```

---

## shallow: false 예제

```tsx
'use client'

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault('')
}

export function useSnackSearchParams() {
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams, {
    shallow: false
  })

  return {
    searchParams,
    setSearchParams
  }
}
```

이 경우:

```ts
setSearchParams({
  brand: 'lotte',
  page: 1
})
```

를 실행하면 URL 이 다음처럼 변경됩니다.

```txt
/snacks?brand=lotte&page=1
```

그리고 `page.tsx` 가 `searchParams` 를 기준으로 다시 실행될 수 있습니다.

---

# 6. Next.js + nuqs + React Query 구조

## page.tsx

```tsx
import {
  HydrationBoundary,
  QueryClient,
  dehydrate
} from '@tanstack/react-query'
import { SnackList } from './SnackList'
import { snackListQueryOptions } from './queries'

type PageProps = {
  searchParams: Promise<{
    page?: string
    brand?: string
    category?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const params = {
    page: Number(resolvedSearchParams.page ?? 1),
    brand: resolvedSearchParams.brand ?? '',
    category: resolvedSearchParams.category ?? ''
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(snackListQueryOptions(params))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackList initialParams={params} />
    </HydrationBoundary>
  )
}
```

---

## Client Component

```tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useSnackSearchParams } from './useSnackSearchParams'
import { snackListQueryOptions } from './queries'

export function SnackList() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  const { data } = useSuspenseQuery(
    snackListQueryOptions(searchParams)
  )

  return (
    <div>
      <button
        onClick={() => {
          setSearchParams({
            category: 'cookie',
            page: 1
          })
        }}
      >
        쿠키 검색
      </button>

      <ul>
        {data.map((snack) => (
          <li key={snack.id}>{snack.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

# 7. nuqs 의 history 옵션

## replace

```ts
useQueryStates(snackSearchParams, {
  history: 'replace'
})
```

현재 URL 을 교체합니다.

적합한 경우:

```txt
- 검색
- 필터
- 정렬
- 페이지 번호
```

검색 조건을 바꿀 때마다 브라우저 뒤로가기 기록이 계속 쌓이는 것은 불편할 수 있으므로, 일반적으로 검색/필터에는 `replace` 가 적합합니다.

---

## push

```ts
useQueryStates(snackSearchParams, {
  history: 'push'
})
```

브라우저 history 에 새 기록을 추가합니다.

적합한 경우:

```txt
- 탭 이동
- 단계 이동
- 사용자가 뒤로가기로 이전 상태를 복원하길 기대하는 UI
```

---

# 8. nuqs 의 scroll 옵션

```ts
useQueryStates(snackSearchParams, {
  scroll: false
})
```

URL 변경 후 스크롤 위치를 유지합니다.

검색 조건 변경 시 화면이 맨 위로 올라가는 것을 원하지 않는 경우 유용합니다.

반대로 검색 조건이 바뀔 때 목록 상단으로 이동해야 한다면 `scroll: true` 를 사용할 수 있습니다.

---

# 9. nuqs 의 clearOnDefault 옵션

```ts
const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault('')
}

const [params, setParams] = useQueryStates(snackSearchParams, {
  clearOnDefault: true
})
```

기본값과 같은 값은 URL 에서 제거합니다.

예를 들어:

```ts
setParams({
  page: 1,
  brand: '',
  category: ''
})
```

결과 URL:

```txt
/snacks
```

반대로 `clearOnDefault: false` 이면 다음처럼 남을 수 있습니다.

```txt
/snacks?page=1&brand=&category=
```

실무에서는 URL 을 깔끔하게 유지하기 위해 `clearOnDefault: true` 가 유용합니다.

---

# 10. nuqs 의 limitUrlUpdates

검색 input 처럼 값이 자주 바뀌는 경우, 입력할 때마다 URL 을 변경하면 너무 많은 라우터 업데이트가 발생할 수 있습니다.

이때 `debounce` 또는 `throttle` 을 사용할 수 있습니다.

```ts
import { debounce, parseAsString, useQueryStates } from 'nuqs'

const searchParams = {
  keyword: parseAsString.withDefault('')
}

const [params, setParams] = useQueryStates(searchParams, {
  limitUrlUpdates: debounce(300)
})
```

사용 예:

```tsx
<input
  value={params.keyword}
  onChange={(event) => {
    setParams({
      keyword: event.target.value
    })
  }}
/>
```

의미:

```txt
사용자가 입력을 멈춘 뒤 300ms 후 URL 을 한 번만 업데이트한다.
```

적합한 경우:

```txt
- 검색어 입력
- 자동완성
- 슬라이더
- 가격 범위 필터
```

---

# 11. nuqs 의 startTransition 옵션

`shallow: false` 를 사용하면 URL 변경이 서버 컴포넌트 재실행과 연결될 수 있습니다.

이때 `startTransition` 을 넘기면 pending 상태를 UI 에 표시할 수 있습니다.

```tsx
'use client'

import { useTransition } from 'react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  category: parseAsString.withDefault('')
}

export function SnackSearchFilter() {
  const [isPending, startTransition] = useTransition()

  const [params, setParams] = useQueryStates(snackSearchParams, {
    shallow: false,
    startTransition
  })

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          setParams({
            category: 'cookie',
            page: 1
          })
        }}
      >
        쿠키
      </button>

      {isPending && <p>검색 중...</p>}
    </div>
  )
}
```

의미:

```txt
URL 변경 + 서버 재실행이 transition 으로 처리된다.
그 사이 isPending 으로 로딩 UI 를 보여줄 수 있다.
```

---

# 12. nuqs 의 urlKeys

내부 state 이름과 실제 URL query key 를 다르게 하고 싶을 때 사용합니다.

```ts
const [params, setParams] = useQueryStates(
  {
    keyword: parseAsString.withDefault('')
  },
  {
    urlKeys: {
      keyword: 'q'
    }
  }
)
```

컴포넌트 내부에서는 다음처럼 사용합니다.

```ts
params.keyword
```

하지만 URL 은 다음처럼 생성됩니다.

```txt
/snacks?q=초코
```

적합한 경우:

```txt
- 코드에서는 명확한 변수명 사용
- URL 은 짧게 유지
- 외부 API query key 와 화면 내부 상태명을 분리
```

---

# 13. qs 와 nuqs 를 함께 사용하는 구조

둘은 대체 관계가 아니라 함께 사용할 수 있습니다.

```txt
nuqs
- 브라우저 URL query 상태 관리
- 검색 조건을 React state 처럼 사용

qs
- API 요청 URL 생성
- repository/service 에서 query string 생성
```

---

## 예시 흐름

```txt
1. 사용자가 검색 조건 변경
2. nuqs setSearchParams 실행
3. URL query string 변경
4. page.tsx 또는 Client Component 가 변경된 params 사용
5. React Query queryKey 변경
6. queryFn 실행
7. repository 에서 qs.stringify 로 API URL 생성
8. 서버 또는 외부 API 호출
```

---

## 전체 예제

### useSnackSearchParams.ts

```ts
'use client'

import {
  parseAsInteger,
  parseAsString,
  useQueryStates
} from 'nuqs'

export const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  keyword: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault('')
}

export function useSnackSearchParams() {
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams, {
    shallow: false,
    history: 'replace',
    scroll: false,
    clearOnDefault: true
  })

  return {
    searchParams,
    setSearchParams
  }
}
```

---

### snack.repository.ts

```ts
import qs from 'qs'
import { api } from '@/lib/api'

export type SnackSearchParams = {
  page: number
  keyword: string
  brand: string
  category: string
}

function removeEmptyParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined
    )
  )
}

export async function getSnacks(params: SnackSearchParams) {
  const queryString = qs.stringify(removeEmptyParams(params), {
    addQueryPrefix: true
  })

  const response = await api.get(`/snacks${queryString}`)

  return response.data
}
```

---

### snack.queries.ts

```ts
import { queryOptions } from '@tanstack/react-query'
import { getSnacks, SnackSearchParams } from './snack.repository'

export const snackKeys = {
  list: (params: SnackSearchParams) => ['snacks', 'list', params] as const
}

export function snackListQueryOptions(params: SnackSearchParams) {
  return queryOptions({
    queryKey: snackKeys.list(params),
    queryFn: () => getSnacks(params)
  })
}
```

---

### SnackList.tsx

```tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useSnackSearchParams } from './useSnackSearchParams'
import { snackListQueryOptions } from './snack.queries'

export function SnackList() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  const { data } = useSuspenseQuery(
    snackListQueryOptions(searchParams)
  )

  return (
    <div>
      <button
        onClick={() => {
          setSearchParams({
            category: 'cookie',
            page: 1
          })
        }}
      >
        쿠키
      </button>

      <button
        onClick={() => {
          setSearchParams({
            category: '',
            page: 1
          })
        }}
      >
        전체
      </button>

      <ul>
        {data.map((snack) => (
          <li key={snack.id}>{snack.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

# 14. 실무 기준 정리

## qs 를 쓰기 좋은 경우

```txt
- API 요청 URL 을 만들 때
- repository/service 계층에서 query string 을 생성할 때
- 중첩 객체나 배열 query 를 처리할 때
- React/Next.js 와 무관하게 query string 변환만 필요할 때
```

---

## nuqs 를 쓰기 좋은 경우

```txt
- 검색 조건을 URL 에 유지해야 할 때
- 새로고침해도 필터 상태가 유지되어야 할 때
- 공유 가능한 검색 URL 이 필요할 때
- Next.js App Router 에서 searchParams 기반 화면을 만들 때
- URL query 를 useState 처럼 다루고 싶을 때
```

---

# 15. 결론

`qs` 와 `nuqs` 는 역할이 다릅니다.

```txt
qs
= query string 변환 도구

nuqs
= URL query string 상태 관리 도구
```

실무에서는 보통 다음처럼 나눠서 사용합니다.

```txt
Client Component
  → nuqs 로 URL 검색 조건 관리

page.tsx
  → searchParams 를 기준으로 SSR/prefetch 처리

queryFn / repository
  → qs 로 API 요청 query string 생성
```

즉:

```txt
nuqs 는 화면의 URL 상태를 관리한다.
qs 는 API 요청 문자열을 만든다.
```

이렇게 이해하면 됩니다.
