# Snack CRUD 프로토타입 및 공통 가이드라인

## 문서 목적

이 문서는 현재 `frontend` 프로젝트 구조를 기준으로 `snack` 기능을 CRUD 서비스의 기준 프로토타입으로 만들기 위한 작업 가이드다.

목표는 단순히 `snack` 기능 하나를 완성하는 것이 아니라, 이후 `notice`, `board`, `product`, `member` 등 다른 도메인으로 확장할 때 반복해서 사용할 수 있는 기준 구조를 만드는 것이다.

핵심 기준은 다음과 같다.

```txt
1. snack을 CRUD 기준 도메인으로 삼는다.
2. 공통 UI와 도메인 로직을 분리한다.
3. features/snack 구조를 기준 구조로 정리한다.
4. shared/common 영역에 반복 가능한 공통 처리를 모은다.
5. API Response, Validation, Query, Mutation, Form, Table, Pagination, Error, Empty, Toast 흐름을 표준화한다.
6. Swagger, CI/CD, TDD, E2E까지 확장 가능한 프로토타입으로 만든다.
```

---

# 1. 기술 스택(Spec)

## 1.1 UI

```txt
UI
- shadcn/ui
  - radix-ui
  - base-ui
```

적용 기준:

```txt
shared/components/ui
- shadcn/ui 원본 컴포넌트 위치

shared/components/ui/custom
- 프로젝트에서 shadcn/ui를 감싸서 만든 확장 컴포넌트 위치

features/snack/components
- snack 도메인 전용 UI 조합 위치
```

권장 방향:

```txt
shadcn/ui 원본 컴포넌트는 직접 수정하지 않는다.
공통화가 필요한 경우 shared/components/ui/custom 또는 shared/components/common에 래핑 컴포넌트를 만든다.
도메인 정책이 들어가는 경우 features/snack/components에 둔다.
```

예:

```txt
shared/components/ui/button.tsx
shared/components/ui/input.tsx
shared/components/ui/select.tsx
shared/components/ui/alert-dialog.tsx

shared/components/common/empty-state.tsx
shared/components/common/error-state.tsx
shared/components/common/common-pagination.tsx
shared/components/common/confirm-dialog-button.tsx

features/snack/components/snack-search.tsx
features/snack/components/snack-sort.tsx
features/snack/components/snack-form.tsx
features/snack/components/snack-table.tsx
```

---

## 1.2 CSS

```txt
CSS
- Tailwind CSS
```

적용 기준:

```txt
shared/styles/globals.css
- 전역 CSS
- shadcn/ui CSS variables
- theme token
- sidebar token
- background/foreground token

컴포넌트 스타일
- className 기반 Tailwind 사용
- cn / clsx / tailwind-merge 사용
```

권장 방향:

```txt
공통 컴포넌트는 className 확장 가능하게 만든다.
도메인 컴포넌트는 레이아웃 조합 위주로 작성한다.
반복 스타일은 variant 또는 custom component로 올린다.
```

---

## 1.3 Component / Form

```txt
Component
- form
  - HTML form
  - Next/form
    - form action 최적화 검토
    - useFormStatus
    - useActionState
    - useTransition
  - RHF(react-hook-form) + zod
```

### Form 사용 기준

CRUD 서비스에서는 폼의 목적에 따라 나눈다.

```txt
검색 Form
- URL query state와 연결
- nuqs 사용
- submit 시 searchParams 변경
- RHF까지 쓰지 않아도 되는 경우가 많음

등록/수정 Form
- 입력 검증 필요
- 복잡한 필드 상태 필요
- RHF + zod 사용 권장

Server Action Form
- 서버 액션 기반 제출
- progressive enhancement가 중요한 경우 검토
- useActionState / useFormStatus 사용 가능

Mutation Form
- React Query useMutation 기반
- 클라이언트 상호작용, toast, invalidateQueries가 중요한 경우 사용
```

### Snack 기준 권장

```txt
SnackSearch
- nuqs + native form submit 또는 controlled search
- RHF는 과한 경우가 많음

SnackCreateForm / SnackEditForm
- RHF + zod
- useMutation
- 성공 시 invalidateQueries + router 이동 + sonner toast

Server Action 실험 영역
- features/snack/actions/snack.action.ts
- form action 방식은 별도 prototype으로 유지
```

정리:

```txt
일반 CRUD 프로토타입의 기본값은 RHF + zod + React Query mutation이다.
Next/form, useFormStatus, useActionState는 Server Action 기반 폼을 검증하기 위한 별도 실험 케이스로 둔다.
```

---

## 1.4 Select

```txt
Select
- shadcn/ui Select
- Native Select
- dynamic select
```

사용 기준:

```txt
shadcn/ui Select
- 디자인 일관성이 중요한 일반 UI
- 값이 명확하고 options가 준비된 경우

Native Select
- hydration 이슈를 피하고 싶을 때
- 검색/정렬처럼 단순한 선택일 때
- 브라우저 기본 접근성이 유리할 때

Dynamic Select
- API에서 options를 받아오는 경우
- 브랜드/카테고리/상태값처럼 공통 코드가 필요한 경우
```

Snack 기준:

```txt
SnackSort
- Native Select 또는 shadcn Select 둘 다 가능
- hydration 안정성을 우선하면 Native Select

SnackForm brand/category
- options가 mock 또는 API에서 온다면 Dynamic Select
- RHF와 연결할 경우 FormSelect 컴포넌트로 공통화
```

주의:

```txt
shadcn/ui Select는 빈 문자열 value 처리, SSR hydration, defaultValue/value 연결에서 문제가 생기기 쉽다.
RHF와 사용할 때는 field.value, onValueChange, placeholder 처리 방식을 명확히 통일한다.
```

---

## 1.5 Validation

```txt
Validation
- zod
```

적용 기준:

```txt
features/snack/schema/snack.schema.ts
- createSnackSchema
- updateSnackSchema
- snackSearchParamsSchema
- snackIdSchema
- snackApiParamsSchema
```

권장 원칙:

```txt
Client Form 검증
- RHF resolver + zod

URL Search Params 검증
- nuqs parser
- 필요 시 zod schema와 분리

Route Handler 검증
- request body / searchParams / params를 zod로 재검증

Server Action 검증
- action 내부에서 zod safeParse 재검증

Repository 반환 데이터 검증
- 외부 API 또는 mock API 응답은 필요 시 zod parse 검토
```

중요:

```txt
RHF에서 검증했다고 해서 서버 검증을 생략하지 않는다.
Client 검증은 UX용이고, Route Handler / Server Action 검증은 신뢰 경계 보호용이다.
```

---

## 1.6 State

```txt
State
- Server State
  - @tanstack/react-query
    - prefetchQuery
    - useQuery
    - useSuspenseQuery
    - useMutation

- Client State
  - Zustand
```

### React Query 사용 기준

```txt
prefetchQuery
- Server Component page.tsx에서 초기 목록/상세 데이터를 미리 채울 때

useSuspenseQuery
- prefetch된 데이터를 Client Component에서 바로 사용할 때
- loading boundary와 Suspense 설계를 전제로 할 때

useQuery
- suspense를 쓰지 않거나 enabled 제어가 필요한 경우

useMutation
- create/update/delete/status 변경
- 성공 후 invalidateQueries
```

Snack 기준:

```txt
features/snack/queries/snack.query.ts
- queryKey
- queryOptions

features/snack/prefetch/snack.prefetch.ts
- prefetchSnackList
- prefetchSnackDetail

features/snack/hooks/useSnack.ts
- useSnackList
- useSnackDetail
- useCreateSnack
- useUpdateSnack
- useDeleteSnack
```

### Zustand 사용 기준

```txt
Zustand는 서버에서 가져오는 데이터 캐시 용도로 쓰지 않는다.
React Query와 역할을 겹치게 만들지 않는다.

적합한 예:
- modal open state
- drawer/sidebar state
- 임시 UI 상태
- multi-step form의 local draft
- 선택된 row ids
```

---

## 1.7 Util

```txt
Util
- search
  - qs
  - nuqs

- date
  - date-format: date-fns
  - date-picker: react-day-picker
```

### Search Util 기준

```txt
nuqs
- URL searchParams를 React 상태처럼 사용할 때
- page, keyword, sort, order, filter 상태 관리

qs
- API 요청 query string 생성
- nested object, array format 처리
- 빈 값 제거 후 요청 URL 생성
```

권장 분리:

```txt
features/snack/schema/snack.search-params.ts
- nuqs parser

shared/lib/query-string.ts
- qs 기반 toQueryString
- removeEmptyQueryParams
```

### Date Util 기준

```txt
date-fns
- 날짜 표시
- 서버/클라이언트 공통 포맷
- yyyy-MM-dd, yyyy.MM.dd HH:mm 등

react-day-picker
- 날짜 선택 UI
- shadcn Calendar와 연결
```

Snack 적용 예:

```txt
유통기한, 등록일, 수정일 같은 필드가 생기면 date-fns로 표시한다.
검색 조건에 기간 필터가 생기면 react-day-picker 기반 DateRangePicker를 공통화한다.
```

---

## 1.8 Alert

```txt
Alert
- alert
- toast(@deprecated)
  - useToast
  - Toast
  - Toaster
- sonner
- AlertDialog
```

권장 기준:

```txt
기본 toast
- sonner 사용 권장

shadcn useToast / Toast / Toaster
- 기존 코드 호환이 필요할 때만 유지
- 신규 프로토타입에서는 deprecated 처리

AlertDialog
- 삭제
- 취소
- 복구 불가 액션
- 상태 변경 확인
```

Snack 기준:

```txt
Create 성공
- toast.success('등록되었습니다.')

Update 성공
- toast.success('수정되었습니다.')

Delete 성공
- toast.success('삭제되었습니다.')

Mutation 실패
- toast.error('처리 중 문제가 발생했습니다.')

Delete 확인
- ConfirmDialogButton + AlertDialog
```

---

## 1.9 Common

```txt
Common
- 공통 컴포넌트
- 공통 유틸
- 공통 타입
- 공통 API Response
- 공통 에러 처리
```

추천 위치:

```txt
shared/components/common
shared/lib
shared/types
features/common
```

구분 기준:

```txt
shared
- 전 도메인에서 재사용 가능한 기술적 공통

features/common
- 여러 feature가 공유하지만 도메인 성격이 있는 공통
- 예: 공통 코드, 카테고리, 업로드 정책, 사용자 선택 등
```

---

## 1.10 Auth

```txt
Auth
- bcryptjs
- middleware.ts
- proxy.ts
```

적용 기준:

```txt
shared/lib/auth.ts
- NextAuth 설정
- auth, signIn, signOut export

app/api/auth/[...nextauth]/route.ts
- NextAuth Route Handler

middleware.ts 또는 proxy.ts
- 인증 라우팅 제어
- 보호 라우트 접근 제한
- 로그인 사용자 redirect
```

Snack CRUD 기준:

```txt
목록/상세
- 공개 가능

등록/수정/삭제
- 로그인 필요

서버 액션/Route Handler
- auth()로 세션 확인
- 권한 없는 요청 거부

UI
- 로그인 전: 등록/수정/삭제 버튼 숨김 또는 로그인 유도
- 로그인 후: 권한에 따라 액션 노출
```

주의:

```txt
클라이언트에서 버튼을 숨기는 것은 UX 처리일 뿐이다.
실제 보호는 Route Handler, Server Action, Middleware, DB 접근 계층에서 해야 한다.
```

---

## 1.11 DB

```txt
DB
- Mock
  - json-server
- ORM
  - Prisma
- BO
  - Nest.js
  - Java
- Supabase
```

단계별 적용:

```txt
1단계: json-server
- 빠른 CRUD 프로토타입
- mock/snack.json
- features/snack/repositories/snack.json.repository.ts

2단계: Next Route Handler + json-server
- app/api/snack
- 클라이언트는 내부 API만 호출
- repository 교체 준비

3단계: Prisma
- PostgreSQL 또는 SQLite
- features/snack/repositories/snack.prisma.repository.ts
- service에서 repository 선택

4단계: BO 분리
- Nest.js 또는 Java 백엔드
- features/snack/repositories/snack.api.repository.ts
- Swagger/OpenAPI 기반 contract 관리

5단계: Supabase 검토
- 인증/DB/Storage를 빠르게 구성할 때 선택 가능
- 단, 기존 NextAuth/Prisma 구조와 책임 중복 주의
```

권장 추상화:

```txt
SnackService
 └─ SnackRepository interface 성격
     ├─ JsonRepository
     ├─ PrismaRepository
     └─ ApiRepository
```

실제 TypeScript interface를 무조건 만들 필요는 없지만, 함수 시그니처는 통일한다.

---

## 1.12 Etc

```txt
Etc
- 공통 컴포넌트
- API Response
```

API Response 기준:

```ts
export type ApiResponse<T> = {
  ok: boolean
  data: T
  message?: string
}

export type ApiErrorResponse = {
  ok: false
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

export type PageResponse<T> = {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
```

권장 방향:

```txt
목록 API는 PageResponse<T> 형태로 통일한다.
단건 API는 ApiResponse<T> 또는 T 직접 반환 중 하나로 통일한다.
프로젝트 초반에는 T 직접 반환도 가능하지만, 에러/메시지/코드까지 표준화하려면 ApiResponse를 둔다.
```

---

## 1.13 TDD

```txt
TDD
- vitest
  - vi
- jsdom
- @vitest/ui
- @testing-library
  - react
  - dom
  - user-event
  - jest-dom
- msw
- @vitest/coverage-v8
- cypress
- playwright
```

역할 구분:

```txt
Vitest
- unit test
- util/schema/service 테스트

Testing Library
- component interaction 테스트
- form, search, pagination 테스트

MSW
- API mocking
- React Query hook 테스트
- 통합 컴포넌트 테스트

Cypress
- 브라우저 기반 component/e2e 테스트 가능
- 로컬 개발 중 UI 확인에 강점

Playwright
- CI용 E2E에 적합
- 로그인, CRUD 흐름, 라우팅 테스트
```

Snack 기준 우선순위:

```txt
1. zod schema 테스트
2. query string util 테스트
3. pagination util 테스트
4. repository/service 테스트
5. SnackSearch 컴포넌트 테스트
6. SnackForm validation 테스트
7. create/update/delete mutation 흐름 테스트
8. Playwright CRUD E2E 테스트
```

---

## 1.14 Swagger

```txt
Swagger
- OpenAPI 문서
- API contract 기준
```

적용 시점:

```txt
json-server만 사용하는 단계
- Swagger 필수 아님

Route Handler를 직접 API처럼 운영하는 단계
- OpenAPI 문서화 검토

Nest.js / Java BO 분리 단계
- Swagger 필수에 가까움
- FE는 Swagger 기반으로 API contract 확인
```

권장 산출물:

```txt
docs/api/snack.openapi.yaml
docs/api/snack-api.md
```

Swagger 기준으로 정의할 항목:

```txt
GET /snacks
GET /snacks/{id}
POST /snacks
PATCH /snacks/{id}
DELETE /snacks/{id}

PageResponse
SnackResponse
CreateSnackRequest
UpdateSnackRequest
ApiErrorResponse
```

---

## 1.15 CI/CD

```txt
CI/CD
- docker
- vercel
- GitHub Actions
  - .github/workflows
```

권장 workflow:

```txt
nextjs-app-ci.yml
- install
- lint
- typecheck
- unit test
- build

playwright.yml
- install
- install playwright browsers
- run mock server or test server
- run e2e
- upload report
```

Docker 기준:

```txt
개발 환경
- devcontainer
- docker-compose
- json-server
- database
- redis 등

배포 환경
- Vercel 우선
- BO/DB 분리 시 Docker 배포 검토
```

Vercel 기준:

```txt
Next.js 프론트 배포
환경변수 관리
Preview Deployment
main/dev 브랜치 배포 전략
```

---

## 1.16 AI

```txt
AI
- gemini-cli
  - .gemini
    - GEMINI.md
    - settings.json
    - 2026.6.18 @deprecated 예정
- AGENTS.md
- Claude
  - CLAUDE.md
- Codex
```

권장 방향:

```txt
AI 도구별 지침 파일을 분산시키지 말고 기준 문서를 하나 둔다.
```

추천 구조:

```txt
AGENTS.md
- 프로젝트 공통 AI 작업 지침
- 폴더 구조
- 코드 스타일
- 금지 사항
- 테스트 실행 방법
- 문서 작성 규칙

.gemini/GEMINI.md
- Gemini CLI가 AGENTS.md를 참조하도록 최소화

CLAUDE.md
- Claude가 AGENTS.md를 참조하도록 최소화

.codex 또는 Codex 관련 문서
- Codex가 AGENTS.md를 참조하도록 최소화
```

주의:

```txt
특정 도구가 deprecated 예정이라면 핵심 규칙은 해당 도구 전용 파일에만 두지 않는다.
프로젝트 표준은 AGENTS.md로 이동시키고, 각 도구별 파일은 연결 문서로 둔다.
```

---

# 2. 현재 프로젝트 구조 기준 정리

현재 구조는 이미 `app`, `features`, `shared`가 분리되어 있다.

```txt
app
- Next.js 라우팅
- page.tsx
- layout.tsx
- route.ts
- loading/error/not-found

features
- 도메인별 로직
- snack/auth/common

shared
- 전역 공통 UI
- 전역 공통 lib
- 전역 공통 type
```

권장 방향은 다음이다.

```txt
app은 라우팅과 조합을 담당한다.
features는 도메인 로직과 도메인 컴포넌트를 담당한다.
shared는 도메인을 모르는 공통 요소를 담당한다.
```

---

# 3. Snack CRUD 기준 목표 구조

최종적으로 `snack`은 다음 기준 구조를 갖는 것을 목표로 한다.

```txt
features/snack
├─ actions
│  └─ snack.action.ts
├─ components
│  ├─ snack-search.tsx
│  ├─ snack-sort.tsx
│  ├─ snack-table.tsx
│  ├─ snack-list.tsx
│  ├─ snack-pagination.tsx
│  ├─ snack-form.tsx
│  ├─ snack-detail.tsx
│  └─ snack-delete-button.tsx
├─ hooks
│  └─ useSnack.ts
├─ prefetch
│  └─ snack.prefetch.ts
├─ queries
│  └─ snack.query.ts
├─ repositories
│  ├─ snack.api.repository.ts
│  ├─ snack.json.repository.ts
│  └─ snack.prisma.repository.ts
├─ schema
│  └─ snack.schema.ts
├─ services
│  └─ snack.service.ts
└─ types
   └─ snack.type.ts
```

`app/(default-layout)/(main)/snack/_components`에 있는 컴포넌트는 점진적으로 `features/snack/components`로 이동한다.

단, Next.js 라우트 세그먼트 내부에서만 쓰는 극히 지역적인 컴포넌트라면 `_components`에 남겨도 된다.

---

# 4. App Router 페이지 책임

## 4.1 목록 페이지

```txt
app/(default-layout)/(main)/snack/page.tsx
```

책임:

```txt
- searchParams 수신
- zod 또는 nuqs 기준으로 기본값 정리
- QueryClient 생성
- snack list prefetch
- HydrationBoundary 구성
- ClientSnackPage 연결
```

하지 말아야 할 것:

```txt
- 테이블 row 직접 렌더링
- mutation 직접 처리
- 복잡한 search form 로직 보유
```

---

## 4.2 상세 페이지

```txt
app/(default-layout)/(main)/snack/[id]/page.tsx
```

책임:

```txt
- params.id 검증
- snack detail prefetch
- SnackDetail 연결
- notFound 처리
```

---

## 4.3 등록 페이지

```txt
app/(default-layout)/(main)/snack/new/page.tsx
```

책임:

```txt
- 권한 확인
- SnackForm mode=create 연결
- 필요한 select option prefetch
```

---

## 4.4 수정 페이지

```txt
app/(default-layout)/(main)/snack/[id]/edit/page.tsx
```

책임:

```txt
- params.id 검증
- 권한 확인
- detail 데이터 prefetch
- SnackForm mode=update 연결
```

---

# 5. 공통 처리 가이드

## 5.1 공통 컴포넌트

추천 위치:

```txt
shared/components/common
```

우선 만들 컴포넌트:

```txt
empty-state.tsx
error-state.tsx
common-pagination.tsx
common-table.tsx
common-sort-select.tsx
common-search-form.tsx
confirm-dialog-button.tsx
action-menu.tsx
form-submit-button.tsx
detail-info-row.tsx
page-header.tsx
section-card.tsx
```

공통 컴포넌트 원칙:

```txt
도메인 hook을 직접 호출하지 않는다.
queryKey를 알지 않는다.
router 이동을 직접 결정하지 않는다.
snack, notice, board 같은 도메인명을 알지 않는다.
value, data, columns, onChange, onSubmit, renderItem을 props로 받는다.
```

---

## 5.2 공통 유틸

추천 위치:

```txt
shared/lib
```

우선 만들 유틸:

```txt
query-string.ts
format-date.ts
format-price.ts
api-response.ts
pagination.ts
```

예:

```ts
export function removeEmptyQueryParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    })
  )
}
```

주의:

```txt
0을 제거해야 하는 명확한 정책이 없다면 !value로 필터링하지 않는다.
0은 page, price, count에서 유효한 값일 수 있다.
```

---

## 5.3 공통 타입

추천 위치:

```txt
shared/types
```

우선 만들 타입:

```txt
api.type.ts
pagination.type.ts
base.type.ts
option.type.ts
```

예:

```ts
export type SelectOption<TValue extends string = string> = {
  label: string
  value: TValue
}

export type PageResponse<T> = {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
```

---

## 5.4 공통 API Response

API 응답은 프로젝트 초반부터 방향을 정해야 한다.

권장:

```txt
외부 API / Route Handler 응답
- ApiResponse<T> 또는 PageResponse<T> 사용

React Query 내부 data
- 화면에서 쓰기 좋은 형태로 변환 후 반환
```

예:

```ts
export type ApiSuccessResponse<T> = {
  ok: true
  data: T
  message?: string
}

export type ApiFailureResponse = {
  ok: false
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse
```

---

# 6. features/common 작업 기준

`features/common`은 `shared`와 다르다.

```txt
shared
- 기술적 공통
- 도메인을 모름
- Button, Table, API Response, util 등

features/common
- 여러 feature에서 공유하는 도메인성 공통
- 공통 코드, 카테고리, 파일 업로드, 사용자 선택 등
```

추천 작업:

```txt
features/common/codes
- 브랜드 코드
- 카테고리 코드
- 상태 코드
- 정렬 옵션

features/common/components
- CommonCodeSelect
- CategorySelect
- BrandSelect
- StatusBadge

features/common/queries
- commonCode.query.ts

features/common/repositories
- commonCode.repository.ts

features/common/schema
- commonCode.schema.ts

features/common/types
- commonCode.type.ts
```

Snack에서 필요한 공통 코드:

```txt
brand
category
status
sort option
page size option
```

처음에는 상수로 시작해도 된다.

```ts
export const SNACK_BRAND_OPTIONS = [
  { label: '농심', value: 'nongshim' },
  { label: '롯데', value: 'lotte' },
  { label: '오리온', value: 'orion' }
] as const
```

이후 API 기반으로 전환할 경우 `features/common/codes`로 이동한다.

---

# 7. Snack CRUD 구현 순서

## 7.1 1단계: 타입과 스키마

작업 파일:

```txt
features/snack/types/snack.type.ts
features/snack/schema/snack.schema.ts
```

구성:

```txt
Snack
SnackDetail
SnackListItem
CreateSnackInput
UpdateSnackInput
SnackSearchParams
SnackApiParams
```

스키마:

```txt
createSnackSchema
updateSnackSchema
snackSearchParamsSchema
snackIdSchema
```

---

## 7.2 2단계: Repository

작업 파일:

```txt
features/snack/repositories/snack.json.repository.ts
features/snack/repositories/snack.api.repository.ts
features/snack/repositories/snack.prisma.repository.ts
```

우선순위:

```txt
1. json.repository
2. api.repository
3. prisma.repository
```

각 repository는 동일한 함수명을 유지한다.

```txt
getSnackList
getSnackDetail
createSnack
updateSnack
deleteSnack
```

---

## 7.3 3단계: Service

작업 파일:

```txt
features/snack/services/snack.service.ts
```

책임:

```txt
- repository 호출
- DTO 변환
- 비즈니스 규칙
- notFound 판단용 null 처리
- 에러 메시지 표준화
```

주의:

```txt
service는 React Query를 모른다.
service는 UI toast를 모른다.
service는 router를 모른다.
```

---

## 7.4 4단계: Query

작업 파일:

```txt
features/snack/queries/snack.query.ts
features/snack/prefetch/snack.prefetch.ts
features/snack/hooks/useSnack.ts
```

구성:

```txt
snackKeys
snackListQueryOptions
snackDetailQueryOptions
prefetchSnackList
prefetchSnackDetail
useSnackList
useSnackDetail
useCreateSnack
useUpdateSnack
useDeleteSnack
```

권장 queryKey:

```ts
export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, 'detail'] as const,
  detail: (id: number) => [...snackKeys.details(), id] as const
}
```

---

## 7.5 5단계: Route Handler

작업 파일:

```txt
app/api/snack/route.ts
app/api/snack/[id]/route.ts
```

책임:

```txt
GET /api/snack
GET /api/snack/:id
POST /api/snack
PATCH /api/snack/:id
DELETE /api/snack/:id
```

검증:

```txt
searchParams 검증
params.id 검증
request body 검증
auth 검증
에러 응답 표준화
```

---

## 7.6 6단계: 화면 컴포넌트

작업 파일:

```txt
features/snack/components/snack-search.tsx
features/snack/components/snack-sort.tsx
features/snack/components/snack-table.tsx
features/snack/components/snack-pagination.tsx
features/snack/components/snack-form.tsx
features/snack/components/snack-detail.tsx
features/snack/components/snack-delete-button.tsx
```

역할:

```txt
SnackSearch
- nuqs searchParams 변경

SnackSort
- sort/order 변경

SnackTable
- data 렌더링

SnackPagination
- page 변경

SnackForm
- create/update 공통 폼

SnackDetail
- 상세 표시

SnackDeleteButton
- AlertDialog + useDeleteSnack
```

---

## 7.7 7단계: App Page 연결

작업 파일:

```txt
app/(default-layout)/(main)/snack/page.tsx
app/(default-layout)/(main)/snack/[id]/page.tsx
app/(default-layout)/(main)/snack/new/page.tsx
app/(default-layout)/(main)/snack/[id]/edit/page.tsx
```

목표:

```txt
page.tsx는 최대한 얇게 유지한다.
데이터 prefetch와 컴포넌트 연결만 담당한다.
```

---

# 8. Swagger / OpenAPI 처리

## 8.1 필요한 이유

Swagger는 프론트 단독 mock 단계에서는 필수는 아니지만, BO가 Nest.js 또는 Java로 분리될 경우 API 계약 기준이 된다.

## 8.2 Snack API 문서화 대상

```txt
GET /api/snack
GET /api/snack/{id}
POST /api/snack
PATCH /api/snack/{id}
DELETE /api/snack/{id}
```

## 8.3 작성 위치

```txt
docs/api/snack.openapi.yaml
docs/api/snack-api.md
```

## 8.4 최소 작성 항목

```txt
Request
- query params
- path params
- body

Response
- success
- validation error
- unauthorized
- forbidden
- not found
- server error
```

---

# 9. TDD / 테스트 처리

## 9.1 Unit Test

대상:

```txt
zod schema
query-string util
pagination util
format util
repository
service
```

위치:

```txt
features/snack/schema/snack.schema.test.ts
shared/lib/query-string.test.ts
shared/lib/pagination.test.ts
features/snack/services/snack.service.test.ts
```

---

## 9.2 Component Test

대상:

```txt
SnackSearch
SnackSort
SnackForm
SnackTable
SnackPagination
ConfirmDialogButton
EmptyState
ErrorState
```

도구:

```txt
vitest
jsdom
@testing-library/react
@testing-library/user-event
@testing-library/jest-dom
```

---

## 9.3 Mock API Test

대상:

```txt
useSnackList
useSnackDetail
useCreateSnack
useUpdateSnack
useDeleteSnack
```

도구:

```txt
msw
React Query test QueryClient
```

---

## 9.4 E2E Test

대상:

```txt
목록 진입
검색
정렬
페이지 이동
상세 진입
등록
수정
삭제
로그인 필요 페이지 접근
```

도구:

```txt
Playwright
Cypress
```

권장:

```txt
CI에서는 Playwright를 우선 사용한다.
Cypress는 로컬 UI 디버깅 또는 component test 용도로 검토한다.
```

---

# 10. CI/CD 처리

## 10.1 GitHub Actions

현재 구조:

```txt
.github/workflows/nextjs-app-ci.yml
.github/workflows/playwright.yml
```

권장 작업:

```txt
nextjs-app-ci.yml
- checkout
- setup node
- install
- lint
- typecheck
- test
- build

playwright.yml
- checkout
- setup node
- install
- playwright install
- app build
- app start
- e2e test
- report upload
```

## 10.2 package.json scripts 기준

권장 script:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:mock": "json-server --port 3173 --watch mock/snack.json",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "build": "next build"
  }
}
```

주의:

```txt
Next.js 버전에 따라 next lint 지원 방식이 달라질 수 있으므로 현재 package.json 기준으로 확인한다.
```

---

# 11. AI 작업 지침 처리

## 11.1 필요한 이유

현재 `.gemini` 디렉터리가 존재한다.

```txt
.gemini
- GEMINI.md
- settings.json
- folder.tree
- image.png
```

하지만 AI 도구가 Gemini만 있는 것은 아니다.

```txt
Gemini
Claude
Codex
```

따라서 프로젝트 표준 지침은 특정 도구 전용 파일에만 두지 않는 편이 좋다.

## 11.2 추천 구조

```txt
AGENTS.md
CLAUDE.md
.gemini/GEMINI.md
```

역할:

```txt
AGENTS.md
- 프로젝트 공통 AI 작업 기준
- 가장 중요한 기준 문서

CLAUDE.md
- Claude 사용 시 AGENTS.md 참조

.gemini/GEMINI.md
- Gemini CLI 사용 시 AGENTS.md 참조
- deprecated 예정이면 핵심 규칙 이전 필요
```

## 11.3 AGENTS.md에 포함할 내용

```txt
프로젝트 구조
기술 스택
코딩 컨벤션
컴포넌트 위치 규칙
테스트 실행 방법
문서 작성 규칙
금지 사항
PR 전 체크리스트
```

---

# 12. 최종 작업 체크리스트

## Phase 1. 기준 정리

```txt
[ ] 기술 스택 Spec 문서화
[ ] features/snack 기준 구조 확정
[ ] shared와 features/common 책임 구분
[ ] API Response 타입 확정
[ ] queryKey 규칙 확정
```

## Phase 2. 공통 기반 구현

```txt
[ ] shared/components/common 생성
[ ] EmptyState 구현
[ ] ErrorState 구현
[ ] CommonPagination 구현
[ ] CommonTable 구현
[ ] ConfirmDialogButton 구현
[ ] FormSubmitButton 구현
[ ] shared/lib/query-string 구현
[ ] shared/lib/format-date 구현
[ ] shared/lib/format-price 구현
[ ] shared/types/api.type.ts 구현
[ ] shared/types/pagination.type.ts 구현
```

## Phase 3. Snack CRUD 구현

```txt
[ ] snack.type.ts 작성
[ ] snack.schema.ts 작성
[ ] snack.repository 작성
[ ] snack.service 작성
[ ] snack.query 작성
[ ] snack.prefetch 작성
[ ] useSnack hooks 작성
[ ] Route Handler 작성
[ ] SnackSearch 작성
[ ] SnackSort 작성
[ ] SnackTable 작성
[ ] SnackPagination 작성
[ ] SnackForm 작성
[ ] SnackDetail 작성
[ ] SnackDeleteButton 작성
[ ] page.tsx 연결
```

## Phase 4. 인증/권한 반영

```txt
[ ] 등록 페이지 보호
[ ] 수정 페이지 보호
[ ] 삭제 API 보호
[ ] 로그인 전/후 액션 버튼 분기
[ ] middleware.ts / proxy.ts 기준 정리
```

## Phase 5. 테스트

```txt
[ ] schema unit test
[ ] util unit test
[ ] service unit test
[ ] component test
[ ] MSW 기반 hook test
[ ] Playwright CRUD e2e test
```

## Phase 6. 문서/CI/CD

```txt
[ ] Swagger/OpenAPI 초안 작성
[ ] nextjs-app-ci.yml 정리
[ ] playwright.yml 정리
[ ] AGENTS.md 작성
[ ] GEMINI.md/CLAUDE.md 연결 정리
```

---

# 13. 최종 요약

이 프로젝트의 CRUD 프로토타입은 `snack`을 기준으로 만든다.

가장 중요한 방향은 다음이다.

```txt
app
- 라우팅
- page 연결
- prefetch
- loading/error/not-found

features/snack
- snack 도메인 전용 로직
- schema
- type
- query
- hook
- service
- repository
- component

shared
- 도메인을 모르는 공통 UI
- 공통 util
- 공통 type
- API Response
- format
- pagination

features/common
- 여러 도메인에서 공유하는 도메인성 공통
- code
- category
- status
- option
```

기술 스택 기준으로는 다음을 기본값으로 둔다.

```txt
UI
- shadcn/ui + radix-ui + base-ui + Tailwind CSS

Form
- 검색: nuqs + form submit
- 등록/수정: RHF + zod + React Query mutation
- Server Action Form: 별도 prototype

State
- Server State: React Query
- Client State: Zustand

Mock/DB
- 1차 json-server
- 2차 Route Handler
- 3차 Prisma
- 4차 BO Nest.js/Java
- 필요 시 Supabase 검토

Alert
- sonner 우선
- AlertDialog로 확인 액션 처리
- shadcn useToast는 deprecated 취급

Test
- Vitest + Testing Library + MSW
- E2E는 Playwright 우선

CI/CD
- GitHub Actions
- Vercel
- Docker/devcontainer

AI
- AGENTS.md를 기준 문서로 두고 Gemini/Claude/Codex는 이를 참조
```

공통화를 할 때는 거대한 `CommonCrudPage`를 만들기보다 작은 공통 컴포넌트를 만들고, 도메인 컴포넌트가 조합하는 방식을 기준으로 한다.

```txt
Common Component
- 도메인 모름
- props 기반
- 재사용 가능

Domain Component
- snack 정책 보유
- query/mutation/router/searchParams 처리
- common component 조합

Page
- route 단위 조합
- prefetch
- layout 연결
```

이 기준으로 `snack` CRUD를 완성하면, 이후 `notice`, `board`, `product`, `member` 기능은 동일한 구조를 복제한 뒤 도메인 규칙만 바꾸는 방식으로 확장할 수 있다.
