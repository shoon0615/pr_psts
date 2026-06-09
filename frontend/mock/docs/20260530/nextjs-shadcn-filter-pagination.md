# Next.js + shadcn/ui Filter & Pagination 예제

> 기준: Next.js App Router, TypeScript, shadcn/ui, URL query string 기반 필터/페이지네이션
>
> 목표: 검색 조건과 현재 페이지를 URL에 유지해서 새로고침, 공유, 뒤로가기/앞으로가기에도 동일한 목록 상태를 유지합니다.

---

## 1. 예제 구조

```txt
app/
└─ snack/
   ├─ page.tsx
   └─ _components/
      ├─ snack-filter.tsx
      ├─ snack-pagination.tsx
      └─ snack-list.tsx

lib/
└─ mock-snacks.ts

components/ui/
├─ button.tsx
├─ input.tsx
├─ select.tsx
├─ card.tsx
└─ pagination.tsx
```

필요한 shadcn/ui 컴포넌트 예시입니다.

```bash
pnpm dlx shadcn@latest add button input select card pagination
```

---

## 2. 핵심 설계

Next.js App Router에서 목록 데이터를 조회할 때는 `page.tsx`의 `searchParams`를 기준으로 처리하는 방식이 일반적입니다.

```tsx
export default async function Page({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
}
```

필터 컴포넌트는 Client Component로 두고, `useRouter`, `usePathname`, `useSearchParams`를 사용해서 URL query string을 변경합니다.

```tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
```

---

## 3. Mock 데이터

`lib/mock-snacks.ts`

```ts
export type Snack = {
  id: number
  name: string
  brand: 'lotte' | 'orion' | 'haitai'
  category: 'cookie' | 'chip' | 'chocolate'
  price: number
}

export const snacks: Snack[] = [
  { id: 1, name: '초코파이', brand: 'orion', category: 'chocolate', price: 4800 },
  { id: 2, name: '꼬깔콘', brand: 'lotte', category: 'chip', price: 2200 },
  { id: 3, name: '에이스', brand: 'haitai', category: 'cookie', price: 3200 },
  { id: 4, name: '마가렛트', brand: 'lotte', category: 'cookie', price: 4200 },
  { id: 5, name: '오징어땅콩', brand: 'orion', category: 'chip', price: 2500 },
  { id: 6, name: '자유시간', brand: 'haitai', category: 'chocolate', price: 1500 },
  { id: 7, name: '칙촉', brand: 'lotte', category: 'cookie', price: 3800 },
  { id: 8, name: '포카칩', brand: 'orion', category: 'chip', price: 2300 },
  { id: 9, name: '홈런볼', brand: 'haitai', category: 'chocolate', price: 3600 }
]
```

---

## 4. 검색/필터/페이지네이션 함수

실제 프로젝트에서는 이 부분이 `service`, `repository`, `route.ts`, DB 조회 로직으로 바뀝니다.

`app/snack/page.tsx`

```tsx
import { snacks } from '@/lib/mock-snacks'
import { SnackFilter } from './_components/snack-filter'
import { SnackList } from './_components/snack-list'
import { SnackPagination } from './_components/snack-pagination'

const PAGE_SIZE = 5

type SearchParams = Record<string, string | string[] | undefined>

function getString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getSnackPage(searchParams: SearchParams) {
  const page = Number(getString(searchParams.page) ?? '1')
  const keyword = getString(searchParams.keyword) ?? ''
  const brand = getString(searchParams.brand) ?? 'all'
  const category = getString(searchParams.category) ?? 'all'

  const filtered = snacks.filter(snack => {
    const matchedKeyword = keyword
      ? snack.name.toLowerCase().includes(keyword.toLowerCase())
      : true

    const matchedBrand = brand === 'all' ? true : snack.brand === brand
    const matchedCategory = category === 'all' ? true : snack.category === category

    return matchedKeyword && matchedBrand && matchedCategory
  })

  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
  const start = (safePage - 1) * PAGE_SIZE
  const items = filtered.slice(start, start + PAGE_SIZE)

  return {
    items,
    page: safePage,
    totalPages,
    totalCount
  }
}

export default async function SnackPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const { items, page, totalPages, totalCount } = getSnackPage(resolvedSearchParams)

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">과자 목록</h1>
        <p className="text-sm text-muted-foreground">
          총 {totalCount}개의 과자가 조회되었습니다.
        </p>
      </div>

      <SnackFilter />

      <SnackList items={items} />

      <SnackPagination currentPage={page} totalPages={totalPages} />
    </main>
  )
}
```

---

## 5. Filter 컴포넌트

`app/snack/_components/snack-filter.tsx`

```tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function SnackFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const keyword = searchParams.get('keyword') ?? ''
  const brand = searchParams.get('brand') ?? 'all'
  const category = searchParams.get('category') ?? 'all'

  const updateParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // 필터가 바뀌면 1페이지부터 다시 조회하는 것이 일반적입니다.
    params.set('page', '1')

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetParams = () => {
    router.push(pathname)
  }

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_160px_160px_auto_auto]">
        <Input
          placeholder="과자명을 검색하세요"
          defaultValue={keyword}
          onKeyDown={event => {
            if (event.key !== 'Enter') return
            updateParams({ keyword: event.currentTarget.value })
          }}
        />

        <Select
          value={brand}
          onValueChange={value => updateParams({ brand: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="브랜드" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 브랜드</SelectItem>
            <SelectItem value="lotte">롯데</SelectItem>
            <SelectItem value="orion">오리온</SelectItem>
            <SelectItem value="haitai">해태</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={category}
          onValueChange={value => updateParams({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            <SelectItem value="cookie">쿠키</SelectItem>
            <SelectItem value="chip">칩</SelectItem>
            <SelectItem value="chocolate">초콜릿</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>(
              'input[placeholder="과자명을 검색하세요"]'
            )

            updateParams({ keyword: input?.value ?? '' })
          }}
        >
          검색
        </Button>

        <Button type="button" variant="outline" onClick={resetParams}>
          초기화
        </Button>
      </div>
    </section>
  )
}
```

### 참고

shadcn/ui `SelectItem`은 빈 문자열 `value=""`를 사용하지 않는 것이 안전합니다. 전체 조건은 `all` 같은 명시적인 값을 사용하고, URL에는 저장하지 않도록 `params.delete(key)`로 처리하는 방식을 권장합니다.

---

## 6. List 컴포넌트

`app/snack/_components/snack-list.tsx`

```tsx
import type { Snack } from '@/lib/mock-snacks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SnackList({ items }: { items: Snack[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        조회된 과자가 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-base">{item.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div>브랜드: {item.brand}</div>
            <div>카테고리: {item.category}</div>
            <div>가격: {item.price.toLocaleString()}원</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## 7. Pagination 컴포넌트

`app/snack/_components/snack-pagination.tsx`

```tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function SnackPagination({
  currentPage,
  totalPages
}: {
  currentPage: number
  totalPages: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const createPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `${pathname}?${params.toString()}`
  }

  const pages = range(1, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageHref(Math.max(currentPage - 1, 1))}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageHref(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={createPageHref(Math.min(currentPage + 1, totalPages))}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

---

## 8. Next.js Link를 shadcn Pagination에 적용하는 경우

shadcn/ui Pagination은 기본적으로 `a` 태그 기반입니다. Next.js `Link`를 직접 쓰고 싶다면 `components/ui/pagination.tsx`의 `PaginationLink` 타입과 컴포넌트를 조정할 수 있습니다.

```tsx
import Link from 'next/link'

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size
      }),
      className
    )}
    {...props}
  />
)
```

다만 단순 페이지 이동이면 기본 `href` 방식만으로도 충분합니다.

---

## 9. React Query와 함께 쓸 때

위 예제는 서버 컴포넌트에서 직접 필터링하는 예제입니다. React Query를 함께 쓴다면 보통 다음처럼 query key에 검색 조건을 포함합니다.

```ts
export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const
}
```

```tsx
const { data } = useSuspenseQuery({
  queryKey: snackKeys.list(searchParams),
  queryFn: () => getSnacks(searchParams)
})
```

실무에서는 아래 중 하나로 정리하는 편이 좋습니다.

| 방식 | 추천 상황 |
|---|---|
| Server Component + `searchParams` | SEO, 초기 렌더링, 단순 목록 |
| Client Component + React Query | 필터 조작이 많고 즉각적인 UX가 중요한 목록 |
| Server prefetch + React Query hydration | 초기 렌더링과 클라이언트 캐싱을 같이 가져가고 싶을 때 |

---

## 10. 실무 기준 정리

- 필터와 페이지 값은 URL query string에 둡니다.
- 필터가 변경되면 `page=1`로 초기화합니다.
- `SelectItem value=""` 대신 `all` 같은 값을 사용합니다.
- 데이터 조회 기준은 `page.tsx`의 `searchParams`를 우선 고려합니다.
- `useSearchParams`는 Client Component에서 URL 변경이나 클라이언트 전용 상태를 다룰 때 사용합니다.
- 검색 조건이 많아지면 `zod` 또는 `nuqs`로 query params 파싱을 분리하는 것이 좋습니다.
- API 연동 시에는 `GET /api/snacks?page=1&brand=orion&category=chip` 같은 형태로 맞추면 됩니다.

---

## 11. 최종 URL 예시

```txt
/snack
/snack?keyword=초코&page=1
/snack?brand=orion&category=chip&page=2
/snack?keyword=파이&brand=orion&category=chocolate&page=1
```

---

## 12. 참고 문서

- Next.js App Router는 `searchParams`를 필터링, 페이지네이션, 정렬 같은 query string 처리에 사용할 수 있습니다.
- Next.js 공식 Learn 문서에서도 검색과 페이지네이션을 URL search params 기반으로 구현합니다.
- shadcn/ui Pagination은 기본적으로 `a` 태그를 렌더링하며, Next.js `Link`를 쓰려면 `PaginationLink`를 조정할 수 있습니다.
