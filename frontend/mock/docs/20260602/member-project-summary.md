# 회원 기능 프로젝트 구조 요약 리포트

Next.js App Router 기반에서 로그인, 회원가입, 로그아웃, 마이페이지, 프로필 수정, 인증 보호 라우트를 구성하는 기준 문서입니다.
CRUD 서비스와 같은 기술 스택을 유지하되, 회원 기능은 보안, 세션, 권한, 서버 전용 로직 분리가 핵심입니다.

## 1. 권장 방향 요약

| 영역            | 권장 방식                                      | 이유                                                               |
| :-------------- | :--------------------------------------------- | :----------------------------------------------------------------- |
| 인증 라이브러리 | Auth.js / NextAuth.js                          | Next.js와 통합이 좋고 OAuth, Credentials, JWT/DB session 선택 가능 |
| 비밀번호 처리   | `bcryptjs` 또는 서버 런타임에 맞는 bcrypt 계열 | 비밀번호 평문 저장 방지                                            |
| 폼              | React Hook Form + Zod                          | 로그인/회원가입/프로필 수정 검증 통일                              |
| 서버 검증       | Zod                                            | 클라이언트 검증과 별개로 서버에서도 재검증                         |
| 세션 조회       | Server Component에서는 `auth()` 계열           | 서버에서 사용자 정보 기반 렌더링 가능                              |
| Client 세션     | 필요한 컴포넌트에만 전달                       | 전체 앱을 무조건 Client Component로 만들지 않기 위함               |
| 보호 라우트     | middleware 또는 layout/page 단위 서버 가드     | 로그인 필요 페이지 접근 제어                                       |
| 알림            | Sonner                                         | 로그인 실패, 회원가입 성공, 프로필 수정 성공 피드백                |
| DB              | Prisma                                         | User, Account, Session, VerificationToken 모델 관리에 적합         |

## 2. 회원 기능 범위

| 기능          | 설명                                   | 주요 화면                            |
| :------------ | :------------------------------------- | :----------------------------------- |
| 회원가입      | 이메일/비밀번호/이름 입력 후 계정 생성 | `/signup`                            |
| 로그인        | Credentials 또는 OAuth 로그인          | `/signin`                            |
| 로그아웃      | 세션 종료                              | Header, Sidebar, MyPage              |
| 마이페이지    | 내 정보 조회                           | `/my` 또는 `/mypage`                 |
| 프로필 수정   | 이름, 이미지, 표시명 등 수정           | `/my/edit`                           |
| 비밀번호 변경 | 기존 비밀번호 확인 후 변경             | `/my/password`                       |
| 인증 보호     | 로그인 사용자만 접근 가능              | `/dashboard`, `/my`, `/snack/new` 등 |
| 권한 제어     | USER/ADMIN 등 role 기반 접근 제한      | 관리자 페이지                        |

## 3. 전체 폴더 구조

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── signin/
│   │   │   └── page.tsx                 # 로그인 페이지
│   │   └── signup/
│   │       └── page.tsx                 # 회원가입 페이지
│   ├── (default-layout)/
│   │   └── (main)/
│   │       ├── my/
│   │       │   ├── page.tsx             # 마이페이지
│   │       │   ├── edit/
│   │       │   │   └── page.tsx         # 프로필 수정
│   │       │   └── password/
│   │       │       └── page.tsx         # 비밀번호 변경
│   │       └── dashboard/
│   │           └── page.tsx             # 보호 페이지 예시
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts             # Auth.js route handler
│   │   └── users/
│   │       ├── route.ts                 # 회원가입 또는 사용자 목록
│   │       └── me/
│   │           └── route.ts             # 내 정보 조회/수정
│   ├── layout.tsx
│   └── provider.tsx
├── features/
│   └── auth/
│       ├── actions/                     # signIn/signOut/updateProfile Server Action
│       ├── components/                  # signin-form, signup-form, nav-user
│       ├── constants/                   # auth route, role, provider option
│       ├── hooks/                       # useCurrentUser, useUpdateProfile
│       ├── queries/                     # me query options
│       ├── repositories/                # user API 호출
│       ├── schemas/                     # signin/signup/profile schema
│       ├── services/                    # password hash, user create/update
│       └── types/                       # Session user 확장 타입
├── auth.ts                              # NextAuth 설정 진입점
├── middleware.ts                        # 인증 보호 라우트
└── prisma/
    └── schema.prisma
```

## 4. 회원 기능 데이터 흐름

### 4.1 로그인

```text
SigninForm(Client)
  ↓ RHF + Zod
signIn('credentials') 또는 Server Action
  ↓
Auth.js authorize
  ↓
DB User 조회 + password compare
  ↓
JWT/session 생성
  ↓
redirect 또는 router.replace
```

### 4.2 회원가입

```text
SignupForm(Client)
  ↓ RHF + Zod
Route Handler 또는 Server Action
  ↓ server zod 검증
중복 이메일 확인
  ↓ password hash
User 생성
  ↓
로그인 페이지 이동 또는 자동 로그인
```

### 4.3 마이페이지

```text
MyPage(Server)
  ↓ auth()
세션 없으면 redirect('/signin')
  ↓
User 정보 조회
  ↓
MyProfile(Client 또는 Server)
```

## 5. 세션 정보 전달 방식

| 방식                                          | 사용 위치                               | 판단   |
| :-------------------------------------------- | :-------------------------------------- | :----- |
| Server Component에서 `auth()` 직접 호출       | layout, page, sidebar server wrapper    | 권장   |
| `SessionProvider`로 전체 클라이언트 세션 제공 | 클라이언트에서 세션 변경 반응이 많은 앱 | 조건부 |
| session user를 필요한 컴포넌트에 props 전달   | Sidebar/NavUser 등 단순 표시            | 권장   |
| 모든 컴포넌트에서 `useSession()` 호출         | 앱 전체가 클라이언트화될 가능성 있음    | 비권장 |

## 6. 보안 기준

| 항목            | 기준                                           |
| :-------------- | :--------------------------------------------- |
| 비밀번호        | 평문 저장 금지, hash 저장                      |
| 회원가입 검증   | 클라이언트 + 서버 모두 검증                    |
| 로그인 실패     | 구체적인 원인 노출 최소화                      |
| 세션 secret     | `AUTH_SECRET` 또는 라이브러리 기준 secret 필수 |
| 보호 라우트     | middleware 또는 서버 가드 적용                 |
| 권한 검사       | UI 숨김과 서버 검사를 모두 적용                |
| 마이페이지 수정 | session user id 기준으로만 수정                |
| 로그아웃        | 서버 세션/JWT 쿠키 정리                        |

## 7. 실무 기준 판단

### 권장

- 로그인/회원가입 폼도 CRUD 폼과 동일하게 RHF + Zod를 사용합니다.
- 마이페이지는 서버에서 세션을 먼저 확인한 뒤 렌더링합니다.
- Header/Sidebar의 사용자 정보는 서버에서 받은 session user를 props로 넘기는 방식이 단순합니다.
- 회원 수정 API는 URL의 userId보다 session user id를 우선 신뢰합니다.
- role 검사는 프론트 UI와 서버 로직 양쪽에 둡니다.

### 조건부 사용

- JWT session은 서버리스/간단한 서비스에 편하지만, 강제 로그아웃/세션 관리가 중요하면 DB session을 검토합니다.
- OAuth 로그인은 사용자 편의성이 좋지만, Credentials 회원가입과 account linking 정책을 별도로 설계해야 합니다.
- `useSession()`은 Client Component에서 동적 세션 상태가 필요한 경우에만 사용합니다.

### 비권장

- 로그인 여부를 localStorage 값만으로 판단하는 방식
- 마이페이지 수정에서 request body의 userId를 그대로 신뢰하는 방식
- Client Component에서 비밀번호 hash 처리
- 인증이 필요한 API에서 session 검사 없이 DB 변경 수행

## 8. 보완 필요

- [ ] OAuth provider 추가 여부 결정
- [ ] JWT session vs DB session 결정
- [ ] role 정책 정의: USER, MANAGER, ADMIN 등
- [ ] 회원 탈퇴/복구 정책 정의
- [ ] 비밀번호 재설정 이메일 정책 정의
- [ ] 로그인 실패 횟수 제한 또는 rate limit 검토

## 9. 향후 계획

- [ ] CRUD 서비스 권한과 회원 role 연결
- [ ] 마이페이지에서 내가 작성한 게시글/상품/주문 목록 연결
- [ ] 관리자 회원 관리 페이지 추가
- [ ] 감사 로그 또는 최근 로그인 기록 추가

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
