# Frontend Roadmap

> Next.js App Router 기반 CRUD + 인증 서비스 구축을 위한 로드맵 문서입니다.  
> 이 문서는 전체 방향을 한눈에 보기 위한 **요약/인덱스 문서**이며, 상세 구현과 스니핏은 각 주제별 md 파일에서 다룹니다.

---

# 목차

- [1. 문서 목적](#1-문서-목적)
- [2. 최종 목표](#2-최종-목표)
- [3. 한눈에 보는 기술 스택](#3-한눈에-보는-기술-스택)
- [4. 전체 학습 로드맵](#4-전체-학습-로드맵)
- [5. 프로젝트 기본 구조](#5-프로젝트-기본-구조)
- [6. CRUD 전체 흐름](#6-crud-전체-흐름)
- [7. 인증 전체 흐름](#7-인증-전체-흐름)
- [8. 상태 관리 기준](#8-상태-관리-기준)
- [9. 문서 인덱스](#9-문서-인덱스)
- [10. 개발 체크리스트](#10-개발-체크리스트)
- [11. 최종 산출물 기준](#11-최종-산출물-기준)

---

# 1. 문서 목적

이 문서는 Next.js 기반의 CRUD 서비스를 만들기 위한 전체 로드맵입니다.

목표는 단순히 라이브러리 사용법을 나열하는 것이 아니라, 다음 내용을 기준으로 프로젝트를 구성하는 것입니다.

```txt
무엇을 사용할지
왜 사용할지
언제 사용할지
어디에 배치할지
어떤 흐름으로 연결할지
```

따라서 README.md는 상세 설명서가 아니라, 전체 문서와 프로젝트 구조를 연결하는 **지도(Map)** 역할을 합니다.

상세 내용은 각 md 파일에서 다룹니다.

---

# 2. 최종 목표

## 구현할 서비스

```txt
CRUD 기반 서비스
+
회원 기능
+
검색/정렬/필터/페이징
+
실무형 프로젝트 구조
```

예상 도메인:

- Snack
- Board
- Auth

---

## 기능 목표

| 구분 | 기능                                              |
| ---- | ------------------------------------------------- |
| 조회 | 목록, 상세, 검색, 필터, 정렬, 페이징              |
| 변경 | 생성, 수정, 삭제                                  |
| 인증 | 로그인, 회원가입, 로그아웃, 마이페이지            |
| 권한 | 로그인 사용자 접근, 본인 데이터 수정, 관리자 확장 |
| 상태 | Server State, Form State, Client State 분리       |
| 품질 | 타입 안정성, 검증, 테스트, 에러 처리              |
| 운영 | 환경변수, Docker, CI/CD, 배포                     |

---

# 3. 한눈에 보는 기술 스택

## Core

| 역할      | 기술               | 사용 기준                                              |
| --------- | ------------------ | ------------------------------------------------------ |
| Framework | Next.js App Router | 라우팅, Server Component, Route Handler, Server Action |
| Language  | TypeScript         | 타입 안정성                                            |
| UI        | shadcn/ui          | 재사용 가능한 UI 구성                                  |
| Style     | Tailwind CSS       | 빠른 스타일링과 디자인 시스템 구성                     |

---

## Form

| 역할           | 기술                     | 사용 기준                  |
| -------------- | ------------------------ | -------------------------- |
| 단순 검색 Form | Next/Form 또는 기본 form | URL 기반 검색, 단순 submit |
| 실무 Form      | React Hook Form          | 입력 상태 관리             |
| Validation     | Zod                      | Client/Server 공통 검증    |
| 연결           | zodResolver              | RHF와 Zod 연결             |

---

## Data

| 역할              | 기술             | 사용 기준                       |
| ----------------- | ---------------- | ------------------------------- |
| Server State      | TanStack Query   | 조회/캐싱/무효화                |
| HTTP Client       | Axios 또는 fetch | API 호출                        |
| Query String 생성 | qs               | 객체 → query string 변환        |
| URL State         | nuqs             | 검색/필터/정렬/페이징 상태 관리 |

---

## Auth

| 역할      | 기술                     | 사용 기준                        |
| --------- | ------------------------ | -------------------------------- |
| 인증      | Auth.js / next-auth      | 로그인, 세션, OAuth, Credentials |
| 비밀번호  | bcryptjs                 | 비밀번호 해싱                    |
| 접근 제어 | auth(), proxy/middleware | 보호 라우트, 권한 처리           |

---

## State

| 역할         | 기술            | 사용 기준                     |
| ------------ | --------------- | ----------------------------- |
| Server State | TanStack Query  | API/DB 데이터                 |
| Form State   | React Hook Form | 입력값, 에러, submit 상태     |
| Client State | Zustand         | 모달, 사이드바, 테마, UI 상태 |

---

## Database

| 역할      | 기술        | 사용 기준                                    |
| --------- | ----------- | -------------------------------------------- |
| 학습/Mock | json-server | 빠른 CRUD 프로토타입                         |
| 실무 DB   | Prisma      | DB 모델링, Repository, Relation, Transaction |

---

## Quality / Deploy

| 역할      | 기술                    | 사용 기준             |
| --------- | ----------------------- | --------------------- |
| Unit Test | Vitest                  | 함수, 유틸, 훅 테스트 |
| API Mock  | MSW                     | API 테스트/개발 Mock  |
| E2E       | Playwright 또는 Cypress | 사용자 흐름 테스트    |
| Deploy    | Vercel / Docker         | 배포                  |
| CI/CD     | GitHub Actions          | 자동화                |

---

# 4. 전체 학습 로드맵

```txt
1. Next.js
   ↓
2. TypeScript
   ↓
3. Form
   - Next/Form
   - RHF
   - Zod
   ↓
4. Query
   - TanStack Query
   - Prefetch
   - Hydration
   ↓
5. Search
   - searchParams
   - qs
   - nuqs
   ↓
6. Auth
   - Auth.js
   - Session
   - Authorization
   ↓
7. State
   - Zustand
   - UI State
   ↓
8. Prisma
   - Schema
   - Relation
   - Repository
   ↓
9. Architecture
   - app
   - features
   - shared
   ↓
10. Project
   - snack
   - board
   - auth
   ↓
11. Testing
   ↓
12. Deployment
```

---

# 5. 프로젝트 기본 구조

## 최상위 구조

```txt
app/
features/
shared/
```

---

## app

라우팅과 페이지 진입점을 담당합니다.

```txt
app/
├─ layout.tsx
├─ page.tsx
├─ provider.tsx
├─ api/
│  └─ ...
└─ (default-layout)/
   └─ (main)/
      ├─ snack/
      ├─ board/
      └─ mypage/
```

사용 기준:

- URL 라우팅
- page.tsx
- layout.tsx
- loading.tsx
- error.tsx
- Route Handler

---

## features

도메인 기능을 담당합니다.

```txt
features/
├─ snack/
├─ board/
└─ auth/
```

feature 내부 예시:

```txt
features/snack/
├─ actions/
├─ components/
├─ hooks/
├─ prefetch/
├─ queries/
├─ repositories/
├─ schema/
├─ services/
└─ types/
```

---

## shared

프로젝트 전역 공통 요소를 담당합니다.

```txt
shared/
├─ components/
├─ hooks/
├─ lib/
├─ styles/
├─ types/
└─ utils/
```

사용 기준:

- 공통 UI
- 공통 유틸
- axios 설정
- react-query provider
- 공통 타입
- 공통 스타일

---

# 6. CRUD 전체 흐름

## 조회 흐름

조회는 URL 기반으로 처리합니다.

```txt
Browser
  ↓ URL
Page(Server)
  ↓ searchParams
Prefetch
  ↓ prefetchQuery
HydrationBoundary
  ↓ dehydrated state
List(Client)
  ↓ useSuspenseQuery
Query Options
  ↓ queryFn
Repository
  ↓
API / DB
```

적용 대상:

- 목록 조회
- 상세 조회
- 검색
- 필터
- 정렬
- 페이징

권장 기술:

| 역할              | 기술             |
| ----------------- | ---------------- |
| 초기 데이터       | prefetchQuery    |
| Client 조회       | useSuspenseQuery |
| Query 상태        | TanStack Query   |
| URL 상태          | nuqs             |
| Query String 생성 | qs               |

---

## 변경 흐름

변경은 Mutation 기반으로 처리합니다.

```txt
Form(Client)
  ↓ RHF
Validation
  ↓ Zod
Submit
  ↓ useMutation
Server Action
  ↓
Service
  ↓
Repository
  ↓
DB
  ↓
invalidateQueries
```

적용 대상:

- 생성
- 수정
- 삭제
- 좋아요
- 북마크
- 상태 변경

권장 기술:

| 역할      | 기술              |
| --------- | ----------------- |
| 입력 상태 | React Hook Form   |
| 검증      | Zod               |
| 변경 요청 | useMutation       |
| 서버 작업 | Server Action     |
| 캐시 갱신 | invalidateQueries |

---

# 7. 인증 전체 흐름

## 로그인 흐름

```txt
Login Form
  ↓
RHF + Zod
  ↓
signIn('credentials')
  ↓
Auth.js
  ↓
Credentials Provider
  ↓
authorize()
  ↓
DB user 조회
  ↓
password compare
  ↓
jwt callback
  ↓
session callback
  ↓
auth()
```

---

## 접근 제어 흐름

```txt
Request
  ↓
proxy / middleware
  ↓
auth()
  ↓
session 확인
  ↓
role 확인
  ↓
allow / redirect
```

---

## 인증 처리 위치

| 위치             | 사용 예                        |
| ---------------- | ------------------------------ |
| Server Component | `const session = await auth()` |
| Client Component | `useSession()` 또는 props 전달 |
| Server Action    | 작업 전 `auth()` 검증          |
| Route Handler    | 요청 처리 전 `auth()` 검증     |
| proxy/middleware | 페이지 접근 제어               |

---

# 8. 상태 관리 기준

상태는 역할별로 분리합니다.

| 상태 종류    | 담당 기술       | 예시                          |
| ------------ | --------------- | ----------------------------- |
| Server State | TanStack Query  | 목록, 상세, 사용자 데이터     |
| Form State   | React Hook Form | 입력값, 검증 에러             |
| Client State | Zustand         | 모달, 사이드바, 테마, 선택 UI |
| URL State    | nuqs            | 검색, 정렬, 필터, 페이징      |

---

## 사용 기준

```txt
API에서 온 데이터
→ TanStack Query

사용자 입력값
→ React Hook Form

URL에 남아야 하는 상태
→ nuqs

UI만 제어하는 상태
→ Zustand
```

---

# 9. 문서 인덱스

## Core

### next.md

Next.js App Router의 핵심 개념을 정리합니다.

포함:

- Server Component
- Client Component
- Route Handler
- Server Action
- Rendering
- Hydration
- Routing
- Cache

제외:

- RHF 상세
- React Query 상세
- Auth.js 상세

---

### typescript.md

실무 TypeScript 사용 기준을 정리합니다.

포함:

- type / interface
- generic
- utility type
- as const
- satisfies
- z.infer
- API 타입 설계

---

## Form

### form.md

Form 입력과 검증을 정리합니다.

포함:

- 단순 작업: Next/Form
- 실무 작업: RHF + Zod
- defaultValues
- Controller / useController
- useFieldArray
- 공통 Form 컴포넌트
- 생성/수정/검색 Form

---

## Data

### query.md

TanStack Query 기반 서버 상태 관리를 정리합니다.

포함:

- React Query → TanStack Query 명칭 변화
- queryKey
- queryOptions
- useQuery
- useSuspenseQuery
- useMutation
- prefetchQuery
- HydrationBoundary
- invalidateQueries
- optimistic update

---

### search.md

URL 기반 검색/필터/정렬/페이징을 정리합니다.

포함:

- searchParams
- URLSearchParams
- qs
- nuqs
- shallow
- history
- pagination
- sort
- filter

---

## Auth

### auth.md

Auth.js 기반 인증/인가를 정리합니다.

포함:

- Authentication / Authorization
- Session / JWT
- Credentials Provider
- OAuth Provider
- auth()
- signIn()
- signOut()
- update()
- middleware.ts / proxy.ts
- 보호 라우트
- RBAC

---

## State

### state.md

전역 UI 상태 관리 기준을 정리합니다.

포함:

- Client State
- Zustand
- Context API와 비교
- Redux와 비교
- persist
- modal store
- sidebar store
- server state와의 분리

---

## Database

### prisma.md

Prisma 기반 DB 접근 구조를 정리합니다.

포함:

- schema.prisma
- model
- relation
- migration
- repository pattern
- transaction
- pagination
- include / select

---

## Architecture

### architecture.md

프로젝트 구조와 책임 분리를 정리합니다.

포함:

- app
- features
- shared
- actions
- services
- repositories
- queries
- schema
- types
- 도메인별 구조

---

## Project

### project.md

최종 프로젝트 구조와 실제 스니핏을 정리합니다.

포함:

- snack
- board
- auth
- 최종 폴더 구조
- 목록/상세/생성/수정/삭제 예제
- 로그인/회원가입 예제
- 공통 컴포넌트 예제

---

## Quality

### testing.md

테스트 전략을 정리합니다.

포함:

- Vitest
- MSW
- Playwright
- Cypress
- Unit
- Integration
- E2E

---

## Deploy

### deployment.md

배포와 운영 환경을 정리합니다.

포함:

- 환경변수
- Docker
- Vercel
- GitHub Actions
- CI/CD

---

# 10. 개발 체크리스트

## 프로젝트 구조

- [ ] app 구조 정리
- [ ] features 구조 정리
- [ ] shared 구조 정리
- [ ] path alias 설정
- [ ] provider 구성

---

## 조회

- [ ] 목록 조회
- [ ] 상세 조회
- [ ] 검색
- [ ] 필터
- [ ] 정렬
- [ ] 페이징
- [ ] empty state
- [ ] loading state
- [ ] error state

---

## 변경

- [ ] 생성
- [ ] 수정
- [ ] 삭제
- [ ] Confirm Dialog
- [ ] Toast
- [ ] invalidateQueries
- [ ] optimistic update 검토

---

## Form

- [ ] schema 작성
- [ ] defaultValues 작성
- [ ] RHF 연결
- [ ] zodResolver 연결
- [ ] 서버 검증 추가
- [ ] 공통 FormInput 작성
- [ ] 공통 FormSelect 작성
- [ ] 공통 FormTextarea 작성

---

## Auth

- [ ] 로그인
- [ ] 회원가입
- [ ] 로그아웃
- [ ] 마이페이지
- [ ] 보호 페이지
- [ ] role 처리
- [ ] Server Action 내부 auth 검증
- [ ] Route Handler 내부 auth 검증

---

## State

- [ ] modal store
- [ ] sidebar store
- [ ] theme store
- [ ] server state와 client state 분리

---

## DB

- [ ] Prisma schema
- [ ] migration
- [ ] seed
- [ ] repository
- [ ] transaction
- [ ] relation

---

## Testing

- [ ] unit test
- [ ] integration test
- [ ] e2e test
- [ ] mock api

---

## Deployment

- [ ] env 분리
- [ ] build 확인
- [ ] docker 설정
- [ ] vercel 설정
- [ ] github actions 설정

---

# 11. 최종 산출물 기준

최종적으로 다음 문서가 생성됩니다.

```txt
README.md

next.md
typescript.md

form.md

query.md
search.md

auth.md

state.md

prisma.md

architecture.md

project.md

testing.md
deployment.md
```

---

## 문서별 역할

| 문서            | 역할                 |
| --------------- | -------------------- |
| README.md       | 전체 로드맵          |
| next.md         | Next.js 핵심 개념    |
| typescript.md   | 타입 설계            |
| form.md         | Form / Validation    |
| query.md        | Server State / Cache |
| search.md       | URL State / Search   |
| auth.md         | 인증 / 인가          |
| state.md        | Client State         |
| prisma.md       | DB / ORM             |
| architecture.md | 프로젝트 구조        |
| project.md      | 최종 프로토타입      |
| testing.md      | 테스트 전략          |
| deployment.md   | 배포 전략            |

---

# 요약

이 프로젝트의 핵심 기준은 다음과 같습니다.

```txt
Page / Route
→ app

도메인 기능
→ features

공통 기능
→ shared
```

```txt
조회
→ TanStack Query

입력
→ React Hook Form

검증
→ Zod

URL 상태
→ nuqs

전역 UI 상태
→ Zustand

DB 접근
→ Prisma

인증
→ Auth.js
```

README.md는 전체 방향을 잡는 문서이며, 상세 구현은 각 md 문서에서 다룹니다.
