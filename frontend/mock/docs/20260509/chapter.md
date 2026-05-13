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
  - [💻 Tip](./next.md#-tip)
    - [Prettier](./next.md#prettier)
    - [ESLint](./next.md#eslint)
  - [출처](./next.md#source)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

---

# 요약

```txt
tsx 기본값 = Server Component
ts 기본값 = Shared Function

단, ts 파일이라도 아래 중 하나면 Server Function 으로 확정된다.
- DB / Prisma / fs / private env / backend SDK 사용
- cookies(), headers(), redirect(), notFound(), revalidatePath() 등 서버 전용 API 사용
- import 'server-only' 사용

단, ts 또는 tsx 파일이라도 아래 중 하나면 Client 쪽으로 확정된다.
- 'use client'
- React Hook 사용
- event handler 사용
- window / document / localStorage 등 browser API 사용
```

---

# 프로젝트 구조 ?? 로드맵 ?? 한눈에 보기

```txt
app/
├─ snacks/
│  ├─ page.tsx                         # 1. Server Component
│  ├─ actions.ts                       # 6. Server Actions
│  │
│  └─ _components/
│     ├─ snack-list.tsx                # 2. Client Component
│     └─ snack-search.tsx              # 2. Client Component
│
├─ api/
│  └─ snacks/
│     └─ route.ts                      # 7. Route Handler

features/
├─ snack/
│  ├─ keys/
│  │  └─ snack.keys.ts                 # 3. Shared Function
│  │
│  ├─ queries/
│  │  └─ snack.query.ts                # 3. Shared Function
│  │
│  ├─ prefetch/
│  │  └─ snack.prefetch.ts             # 4. Server Function
│  │
│  ├─ hooks/
│  │  └─ use-snack-list.ts             # 5. Client Function
│  │
│  ├─ services/
│  │  └─ snack.service.ts              # 4. Server Function 또는 3. Shared Function
│  │
│  ├─ repositories/
│  │  └─ snack.repository.ts           # 구현에 따라 3 / 4 / 5 판단
│  │
│  ├─ schemas/
│  │  └─ snack.schema.ts               # 3. Shared Function
│  │
│  └─ types/
│     └─ snack.type.ts                 # Type only
```
