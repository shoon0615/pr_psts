# Snack CRUD 프로토타입 및 공통 처리 가이드라인

## 0. 문서 목적

이 문서는 현재 `frontend` 프로젝트 구조를 기준으로, `snack` 도메인을 CRUD 서비스의 기준 프로토타입으로 완성하기 위해 필요한 작업을 정리한다.

기존 문서가 CRUD 화면에서 반복되는 공통 컴포넌트의 분리 기준을 다뤘다면, 이 문서는 다음 내용을 목표로 한다.

```txt
1. snack CRUD를 기준 프로토타입으로 완성한다.
2. features/common 또는 shared/common으로 승격할 공통 처리를 정의한다.
3. swagger, CI/CD, TDD까지 포함한 프로젝트 운영 기준을 만든다.
```

---

## 1. 현재 구조 평가

현재 구조는 이미 `app`, `features`, `shared`, `mock`, `tests`가 분리되어 있어 CRUD 프로토타입을 만들기 좋은 상태다.

```txt
app/
 ├─ route segment, page, layout, route handler
features/
 ├─ domain 중심 로직
shared/
 ├─ 공통 UI, 공통 hook, 공통 lib, 공통 type
mock/
 ├─ json-server 또는 테스트용 mock data
tests/
 ├─ e2e 또는 통합 테스트 진입점
```

현재 `features/snack` 구조도 방향은 좋다.

```txt
features/snack/
 ├─ actions
 ├─ components
 ├─ hooks
 ├─ prefetch
 ├─ queries
 ├─ repositories
 ├─ schema
 ├─ services
 └─ types
```

다만 프로토타입 기준으로는 역할을 더 명확히 해야 한다.

---

## 2. snack CRUD의 기준 역할 분리

### 2.1 app의 역할

`app`은 라우팅, 서버 컴포넌트 진입점, 페이지 조합을 담당한다.

```txt
app/(default-layout)/(main)/snack/page.tsx
app/(default-layout)/(main)/snack/new/page.tsx
app/(default-layout)/(main)/snack/[id]/page.tsx
app/(default-layout)/(main)/snack/[id]/edit/page.tsx
```

권장 역할은 다음과 같다.

```txt
page.tsx
- URL params/searchParams 수신
- Server Component에서 prefetch 실행
- HydrationBoundary 연결
- feature 컴포넌트 조합
- 복잡한 UI 로직은 직접 작성하지 않음
```

예시 구조:

```tsx
export default async function SnackPage({ searchParams }: PageProps) {
  const params = snackSearchParamsSchema.parse(await searchParams)

  const queryClient = getQueryClient()

  await prefetchSnackList(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackListPage params={params} />
    </HydrationBoundary>
  )
}
```

---

### 2.2 features/snack의 역할

`features/snack`은 snack 도메인에 종속된 정책을 가진다.

```txt
features/snack/schema
- zod schema
- searchParams schema
- create/update form schema

features/snack/types
- Snack
- SnackListItem
- SnackDetail
- SnackSearchParams
- SnackCreateInput
- SnackUpdateInput

features/snack/repositories
- 외부 요청 구현부
- json-server, route handler, prisma 교체 가능 지점

features/snack/services
- repository 조합
- 서버 전용 비즈니스 로직

features/snack/queries
- React Query queryKey/queryOptions

features/snack/hooks
- Client Component에서 사용하는 query/mutation hook

features/snack/prefetch
- Server Component prefetch 전용 함수

features/snack/components
- SnackSearch
- SnackSort
- SnackList
- SnackTable
- SnackForm
- SnackDetail
- SnackActions
```

---

### 2.3 shared의 역할

`shared`는 도메인을 몰라야 한다.

```txt
shared/components/ui
- shadcn/ui 원본 또는 래핑이 거의 없는 UI

shared/components/common
- EmptyState
- ErrorState
- ConfirmDialogButton
- CommonPagination
- CommonTable
- CommonSearchForm
- CommonSortSelect
- FormSubmitButton
- DetailInfoRow

shared/lib
- axios core
- fetch wrapper
- react-query client
- toast wrapper
- utils

shared/types
- BaseEntity
- PageResponse
- ApiResponse
- SelectOption
- Nullable
```

`shared`에서 금지하는 것:

```txt
- useSnackList 사용
- snackKeys 사용
- snackSchema 사용
- /snack 라우트 직접 참조
- Snack 타입 직접 참조
```

---

## 3. snack CRUD 프로토타입 작업 순서

## Phase 1. 도메인 모델 정리

먼저 타입과 schema를 기준으로 고정한다.

```txt
features/snack/types/snack.type.ts
features/snack/schema/snack.schema.ts
```

권장 타입:

```ts
export type Snack = {
  id: number
  title: string
  brand: string
  category: string
  contents?: string | null
  price: number
  createdAt?: string
  updatedAt?: string
}

export type SnackSearchParams = {
  page: number
  brand: string
  category: string
  contents: string
  sort: 'title' | 'price' | 'createdAt'
  order: 'asc' | 'desc'
}

export type SnackListResponse = {
  data: Snack[]
  totalCount: number
  page: number
  pageSize: number
}
```

권장 schema:

```ts
export const snackSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  brand: z.string().default(''),
  category: z.string().default(''),
  contents: z.string().default(''),
  sort: z.enum(['title', 'price', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const snackFormSchema = z.object({
  title: z.string().min(2).max(32),
  brand: z.string().min(1),
  category: z.string().min(1),
  contents: z.string().optional(),
  price: z.coerce.number().positive()
})
```

주의할 점:

```txt
- RHF 입력값은 string으로 들어오는 경우가 많다.
- submit 직전 zod에서 number로 coerce하는 방식이 안정적이다.
- 검색 params schema와 form schema는 분리한다.
```

---

## Phase 2. repository 경계 확정

현재 repository가 3개로 나뉘어 있다.

```txt
snack.api.repository.ts
snack.json.repository.ts
snack.prisma.repository.ts
```

프로토타입에서는 다음 기준을 권장한다.

```txt
snack.api.repository.ts
- Client에서 /api/snack Route Handler를 호출하는 axios/fetch repository
- Client Component 또는 React Query queryFn에서 사용

snack.json.repository.ts
- 서버에서 json-server/mock 파일을 직접 호출하는 임시 repository
- Route Handler 또는 service 내부에서 사용

snack.prisma.repository.ts
- 추후 DB 전환 시 사용할 repository
- 현재는 interface 기준만 맞춰두고 구현은 보류 가능
```

권장 인터페이스:

```ts
export interface SnackRepository {
  findMany(params: SnackSearchParams): Promise<SnackListResponse>
  findById(id: number): Promise<Snack>
  create(input: SnackCreateInput): Promise<Snack>
  update(id: number, input: SnackUpdateInput): Promise<Snack>
  delete(id: number): Promise<void>
}
```

실무적으로 중요한 점:

```txt
- 컴포넌트가 json-server, Prisma, axios 구현을 직접 알면 안 된다.
- 구현 교체 가능 지점은 repository다.
- service는 repository를 사용해 비즈니스 규칙을 표현한다.
```

---

## Phase 3. service 정리

`features/snack/services/snack.service.ts`는 서버 전용 로직을 담당한다.

```ts
import 'server-only'

export const snackService = {
  async getList(params: SnackSearchParams) {
    return snackRepository.findMany(params)
  },

  async getDetail(id: number) {
    const snack = await snackRepository.findById(id)
    if (!snack) {
      throw new Error('Snack not found')
    }
    return snack
  },

  async create(input: SnackCreateInput) {
    const parsed = snackFormSchema.parse(input)
    return snackRepository.create(parsed)
  },

  async update(id: number, input: SnackUpdateInput) {
    const parsed = snackFormSchema.partial().parse(input)
    return snackRepository.update(id, parsed)
  },

  async delete(id: number) {
    return snackRepository.delete(id)
  }
}
```

서비스 계층의 기준:

```txt
- 서버 전용이면 import 'server-only'를 사용한다.
- 데이터 검증을 한 번 더 수행한다.
- not found, 권한 체크, 중복 체크 등 도메인 규칙을 둔다.
- Client Component에서 직접 import하지 않는다.
```

---

## Phase 4. Route Handler 정리

`app/api/snack/route.ts`, `app/api/snack/[id]/route.ts`는 외부 HTTP 경계다.

권장 역할:

```txt
- request searchParams/body 파싱
- zod validation
- service 호출
- NextResponse.json 반환
- HTTP status 정리
```

예시:

```ts
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = snackSearchParamsSchema.parse(params)

  const result = await snackService.getList(parsed)

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = snackFormSchema.parse(body)

  const result = await snackService.create(parsed)

  return NextResponse.json(result, { status: 201 })
}
```

주의:

```txt
- Route Handler는 Client에서 호출 가능한 API다.
- Server Action과 Route Handler를 같은 용도로 중복 사용하지 않는다.
- 현재 CRUD 프로토타입에서는 조회/변경 모두 Route Handler 기준으로 잡는 편이 테스트와 swagger 연동에 유리하다.
```

---

## Phase 5. React Query queryOptions 정리

`features/snack/queries/snack.query.ts`는 queryKey와 queryOptions를 담당한다.

```ts
export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, 'detail'] as const,
  detail: (id: number) => [...snackKeys.details(), id] as const
}

export const snackListQueryOptions = (params: SnackSearchParams) => ({
  queryKey: snackKeys.list(params),
  queryFn: () => snackApiRepository.findMany(params)
})

export const snackDetailQueryOptions = (id: number) => ({
  queryKey: snackKeys.detail(id),
  queryFn: () => snackApiRepository.findById(id)
})
```

기준:

```txt
- queryKey는 한 파일에서 관리한다.
- list queryKey에는 검색 조건 전체를 포함한다.
- mutation 성공 시 lists/detail을 명확히 invalidate한다.
```

---

## Phase 6. prefetch 정리

`features/snack/prefetch/snack.prefetch.ts`는 Server Component prefetch 전용이다.

```ts
export async function prefetchSnackList(
  queryClient: QueryClient,
  params: SnackSearchParams
) {
  await queryClient.prefetchQuery(snackListQueryOptions(params))
}

export async function prefetchSnackDetail(queryClient: QueryClient, id: number) {
  await queryClient.prefetchQuery(snackDetailQueryOptions(id))
}
```

기준:

```txt
- page.tsx에서 직접 queryOptions를 길게 작성하지 않는다.
- prefetch 함수는 서버 컴포넌트에서만 사용한다.
- Client Component에서는 useSuspenseQuery를 사용한다.
```

---

## Phase 7. hooks 정리

`features/snack/hooks/useSnack.ts`는 Client Component 전용 hook을 둔다.

```ts
export function useSnackList(params: SnackSearchParams) {
  return useSuspenseQuery(snackListQueryOptions(params))
}

export function useSnackDetail(id: number) {
  return useSuspenseQuery(snackDetailQueryOptions(id))
}

export function useCreateSnack() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: snackApiRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
      router.replace('/snack')
    }
  })
}
```

기준:

```txt
- mutation 후 이동, invalidate, toast는 hook 또는 domain component에서 처리한다.
- shared hook으로 올리지 않는다.
- snack 전용 hook은 features/snack/hooks에 둔다.
```

---

## Phase 8. components 정리

권장 컴포넌트 구성:

```txt
features/snack/components/
 ├─ snack-list-page.tsx
 ├─ snack-search.tsx
 ├─ snack-sort.tsx
 ├─ snack-table.tsx
 ├─ snack-pagination.tsx
 ├─ snack-form.tsx
 ├─ snack-detail.tsx
 └─ snack-actions.tsx
```

`snack-list-page.tsx`는 조합 컴포넌트다.

```tsx
'use client'

export function SnackListPage({ params }: { params: SnackSearchParams }) {
  const { data, isFetching } = useSnackList(params)

  return (
    <div className="space-y-4">
      <SnackSearch isFetching={isFetching} />
      <SnackSort />

      {data.data.length === 0 ? (
        <EmptyState title="등록된 과자가 없습니다." />
      ) : (
        <>
          <SnackTable data={data.data} />
          <SnackPagination totalCount={data.totalCount} />
        </>
      )}
    </div>
  )
}
```

---

# 4. md 파일 내용처럼 공통 처리해야 할 항목

기존 공통 컴포넌트 문서의 방향은 유지하되, 실제 프로토타입에서는 다음 항목을 우선 만든다.

## 4.1 공통 UI 컴포넌트

```txt
shared/components/common/
 ├─ empty-state.tsx
 ├─ error-state.tsx
 ├─ confirm-dialog-button.tsx
 ├─ common-pagination.tsx
 ├─ common-table.tsx
 ├─ common-sort-select.tsx
 ├─ form-submit-button.tsx
 ├─ detail-info-row.tsx
 └─ action-menu.tsx
```

우선순위:

```txt
1. EmptyState
2. ErrorState
3. ConfirmDialogButton
4. CommonPagination
5. CommonTable
6. FormSubmitButton
7. DetailInfoRow
8. CommonSortSelect
9. ActionMenu
```

## 4.2 공통 타입

```txt
shared/types/base.type.ts
```

권장 타입:

```ts
export type BaseEntity = {
  id: number
  createdAt?: string
  updatedAt?: string
}

export type PageResponse<T> = {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
}

export type SelectOption<TValue extends string = string> = {
  label: string
  value: TValue
}

export type SortOrder = 'asc' | 'desc'
```

## 4.3 공통 API 응답 처리

```txt
shared/lib/fetch.ts 또는 shared/lib/axios/core.ts
```

목표:

```txt
- HTTP error를 한 곳에서 처리
- response.data unwrap 기준 통일
- queryString 생성 기준 통일
- 인증 헤더 또는 쿠키 처리 위치 통일
```

권장 기준:

```txt
Client Component / React Query
→ snack.api.repository.ts
→ shared/lib/axios/core.ts
→ app/api/snack
→ snack.service.ts
→ repository 구현체
```

## 4.4 공통 에러 처리

필요 파일:

```txt
shared/lib/error.ts
shared/components/common/error-state.tsx
app/(default-layout)/error.tsx
app/(default-layout)/not-found.tsx
```

권장 에러 타입:

```ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 500
  ) {
    super(message)
  }
}
```

Route Handler에서는 다음처럼 변환한다.

```ts
try {
  const result = await snackService.getList(params)
  return NextResponse.json(result)
} catch (error) {
  return handleRouteError(error)
}
```

## 4.5 공통 toast 처리

```txt
shared/lib/toast.ts
```

권장 형태:

```ts
export const appToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  promise: toast.promise
}
```

mutation에서는 다음 기준으로 사용한다.

```txt
- 등록 성공: toast + 목록 이동
- 수정 성공: toast + 상세 이동
- 삭제 성공: toast + 목록 이동
- 실패: 공통 에러 메시지
```

---

# 5. common에 필요한 작업 및 공통 처리

현재 `features/common`은 비어 있는 상태에 가깝다. 여기에는 `shared`로 올리기에는 도메인성은 있지만 여러 feature에서 반복될 가능성이 높은 코드를 둘 수 있다.

다만 기준을 명확히 해야 한다.

## 5.1 shared와 features/common의 차이

```txt
shared
- 완전히 도메인 독립적
- UI primitive, 공통 lib, 공통 type
- snack, notice, auth를 몰라야 함

features/common
- 여러 feature에서 반복되는 application-level 패턴
- CRUD 도메인들이 공유하는 정책
- app의 업무 규칙에 가까움
```

## 5.2 features/common에 둘 수 있는 후보

```txt
features/common/
 ├─ components
 │   ├─ crud-page-header.tsx
 │   ├─ crud-toolbar.tsx
 │   ├─ crud-section.tsx
 │   └─ delete-confirm-button.tsx
 ├─ hooks
 │   └─ use-delete-confirm.ts
 ├─ constants
 │   └─ pagination.constant.ts
 └─ types
     └─ crud.type.ts
```

단, 처음부터 크게 만들지 않는다.

권장 시작점:

```txt
1. crud-page-header.tsx
2. crud-toolbar.tsx
3. pagination.constant.ts
4. crud.type.ts
```

## 5.3 CrudPageHeader

```tsx
type CrudPageHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export function CrudPageHeader({
  title,
  description,
  action
}: CrudPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>

      {action}
    </div>
  )
}
```

사용 예:

```tsx
<CrudPageHeader
  title="과자 관리"
  description="과자 목록을 조회하고 등록, 수정, 삭제할 수 있습니다."
  action={
    <Button asChild>
      <Link href="/snack/new">등록</Link>
    </Button>
  }
/>
```

## 5.4 CrudToolbar

```tsx
type CrudToolbarProps = {
  search?: React.ReactNode
  filters?: React.ReactNode
  sort?: React.ReactNode
}

export function CrudToolbar({ search, filters, sort }: CrudToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md border p-4">
      {search}
      <div className="flex items-center justify-between gap-2">
        <div>{filters}</div>
        <div>{sort}</div>
      </div>
    </div>
  )
}
```

주의:

```txt
CrudToolbar는 searchParams를 직접 알면 안 된다.
SnackSearch, SnackSort를 끼워 넣는 조합 컴포넌트로만 사용한다.
```

## 5.5 pagination.constant.ts

```ts
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SIBLING_COUNT = 2
```

---

# 6. Swagger / API 문서화 처리

Next.js Route Handler는 Spring Boot처럼 Swagger가 자동으로 잘 붙는 구조는 아니다. 따라서 선택지가 있다.

## 6.1 권장 선택지

```txt
1안. OpenAPI YAML/JSON을 직접 관리
2안. zod schema 기반으로 openapi 문서 생성
3안. 백엔드가 별도로 생기면 백엔드 Swagger를 기준으로 사용
```

현재 프로젝트가 Next.js 단독 CRUD 프로토타입이라면 1안 또는 2안이 적합하다.

## 6.2 프로토타입 추천

처음에는 다음 파일을 둔다.

```txt
mock/docs/openapi/snack.openapi.yaml
```

또는:

```txt
docs/api/snack.openapi.yaml
```

권장 구조:

```yaml
openapi: 3.0.3
info:
  title: Snack API
  version: 0.1.0
paths:
  /api/snack:
    get:
      summary: Snack 목록 조회
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: brand
          in: query
          schema:
            type: string
        - name: sort
          in: query
          schema:
            type: string
            enum: [title, price, createdAt]
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
      responses:
        '200':
          description: OK
    post:
      summary: Snack 등록
      responses:
        '201':
          description: Created
  /api/snack/{id}:
    get:
      summary: Snack 상세 조회
      responses:
        '200':
          description: OK
    put:
      summary: Snack 수정
      responses:
        '200':
          description: OK
    delete:
      summary: Snack 삭제
      responses:
        '204':
          description: No Content
```

## 6.3 Swagger UI 연결

프론트 프로젝트에서 문서 확인용으로만 쓸 경우 다음 중 하나를 선택한다.

```txt
- swagger-ui-react 사용
- scalar api reference 사용
- redoc 사용
- docs 폴더의 yaml만 관리하고 GitHub에서 확인
```

프로토타입 기준 추천:

```txt
1단계: openapi yaml 직접 작성
2단계: CI에서 openapi lint 추가
3단계: 필요하면 /api-docs 페이지 추가
```

---

# 7. CI/CD 처리

현재 `.github/workflows`에 다음 파일이 있다.

```txt
.github/workflows/nextjs-app-ci.yml
.github/workflows/playwright.yml
```

프로토타입 기준으로 CI는 다음 단계로 나눈다.

## 7.1 필수 CI 단계

```txt
1. 의존성 설치
2. 타입 체크
3. lint
4. unit test
5. build
6. e2e test
```

권장 npm scripts:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "build": "next build"
  }
}
```

Next.js 최신 구성에서는 `next lint` 사용 가능 여부를 현재 버전에 맞게 확인해야 한다. 이미 ESLint flat config를 사용 중이면 다음처럼 직접 eslint를 실행하는 방식이 더 명확할 수 있다.

```json
{
  "lint": "eslint ."
}
```

## 7.2 nextjs-app-ci.yml 권장 흐름

```yaml
name: Next.js App CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## 7.3 Playwright CI 권장 흐름

```yaml
name: Playwright

on:
  pull_request:
    branches: [main, dev]

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

## 7.4 배포 CD는 나중에 분리

프로토타입 단계에서는 CD를 바로 붙이지 않아도 된다.

권장 순서:

```txt
1. PR CI 안정화
2. main merge 시 build 검증
3. Vercel 배포 연결
4. preview deployment 확인
5. production deployment 보호 규칙 추가
```

---

# 8. TDD / 테스트 처리

현재 테스트 관련 파일이 있다.

```txt
tests/example.spec.ts
vitest.config.ts
vitest.setup.ts
playwright.config.ts
cypress.config.ts
```

프로토타입에서는 Cypress와 Playwright를 동시에 깊게 운영하지 않는 편이 좋다. 하나를 우선 기준으로 잡는 것이 낫다.

권장:

```txt
Unit/Component: Vitest + Testing Library
E2E: Playwright
Cypress: 보류 또는 제거 후보
```

## 8.1 테스트 계층

```txt
1. schema test
2. util test
3. repository test
4. component test
5. e2e test
```

## 8.2 snack schema test

```txt
features/snack/schema/__tests__/snack.schema.test.ts
```

```ts
import { describe, expect, it } from 'vitest'
import { snackFormSchema } from '../snack.schema'

describe('snackFormSchema', () => {
  it('유효한 입력값을 통과시킨다', () => {
    const result = snackFormSchema.safeParse({
      title: '새우깡',
      brand: '농심',
      category: '과자',
      contents: '',
      price: '1500'
    })

    expect(result.success).toBe(true)
  })

  it('가격이 0 이하이면 실패한다', () => {
    const result = snackFormSchema.safeParse({
      title: '새우깡',
      brand: '농심',
      category: '과자',
      price: 0
    })

    expect(result.success).toBe(false)
  })
})
```

## 8.3 common util test

```txt
shared/lib/__tests__/query-string.test.ts
```

```ts
import { describe, expect, it } from 'vitest'
import { removeEmptyQueryParams } from '../utils'

describe('removeEmptyQueryParams', () => {
  it('빈 문자열, null, undefined만 제거한다', () => {
    expect(
      removeEmptyQueryParams({
        keyword: '',
        page: 1,
        price: 0,
        brand: null,
        category: undefined
      })
    ).toEqual({
      page: 1,
      price: 0
    })
  })
})
```

중요 기준:

```txt
0은 유효한 값일 수 있으므로 !value로 제거하면 안 된다.
```

## 8.4 component test

```txt
features/snack/components/__tests__/snack-form.test.tsx
```

테스트 범위:

```txt
- 기본값 렌더링
- 필수값 누락 시 에러 표시
- submit 시 onSubmit 호출
- create/update mode에 따라 버튼 텍스트 변경
```

## 8.5 e2e test

```txt
tests/snack-crud.spec.ts
```

테스트 시나리오:

```txt
1. /snack 접속
2. 목록 표시 확인
3. 검색어 입력 후 검색
4. 정렬 변경
5. 등록 페이지 이동
6. 필수값 검증 확인
7. 정상 등록
8. 상세 페이지 확인
9. 수정
10. 삭제
```

예시:

```ts
import { expect, test } from '@playwright/test'

test('snack CRUD flow', async ({ page }) => {
  await page.goto('/snack')

  await expect(page.getByRole('heading', { name: /과자/ })).toBeVisible()

  await page.getByRole('link', { name: '등록' }).click()
  await page.getByLabel('이름').fill('테스트 과자')
  await page.getByLabel('브랜드').fill('테스트 브랜드')
  await page.getByLabel('카테고리').fill('스낵')
  await page.getByLabel('가격').fill('1500')
  await page.getByRole('button', { name: '등록' }).click()

  await expect(page).toHaveURL(/\/snack/)
})
```

---

# 9. Prototype Definition of Done

snack CRUD 프로토타입은 아래 조건을 만족하면 1차 완료로 본다.

## 9.1 기능 기준

```txt
- 목록 조회
- 검색
- 정렬
- 페이지네이션
- 상세 조회
- 등록
- 수정
- 삭제
- EmptyState
- ErrorState
- Loading 처리
- Toast 처리
```

## 9.2 구조 기준

```txt
- app/page.tsx는 조합만 담당
- features/snack에 도메인 로직 집중
- shared에는 도메인 독립 공통 코드만 배치
- features/common은 application-level 공통 패턴만 배치
- repository 교체 가능 구조 유지
```

## 9.3 테스트 기준

```txt
- schema unit test 작성
- util unit test 작성
- form component test 작성
- CRUD 핵심 e2e 1개 이상 작성
- CI에서 typecheck/lint/test/build 통과
```

## 9.4 문서 기준

```txt
- README에 실행 방법 정리
- docs 또는 mock/docs에 API 문서 정리
- features/snack/components/README.md에 컴포넌트 역할 정리
- common 컴포넌트 사용 기준 정리
```

---

# 10. 추천 작업 순서 체크리스트

## 1단계. snack 기준 정리

```txt
[ ] Snack 타입 정리
[ ] SnackSearchParams 정리
[ ] snackFormSchema 정리
[ ] snackSearchParamsSchema 정리
[ ] mock/snack.json 응답 구조 확정
```

## 2단계. API 경계 정리

```txt
[ ] snack.repository interface 기준 정리
[ ] snack.api.repository.ts 정리
[ ] snack.json.repository.ts 정리
[ ] snack.service.ts 정리
[ ] app/api/snack/route.ts 정리
[ ] app/api/snack/[id]/route.ts 정리
```

## 3단계. React Query 정리

```txt
[ ] snackKeys 정리
[ ] snackListQueryOptions 정리
[ ] snackDetailQueryOptions 정리
[ ] useSnackList 정리
[ ] useSnackDetail 정리
[ ] useCreateSnack 정리
[ ] useUpdateSnack 정리
[ ] useDeleteSnack 정리
[ ] prefetchSnackList 정리
[ ] prefetchSnackDetail 정리
```

## 4단계. 공통 컴포넌트 제작

```txt
[ ] EmptyState
[ ] ErrorState
[ ] ConfirmDialogButton
[ ] CommonPagination
[ ] CommonTable
[ ] CommonSortSelect
[ ] FormSubmitButton
[ ] DetailInfoRow
[ ] ActionMenu
```

## 5단계. snack 컴포넌트 제작

```txt
[ ] SnackListPage
[ ] SnackSearch
[ ] SnackSort
[ ] SnackTable
[ ] SnackPagination
[ ] SnackForm
[ ] SnackDetail
[ ] SnackActions
```

## 6단계. common 정리

```txt
[ ] features/common/components/crud-page-header.tsx
[ ] features/common/components/crud-toolbar.tsx
[ ] features/common/constants/pagination.constant.ts
[ ] features/common/types/crud.type.ts
```

## 7단계. Swagger/API 문서

```txt
[ ] docs/api 또는 mock/docs/openapi 폴더 생성
[ ] snack.openapi.yaml 작성
[ ] API request/response 예시 작성
[ ] 추후 swagger-ui 또는 scalar 연결 여부 결정
```

## 8단계. CI/CD

```txt
[ ] package.json scripts 정리
[ ] typecheck script 추가
[ ] lint script 확인
[ ] vitest CI 연결
[ ] playwright CI 연결
[ ] build CI 연결
[ ] Vercel preview/prod 배포는 후순위로 분리
```

## 9단계. TDD/테스트

```txt
[ ] snack.schema.test.ts
[ ] query-string.test.ts
[ ] snack-form.test.tsx
[ ] snack-crud.spec.ts
[ ] CI에서 테스트 실행 확인
```

---

# 11. 최종 권장 구조

프로토타입 완료 후 목표 구조는 다음과 같다.

```txt
app/
 ├─ (default-layout)/(main)/snack
 │   ├─ page.tsx
 │   ├─ new/page.tsx
 │   ├─ [id]/page.tsx
 │   └─ [id]/edit/page.tsx
 └─ api/snack
     ├─ route.ts
     └─ [id]/route.ts

features/
 ├─ common
 │   ├─ components
 │   ├─ constants
 │   └─ types
 └─ snack
     ├─ components
     ├─ hooks
     ├─ prefetch
     ├─ queries
     ├─ repositories
     ├─ schema
     ├─ services
     └─ types

shared/
 ├─ components
 │   ├─ ui
 │   └─ common
 ├─ hooks
 ├─ lib
 ├─ styles
 └─ types

docs/
 └─ api
     └─ snack.openapi.yaml

tests/
 └─ snack-crud.spec.ts
```

---

# 12. 핵심 결론

`snack`은 단순 예제 도메인이 아니라, 앞으로 `notice`, `board`, `product`, `member` 같은 CRUD 도메인으로 확장하기 위한 기준 프로토타입으로 만드는 것이 좋다.

가장 중요한 기준은 다음이다.

```txt
1. app은 라우팅과 조합만 담당한다.
2. features/snack은 snack 도메인 정책을 담당한다.
3. shared는 도메인을 모르는 공통 UI와 lib만 담당한다.
4. features/common은 여러 feature가 공유하는 application-level CRUD 패턴만 담당한다.
5. repository 경계를 명확히 해서 json-server, Route Handler, Prisma 전환이 가능하게 만든다.
6. Swagger/API 문서는 초기에 수동 yaml로 시작해도 충분하다.
7. CI는 typecheck, lint, test, build를 먼저 안정화한다.
8. TDD는 schema/util부터 시작하고, 핵심 CRUD는 Playwright e2e로 보강한다.
```

큰 `CommonCrudPage` 하나를 만드는 방식은 피하는 편이 좋다. 대신 작은 공통 컴포넌트를 만들고, `SnackSearch`, `SnackSort`, `SnackForm`, `SnackTable` 같은 도메인 컴포넌트가 이를 조합하는 방식이 가장 안정적이다.
