# CRUD 서비스 프로젝트 구조 요약 리포트

Next.js App Router 기반에서 `qs`, `nuqs`, `React Query`, `React Hook Form`, `Zod`를 조합해 CRUD 서비스를 구성하는 기준 문서입니다.
목표는 목록/상세/등록/수정/삭제 흐름을 일관된 구조로 만들고, 검색/필터/정렬/페이징 상태를 URL과 서버 상태 캐시에 안정적으로 연결하는 것입니다.

## 1. 권장 방향 요약

| 영역                  | 권장 방식                         | 이유                                                              |
| :-------------------- | :-------------------------------- | :---------------------------------------------------------------- |
| 라우팅                | Next.js App Router                | 목록/상세/등록/수정 페이지를 파일 기반으로 명확히 분리            |
| 조회 상태             | `nuqs`                            | 검색, 필터, 정렬, 페이지 번호를 URL query string으로 관리         |
| API query string 생성 | `qs`                              | 배열, 중첩 객체, 빈 값 제거 후 직렬화에 유리                      |
| 서버 상태             | `@tanstack/react-query`           | 목록/상세 조회 캐싱, prefetch, invalidate, optimistic update 대응 |
| 폼                    | `react-hook-form`                 | 불필요한 리렌더링을 줄이고 폼 상태 관리가 단순함                  |
| 검증                  | `zod` + `@hookform/resolvers/zod` | 입력값 검증과 TypeScript 타입 추론을 한 스키마로 통합             |
| UI                    | `shadcn/ui`                       | CRUD 화면에서 Button, Form, Select, Dialog, Table 조합이 좋음     |
| 알림                  | `sonner`                          | 생성/수정/삭제 성공/실패 피드백에 적합                            |
| 로컬 UI 상태          | 필요 시 `zustand`                 | 상세 패널, 선택 행, 모달 상태 등 서버 데이터가 아닌 UI 상태 분리  |
| DB 연동               | 실서비스 기준 `Prisma`            | TypeScript 기반 ORM, migration, relation 처리에 적합              |

## 2. 전체 폴더 구조

```text
frontend/
├── app/
│   ├── (default-layout)/
│   │   └── (main)/
│   │       └── snack/
│   │           ├── page.tsx              # 목록 페이지
│   │           ├── new/
│   │           │   └── page.tsx          # 등록 페이지
│   │           └── [id]/
│   │               ├── page.tsx          # 상세 페이지
│   │               └── edit/
│   │                   └── page.tsx      # 수정 페이지
│   ├── api/
│   │   └── snacks/
│   │       ├── route.ts                  # 목록 조회 / 등록
│   │       └── [id]/
│   │           └── route.ts              # 상세 / 수정 / 삭제
│   ├── layout.tsx
│   └── provider.tsx                      # QueryClientProvider, NuqsAdapter, Toaster
├── features/
│   └── snack/
│       ├── actions/                      # Server Action 사용 시 변경 로직
│       ├── components/                   # 검색, 정렬, 목록, 폼, 삭제 버튼
│       ├── constants/                    # 옵션, 라벨, 정렬 값
│       ├── hooks/                        # useSnackList, useCreateSnack 등
│       ├── prefetch/                     # 서버 prefetch 함수
│       ├── queries/                      # queryKeys, queryOptions
│       ├── repositories/                 # API 호출 계층
│       ├── schemas/                      # zod schema
│       ├── services/                     # 비즈니스 로직 계층
│       └── types/                        # request/response/input 타입
├── shared/
│   ├── components/
│   │   ├── common/                       # EmptyState, ErrorState, ConfirmDialogButton
│   │   └── ui/                           # shadcn/ui
│   ├── lib/
│   │   ├── axios/                        # axios instance
│   │   ├── query-client.ts
│   │   ├── react-query.tsx
│   │   ├── qs.ts
│   │   └── utils.ts
│   └── types/
└── mock/
    └── db.json
```

## 3. CRUD 페이지별 역할

| 페이지                             | 컴포넌트 성격         | 주요 책임                                                |
| :--------------------------------- | :-------------------- | :------------------------------------------------------- |
| `snack/page.tsx`                   | Server Component      | searchParams 파싱, prefetch, HydrationBoundary 구성      |
| `snack/_components/search.tsx`     | Client Component      | RHF 또는 일반 form으로 검색 조건 입력, nuqs로 URL 반영   |
| `snack/_components/sort.tsx`       | Client Component      | 정렬 조건을 URL에 반영, page는 1로 초기화                |
| `snack/_components/list.tsx`       | Client Component      | `useSuspenseQuery`로 목록 렌더링                         |
| `snack/_components/pagination.tsx` | Client Component      | 현재 query 유지 + page 변경                              |
| `snack/new/page.tsx`               | Server Component 가능 | 등록 폼 렌더링, 공통 옵션 prefetch 가능                  |
| `snack/[id]/page.tsx`              | Server Component      | 상세 데이터 prefetch 또는 직접 조회, 없으면 `notFound()` |
| `snack/[id]/edit/page.tsx`         | Server Component      | 상세 데이터 + 공통 옵션 prefetch 후 수정 폼 렌더링       |

## 4. 데이터 흐름 요약

### 4.1 목록 조회

```text
Page(Server)
  ↓ searchParams 파싱
prefetchQuery(list, common options)
  ↓ dehydrate
HydrationBoundary
  ↓
Search / Sort / Pagination(Client)
  ↓ nuqs로 URL 변경
List(Client)
  ↓ useSuspenseQuery(queryKey: params)
Route Handler 또는 Backend API
```

### 4.2 등록/수정/삭제

```text
Form(Client)
  ↓ RHF + zodResolver
useMutation
  ↓ repository 호출
Route Handler 또는 Server Action
  ↓ service
DB 또는 json-server
  ↓ 성공 시
invalidateQueries 또는 setQueryData
  ↓ router.replace / toast
```

## 5. 계층별 역할 정리

| 계층         | 예시 파일             | 역할                                    |
| :----------- | :-------------------- | :-------------------------------------- |
| `schema`     | `snack.schema.ts`     | 폼 입력값, 검색 파라미터, API 요청 검증 |
| `types`      | `snack.type.ts`       | 화면/서버/API 타입 정의                 |
| `constants`  | `snack.constants.ts`  | 정렬 옵션, select option, 라벨 매핑     |
| `repository` | `snack.repository.ts` | axios/fetch 호출만 담당                 |
| `queries`    | `snack.query.ts`      | queryKey, queryOptions 정의             |
| `hooks`      | `snack.hooks.ts`      | `useSuspenseQuery`, `useMutation` 래핑  |
| `components` | `snack-form.tsx`      | UI 렌더링과 이벤트 연결                 |
| `prefetch`   | `snack.prefetch.ts`   | 서버 컴포넌트에서 query prefetch 담당   |
| `service`    | `snack.service.ts`    | DB/외부 API 앞단의 비즈니스 규칙 처리   |

## 6. 실무 기준 판단

### 권장

- 목록 조건은 URL query string으로 관리합니다.
- 목록 데이터는 React Query의 `queryKey`에 검색 조건 전체를 포함합니다.
- 생성/수정/삭제 후에는 관련 list/detail query를 명확하게 invalidate합니다.
- 등록/수정 폼은 같은 `SnackForm`을 재사용하되, mode와 defaultValues로 분기합니다.
- 서버 컴포넌트는 초기 데이터 준비와 SEO에 집중하고, 입력/상호작용은 Client Component로 분리합니다.

### 조건부 사용

- Server Action은 폼 변경 작업에 적합하지만, React Query 중심 구조에서는 Route Handler/API 호출이 더 일관될 수 있습니다.
- `zustand`는 서버 데이터가 아니라 상세 패널 열림, 선택 행, 임시 필터 UI 같은 클라이언트 UI 상태에만 사용하는 것이 좋습니다.
- `shallow: false`는 URL 변경 후 Server Component 재실행이 필요한 경우에만 사용합니다.

### 비권장

- 검색 조건을 컴포넌트 내부 `useState`에만 두고 URL에 반영하지 않는 방식
- 목록과 페이징 컴포넌트에서 서로 다른 queryKey로 같은 데이터를 각각 조회하는 방식
- 폼 검증은 Zod, API 검증은 별도 타입으로 따로 관리해 타입이 어긋나는 방식
- `find()` 결과가 항상 있다고 가정하고 런타임 처리 없이 강제 단언만 사용하는 방식

## 7. 보완 필요

- [ ] 실제 DB 전환 시 Prisma schema와 Zod schema의 중복 관리 기준 정리
- [ ] 권한별 CRUD 접근 제어 정책 추가
- [ ] 에러 바운더리와 `not-found.tsx` 기준 추가
- [ ] 목록 성능 최적화를 위한 prefetch 범위 조정
- [ ] optimistic update 적용 여부 검토

## 8. 향후 계획

- [ ] CRUD 공통 컴포넌트: `SearchForm`, `DataTable`, `Pagination`, `EmptyState`, `ConfirmDialogButton`
- [ ] CRUD 공통 훅: `useListQueryParams`, `useCrudMutationToast`
- [ ] API 응답 규격 통일: `{ data, meta, message }`
- [ ] 인증/권한 모듈과 연결

## 참고 기준

- Next.js App Router / Server Actions: https://nextjs.org/docs/app
- Next.js `useSearchParams`: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- TanStack Query SSR / Hydration: https://tanstack.com/query/v5/docs/framework/react/guides/ssr
- TanStack Query Advanced SSR: https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr
- nuqs: https://nuqs.dev/
- React Hook Form: https://react-hook-form.com/docs/useform
- React Hook Form Resolvers: https://github.com/react-hook-form/resolvers
- Zod: https://zod.dev/
- qs: https://github.com/ljharb/qs
- Prisma + Next.js: https://www.prisma.io/docs/guides/frameworks/nextjs
- Auth.js / NextAuth.js: https://authjs.dev/reference/nextjs
- Zustand: https://zustand.docs.pmnd.rs/
- Sonner: https://ui.shadcn.com/docs/components/sonner
