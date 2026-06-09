# 프로젝트 구조 & 로드맵 한눈에 보기

## 📦 전체 프로젝트 구조

```txt
📦frontend
 ┣ 📂.gemini
 ┣ 📂app
 ┃ ┣ 📂(default-layout)
 ┃ ┃ ┣ 📂(main)
 ┃ ┃ ┃ ┗ 📂snack
 ┃ ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┃ ┣ 📜list.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜loader.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜search-loader.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜search.tsx
 ┃ ┃ ┃ ┃ ┣ 📂new
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂(public)
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📂signup
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┣ 📜loading.tsx
 ┃ ┃ ┗ 📜provider.tsx
 ┃ ┣ 📂(empty-layout)
 ┃ ┃ ┣ 📂example
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┗ 📂api
 ┃ ┃ ┗ 📂snack
 ┃ ┃ ┃ ┗ 📜route.ts
 ┣ 📂features
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┗ 📜useCommon.ts
 ┃ ┃ ┣ 📂queries
 ┃ ┃ ┃ ┗ 📜common.query.ts
 ┃ ┃ ┣ 📂repositories
 ┃ ┃ ┃ ┗ 📜common.repository.ts
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┗ 📜common.service.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜common.type.ts
 ┃ ┗ 📂snack
 ┃ ┃ ┣ 📂actions
 ┃ ┃ ┃ ┗ 📜snack.action.ts
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┗ 📜useSnack.ts
 ┃ ┃ ┣ 📂prefetch
 ┃ ┃ ┃ ┣ 📜snack.prefetch.ts
 ┃ ┃ ┣ 📂queries
 ┃ ┃ ┃ ┗ 📜snack.query.ts
 ┃ ┃ ┣ 📂repositories
 ┃ ┃ ┃ ┣ 📜snack.api.repository.ts
 ┃ ┃ ┃ ┗ 📜snack.prisma.repository.ts
 ┃ ┃ ┣ 📂schema
 ┃ ┃ ┃ ┗ 📜snack.schema.ts
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┗ 📜snack.service.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜snack.type.ts
 ┣ 📂mock
 ┃ ┣ 📂docs
 ┃ ┃ ┣ 📂20260509
 ┃ ┃ ┃ ┣ 📜chapter.md
 ┃ ┃ ┃ ┣ 📜next.md
 ┃ ┃ ┣ 📂images
 ┃ ┃ ┣ 📜form-guide.md
 ┃ ┃ ┣ 📜form-next-demo.md
 ┃ ┃ ┣ 📜form-rhf-demo.md
 ┃ ┃ ┗ 📜qua.md
 ┃ ┗ 📜snack.json
 ┣ 📂public
 ┣ 📂shared
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂ui
 ┃ ┣ 📂hooks
 ┃ ┃ ┣ 📜use-mobile.ts
 ┃ ┃ ┗ 📜use-toast.ts
 ┃ ┣ 📂lib
 ┃ ┃ ┣ 📜axios.ts
 ┃ ┃ ┣ 📜prisma.ts
 ┃ ┃ ┣ 📜react-query.ts
 ┃ ┃ ┗ 📜utils.ts
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜globals.css
 ┃ ┗ 📂types
 ┃ ┃ ┣ 📜base.type.ts
 ┃ ┃ ┗ 📜env.d.ts
 ┣ 📜.env.local
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜next.config.ts
 ┣ 📜package.json
```

---

# app 구조

```txt
app/
├─ (default-layout)/
│  └─ (main)/
│     └─ snack/
│        ├─ page.tsx
│        ├─ new/
│        │  └─ page.tsx
│        ├─ [id]/
│        │  ├─ page.tsx
│        │  └─ edit/
│        │     └─ page.tsx
│        │
│        └─ _components/
│           ├─ list.tsx            # 리스트 조회 영역
│           ├─ loader.tsx          # Suspense fallback loader
│           ├─ search.tsx          # 검색/필터 영역
│           └─ search-loader.tsx   # 검색 loader
│
├─ (public)/
│  ├─ login/
│  │  └─ page.tsx
│  └─ signup/
│     └─ page.tsx
│
├─ api/
│  └─ snack/
│     └─ route.ts                  # Route Handler API
│
├─ layout.tsx                      # Root Layout
├─ loading.tsx                     # Global Loading UI
└─ provider.tsx                    # React Query / Theme / Toast Provider
```

---

# features 구조

```txt
features/
├─ common/
│  ├─ hooks/
│  │  └─ useCommon.ts              # 공통 Query Hooks
│  │
│  ├─ queries/
│  │  └─ common.query.ts           # 공통 Query Options
│  │
│  ├─ repositories/
│  │  └─ common.repository.ts      # 공통 API/DB 접근
│  │
│  ├─ services/
│  │  └─ common.service.ts         # 공통 비즈니스 로직
│  │
│  └─ types/
│     └─ common.type.ts            # 공통 타입
│
└─ snack/
   ├─ actions/
   │  └─ snack.action.ts           # Server Actions (CUD)
   │
   ├─ hooks/
   │  └─ useSnack.ts               # useQuery/useMutation Custom Hook
   │
   ├─ prefetch/
   │  └─ snack.prefetch.ts         # SSR Prefetch Logic
   │
   ├─ queries/
   │  └─ snack.query.ts            # QueryKey & queryOptions
   │
   ├─ repositories/
   │  ├─ snack.api.repository.ts   # HTTP API Repository
   │  └─ snack.prisma.repository.ts# Prisma Repository
   │
   ├─ schema/
   │  └─ snack.schema.ts           # zod validation schema
   │
   ├─ services/
   │  └─ snack.service.ts          # Business Logic Layer
   │
   └─ types/
      └─ snack.type.ts             # DTO / Type Definition
```

---

# 조회(List)

```txt
page.tsx
  ↓ `Server` searchParams 처리
snack.prefetch.ts
  ↓ `Server` prefetchQuery
HydrationBoundary
  ↓
list.tsx
  ↓ `Client` useSuspenseQuery
useSnack.ts
  ↓
snack.query.ts
  ↓
fetch('/api/snack')
  ↓ `Server` Route Handler
route.ts
  ↓ `Server` request validation
snack.schema.safeParse
  ↓
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 조회 특징

- `조회`는 Route Handler 기반 권장
- `GET/search/filter/paging` 처리에 적합
- React Query cache 활용 가능
- `SSR + hydration` 조합 가능
- `prefetchQuery + useSuspenseQuery` 조합 사용
- `searchParams/nuqs` 와 자연스럽게 연결 가능
- 외부 서비스/모바일에서도 API 재사용 가능

---

# 상세(Detail)

```txt
[id]/page.tsx
  ↓ `Server` params.id
snack.prefetch.ts
  ↓ `Server` prefetchQuery
HydrationBoundary
  ↓
detail.tsx
  ↓ `Client` useSuspenseQuery
useSnack.ts
  ↓
snack.query.ts
  ↓
fetch('/api/snack/:id')
  ↓ `Server`
route.ts
  ↓
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 상세 특징

- 상세 페이지도 조회와 동일하게 Route Handler 권장
- SEO 대응 가능
- URL 직접 접근 가능
- `notFound()` 처리 가능
- `generateMetadata()` 와 연결 가능
- 상세 + 댓글 + 연관 데이터 prefetch 가능

---

# 생성(Create)

```txt
new/page.tsx
  ↓ `Client`
RHF(react-hook-form)
  ↓
handleSubmit
  ↓
useMutation
  ↓
snack.action.ts
  ↓ `Server Action`
zod.schema.parse
  ↓
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 생성 특징

- `변경(CUD)` 작업은 Server Action 권장
- form action 과도 연결 가능
- useMutation 과 조합 가능
- optimistic update 가능
- revalidatePath/revalidateTag 가능
- validation 실패 시 field error 처리 가능

---

# 수정(Update)

```txt
[id]/edit/page.tsx
  ↓ `Server` 초기 데이터 prefetch
HydrationBoundary
  ↓
edit-form.tsx
  ↓ `Client`
RHF defaultValues
  ↓
useMutation
  ↓
snack.action.ts
  ↓ `Server`
zod.schema.parse
  ↓
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 수정 특징

- 초기 데이터는 SSR prefetch 권장
- RHF defaultValues 연결
- dirtyFields 활용 가능
- optimistic update 가능
- 수정 완료 후 invalidateQueries 처리
- 수정 성공 시 redirect/navigation 가능

---

# 삭제(Delete)

```txt
list.tsx / detail.tsx
  ↓ `Client`
delete button
  ↓
useMutation
  ↓
snack.action.ts
  ↓ `Server Action`
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 삭제 특징

- Server Action 기반 권장
- confirm dialog 와 조합
- optimistic remove 가능
- 삭제 후 cache invalidate
- 삭제 후 redirect 가능

---

# Query Layer 흐름

```txt
useSnack.ts
  ↓
snack.query.ts
  ↓
queryOptions({
  queryKey,
  queryFn
})
```

## 역할 분리

| 파일 | 역할 |
|---|---|
| useSnack.ts | 화면에서 사용하는 custom hook |
| snack.query.ts | queryKey/queryOptions 정의 |
| snack.prefetch.ts | SSR prefetch |
| snack.service.ts | 비즈니스 로직 |
| snack.repository.ts | 실제 API/DB 접근 |

---

# 추천 패턴

## 조회

```txt
Route Handler
  + useSuspenseQuery
  + prefetchQuery
  + HydrationBoundary
```

## 변경

```txt
Server Actions
  + useMutation
  + RHF
  + zod
```

---

# 실무 기준 추천 구조

## 조회

```txt
Client
  ↓
React Query
  ↓
Route Handler
  ↓
Service
  ↓
Repository
  ↓
DB
```

## 변경

```txt
Client
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
```

---

# ℹ️ 계획

## 1. 현재 단계

현재 구조는 이미 아래의 핵심 구조가 거의 완성된 상태입니다.

- App Router 기반 구조
- Feature 기반 구조
- React Query 도입
- Server Action 분리
- Route Handler 분리
- RHF + zod 구조
- Repository/Service 레이어 분리

즉, "실무형 Next.js 구조"의 기반은 거의 완성 단계입니다.

---

## 2. 다음 우선순위

### 1순위 - Query 안정화

### 목표

- queryKey 통일
- queryOptions 패턴 통일
- invalidateQueries 전략 정리

### 작업

```txt
features/*/queries
```

정리 및 공통화

---

### 2순위 - schema 강화

### 목표

- parse/safeParse 전략 통일
- field error 구조 통일
- form validation 공통화

### 작업

```txt
features/*/schema
```

정리

---

### 3순위 - API 구조 정리

### 목표

- Route Handler 역할 최소화
- validation/service 분리
- response format 통일

### 추천 응답 형식

```ts
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}
```

---

### 4순위 - 공통 UI 구축

### 목표

```txt
shared/components/ui
```

기반 공통 component 정리

### 추천

- DataTable
- FormField
- FormSelect
- Dialog
- ConfirmDialog
- PageHeader
- SearchFilter

---

### 5순위 - 인증 구조 연결

### 추천 흐름

```txt
middleware
  ↓
auth
  ↓
protected route
```

### 추가 후보

- JWT
- Session
- OAuth2
- refresh token
- role 기반 권한

---

### 6순위 - 에러 처리 통일

### 목표

- toast 처리 통일
- API error format 통일
- ErrorBoundary 적용
- loading/error/not-found 정리

---

### 7순위 - DB 전환

현재:

```txt
json-server
```

이후:

```txt
Prisma + PostgreSQL
```

추천

### 진행 순서

```txt
schema.prisma
  ↓
migration
  ↓
repository 교체
  ↓
service 유지
```

즉, service 계층은 유지한 채 repository 만 교체하는 구조 추천

---

## 3. 이후 추천 확장

### 검색 고도화

- debounce
- infinite query
- cursor pagination
- server filtering

### 성능

- streaming
- partial prerendering
- suspense boundary 분리
- dynamic import

### DX 개선

- eslint rule 강화
- prettier plugin tailwind
- husky/lint-staged
- commitlint

### 테스트

- vitest
- react-testing-library
- playwright
- msw

---

# 최종 목표 구조

```txt
Next.js App Router
  + React Query
  + Server Actions
  + Route Handler
  + RHF
  + zod
  + Prisma
  + PostgreSQL
  + Feature Layer Architecture
```

## 핵심 방향

```txt
조회 → Route Handler + React Query
변경 → Server Action + useMutation
검증 → zod
상태 → React Query
DB → Prisma
구조 → Feature 기반
```
