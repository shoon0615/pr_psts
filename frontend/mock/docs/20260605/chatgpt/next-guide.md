# Next.js

> Next.js App Router 기반 프로젝트에서 Server Component, Client Component, Route Handler, Server Action, Hydration, Proxy를 어떻게 이해하고 사용할지 정리한 문서입니다.  
> 이 문서는 Next.js의 모든 기능을 설명하기보다, 현재 CRUD + Auth 프로젝트에서 필요한 핵심 흐름을 가독성 있게 정리합니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 사용하는가?](#3-왜-사용하는가)
- [4. 실무 기준](#4-실무-기준)
- [5. App Router](#5-app-router)
- [6. Server Component](#6-server-component)
- [7. Client Component](#7-client-component)
- [8. Server Function / Client Function](#8-server-function--client-function)
- [9. Route Handler](#9-route-handler)
- [10. Server Action](#10-server-action)
- [11. Route Handler vs Server Action](#11-route-handler-vs-server-action)
- [12. proxy.ts](#12-proxyts)
- [13. Hydration](#13-hydration)
- [14. Streaming / Suspense](#14-streaming--suspense)
- [15. Cache / Revalidate](#15-cache--revalidate)
- [16. CRUD 적용 예제](#16-crud-적용-예제)
- [17. 코드 스니핏](#17-코드-스니핏)
- [18. Caution](#18-caution)
- [19. Best Practice](#19-best-practice)
- [20. 요약](#20-요약)

---

# 1. 한눈에 보기

Next.js는 React 기반 프레임워크입니다.

현재 프로젝트에서는 다음 역할로 사용합니다.

```txt
Routing
  ↓
Server Component
  ↓
Client Component
  ↓
Route Handler / Server Action
  ↓
DB / API
```

---

## 핵심 구성

| 기능             | 역할                       | 사용 예                 |
| ---------------- | -------------------------- | ----------------------- |
| App Router       | 파일 기반 라우팅           | app/snack/page.tsx      |
| Server Component | 서버에서 렌더링            | page.tsx, layout.tsx    |
| Client Component | 브라우저 상호작용          | form, button, select    |
| Route Handler    | HTTP API endpoint          | app/api/snacks/route.ts |
| Server Action    | 서버 mutation 함수         | createSnackAction       |
| proxy.ts         | 요청 전 처리               | 보호 라우트, redirect   |
| Suspense         | 비동기 UI fallback         | loading, list fallback  |
| Hydration        | 서버 HTML과 Client JS 연결 | interactive 활성화      |

---

## 핵심 기준

```txt
페이지 진입점
→ Server Component

이벤트 / hook / browser API
→ Client Component

조회 API
→ Route Handler 또는 Server Component 직접 조회

변경 작업
→ Server Action

보호 라우트
→ proxy.ts + 서버 내부 auth()

초기 데이터
→ Server prefetch + HydrationBoundary
```

---

# 2. 언제 사용하는가?

Next.js는 다음 요구사항이 있을 때 적합합니다.

- 파일 기반 라우팅
- SSR / RSC 기반 초기 렌더링
- SEO가 필요한 페이지
- 서버와 클라이언트 역할 분리
- API Route / Route Handler 내장
- Server Action 기반 mutation
- 인증/권한 처리
- React Query prefetch와 hydration
- 배포 친화적인 구조

---

## 현재 프로젝트에서의 역할

| 기능         | Next.js 역할               |
| ------------ | -------------------------- |
| Snack 목록   | page.tsx + Server prefetch |
| Snack 생성   | Server Action              |
| Board 상세   | Dynamic Route              |
| Board 수정   | Server Action + auth       |
| Auth 보호    | proxy.ts / auth()          |
| API endpoint | Route Handler              |
| Layout       | layout.tsx                 |
| Loading      | loading.tsx / Suspense     |

---

# 3. 왜 사용하는가?

React만 사용하는 SPA에서는 보통 다음 흐름입니다.

```txt
Browser
  ↓
빈 HTML
  ↓
JS 다운로드
  ↓
React 실행
  ↓
화면 생성
```

장점은 단순하지만, 초기 로딩과 SEO에 불리할 수 있습니다.

Next.js App Router에서는 다음 흐름이 가능합니다.

```txt
Server
  ↓
React 렌더링
  ↓
HTML 생성
  ↓
Browser 표시
  ↓
Hydration
  ↓
Client 상호작용
```

---

## 장점

| 장점             | 설명                          |
| ---------------- | ----------------------------- |
| SSR/RSC          | 서버에서 HTML 생성            |
| SEO              | 초기 HTML에 콘텐츠 포함 가능  |
| App Router       | 파일 기반 라우팅              |
| Server Component | 서버 전용 로직 실행 가능      |
| Route Handler    | API endpoint 내장             |
| Server Action    | mutation을 함수처럼 작성      |
| Streaming        | 일부 UI를 먼저 보여줄 수 있음 |
| 배포             | Vercel 등과 자연스럽게 연결   |

---

# 4. 실무 기준

## 권장

```txt
page.tsx
→ Server Component

상호작용 UI
→ Client Component

목록 조회
→ Server prefetch + useSuspenseQuery

검색/필터/페이징
→ searchParams + nuqs

생성/수정/삭제
→ Server Action

외부/공용 API
→ Route Handler

접근 제어
→ proxy.ts + auth()
```

---

## 권장하지 않음

```txt
모든 컴포넌트를 'use client'로 작성

Client Component에서 DB/Prisma 직접 사용

Server Action에 모든 비즈니스 로직 작성

page.tsx에 모든 로직 작성

proxy.ts만으로 권한 검증 끝내기
```

---

# 5. App Router

App Router는 `app/` 디렉터리 기반 라우터입니다.

```txt
app/
├─ layout.tsx
├─ page.tsx
├─ loading.tsx
├─ error.tsx
├─ not-found.tsx
└─ api/
```

---

## 주요 파일

| 파일          | 역할          |
| ------------- | ------------- |
| page.tsx      | 페이지        |
| layout.tsx    | 레이아웃      |
| loading.tsx   | 로딩 UI       |
| error.tsx     | 에러 UI       |
| not-found.tsx | 404 UI        |
| route.ts      | Route Handler |
| proxy.ts      | 요청 전 처리  |

---

## Route Segment

```txt
app/
└─ snack/
   ├─ page.tsx
   ├─ new/
   │  └─ page.tsx
   └─ [id]/
      ├─ page.tsx
      └─ edit/
         └─ page.tsx
```

결과:

```txt
/snack
/snack/new
/snack/:id
/snack/:id/edit
```

---

# 6. Server Component

App Router에서 컴포넌트는 기본적으로 Server Component입니다.

```tsx
export default async function Page() {
  const data = await getData();

  return <div>{data.title}</div>;
}
```

---

## 특징

| 항목          | 설명                                   |
| ------------- | -------------------------------------- |
| 기본값        | `'use client'` 없으면 Server Component |
| 실행 위치     | 서버                                   |
| async/await   | 가능                                   |
| DB 접근       | 가능                                   |
| private env   | 가능                                   |
| event handler | 불가                                   |
| React hook    | 대부분 불가                            |
| browser API   | 불가                                   |

---

## 적합한 작업

- page.tsx
- layout.tsx
- 초기 데이터 조회
- auth() 세션 확인
- redirect/notFound
- metadata 생성
- React Query prefetch

---

## 예시

```tsx
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return <div>{session.user.email}</div>;
}
```

---

# 7. Client Component

Client Component는 브라우저에서 상호작용이 필요한 컴포넌트입니다.

```tsx
"use client";

export function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 특징

| 항목               | 설명                                      |
| ------------------ | ----------------------------------------- |
| 선언               | 파일 상단 `'use client'`                  |
| 실행 위치          | 서버에서 pre-render 후 브라우저 hydration |
| event handler      | 가능                                      |
| React hook         | 가능                                      |
| browser API        | useEffect 내부 권장                       |
| DB 접근            | 불가                                      |
| private env        | 불가                                      |
| Server Action 호출 | 이벤트/submit을 통해 가능                 |

---

## 적합한 작업

- Form
- Button event
- Select
- Modal
- Toast
- useMutation
- useSuspenseQuery
- Zustand store
- nuqs hook

---

## 기준

```txt
이벤트가 필요하다
→ Client Component

useState/useEffect가 필요하다
→ Client Component

window/localStorage가 필요하다
→ Client Component + useEffect
```

---

# 8. Server Function / Client Function

파일이 서버/클라이언트로 나뉘는 것처럼 함수도 실행 위치에 따라 성격이 달라집니다.

---

## Server Function

서버에서 실행되는 함수입니다.

예:

- DB 접근
- Prisma
- private env
- cookies/headers
- auth()
- redirect/notFound
- fs

위치:

```txt
Server Component
Server Action
Route Handler
service
repository
```

---

## Client Function

브라우저에서 실행되는 함수입니다.

예:

- useState
- useEffect
- event handler
- window
- localStorage
- document

위치:

```txt
Client Component
Client hook
Zustand store
nuqs hook
```

---

## Shared Function

서버/클라이언트 양쪽에서 사용할 수 있는 순수 함수입니다.

예:

```ts
formatPrice
cn
removeEmptyQueryParams
zod schema
```

주의:

shared 함수 안에 server-only API나 browser API가 들어가면 더 이상 shared가 아닙니다.

---

# 9. Route Handler

Route Handler는 App Router의 HTTP API endpoint입니다.

```txt
app/api/snacks/route.ts
```

---

## 사용 기준

적합:

- GET 조회 API
- 외부에서 호출 가능한 endpoint
- 모바일/외부 클라이언트와 공유할 API
- 파일 업로드 endpoint
- webhook
- 명시적 HTTP status/header가 필요한 경우

---

## 예시

```ts
// app/api/snacks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { snackRepository } from "@/features/snack/repositories/snack.repository";
import { parseSnackSearchParams } from "@/features/snack/schema/snack.schema";

export async function GET(request: NextRequest) {
  const params = parseSnackSearchParams(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  const data = await snackRepository.list(params);

  return NextResponse.json(data);
}
```

---

## 특징

| 항목             | 설명                        |
| ---------------- | --------------------------- |
| 파일 위치        | app/api/\*\*/route.ts       |
| HTTP Method      | GET, POST, PATCH, DELETE    |
| Request/Response | 직접 제어                   |
| 인증             | route 내부에서 auth()       |
| 재사용성         | 외부 클라이언트와 공유 쉬움 |

---

# 10. Server Action

Server Action은 서버에서 실행되는 mutation 함수입니다.

```ts
"use server";

export async function createSnackAction(input: unknown) {
  // server logic
}
```

---

## 사용 기준

적합:

- 생성
- 수정
- 삭제
- 로그인/로그아웃
- 현재 화면 내부 mutation
- Form submit
- useMutation의 mutationFn

---

## 흐름

```txt
Client Form/Button
  ↓
useMutation 또는 form action
  ↓
Server Action
  ↓
schema 검증
  ↓
service
  ↓
repository
  ↓
DB
```

---

## 예시

```ts
"use server";

import { createSnackSchema } from "../schema/snack.schema";
import { snackService } from "../services/snack.service";

export async function createSnackAction(input: unknown) {
  const payload = createSnackSchema.parse(input);

  return snackService.create(payload);
}
```

---

## 기준

Server Action은 얇게 유지합니다.

```txt
Server Action
→ auth 확인
→ schema 검증
→ service 호출
```

비즈니스 로직을 길게 작성하지 않습니다.

---

# 11. Route Handler vs Server Action

## 한눈에 보기

| 구분          | Route Handler         | Server Action                  |
| ------------- | --------------------- | ------------------------------ |
| 성격          | HTTP API endpoint     | 서버 함수 호출                 |
| 파일          | app/api/\*\*/route.ts | 'use server' 함수              |
| 주 용도       | 조회/API/webhook      | 생성/수정/삭제                 |
| 호출          | fetch/axios           | form action / event / mutation |
| 외부 접근     | 쉬움                  | 내부 중심                      |
| HTTP 제어     | 강함                  | 제한적                         |
| status/header | 직접 제어             | 직접 API 응답 형태 아님        |
| 권장 사용     | GET 조회, 외부 API    | mutation                       |

---

## 현재 프로젝트 기준

```txt
조회
→ Route Handler 또는 Server Component 직접 조회

변경
→ Server Action
```

React Query를 사용할 경우:

```txt
useSuspenseQuery
→ queryFn
→ Route Handler / Repository

useMutation
→ Server Action
```

---

# 12. proxy.ts

Next.js 16 기준으로 `middleware.ts` 파일 컨벤션은 deprecated 되었고 `proxy.ts`로 변경되었습니다.

```txt
middleware.ts
↓
proxy.ts
```

함수명도 다음처럼 변경됩니다.

```ts
export function middleware() {}
↓
export function proxy() {}
```

---

## 사용 기준

- 로그인 필요 페이지 접근 제어
- 요청 전 redirect
- rewrite
- header 조작
- 특정 route matcher 적용

---

## 예시

```ts
// proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/shared/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/mypage") ||
    pathname.startsWith("/board/new") ||
    pathname.includes("/edit");

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/board/new", "/board/:path*/edit"],
};
```

---

## 주의

proxy는 최종 권한 검증 위치가 아닙니다.

```txt
proxy.ts
→ 페이지 접근 1차 제어

Server Action
→ 실제 변경 전 인증 확인

Service
→ 작성자/관리자 권한 확인
```

---

# 13. Hydration

Hydration은 서버에서 만든 HTML에 React Client JS를 연결하는 과정입니다.

---

## 흐름

```txt
Server
  ↓
HTML 생성
  ↓
Browser 표시
  ↓
JS 다운로드
  ↓
Hydration
  ↓
Event / Hook 활성화
```

---

## 중요한 이유

화면은 보이지만 hydration 전에는 다음이 아직 완전히 활성화되지 않았을 수 있습니다.

- onClick
- onChange
- useEffect
- Radix Portal UI
- Select dropdown
- Modal interaction

---

## Client Component도 서버에서 일부 렌더링된다

`'use client'` 컴포넌트도 초기 HTML 생성을 위해 서버에서 pre-render될 수 있습니다.

따라서 다음 코드는 바로 사용하면 문제가 될 수 있습니다.

```tsx
const value = window.localStorage.getItem("theme");
```

권장:

```tsx
useEffect(() => {
  const value = window.localStorage.getItem("theme");
}, []);
```

---

# 14. Streaming / Suspense

Suspense는 비동기 UI의 대기 상태를 선언적으로 처리합니다.

---

## 기본 구조

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <List />
    </Suspense>
  );
}
```

---

## App Router 파일 기반 loading

```txt
app/snack/loading.tsx
```

해당 segment의 로딩 UI로 동작합니다.

---

## React Query와 조합

```txt
Server prefetch
  ↓
HydrationBoundary
  ↓
useSuspenseQuery
  ↓
Suspense fallback
```

---

# 15. Cache / Revalidate

Next.js에는 자체 cache/revalidate 개념이 있고, 프로젝트에서는 TanStack Query 캐시도 함께 사용합니다.

---

## 역할 구분

| 캐시              | 담당                           |
| ----------------- | ------------------------------ |
| Next cache        | fetch, RSC, route segment 관련 |
| React Query cache | Client server state            |
| Browser cache     | 정적 리소스                    |
| DB cache          | DB/infra 영역                  |

---

## 현재 프로젝트 기준

React Query를 주된 서버 상태 캐시로 사용합니다.

```txt
조회
→ TanStack Query

변경 후 갱신
→ invalidateQueries
```

Next의 `revalidatePath`, `revalidateTag`는 Server Component cache 중심 흐름에서 사용합니다.

---

# 16. CRUD 적용 예제

## 목록 조회

```txt
app/snack/page.tsx
  ↓
searchParams
  ↓
prefetchSnackList
  ↓
HydrationBoundary
  ↓
SnackList(Client)
  ↓
useSuspenseQuery
```

---

## 생성

```txt
SnackForm(Client)
  ↓
RHF + Zod
  ↓
useMutation
  ↓
createSnackAction
  ↓
snackService.create
  ↓
snackRepository.create
```

---

## 수정

```txt
SnackEditPage(Server)
  ↓
detail prefetch
  ↓
SnackEditForm(Client)
  ↓
useMutation
  ↓
updateSnackAction
```

---

## 삭제

```txt
DeleteButton(Client)
  ↓
ConfirmDialog
  ↓
useMutation
  ↓
deleteSnackAction
```

---

## 인증 보호

```txt
proxy.ts
  ↓
1차 접근 제어

Server Action
  ↓
auth()

Service
  ↓
owner/role check
```

---

# 17. 코드 스니핏

## Server Page + Prefetch

```tsx
// app/(default-layout)/(main)/snack/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SnackList } from "@/features/snack/components/snack-list";
import { prefetchSnackList } from "@/features/snack/prefetch/snack.prefetch";
import { parseSnackSearchParams } from "@/features/snack/schema/snack.schema";

export default async function SnackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseSnackSearchParams(await searchParams);

  const queryClient = new QueryClient();
  await prefetchSnackList(queryClient, params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackList params={params} />
    </HydrationBoundary>
  );
}
```

---

## Client Component

```tsx
"use client";

import { useSnackList } from "../hooks/use-snack";
import type { SnackSearchParams } from "../types/snack.type";

export function SnackList({ params }: { params: SnackSearchParams }) {
  const { data } = useSnackList(params);

  if (data.items.length === 0) {
    return <p>등록된 간식이 없습니다.</p>;
  }

  return (
    <ul>
      {data.items.map((snack) => (
        <li key={snack.id}>{snack.title}</li>
      ))}
    </ul>
  );
}
```

---

## Route Handler

```ts
// app/api/snacks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { snackRepository } from "@/features/snack/repositories/snack.repository";
import { parseSnackSearchParams } from "@/features/snack/schema/snack.schema";

export async function GET(request: NextRequest) {
  const params = parseSnackSearchParams(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  const data = await snackRepository.list(params);

  return NextResponse.json(data);
}
```

---

## Server Action

```ts
// features/snack/actions/snack.action.ts
"use server";

import { createSnackSchema } from "../schema/snack.schema";
import { snackService } from "../services/snack.service";

export async function createSnackAction(input: unknown) {
  const payload = createSnackSchema.parse(input);

  return snackService.create(payload);
}
```

---

## proxy.ts

```ts
// proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/shared/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth();

  if (request.nextUrl.pathname.startsWith("/mypage") && !session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*"],
};
```

---

# 18. Caution

## 1. 모든 파일에 'use client' 붙이지 않기

나쁜 예:

```tsx
"use client";

export default function Page() {
  // 모든 페이지를 Client Component로 작성
}
```

Server Component의 장점을 잃습니다.

---

## 2. Client Component에서 server-only 코드 import 금지

금지:

```tsx
"use client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
```

---

## 3. Server Action에 모든 로직을 몰아넣지 않기

Server Action은 진입점입니다.

```txt
Action
→ 검증
→ service 호출
```

정도로 유지합니다.

---

## 4. proxy.ts만으로 보안 처리 끝내지 않기

proxy는 라우트 접근 제어입니다.

실제 변경 작업은 Server Action과 service에서 다시 검증해야 합니다.

---

## 5. Hydration 전 browser API 직접 사용 주의

`window`, `document`, `localStorage`는 useEffect 내부에서 사용하는 것이 안전합니다.

---

## 6. Route Handler와 Server Action을 무조건 하나로 통일하지 않기

둘은 목적이 다릅니다.

```txt
조회/API
→ Route Handler

변경
→ Server Action
```

---

# 19. Best Practice

## 권장

- page.tsx는 Server Component로 유지
- 상호작용이 필요한 하위 컴포넌트만 Client Component로 분리
- 조회는 Server prefetch + useSuspenseQuery 조합 사용
- 변경은 Server Action + useMutation 조합 사용
- Server Action은 얇게 유지
- 비즈니스 로직은 service로 분리
- 데이터 접근은 repository로 분리
- 보호 라우트는 proxy.ts + 서버 내부 auth() 조합
- browser API는 useEffect 내부에서 사용
- loading/error/not-found 파일을 활용

---

## 비권장

- 모든 페이지를 Client Component로 작성
- Client에서 Prisma/Auth server function 직접 import
- page.tsx에 form/query/service 로직 몰아넣기
- Route Handler와 Server Action 역할 혼동
- proxy.ts만으로 권한 검증 완료
- Hydration 문제를 무조건 dynamic ssr:false로 해결
- 검색/정렬/페이징 상태를 local state에만 저장

---

# 20. 요약

## 역할 분리

```txt
Server Component
→ 초기 렌더링 / 데이터 prefetch / auth 확인

Client Component
→ 이벤트 / hook / UI 상호작용

Route Handler
→ HTTP API endpoint

Server Action
→ 생성 / 수정 / 삭제

proxy.ts
→ 요청 전 접근 제어

Hydration
→ 서버 HTML과 Client JS 연결
```

---

## 현재 프로젝트 기준

```txt
조회
→ page.tsx
→ prefetchQuery
→ HydrationBoundary
→ useSuspenseQuery

변경
→ RHF
→ useMutation
→ Server Action

인증
→ proxy.ts
→ auth()
→ service 권한 검증
```

---

## 핵심 원칙

```txt
Server와 Client 경계를 명확히 한다.

페이지는 서버에서 조립한다.

상호작용은 클라이언트로 분리한다.

조회와 변경의 진입점을 구분한다.

보안 검증은 서버에서 최종 수행한다.
```

---

# 참고

- Next.js 16 기준 `middleware.ts`는 `proxy.ts`로 rename/deprecate된 흐름입니다.
- Server Actions는 서버에서 실행되는 mutation 함수로, Form submit이나 Client event에서 호출할 수 있습니다.
- Server/Client Component는 App Router의 핵심 구분이며, Client Component는 `'use client'` 지시어로 선언합니다.
