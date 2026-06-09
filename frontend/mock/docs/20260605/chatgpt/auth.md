# Auth

> Next.js App Router + Auth.js 기반 인증/인가 실무 가이드입니다.  
> 이 문서는 로그인/회원가입/세션/권한 처리 흐름과, Next.js 최신 버전에서 `middleware.ts`가 `proxy.ts`로 변경된 부분까지 포함합니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 인증 구조가 필요한가?](#3-왜-인증-구조가-필요한가)
- [4. Authentication vs Authorization](#4-authentication-vs-authorization)
- [5. 실무 기준](#5-실무-기준)
- [6. Auth.js / NextAuth](#6-authjs--nextauth)
- [7. middleware.ts → proxy.ts](#7-middlewarets--proxyts)
- [8. 전체 인증 흐름](#8-전체-인증-흐름)
- [9. Credentials Provider](#9-credentials-provider)
- [10. OAuth Provider](#10-oauth-provider)
- [11. Session / JWT](#11-session--jwt)
- [12. callbacks](#12-callbacks)
- [13. auth()](#13-auth)
- [14. signIn / signOut / update](#14-signin--signout--update)
- [15. 보호 라우트](#15-보호-라우트)
- [16. 권한 처리](#16-권한-처리)
- [17. CRUD 적용 예제](#17-crud-적용-예제)
- [18. 코드 스니핏](#18-코드-스니핏)
- [19. Caution](#19-caution)
- [20. Best Practice](#20-best-practice)
- [21. 요약](#21-요약)

---

# 1. 한눈에 보기

Auth는 크게 두 가지를 처리합니다.

```txt
Authentication
→ 사용자가 누구인지 확인

Authorization
→ 사용자가 무엇을 할 수 있는지 확인
```

---

## 프로젝트 기준 인증 구조

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
JWT / Session
  ↓
auth()
```

---

## 사용 기술

| 역할 | 기술 |
|---|---|
| 인증 프레임워크 | Auth.js / next-auth |
| 로그인 방식 | Credentials, OAuth |
| 비밀번호 해싱 | bcryptjs |
| Client Form | React Hook Form |
| Validation | Zod |
| 서버 세션 확인 | auth() |
| 보호 라우트 | proxy.ts 또는 서버 내부 auth() |
| 권한 처리 | role / owner check |

---

# 2. 언제 사용하는가?

Auth는 다음 기능에서 사용합니다.

- 로그인
- 회원가입
- 로그아웃
- 마이페이지
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 관리자 페이지
- API 접근 보호
- Server Action 보호

---

## 인증이 필요한 경우

```txt
로그인한 사용자만 가능
→ auth() 확인

작성자만 가능
→ user.id 비교

관리자만 가능
→ role 확인
```

---

## 인증이 필요 없는 경우

- 공개 목록 조회
- 공개 상세 조회
- 공개 검색
- 로그인 페이지
- 회원가입 페이지

---

# 3. 왜 인증 구조가 필요한가?

인증 로직을 아무 곳에나 작성하면 다음 문제가 생깁니다.

- Client에서만 권한 체크
- Server Action 권한 누락
- Route Handler 권한 누락
- 세션 타입 불명확
- 로그인/회원가입 검증 중복
- 사용자 정보가 과하게 노출
- role 처리 위치가 섞임

---

## 좋은 구조

```txt
UI
  ↓
Action / Route Handler
  ↓
auth()
  ↓
service
  ↓
repository
```

서버에서 반드시 다시 검증합니다.

---

# 4. Authentication vs Authorization

## Authentication

인증입니다.

```txt
너는 누구인가?
```

예:

- 이메일/비밀번호 로그인
- Google 로그인
- GitHub 로그인
- 세션 확인

---

## Authorization

인가입니다.

```txt
너는 무엇을 할 수 있는가?
```

예:

- 관리자만 접근
- 작성자만 수정
- 로그인 사용자만 글 작성
- 본인만 마이페이지 수정

---

## 비교

| 구분 | 의미 | 예시 |
|---|---|---|
| Authentication | 사용자 확인 | 로그인 |
| Authorization | 권한 확인 | 관리자 페이지 접근 |
| Session | 로그인 상태 | auth() 결과 |
| Role | 권한 등급 | user, admin |

---

# 5. 실무 기준

## 권장

```txt
로그인
→ Auth.js

입력 검증
→ Zod

비밀번호 해싱
→ bcryptjs

서버 세션 확인
→ auth()

페이지 접근 제어
→ proxy.ts 또는 Server Component redirect

변경 작업 권한
→ Server Action 내부 auth()

작성자 권한
→ service에서 owner check
```

---

## 인증 체크 위치

| 위치 | 목적 |
|---|---|
| proxy.ts | 라우트 진입 전 접근 제어 |
| Server Component | 페이지 렌더링 전 세션 확인 |
| Server Action | 생성/수정/삭제 전 권한 확인 |
| Route Handler | API 요청 처리 전 권한 확인 |
| Service | owner/role 같은 비즈니스 권한 확인 |

---

# 6. Auth.js / NextAuth

현재 Next.js 프로젝트에서는 `next-auth` 패키지를 사용하며, Auth.js 문서와 함께 보는 경우가 많습니다.

```bash
npm install next-auth
```

---

## 기본 구성

```txt
auth.ts
  ↓
NextAuth(config)
  ↓
auth
signIn
signOut
handlers
```

---

## 보통 export하는 값

```ts
export const {
  handlers,
  auth,
  signIn,
  signOut,
  update
} = NextAuth(...)
```

---

## route.ts

```ts
export const { GET, POST } = handlers
```

---

# 7. middleware.ts → proxy.ts

Next.js 16 기준으로 `middleware.ts` 파일 컨벤션은 deprecated 되었고, `proxy.ts`로 이름이 변경되었습니다.

```txt
middleware.ts
↓
proxy.ts
```

함수명도 변경됩니다.

```ts
// before
export function middleware() {}

// after
export function proxy() {}
```

---

## 왜 중요한가?

이 변경은 인증 문서에서 실무적으로 중요합니다.

이전 자료에서는 보호 라우트를 다음처럼 설명하는 경우가 많습니다.

```txt
middleware.ts에서 인증 체크
```

하지만 최신 Next.js 기준에서는 다음 표현이 더 적합합니다.

```txt
proxy.ts에서 인증 체크
```

---

## 기능은 동일한가?

요청이 라우팅/렌더링되기 전에 실행되어 redirect, rewrite, header 조작 등을 할 수 있다는 핵심 역할은 유지됩니다.

즉, 실무 판단은 다음과 같습니다.

| 버전/문서 | 파일 |
|---|---|
| 기존 자료 | middleware.ts |
| Next.js 16 기준 | proxy.ts |
| 현재 프로젝트 기준 | 사용 중인 Next 버전에 맞춤 |

---

## 사용 예

```ts
// proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/shared/lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()

  const isProtected = request.nextUrl.pathname.startsWith('/mypage')

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/mypage/:path*', '/board/new', '/board/:path*/edit']
}
```

---

## 주의

proxy는 모든 권한 검증을 대체하지 않습니다.

```txt
proxy.ts
→ 페이지 진입 전 1차 보호

Server Action
→ 실제 변경 작업 전 최종 검증

Service
→ 작성자/관리자 권한 검증
```

---

# 8. 전체 인증 흐름

## 로그인

```txt
SigninForm
  ↓
signinSchema
  ↓
signInWithCredentials
  ↓
signIn('credentials')
  ↓
Credentials Provider
  ↓
authorize()
  ↓
userRepository.findByEmail
  ↓
bcrypt.compare
  ↓
jwt callback
  ↓
session callback
  ↓
redirect
```

---

## 회원가입

```txt
SignupForm
  ↓
signupSchema
  ↓
signUpAction
  ↓
authService.signup
  ↓
email 중복 확인
  ↓
bcrypt.hash
  ↓
userRepository.create
```

---

## 로그아웃

```txt
LogoutButton
  ↓
signOutAction
  ↓
signOut()
  ↓
redirect('/signin')
```

---

## 권한 변경 작업

```txt
Client Button/Form
  ↓
Server Action
  ↓
auth()
  ↓
session 확인
  ↓
service
  ↓
owner / role 확인
  ↓
repository
```

---

# 9. Credentials Provider

Credentials Provider는 이메일/비밀번호 같은 자체 로그인 방식을 구현할 때 사용합니다.

---

## 사용 기준

적합:

- 직접 회원가입을 구현한다.
- DB에 사용자 테이블이 있다.
- 이메일/비밀번호 로그인을 사용한다.
- 비밀번호 해싱을 직접 관리한다.

---

## authorize 역할

```txt
credentials
  ↓
schema 검증
  ↓
user 조회
  ↓
password compare
  ↓
user 반환 or null
```

---

## 반환 값 기준

`authorize()`에서 반환하는 user는 session/jwt에 들어갈 최소 정보만 포함하는 것이 좋습니다.

권장:

```ts
return {
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image,
  role: user.role
}
```

비권장:

```ts
return {
  passwordHash: user.passwordHash,
  refreshToken: user.refreshToken
}
```

---

# 10. OAuth Provider

OAuth Provider는 Google, GitHub 같은 외부 로그인 제공자를 사용할 때 사용합니다.

---

## 사용 기준

적합:

- 소셜 로그인을 제공한다.
- 비밀번호를 직접 관리하고 싶지 않다.
- 빠른 회원가입 경험이 필요하다.

---

## Credentials와 비교

| 구분 | Credentials | OAuth |
|---|---|---|
| 비밀번호 관리 | 직접 관리 | Provider가 관리 |
| 회원가입 | 직접 구현 | OAuth callback 기반 |
| DB 사용자 매핑 | 직접 | adapter 또는 callback |
| 보안 책임 | 상대적으로 큼 | 일부 Provider 위임 |
| 커스터마이징 | 높음 | Provider 정책 영향 |

---

# 11. Session / JWT

## Session

사용자의 로그인 상태입니다.

프로젝트에서는 `auth()`로 확인합니다.

```ts
const session = await auth()
```

---

## JWT

Auth.js 내부에서 세션 전략에 따라 token 기반으로 사용자 정보를 관리할 수 있습니다.

---

## Session에 넣을 정보

권장:

```ts
session.user.id
session.user.email
session.user.name
session.user.image
session.user.role
```

주의:

- 비밀번호 해시 저장 금지
- 민감한 토큰 저장 주의
- 화면에 필요 없는 정보 저장 지양

---

# 12. callbacks

callbacks는 Auth.js 인증 흐름 중간에 데이터를 가공하는 지점입니다.

---

## jwt callback

token에 사용자 정보를 넣습니다.

```ts
async jwt({ token, user }) {
  if (user) {
    token.id = user.id
    token.role = user.role
  }

  return token
}
```

---

## session callback

session에 token 정보를 반영합니다.

```ts
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string
    session.user.role = token.role as string
  }

  return session
}
```

---

## 흐름

```txt
authorize()
  ↓ user
jwt callback
  ↓ token
session callback
  ↓ session
auth()
```

---

# 13. auth()

`auth()`는 서버에서 현재 요청의 세션을 확인하는 함수입니다.

---

## 사용 위치

| 위치 | 사용 |
|---|---|
| Server Component | 가능 |
| Server Action | 가능 |
| Route Handler | 가능 |
| proxy.ts | 가능 |
| Client Component | 직접 사용 불가 |

---

## Server Component

```tsx
import { auth } from '@/shared/lib/auth'
import { redirect } from 'next/navigation'

export default async function MyPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/signin')
  }

  return <div>{session.user.email}</div>
}
```

---

## Server Action

```ts
'use server'

import { auth } from '@/shared/lib/auth'

export async function createBoardAction(input: unknown) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  // create logic
}
```

---

# 14. signIn / signOut / update

## signIn

로그인을 수행합니다.

```ts
await signIn('credentials', {
  email,
  password,
  redirectTo: '/snack'
})
```

---

## signOut

로그아웃을 수행합니다.

```ts
await signOut({
  redirectTo: '/signin'
})
```

---

## update

세션 정보를 갱신할 때 사용합니다.

예:

- 사용자 이름 변경 후 session 갱신
- 프로필 이미지 변경 후 session 갱신

사용 여부는 프로젝트 구조에 따라 결정합니다.

---

# 15. 보호 라우트

보호 라우트는 두 단계로 생각하는 것이 안전합니다.

---

## 1차 보호: proxy.ts

```txt
요청 진입 전
→ 로그인 여부 확인
→ redirect
```

예:

- `/mypage`
- `/board/new`
- `/board/[id]/edit`

---

## 2차 보호: Server Action / Service

```txt
실제 변경 작업 전
→ auth()
→ owner/role 확인
```

예:

- 게시글 수정
- 게시글 삭제
- 회원정보 수정

---

## 이유

Client 또는 proxy에서 막았더라도, Server Action은 별도로 호출될 수 있다고 보고 검증해야 합니다.

---

# 16. 권한 처리

## Role 기반

```ts
type Role = 'user' | 'admin'
```

---

## Owner 기반

```txt
board.authorId === session.user.id
```

---

## Service에서 처리

```ts
if (board.authorId !== actor.userId && actor.role !== 'admin') {
  throw new Error('권한이 없습니다.')
}
```

---

## 권한 위치

| 권한 | 위치 |
|---|---|
| 로그인 필요 | proxy.ts / Server Component / Server Action |
| 작성자 확인 | service |
| 관리자 확인 | service |
| UI 버튼 노출 | Client Component |
| 최종 보호 | Server Action / service |

---

# 17. CRUD 적용 예제

## 게시글 작성

```txt
BoardForm
  ↓
createBoardAction
  ↓
auth()
  ↓
createBoardSchema
  ↓
boardService.create
  ↓
boardRepository.create
```

---

## 게시글 수정

```txt
BoardEditForm
  ↓
updateBoardAction
  ↓
auth()
  ↓
boardService.update
  ↓
작성자/관리자 확인
  ↓
boardRepository.update
```

---

## 게시글 삭제

```txt
DeleteButton
  ↓
deleteBoardAction
  ↓
auth()
  ↓
boardService.remove
  ↓
작성자/관리자 확인
  ↓
boardRepository.remove
```

---

# 18. 코드 스니핏

## auth.ts

```ts
// shared/lib/auth/index.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { signinSchema } from '@/features/auth/schema/auth.schema'
import { userRepository } from '@/features/auth/repositories/user.repository'

export const {
  handlers,
  auth,
  signIn,
  signOut,
  update
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = signinSchema.safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const user = await userRepository.findByEmail(parsed.data.email)

        if (!user?.passwordHash) {
          return null
        }

        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }

      return session
    }
  },

  pages: {
    signIn: '/signin'
  }
})
```

---

## route.ts

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/shared/lib/auth'

export const { GET, POST } = handlers
```

---

## proxy.ts

```ts
// proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/shared/lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  const isProtected =
    pathname.startsWith('/mypage') ||
    pathname.startsWith('/board/new') ||
    pathname.includes('/edit')

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/mypage/:path*', '/board/new', '/board/:path*/edit']
}
```

---

## auth.schema.ts

```ts
// features/auth/schema/auth.schema.ts
import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.')
})

export const signupSchema = signinSchema
  .extend({
    displayName: z.string().min(2, '이름은 2자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(8, '비밀번호 확인을 입력해주세요.')
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  })

export type SigninInput = z.infer<typeof signinSchema>
export type SignupInput = z.infer<typeof signupSchema>
```

---

## auth.action.ts

```ts
// features/auth/actions/auth.action.ts
'use server'

import { signIn, signOut } from '@/shared/lib/auth'
import { signupSchema } from '../schema/auth.schema'
import { authService } from '../services/auth.service'

export async function signInWithCredentials(input: {
  email: string
  password: string
}) {
  await signIn('credentials', {
    ...input,
    redirectTo: '/snack'
  })
}

export async function signUpAction(input: unknown) {
  const payload = signupSchema.parse(input)
  await authService.signup(payload)
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/signin'
  })
}
```

---

## auth.service.ts

```ts
// features/auth/services/auth.service.ts
import bcrypt from 'bcryptjs'
import { userRepository } from '../repositories/user.repository'
import type { SignupInput } from '../schema/auth.schema'

export const authService = {
  async signup(input: SignupInput) {
    const exists = await userRepository.findByEmail(input.email)

    if (exists) {
      throw new Error('이미 가입된 이메일입니다.')
    }

    const passwordHash = await bcrypt.hash(input.password, 10)

    return userRepository.create({
      email: input.email,
      name: input.displayName,
      passwordHash
    })
  }
}
```

---

## Board 권한 검증

```ts
// features/board/services/board.service.ts
export const boardService = {
  async update(id: string, input: UpdateBoardInput, actor: Actor) {
    const board = await boardRepository.detail(id)

    if (board.authorId !== actor.userId && actor.role !== 'admin') {
      throw new Error('수정 권한이 없습니다.')
    }

    return boardRepository.update(id, input)
  }
}
```

---

# 19. Caution

## 1. proxy.ts만 믿지 않기

proxy.ts는 페이지 접근 제어입니다.

실제 데이터 변경 권한은 Server Action과 service에서 다시 확인해야 합니다.

---

## 2. Client 권한 체크만 믿지 않기

버튼을 숨기는 것은 UX입니다.

보안은 서버에서 처리해야 합니다.

```txt
Client
→ 버튼 숨김

Server
→ 실제 권한 검증
```

---

## 3. session에 민감 정보 넣지 않기

금지:

- passwordHash
- refreshToken
- accessToken 원문
- 민감한 개인 정보

---

## 4. authorize에서 에러 메시지 노출 주의

로그인 실패 사유를 너무 자세히 나누면 보안상 좋지 않을 수 있습니다.

예:

```txt
이메일이 없습니다.
비밀번호가 틀렸습니다.
```

보다

```txt
이메일 또는 비밀번호를 확인해주세요.
```

가 더 안전합니다.

---

## 5. Server Action에서 auth() 누락하지 않기

보호 페이지에서만 버튼을 보여준다고 해서 Server Action이 안전한 것은 아닙니다.

---

## 6. Auth Session을 Zustand에 복제하지 않기

세션의 source of truth는 Auth.js입니다.

```txt
Auth Session
→ Auth.js

UI open/close
→ Zustand
```

---

# 20. Best Practice

## 권장

- 로그인/회원가입 Form은 RHF + Zod 사용
- authorize 내부에서도 schema 검증
- passwordHash는 bcrypt로 저장
- session에는 최소 정보만 저장
- role은 jwt/session callback에서 명시적으로 전달
- 보호 페이지는 proxy.ts 또는 Server Component에서 처리
- Server Action은 항상 auth() 확인
- 작성자/관리자 권한은 service에서 확인
- Client 권한 체크는 UX 목적으로만 사용
- Auth 관련 타입 확장은 별도 d.ts에서 관리

---

## 비권장

- 비밀번호를 평문 저장
- session에 passwordHash 저장
- Client에서만 권한 검증
- proxy.ts만으로 모든 보안을 대체
- Server Action에서 auth() 생략
- 사용자 데이터를 전부 JWT/session에 넣기
- Auth Session을 Zustand에 복제
- authorize에서 DB 조회 없이 credentials 신뢰

---

# 21. 요약

## 인증 흐름

```txt
Form
  ↓
signIn
  ↓
Auth.js
  ↓
authorize
  ↓
JWT / Session
  ↓
auth()
```

---

## 권한 흐름

```txt
proxy.ts
→ 페이지 접근 1차 제어

Server Action
→ 변경 작업 최종 검증

Service
→ 작성자/관리자 권한 검증
```

---

## 핵심 기준

```txt
Authentication
→ 로그인 상태 확인

Authorization
→ 권한 확인

Session source of truth
→ Auth.js

UI State
→ Zustand

Server 최종 검증
→ 필수
```

---

# 참고

Next.js 16 기준으로 `middleware.ts`는 `proxy.ts`로 변경되었으며, 기존 middleware 함수명도 proxy로 변경하는 방향이 공식 문서에 안내되어 있습니다. Auth.js/NextAuth 설정은 프로젝트 버전과 사용하는 next-auth 버전에 맞춰 조정해야 합니다.
