# 목차

<!-- [절대 경로](/frontend/mock/docs/20260509/next.md#eslint) -->
<!-- [상대 경로](./next.md#eslint) -->

[한글 설명]: # '/경로#영어제목'

<!-- 한글제목은 인코딩 문제로 깨져 링크 호환이 안됩니다. (디코딩해야 호환 가능) -->

- [Next.js?](./next.md#nextjs)
  - [설치 및 구성](./next.md#installation-and-configuration)
  - [기본 구성 요소(Component & Function)](./next.md#basic-componentscomponent--function)
    - [1. Server Component](./next.md#1-server-component)
    - [2. Client Component](./next.md#2-client-component)
    - [3. Shared Function](./next.md#3-shared-function)
    - [4. Server Function](./next.md#4-server-function)
      - [서버 전용 요소](./next.md#server-only-elements)
      - [서버 전용 API](./next.md#server-only-api)
    - [5. Client Function](./next.md#5-client-function)
      - [클라이언트 전용 요소](./next.md#client-only-elements)
      - [클라이언트 전용 API](./next.md#client-only-api)
  - [서버 진입점](./next.md#remote-procedure-call)
    - [기본 기능](./next.md#rpc-function-simple)
      - [1. Public API](./next.md#1-public-api)
      - [2. Server Actions](./next.md#2-server-actions)
      - [3. Route Handler](./next.md#3-route-handler)
    - [심화 기능](./next.md#rpc-function-detail)
      - [1. useFormStatus](./next.md#1-useformstatus)
      - [2. useActionState](./next.md#2-useactionstate)
      - [3. useTransition](./next.md#3-usetransition)
      - [4. useOptimistic](./next.md#4-useoptimistic)
    - [React Query](./next.md#react-query)
      - [1. prefetchQuery](./next.md#1-prefetchquery)
      - [2. useQuery](./next.md#2-usequery)
      - [3. useSuspenseQuery](./next.md#3-usesuspensequery)
      - [4. useMutation](./next.md#4-usetransition)
  - [한눈에 보기](./next.md#overview)
  - [⚠️ 주의사항](./next.md#caution)
    - [Next/Form](./next.md#nextform)
    - [Radix UI](./next.md#radix-ui)
      - [Radix Select](./next.md#radix-select)
    - [Query String](./next.md#query-string)
      - [searchParams](./next.md#searchparams)
      - [qs](./next.md#qs)
      - [nuqs](./next.md#nuqs)
  - [서버 vs 브라우저](./next.md#server-vs-client)
    - [단계별 과정 요약](./next.md#step-by-step-simple)
      - [1. `Server` prerender](./next.md#1-server-prerender)
      - [2. `Server` 생성한 HTML 을 브라우저에 전달](./next.md#2-server-ssr)
      - [3. `Browser` 전달받은 HTML 표시](./next.md#3-browser-html)
      - [4. `Browser` hydration 시작](./next.md#4-browser-hydration-start)
      - [5. `Browser` hydration 완료](./next.md#5-browser-hydration-end)
    - [단계별 과정 심화](./next.md#step-by-step-detail)
      - [용어](./next.md#dictionary)
  - [React vs Next.js](./next.md#react-vs-nextjs)
    - [1. React](./next.md#1-react)
    - [2. Next.js](./next.md#2-nextjs)
  - [라우팅](./next.md#routing)
    - [1. Pages Router](./next.md#1-pages-router)
    - [2. App Router](./next.md#2-app-router)
      - [세그먼트](./next.md#segment)
      - [세그먼트 구조](./next.md#segment-structure)
  - [동적 경로](./next.md#dynamic-route)
    - [순서](./next.md#squence)
  - [비동기 컴포넌트 스트리밍](./next.md#async)
  - [경로 병렬 처리](./next.md#parallel-routes)
  - [경로 가로채기](./next.md#intercepting-routes)
    - [Modal](./next.md#modal)
  - [인증](./next.md#auth)
  - [캐싱](./next.md#cache)
    - [RYW](./next.md#ryw)
    - [SWR](./next.md#swr)
  - [최적화](./next.md#optimization)
  - [편의성 라이브러리 추천](./next.md#library-recommend)
    - [기본](./next.md#simple)
      - [alert](./next.md#alert)
    - [심화](./next.md#detail)
      - [트렌드 확인](./next.md#check-trends)
  - [배포](./next.md#deploy)
  - [💻 Tip](./next.md#tip)
    - [Prettier](./next.md#prettier)
    - [ESLint](./next.md#eslint)
  - [출처](./next.md#source)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

---

# 요약

## 기본 구성 요소

| 항목             | 환경               | 필수           | 특징                                          |
| ---------------- | ------------------ | -------------- | --------------------------------------------- |
| Server Component | `Server`           | default        | async/await Component                         |
| Client Component | `Client`           | `'use client'` |                                               |
| Shared Function  | `Server \| Client` |                | 실행 위치에 따라 결정                         |
| Server Function  | `Server`           | default        | `Server 전용 요소 \| API` 사용 → DB           |
| Client Function  | `Client`           | `'use client'` | `Client 전용 요소 \| API` 사용 → React(hooks) |

> `'use client'` 가 필수는 아니지만, React(hooks) → Browser(Client) 환경에서만 가능

## 기본 로직

```txt
`Server`
  ↓ `RSC` prerender
prerender
  ↓ `SSR` HTML 생성/전달
`Browser`
  ↓ `SPA` Client Function 처리
hydration
  ↓ `CSR` React 동작
`Client`
```

### 1. `Server` prerender

`RSC` Next 가 서버 환경에서 React 렌더링

- `Server Component/Function` ✅ 완료
- `Client Component` ✅ 완료
- `Client Function` ✅ 미리 실행하여 확인

```ts
/* 서버 터미널 출력 */
console.log('Server Component')
console.log('Client Component')
console.log('render')
```

### 2. `Server` HTML 생성

`SSR` HTML 생성 후 브라우저 전달

### 3. `Browser` HTML 조회

화면으로 조회 가능

- `Server Component/Function` ✅ 완료 → 데이터 존재(HTML 반영)
- `Client Component` ✅ 완료
- `Client Function` ❌ 미실행 단계 → HTML 미반영

### 4. `Browser` JS 다운로드

- Client Component bundle(JS)
- React runtime
- Next runtime

### 5. `Browser` hydration 시작

`SPA` React(hooks) 를 제외한 완료

- `Client Function` ⚠️ 일부 완료 → window/document(DOM)/event handler

```ts
/* 브라우저 콘솔 출력 */
console.log('Client Component')
console.log('render')
```

### 6. `Browser` hydration 완료

`CSR` React(hooks) 를 포함한 모든 완료

```ts
/* 브라우저 콘솔 출력 */
console.log('effect')
```

**⚬ console.log**

```tsx
'use client'

console.log('Client Component')

export default function Page() {
  console.log('render')

  React.useEffect(() => {
    console.log('effect')
  }, [])

  return <div>Hello</div>
}
```

## 서버 함수 호출

> `Client` → `서버 진입점(RPC)` → `Server`

**⚬ 흐름**

```txt
Browser
  ↓ form submit/event handler
Client
  ↓ `RPC` fetch
Server Action/Route Handler
  ↓ service
Server Function
  ↓ repository
DB
```

### 1. Public API

- `Server 전용 요소/API` 가 없고, public env 만 사용한 API
- RPC 거치지 않고, 바로 `fetch` 로 연결

### 2. Server Actions

- `'use server'` 필수
- `자동 RPC` Next/React 에서 자동 API 작성 + 자동 fetch 요청 → 작성 불필요
- `변경` mutation 기반(POST) 최적화 → 생성/수정/삭제
- Server 환경

### 3. Route Handler

- Server 환경
- `수동 RPC` 직접 RPC(API) 작성 + 직접 호출(fetch) 필요
- `조회` URL 기반(GET) 최적화 → 검색/필터/페이징
- Server 환경

---

# 한눈에 보기

## 프로젝트 구조

```txt
app/
├─ (default-layout)/
│  └─ (main)/
│     └─ snack/
│        ├─ page.tsx                # 조회 페이지
│        ├─ new/
│        │  └─ page.tsx             # 생성 페이지
│        ├─ [id]/
│        │  ├─ page.tsx             # 상세 페이지
│        │  └─ edit/
│        │     └─ page.tsx          # 수정 페이지
│        └─ _components/
│           ├─ list.tsx             # 리스트 조회 영역
│           ├─ loader.tsx           # 리스트 로딩 → Suspense fallback Wrapper
│           ├─ search.tsx           # 검색/필터 영역
│           └─ search-loader.tsx    # 검색 영역 로딩
├─ api/
│  └─ snacks/
│     └─ route.ts                   # API Route Handler (선택사항)
features/
├─ common/
├─ snack/
│  ├─ actions/
│  │  └─ snack.action.ts            # Server Actions (CUD 작업)
│  │
│  ├─ hooks/
│  │  └─ useSnack.ts                # Custom Hooks (Query/Mutation)
│  │
│  ├─ prefetch/
│  │  └─ snack.prefetch.ts          # SSR Prefetching Logic
│  │
│  ├─ queries/
│  │  └─ snack.query.ts             # Query Keys & queryOptions
│  │
│  ├─ repositories/
│  │  ├─ snack.api.repository.ts    # Axios 기반 Repository
│  │  └─ snack.prisma.repository.ts # Prisma(DB) 기반 Repository
│  │
│  ├─ schema/
│  │  └─ snack.schema.ts            # Zod Validation Schemas
│  │
│  ├─ services/
│  │  └─ snack.service.ts           # Business Logic Layer
│  │
│  └─ types/
│     └─ snack.type.ts              # DTO/Interfaces/Types Definition
shared/
```

## 조회

```txt
page.tsx
  ↓ `Server` searchParams
snack.prefetch
  ↓ `Server` prefetchQuery
list.tsx
  ↓ `Client` useSuspenseQuery
useSnack.ts
  ↓
snack.query.ts
  ↓
axios('/api/snack')
  ↓ `Server` Route Handler
route.ts
  ↓ `Server` request validation
snack.schema.safeParse
  ↓
snack.service
  ↓
snack.repository
  ↓ Prisma/fetch
DB
```

## 상세

```txt
[id]/page.tsx
  ↓ `Server` params.id
snack.prefetch.ts
  ↓ `Server` prefetchQuery
detail.tsx
  ↓ `Client` useSuspenseQuery
useSnack.ts
  ↓
snack.query.ts
  ↓
fetch('/api/snack/:id')
  ↓ `Server` Route Handler
route.ts
  ↓
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 생성

```txt
new/page.tsx
  ↓ `Client` RHF(react-hook-form)
useSnack.ts
  ↓ `Client` useMutation
snack.action
  ↓ `Server` Server Action
snack.service
  ↓
snack.repository
  ↓
DB
```

## 수정

```txt
[id]/edit/page.tsx
  ↓ `Server` 초기 데이터 prefetch
edit-form.tsx
  ↓ `Client` RHF(react-hook-form) defaultValues
useSnack.ts
  ↓ `Client` useMutation
snack.action.ts
  ↓ `Server` Server Action
zod.schema.parse
  ↓
snack.service.ts
  ↓
snack.repository.ts
  ↓
DB
```

## 삭제

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
