# Next.js 검색 화면 구조 가이드

> 기준 화면 구조  
> **상단: Search 검색 버튼**  
> **중단: 필터 / 정렬**  
> **하단: 목록**  
> **최하단: 페이징**

---

## 0. 결론

이 구조에서는 다음 조합을 추천한다.

```txt
검색어 입력 + 검색 버튼
→ next/form 또는 일반 form

필터 / 정렬 / 페이징
→ nuqs

목록 조회 / 캐시 / 재조회
→ TanStack Query, React Query

등록 / 수정 form
→ React Hook Form + zod
```

단, **검색 화면만 놓고 보면 RHF는 굳이 필요하지 않다.**  
RHF는 create/edit처럼 입력값 검증, 에러 메시지, touched/dirty 상태 관리가 필요한 form에 더 적합하다.

---

## 1. 라이브러리 선택 기준

### 1.1 사용하는 것이 좋은 라이브러리

| 라이브러리              |            사용 여부 | 이유                                             |
| ----------------------- | -------------------: | ------------------------------------------------ |
| `@tanstack/react-query` |                 사용 | 서버 데이터 조회, 캐시, 재조회, stale 상태 관리  |
| `nuqs`                  |                 사용 | URL query string을 타입 기반 상태로 관리         |
| `next/form`             |                 선택 | 검색 버튼 submit 기반 UI라면 간단하고 자연스러움 |
| `zod`                   | create/edit에서 사용 | 입력값 검증, API boundary validation             |
| `react-hook-form`       | create/edit에서 사용 | 복잡한 입력 form 상태 관리                       |
| `@hookform/resolvers`   | create/edit에서 사용 | RHF와 zod 연결                                   |
| `qs`                    |                 선택 | API 요청 query string 직렬화가 복잡할 때 사용    |

### 1.2 굳이 추가하지 않아도 되는 경우

| 상황                                           | 굳이 필요 없는 것                                     |
| ---------------------------------------------- | ----------------------------------------------------- |
| 단순 검색어 하나만 있는 화면                   | RHF, zod, qs                                          |
| 검색 버튼 클릭 시 URL만 바꾸면 되는 화면       | nuqs 없이 `next/form`만 가능                          |
| 필터/정렬/페이징을 즉시 URL 반영해야 하는 화면 | `next/form` 없이 nuqs만으로 가능                      |
| API 요청 params가 단순한 객체                  | qs 없이 `URLSearchParams` 또는 axios params 사용 가능 |

---

## 2. 실무 추천 구조

```txt
app/
└─ (default-layout)/
   └─ (main)/
      └─ snack/
         ├─ page.tsx
         └─ _components/
            ├─ snack-search-form.tsx
            ├─ snack-filter-sort.tsx
            ├─ snack-list.tsx
            └─ snack-pagination.tsx

features/
└─ snack/
   ├─ api/
   │  └─ snack.api.ts
   ├─ hooks/
   │  └─ use-snack-list.ts
   ├─ queries/
   │  └─ snack.query.ts
   ├─ schema/
   │  └─ snack-search-params.ts
   └─ types/
      └─ snack.type.ts
```

검색 화면만 기준으로 하면 `RHF + zod` 파일은 아직 필요 없다.  
create/edit 화면이 생길 때 `snack-form.schema.ts`, `snack-form.tsx`를 추가하는 쪽이 낫다.

---

## 3. searchParams schema

```ts
// features/snack/schema/snack-search-params.ts
import { parseAsInteger, parseAsString, inferParserType } from 'nuqs'

export const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  keyword: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  sort: parseAsString.withDefault('latest')
}

export type SnackSearchParams = inferParserType<typeof snackSearchParams>
```

### 변수명 기준

```ts
const [searchParams, setSearchParams] = useQueryStates(snackSearchParams)
```

추천 변수명은 `searchParams`다.

```ts
const [params, setParams] = useQueryStates(snackSearchParams)
```

이것도 가능하지만, Next의 route `params`와 헷갈릴 수 있다.

---

## 4. React Query queryOptions

```ts
// features/snack/queries/snack.query.ts
import { queryOptions } from '@tanstack/react-query'
import { getSnackList } from '../api/snack.api'
import type { SnackSearchParams } from '../schema/snack-search-params'

export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (searchParams: SnackSearchParams) =>
    [...snackKeys.lists(), searchParams] as const
}

export const snackListQueryOptions = (searchParams: SnackSearchParams) =>
  queryOptions({
    queryKey: snackKeys.list(searchParams),
    queryFn: () => getSnackList(searchParams)
  })
```

`queryKey`에 검색 조건을 포함해야 한다.

```txt
/snack?brand=nongshim
→ queryKey: ['snack', 'list', { brand: 'nongshim', ... }]

/snack?brand=lotte
→ queryKey 변경
→ React Query 재조회
```

---

## 5. API 요청

### 5.1 단순한 경우

axios를 쓴다면 `params` 옵션을 사용하는 것이 제일 단순하다.

```ts
// features/snack/api/snack.api.ts
import { api } from '@/shared/lib/axios'
import type { SnackSearchParams } from '../schema/snack-search-params'

export async function getSnackList(searchParams: SnackSearchParams) {
  const { data } = await api.get('/snacks', {
    params: removeEmptySearchParams(searchParams)
  })

  return data
}

function removeEmptySearchParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}
```

### 5.2 qs가 필요한 경우

다음처럼 변환 규칙이 복잡하면 `qs`를 고려한다.

```txt
화면 URL
/snack?brand=nongshim&category=chip

API 요청
/snacks?_expand=brand&brandId=nongshim&categoryId=chip
```

이 정도까지 복잡하지 않으면 `qs`는 굳이 추가하지 않아도 된다.

---

## 6. 전체 페이지

```tsx
// app/(default-layout)/(main)/snack/page.tsx
import { SnackSearchForm } from './_components/snack-search-form'
import { SnackFilterSort } from './_components/snack-filter-sort'
import { SnackList } from './_components/snack-list'
import { SnackPagination } from './_components/snack-pagination'

export default function SnackPage() {
  return (
    <div className="space-y-6">
      <SnackSearchForm />
      <SnackFilterSort />
      <SnackList />
      <SnackPagination />
    </div>
  )
}
```

이 구조는 Client 중심 검색 화면이다.  
목록 SEO, SSR prefetch, HydrationBoundary까지 중요해지면 `page.tsx`에서 searchParams를 파싱해서 `SnackList`로 props 전달하는 구조를 추가 검토한다.

---

## 7. 상단 Search Form

검색어는 입력 중에는 URL에 반영하지 않고, **검색 버튼을 눌렀을 때만 URL에 반영**한다.

이 요구사항이면 `next/form` 또는 일반 `<form>` 둘 다 가능하다.

---

# 7-A. nuqs + 일반 form 방식

```tsx
// app/(default-layout)/(main)/snack/_components/snack-search-form.tsx
'use client'

import { useEffect, useState } from 'react'
import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'
import { Input } from '@/shared/components/shadcn/ui/input'
import { Button } from '@/shared/components/shadcn/ui/button'

export function SnackSearchForm() {
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams)
  const [keyword, setKeyword] = useState(searchParams.keyword)

  useEffect(() => {
    setKeyword(searchParams.keyword)
  }, [searchParams.keyword])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSearchParams({
      keyword,
      page: 1
    })
  }

  function onReset() {
    setKeyword('')

    setSearchParams({
      keyword: '',
      brand: '',
      category: '',
      sort: 'latest',
      page: 1
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-2">
      <Input
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
        placeholder="검색어를 입력하세요"
      />

      <Button type="submit">검색</Button>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}>
        초기화
      </Button>
    </form>
  )
}
```

### 장점

```txt
- 검색, 필터, 정렬, 페이징을 nuqs로 통일 가능
- 상태 흐름이 한 곳으로 모임
- React Query queryKey와 연결하기 쉬움
```

### 단점

```txt
- 단순 검색 submit만 보면 next/form보다 코드가 조금 많음
```

---

# 7-B. next/form 방식

```tsx
// app/(default-layout)/(main)/snack/_components/snack-search-form.tsx
import Form from 'next/form'
import { Input } from '@/shared/components/shadcn/ui/input'
import { Button } from '@/shared/components/shadcn/ui/button'

type Props = {
  defaultValues?: {
    keyword?: string
  }
}

export function SnackSearchForm({ defaultValues }: Props) {
  return (
    <Form
      action="/snack"
      className="flex gap-2">
      <Input
        name="keyword"
        defaultValue={defaultValues?.keyword ?? ''}
        placeholder="검색어를 입력하세요"
      />

      <Button type="submit">검색</Button>
    </Form>
  )
}
```

`next/form`은 `action`이 문자열이면 form 데이터를 search params로 붙여 client-side navigation을 수행한다.

```txt
검색 전
/snack

keyword 입력 후 검색
/snack?keyword=새우깡
```

### 장점

```txt
- 검색 버튼 기반 UI에 단순함
- progressive enhancement 성격이 좋음
- 검색 input을 굳이 useState로 관리하지 않아도 됨
```

### 단점

```txt
- 필터/정렬/페이징까지 즉시 변경하는 UI에는 nuqs가 더 편함
- Form의 onSubmit에서 preventDefault를 호출하면 next/form의 navigation 동작을 막게 됨
- method, encType, target 같은 일부 form props는 next/form 동작과 맞지 않음
```

---

## 8. 중단 Filter / Sort

필터와 정렬은 선택 즉시 URL에 반영한다.

```tsx
// app/(default-layout)/(main)/snack/_components/snack-filter-sort.tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/shadcn/ui/select'

const ALL = 'all'

export function SnackFilterSort() {
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams)

  return (
    <div className="flex gap-2">
      <Select
        value={searchParams.brand || ALL}
        onValueChange={value =>
          setSearchParams({
            brand: value === ALL ? '' : value,
            page: 1
          })
        }>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="브랜드" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>전체 브랜드</SelectItem>
          <SelectItem value="nongshim">농심</SelectItem>
          <SelectItem value="lotte">롯데</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.category || ALL}
        onValueChange={value =>
          setSearchParams({
            category: value === ALL ? '' : value,
            page: 1
          })
        }>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>전체 카테고리</SelectItem>
          <SelectItem value="chip">칩</SelectItem>
          <SelectItem value="cookie">쿠키</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.sort}
        onValueChange={sort =>
          setSearchParams({
            sort,
            page: 1
          })
        }>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="name">이름순</SelectItem>
          <SelectItem value="price">가격순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

### 실무 보완 포인트

shadcn/Radix Select에서는 `value=""`가 문제가 될 수 있으므로, 전체 값은 `all` 같은 sentinel 값을 쓰고 내부에서 `''`로 변환하는 편이 안전하다.

---

## 9. 하단 List

```tsx
// app/(default-layout)/(main)/snack/_components/snack-list.tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'
import { useSnackList } from '@/features/snack/hooks/use-snack-list'

export function SnackList() {
  const [searchParams] = useQueryStates(snackSearchParams)
  const { data } = useSnackList(searchParams)

  if (data.items.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border p-6 text-center text-sm">
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {data.items.map(snack => (
        <li
          key={snack.id}
          className="rounded-md border p-3">
          <div className="font-medium">{snack.name}</div>
          <div className="text-muted-foreground text-sm">
            {snack.brandName} / {snack.categoryName}
          </div>
        </li>
      ))}
    </ul>
  )
}
```

---

## 10. 최하단 Pagination

```tsx
// app/(default-layout)/(main)/snack/_components/snack-pagination.tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'
import { Button } from '@/shared/components/shadcn/ui/button'
import { useSnackList } from '@/features/snack/hooks/use-snack-list'

export function SnackPagination() {
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams)
  const { data } = useSnackList(searchParams)

  const page = searchParams.page
  const totalPages = data.totalPages

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={page <= 1}
        onClick={() =>
          setSearchParams({
            page: page - 1
          })
        }>
        이전
      </Button>

      <span className="text-sm">
        {page} / {totalPages}
      </span>

      <Button
        type="button"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() =>
          setSearchParams({
            page: page + 1
          })
        }>
        다음
      </Button>
    </div>
  )
}
```

### 주의

위 예제는 `SnackList`와 `SnackPagination`에서 같은 query를 각각 호출한다.
React Query가 같은 `queryKey` 기준으로 캐시를 공유하므로 네트워크 요청이 무조건 2번 나가는 구조는 아니다.

하지만 더 명시적으로 만들고 싶으면 `SnackContent` 부모 컴포넌트에서 한 번만 조회하고 props로 내려도 된다.

---

## 11. List + Pagination을 묶는 실무형 구조

반복 조회 호출이 신경 쓰이면 이 구조가 더 명확하다.

```tsx
// app/(default-layout)/(main)/snack/_components/snack-content.tsx
'use client'

import { useQueryStates } from 'nuqs'
import { snackSearchParams } from '@/features/snack/schema/snack-search-params'
import { useSnackList } from '@/features/snack/hooks/use-snack-list'
import { SnackListView } from './snack-list-view'
import { SnackPaginationView } from './snack-pagination-view'

export function SnackContent() {
  const [searchParams, setSearchParams] = useQueryStates(snackSearchParams)
  const { data } = useSnackList(searchParams)

  return (
    <>
      <SnackListView items={data.items} />
      <SnackPaginationView
        page={searchParams.page}
        totalPages={data.totalPages}
        onChangePage={page => setSearchParams({ page })}
      />
    </>
  )
}
```

```tsx
// app/(default-layout)/(main)/snack/_components/snack-list-view.tsx
export function SnackListView({ items }) {
  if (items.length === 0) {
    return <div>검색 결과가 없습니다.</div>
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

```tsx
// app/(default-layout)/(main)/snack/_components/snack-pagination-view.tsx
import { Button } from '@/shared/components/shadcn/ui/button'

export function SnackPaginationView({ page, totalPages, onChangePage }) {
  return (
    <div className="flex justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onChangePage(page - 1)}>
        이전
      </Button>

      <span>
        {page} / {totalPages}
      </span>

      <Button
        type="button"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onChangePage(page + 1)}>
        다음
      </Button>
    </div>
  )
}
```

`page.tsx`는 이렇게 변경한다.

```tsx
export default function SnackPage() {
  return (
    <div className="space-y-6">
      <SnackSearchForm />
      <SnackFilterSort />
      <SnackContent />
    </div>
  )
}
```

이쪽이 실무적으로 더 깔끔하다.

```txt
SearchForm
→ URL 변경 담당

FilterSort
→ URL 변경 담당

SnackContent
→ URL 읽기 + React Query 조회

ListView / PaginationView
→ 순수 UI
```

---

## 12. next/form과 nuqs를 섞는 경우

다음처럼 역할을 나누면 가능하다.

```txt
상단 검색어 submit
→ next/form

중단 필터/정렬
→ nuqs

최하단 페이지
→ nuqs
```

다만 이 경우 `next/form`이 submit할 때 기존 필터/정렬 값을 유지하려면 hidden input이 필요하다.

```tsx
import Form from 'next/form'

export function SnackSearchForm({ searchParams }) {
  return (
    <Form
      action="/snack"
      className="flex gap-2">
      <input
        name="keyword"
        defaultValue={searchParams.keyword}
      />

      <input
        type="hidden"
        name="brand"
        value={searchParams.brand}
      />
      <input
        type="hidden"
        name="category"
        value={searchParams.category}
      />
      <input
        type="hidden"
        name="sort"
        value={searchParams.sort}
      />
      <input
        type="hidden"
        name="page"
        value="1"
      />

      <button type="submit">검색</button>
    </Form>
  )
}
```

이게 번거롭다면 검색 form도 nuqs로 통일하는 편이 낫다.

---

## 13. RHF는 검색에 써야 할까?

검색 화면만 놓고 보면 보통은 굳이 쓰지 않는다.

### RHF가 필요한 경우

```txt
- 입력 필드가 많다
- 검색 조건에도 검증이 필요하다
- 날짜 range 검증이 있다
- 최소/최대 가격 교차 검증이 있다
- 에러 메시지를 form UI에 보여줘야 한다
```

### RHF가 과한 경우

```txt
- keyword 하나
- brand/category select 정도
- 검색 버튼 클릭 시 URL만 변경
```

이 프로젝트의 현재 검색 구조에서는 RHF를 검색에 넣기보다 create/edit에 집중해서 쓰는 편이 낫다.

---

## 14. create/edit에서 RHF + zod를 쓰는 위치

```txt
검색
→ nuqs / next/form

목록
→ React Query

등록 / 수정
→ RHF + zod + mutation
```

```ts
// features/snack/schema/snack-form.schema.ts
import { z } from 'zod'

export const snackFormSchema = z.object({
  name: z.string().min(1, '과자명을 입력해주세요.'),
  brandId: z.string().min(1, '브랜드를 선택해주세요.'),
  categoryId: z.string().min(1, '카테고리를 선택해주세요.'),
  contents: z.string().optional()
})

export type SnackFormInput = z.input<typeof snackFormSchema>
export type SnackFormOutput = z.output<typeof snackFormSchema>
```

검색 스키마와 form 스키마는 분리한다.

```txt
snack-search-params.ts
→ URL query string schema

snack-form.schema.ts
→ create/edit 입력값 schema
```

---

## 15. 최종 추천안

현재 요구사항 기준으로는 다음이 가장 무난하다.

```txt
상단 Search
→ nuqs + local state
→ 검색 버튼 클릭 시 setSearchParams

중단 Filter / Sort
→ nuqs
→ 변경 즉시 setSearchParams

하단 List + Pagination
→ SnackContent에서 useSnackList(searchParams)
→ ListView / PaginationView는 순수 UI

목록 조회
→ React Query
→ queryKey에 searchParams 포함

create/edit
→ RHF + zod
```

즉, 검색 화면에서는 `next/form`을 꼭 넣지 않아도 된다.

```txt
검색 화면 전체를 nuqs로 통일
→ 상태 흐름 단순
→ React Query queryKey와 연결 쉬움
→ 필터/정렬/페이징 확장 쉬움
```

`next/form`은 다음 조건일 때 선택한다.

```txt
검색 버튼 기반 form만 있고
필터/정렬/페이징 상태와 강하게 엮이지 않으며
입력값을 uncontrolled form으로 단순하게 처리하고 싶을 때
```

---

## 16. 참고한 공식 문서 기준

- Next.js `Form`은 form submissions와 search params 업데이트를 client-side navigation으로 처리하는 컴포넌트다.
- Next.js `useSearchParams`는 Client Component에서 query string을 읽기 위한 hook이다.
- nuqs는 URL query string을 React state처럼 다루기 위한 type-safe search params state manager다.
- TanStack Query는 서버 상태 조회, 캐싱, background update, stale data 관리를 위한 라이브러리다.
- zod는 TypeScript-first validation library다.
- React Hook Form resolvers는 zod 같은 외부 validation library를 RHF와 연결한다.

---

## 17. 출처

- Next.js Form Component: https://nextjs.org/docs/app/api-reference/components/form
- Next.js useSearchParams: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- nuqs GitHub: https://github.com/47ng/nuqs
- TanStack Query Overview: https://tanstack.com/query/latest/docs/framework/react/overview
- TanStack Query queryOptions: https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- Zod: https://zod.dev/
- React Hook Form useForm: https://react-hook-form.com/docs/useform
- React Hook Form Resolvers: https://github.com/react-hook-form/resolvers
