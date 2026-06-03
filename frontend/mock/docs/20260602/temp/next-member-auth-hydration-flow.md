# Next.js 회원 기능 로직 흐름 정리

> 기준: `Next.js App Router + Auth.js(NextAuth v5) + React Query + RHF/Zod + nuqs/qs`
>
> 주제: `로그인 / 회원가입 / 로그아웃 / 마이페이지 / 세션 갱신` 이 hydration 전후로 어떤 순서로 동작하는지 정리

---

## 0. 핵심 결론

회원 기능은 단순 CRUD보다 **Server와 Client의 경계**가 더 중요합니다.

```txt
Server
  ↓ auth() / cookie / session 확인
RSC prerender
  ↓ 로그인 여부가 반영된 HTML 생성
Browser
  ↓ HTML 표시
JS 다운로드
  ↓ Client Component hydration
Client
  ↓ RHF / event handler / useMutation / router.refresh
Server Action 또는 Route Handler
  ↓ 인증/검증/DB 처리
DB
```

회원 기능에서 가장 중요한 원칙은 다음입니다.

| 구분                    | 권장 위치                                              | 이유                                               |
| ----------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| 현재 로그인 사용자 확인 | Server Component의 `auth()`                            | 초기 HTML에 로그인 상태를 반영 가능                |
| 로그인/로그아웃         | Server Action 또는 Auth.js `signIn/signOut`            | 쿠키/세션 변경이 서버에서 발생                     |
| 회원가입                | Server Action                                          | 비밀번호 해싱, DB 저장, 중복 검증이 서버 전용 로직 |
| 마이페이지 초기 조회    | Server Component prefetch 또는 직접 `auth()` + DB 조회 | 로그인 사용자 기준 데이터이므로 서버에서 먼저 확인 |
| 마이페이지 수정         | Client Form + RHF/Zod + Mutation + Server Action       | 입력 UX는 Client, 최종 검증/저장은 Server          |
| 검색/목록성 회원 데이터 | Route Handler + React Query                            | URL 기반 조회, 필터/페이징에 적합                  |

---

## 1. 기본 구성 요소

| 항목             | 환경                | 대표 파일                                               | 역할                                         |
| ---------------- | ------------------- | ------------------------------------------------------- | -------------------------------------------- |
| Server Component | Server              | `layout.tsx`, `page.tsx`                                | `auth()` 호출, 세션 확인, redirect, prefetch |
| Client Component | Browser + hydration | `login-form.tsx`, `signup-form.tsx`, `profile-form.tsx` | RHF, 이벤트 핸들러, mutation, toast          |
| Server Action    | Server              | `member.action.ts`                                      | 로그인, 회원가입, 프로필 수정, 로그아웃      |
| Route Handler    | Server              | `app/api/me/route.ts`                                   | React Query에서 호출하는 조회 API            |
| Service          | Server              | `member.service.ts`                                     | 비즈니스 로직                                |
| Repository       | Server              | `member.repository.ts`                                  | Prisma/DB 접근                               |
| Schema           | Shared 또는 Server  | `member.schema.ts`                                      | Zod 검증                                     |

> `use client`는 “브라우저에서만 실행된다”는 뜻이 아니라, **Client Component 번들에 포함되며 hydration 이후 이벤트와 hooks가 동작한다**는 의미로 이해하는 것이 안전합니다.

---

## 2. 회원 기능 프로젝트 구조

```txt
app/
├─ (default-layout)/
│  ├─ layout.tsx                         # 공통 레이아웃: auth()로 session 확인 가능
│  ├─ (public)/
│  │  ├─ signin/
│  │  │  └─ page.tsx                     # 로그인 페이지(Server)
│  │  └─ signup/
│  │     └─ page.tsx                     # 회원가입 페이지(Server)
│  └─ (private)/
│     ├─ layout.tsx                      # 보호 레이아웃: 비로그인 redirect
│     └─ mypage/
│        ├─ page.tsx                     # 마이페이지(Server)
│        └─ _components/
│           ├─ profile-form.tsx          # 프로필 수정(Client)
│           └─ password-form.tsx         # 비밀번호 변경(Client)
├─ api/
│  └─ me/
│     └─ route.ts                        # 현재 사용자 조회 API(선택)
│
features/
└─ member/
   ├─ actions/
   │  └─ member.action.ts                # signin/signup/signout/updateProfile
   ├─ components/
   │  ├─ signin-form.tsx                 # RHF 로그인 폼
   │  ├─ signup-form.tsx                 # RHF 회원가입 폼
   │  └─ user-menu.tsx                   # 로그인 사용자 메뉴
   ├─ hooks/
   │  └─ use-member.ts                   # useMutation / useQuery
   ├─ queries/
   │  └─ member.query.ts                 # queryKey / queryOptions
   ├─ schemas/
   │  └─ member.schema.ts                # zod schemas
   ├─ services/
   │  └─ member.service.ts               # 인증/회원 비즈니스 로직
   ├─ repositories/
   │  └─ member.repository.ts            # Prisma DB 접근
   └─ types/
      └─ member.type.ts

shared/
├─ lib/
│  ├─ auth.ts                            # Auth.js 설정 export
│  ├─ bcrypt.ts                          # 비밀번호 hash/compare
│  ├─ prisma.ts
│  ├─ react-query.tsx
│  └─ utils.ts
└─ components/ui                         # shadcn/ui
```

---

# Part 1. 로그인 상태가 화면에 반영되는 기본 흐름

## 1-1. 최초 접속 흐름

```txt
사용자 요청
  ↓
Next.js Server
  ↓
layout.tsx / page.tsx 실행
  ↓ auth()
Cookie / Session 확인
  ↓
로그인 상태에 맞는 RSC 생성
  ↓
HTML 생성
  ↓
Browser에 전달
  ↓
HTML 먼저 표시
  ↓
Client Component JS 다운로드
  ↓
hydration
  ↓
버튼 클릭 / form submit / useEffect / useMutation 동작 가능
```

### 단계별 설명

| 단계 | 위치    | 설명                                             |
| ---- | ------- | ------------------------------------------------ |
| 1    | Server  | 브라우저가 `/mypage` 또는 `/signin` 요청         |
| 2    | Server  | `layout.tsx`, `page.tsx`가 실행됨                |
| 3    | Server  | `auth()`가 쿠키를 읽고 session을 확인            |
| 4    | Server  | 로그인 여부에 따라 redirect 또는 HTML 생성       |
| 5    | Browser | HTML이 먼저 표시됨                               |
| 6    | Browser | Client Component JS가 다운로드됨                 |
| 7    | Browser | hydration 이후 RHF, click handler, mutation 동작 |

### 중요한 포인트

```txt
로그인 사용자명 표시, 로그인/로그아웃 버튼 분기, 보호 페이지 redirect
```

이런 것은 가능하면 **Server Component에서 먼저 처리**하는 것이 좋습니다.

```tsx
// app/(default-layout)/layout.tsx
import { auth } from '@/shared/lib/auth'
import { Header } from '@/shared/components/layout/header'

export default async function DefaultLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <>
      <Header user={session?.user ?? null} />
      {children}
    </>
  )
}
```

```tsx
// shared/components/layout/header.tsx
import { UserMenu } from '@/features/member/components/user-menu'

export function Header({
  user
}: {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}) {
  return (
    <header>
      {user ? <UserMenu user={user} /> : <a href="/signin">로그인</a>}
    </header>
  )
}
```

---

# Part 2. 로그인 페이지 흐름

## 2-1. 로그인 페이지 진입

```txt
/signin 요청
  ↓
signin/page.tsx(Server)
  ↓ auth()
  ↓
이미 로그인 상태라면 redirect('/mypage')
  ↓
비로그인 상태라면 SigninForm(Client) 렌더링
  ↓
HTML 표시
  ↓
hydration 이후 RHF 동작
```

```tsx
// app/(default-layout)/(public)/signin/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/shared/lib/auth'
import { SigninForm } from '@/features/member/components/signin-form'

export default async function SigninPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/mypage')
  }

  return <SigninForm />
}
```

## 2-2. 로그인 submit 흐름

```txt
SigninForm(Client)
  ↓ RHF submit
zodResolver로 1차 검증
  ↓
useMutation 또는 form action
  ↓
signInWithCredentials(Server Action)
  ↓
Auth.js signIn('credentials')
  ↓
Credentials authorize()
  ↓
DB에서 user 조회
  ↓
password compare
  ↓
JWT/session cookie 생성
  ↓
redirect 또는 result 반환
  ↓
router.refresh()
  ↓
서버 컴포넌트 재요청
  ↓
layout.tsx auth()가 새 session 확인
  ↓
로그인 UI 반영
```

### 로그인 Form 예시

```tsx
// features/member/components/signin-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signinSchema, type SigninInput } from '../schemas/member.schema'
import { signInWithCredentials } from '../actions/member.action'

export function SigninForm() {
  const router = useRouter()

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = form.handleSubmit(async values => {
    const result = await signInWithCredentials(values)

    if (!result.ok) {
      form.setError('root', { message: result.message })
      return
    }

    router.replace('/mypage')
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit}>
      <input
        {...form.register('email')}
        placeholder="이메일"
      />
      <input
        {...form.register('password')}
        type="password"
        placeholder="비밀번호"
      />

      {form.formState.errors.root?.message && (
        <p>{form.formState.errors.root.message}</p>
      )}

      <button disabled={form.formState.isSubmitting}>로그인</button>
    </form>
  )
}
```

### 로그인 Server Action 예시

```ts
// features/member/actions/member.action.ts
'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/shared/lib/auth'
import { signinSchema, signupSchema } from '../schemas/member.schema'
import { memberService } from '../services/member.service'

export async function signInWithCredentials(input: unknown) {
  const parsed = signinSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: '입력값을 확인해주세요.'
    }
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false
    })

    return { ok: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      }
    }

    throw error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
```

---

# Part 3. Auth.js Credentials 내부 흐름

## 3-1. Auth.js 설정 흐름

```txt
auth.ts
  ↓
NextAuth({ providers: [Credentials] })
  ↓
handlers / auth / signIn / signOut export
  ↓
app/api/auth/[...nextauth]/route.ts에서 handlers 연결
  ↓
Server Component / Server Action에서 auth(), signIn(), signOut() 사용
```

```ts
// shared/lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { memberService } from '@/features/member/services/member.service'
import { signinSchema } from '@/features/member/schemas/member.schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsed = signinSchema.safeParse(credentials)

        if (!parsed.success) return null

        const user = await memberService.validateUser(parsed.data)

        if (!user) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }

      return session
    }
  }
})
```

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/shared/lib/auth'

export const { GET, POST } = handlers
```

## 3-2. Credentials 로그인 내부 단계

```txt
Client submit
  ↓
Server Action signIn('credentials')
  ↓
Auth.js Credentials authorize(credentials)
  ↓
Zod schema 검증
  ↓
memberService.validateUser
  ↓
memberRepository.findByEmail
  ↓
bcrypt.compare
  ↓
성공: user 반환
  ↓
jwt callback
  ↓
session callback
  ↓
쿠키 저장
```

```ts
// features/member/services/member.service.ts
import { compare } from 'bcryptjs'
import { memberRepository } from '../repositories/member.repository'
import type { SigninInput, SignupInput } from '../schemas/member.schema'

export const memberService = {
  async validateUser(input: SigninInput) {
    const user = await memberRepository.findByEmail(input.email)

    if (!user) return null

    const isValidPassword = await compare(input.password, user.password)

    if (!isValidPassword) return null

    return user
  }
}
```

---

# Part 4. 회원가입 흐름

## 4-1. 회원가입 전체 흐름

```txt
/signup 요청
  ↓
signup/page.tsx(Server)
  ↓ auth()
  ↓
이미 로그인 상태라면 redirect('/mypage')
  ↓
SignupForm(Client) 렌더링
  ↓
hydration 완료
  ↓
RHF submit
  ↓
zodResolver 1차 검증
  ↓
signUpAction(Server Action)
  ↓
signupSchema 2차 검증
  ↓
email 중복 확인
  ↓
password hash
  ↓
DB user 생성
  ↓
선택 1: 로그인 페이지로 이동
선택 2: 바로 signIn 처리
```

## 4-2. 회원가입 Server Action 예시

```ts
// features/member/actions/member.action.ts
'use server'

import { hash } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { signupSchema } from '../schemas/member.schema'
import { memberRepository } from '../repositories/member.repository'

export async function signUpAction(input: unknown) {
  const parsed = signupSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: '입력값을 확인해주세요.'
    }
  }

  const existsUser = await memberRepository.findByEmail(parsed.data.email)

  if (existsUser) {
    return {
      ok: false,
      message: '이미 사용 중인 이메일입니다.'
    }
  }

  const hashedPassword = await hash(parsed.data.password, 10)

  await memberRepository.create({
    email: parsed.data.email,
    name: parsed.data.name,
    password: hashedPassword
  })

  redirect('/signin?signup=success')
}
```

## 4-3. 회원가입 Schema 예시

```ts
// features/member/schemas/member.schema.ts
import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
})

export const signupSchema = z
  .object({
    email: z.string().email('이메일 형식이 올바르지 않습니다.'),
    name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(8)
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  })

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(30),
  image: z.string().url().optional().or(z.literal(''))
})

export type SigninInput = z.infer<typeof signinSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
```

---

# Part 5. 로그아웃 흐름

## 5-1. Server Action 기반 로그아웃

```txt
UserMenu(Client 또는 Server form)
  ↓
form action={signOutAction}
  ↓
Server Action
  ↓
Auth.js signOut()
  ↓
세션 쿠키 제거
  ↓
redirect('/')
  ↓
layout.tsx auth() 재실행
  ↓
비로그인 UI 반영
```

```tsx
// features/member/components/signout-button.tsx
import { signOutAction } from '../actions/member.action'

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit">로그아웃</button>
    </form>
  )
}
```

### 실무 기준

| 방식                      | 사용 가능 | 권장 상황                                            |
| ------------------------- | --------- | ---------------------------------------------------- |
| Server Action `signOut()` | 가능      | App Router + 서버 중심 세션 처리                     |
| Client `signOut()`        | 가능      | 완전 Client UI에서 버튼 이벤트로 처리할 때           |
| 직접 쿠키 삭제            | 비권장    | Auth.js 사용 시 내부 쿠키/CSRF 흐름을 우회할 수 있음 |

---

# Part 6. 마이페이지 흐름

## 6-1. 보호 레이아웃에서 인증 확인

```txt
/private 요청
  ↓
(private)/layout.tsx(Server)
  ↓ auth()
  ↓
session 없음 → redirect('/signin')
  ↓
session 있음 → children 렌더링
```

```tsx
// app/(default-layout)/(private)/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/shared/lib/auth'

export default async function PrivateLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/signin')
  }

  return <>{children}</>
}
```

## 6-2. 마이페이지 초기 조회

```txt
mypage/page.tsx(Server)
  ↓ auth()
  ↓ session.user.id
  ↓
memberService.getMyProfile(userId)
  ↓
DB 조회
  ↓
ProfileForm(Client)에 defaultValues 전달
  ↓
HTML 생성
  ↓
hydration 후 RHF 수정 가능
```

```tsx
// app/(default-layout)/(private)/mypage/page.tsx
import { auth } from '@/shared/lib/auth'
import { memberService } from '@/features/member/services/member.service'
import { ProfileForm } from './_components/profile-form'

export default async function MyPage() {
  const session = await auth()

  const profile = await memberService.getMyProfile(session!.user.id)

  return (
    <ProfileForm
      defaultValues={{
        name: profile.name,
        image: profile.image ?? ''
      }}
    />
  )
}
```

## 6-3. 프로필 수정 흐름

```txt
ProfileForm(Client)
  ↓
RHF defaultValues로 서버 데이터 반영
  ↓
사용자 입력
  ↓
submit
  ↓
zodResolver 1차 검증
  ↓
updateProfileAction(Server Action)
  ↓
auth()로 현재 사용자 재확인
  ↓
updateProfileSchema 2차 검증
  ↓
DB update
  ↓
revalidatePath('/mypage') 또는 router.refresh()
  ↓
서버 컴포넌트 재실행
  ↓
수정된 사용자 정보 반영
```

```tsx
// app/(default-layout)/(private)/mypage/_components/profile-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  updateProfileSchema,
  type UpdateProfileInput
} from '@/features/member/schemas/member.schema'
import { updateProfileAction } from '@/features/member/actions/member.action'

export function ProfileForm({
  defaultValues
}: {
  defaultValues: UpdateProfileInput
}) {
  const router = useRouter()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues
  })

  const onSubmit = form.handleSubmit(async values => {
    const result = await updateProfileAction(values)

    if (!result.ok) {
      form.setError('root', { message: result.message })
      return
    }

    router.refresh()
  })

  return (
    <form onSubmit={onSubmit}>
      <input {...form.register('name')} />
      <input {...form.register('image')} />
      <button disabled={form.formState.isSubmitting}>저장</button>
    </form>
  )
}
```

```ts
// features/member/actions/member.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/shared/lib/auth'
import { updateProfileSchema } from '../schemas/member.schema'
import { memberService } from '../services/member.service'

export async function updateProfileAction(input: unknown) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ok: false,
      message: '로그인이 필요합니다.'
    }
  }

  const parsed = updateProfileSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: '입력값을 확인해주세요.'
    }
  }

  await memberService.updateProfile(session.user.id, parsed.data)

  revalidatePath('/mypage')

  return { ok: true }
}
```

---

# Part 7. React Query를 회원 기능에 쓰는 경우

회원 기능 전체를 React Query로 처리할 필요는 없습니다.

## 7-1. React Query가 필요한 경우

| 기능                      | React Query 필요성 | 이유                                   |
| ------------------------- | ------------------ | -------------------------------------- |
| 로그인 상태 확인          | 낮음               | Server Component `auth()`가 더 적합    |
| 로그인/로그아웃           | 낮음               | Auth.js Server Action이 더 직접적      |
| 회원가입                  | 낮음~보통          | mutation UX/toast가 필요하면 사용 가능 |
| 마이페이지 조회           | 선택               | 서버에서 직접 조회하거나 prefetch 가능 |
| 알림 목록, 내 게시글 목록 | 높음               | 목록/페이징/필터/캐싱에 적합           |
| 관리자 회원 목록          | 높음               | 검색/정렬/페이징이 필요                |

## 7-2. 마이페이지를 React Query prefetch로 처리하는 흐름

```txt
mypage/page.tsx(Server)
  ↓ auth()
  ↓
queryClient.prefetchQuery(memberMeQueryOptions())
  ↓
dehydrate(queryClient)
  ↓
HydrationBoundary
  ↓
MyPageContent(Client)
  ↓
useSuspenseQuery(memberMeQueryOptions())
  ↓
캐시에서 즉시 조회
  ↓
필요 시 background refetch
```

```tsx
// app/(default-layout)/(private)/mypage/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/lib/react-query'
import { memberMeQueryOptions } from '@/features/member/queries/member.query'
import { MyPageContent } from './_components/my-page-content'

export default async function MyPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(memberMeQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPageContent />
    </HydrationBoundary>
  )
}
```

```ts
// features/member/queries/member.query.ts
import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/lib/axios'

export const memberKeys = {
  all: ['member'] as const,
  me: () => [...memberKeys.all, 'me'] as const
}

export const memberMeQueryOptions = () =>
  queryOptions({
    queryKey: memberKeys.me(),
    queryFn: () => api.get('/me').then(res => res.data),
    staleTime: 1000 * 60
  })
```

```ts
// app/api/me/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/shared/lib/auth'
import { memberService } from '@/features/member/services/member.service'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const profile = await memberService.getMyProfile(session.user.id)

  return NextResponse.json(profile)
}
```

---

# Part 8. nuqs / qs는 회원 기능에서 어디에 쓰나?

로그인/회원가입 자체에는 `nuqs`, `qs`가 핵심은 아닙니다.

다만 회원 관련 목록/탭/필터에는 유용합니다.

## 8-1. 사용 예시

| 기능                 | 사용 라이브러리             | 예시                                  |
| -------------------- | --------------------------- | ------------------------------------- |
| 로그인 redirect URL  | `searchParams`, `qs`        | `/signin?callbackUrl=/mypage`         |
| 회원가입 성공 메시지 | `searchParams`              | `/signin?signup=success`              |
| 마이페이지 탭        | `nuqs`                      | `/mypage?tab=profile`                 |
| 내 활동 목록 필터    | `nuqs + qs + React Query`   | `/mypage/posts?page=1&sort=createdAt` |
| 관리자 회원 목록     | `nuqs + qs + Route Handler` | `/admin/members?keyword=kim&page=1`   |

## 8-2. 마이페이지 탭 예시

```tsx
// app/(default-layout)/(private)/mypage/_components/mypage-tabs.tsx
'use client'

import { parseAsStringEnum, useQueryState } from 'nuqs'

const tabs = ['profile', 'password', 'posts'] as const

export function MyPageTabs() {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum(tabs).withDefault('profile')
  )

  return (
    <div>
      <button onClick={() => setTab('profile')}>프로필</button>
      <button onClick={() => setTab('password')}>비밀번호</button>
      <button onClick={() => setTab('posts')}>내 게시글</button>

      {tab === 'profile' && <div>프로필 수정</div>}
      {tab === 'password' && <div>비밀번호 변경</div>}
      {tab === 'posts' && <div>내 게시글 목록</div>}
    </div>
  )
}
```

---

# Part 9. 로그인 후 UI가 안 바뀌는 이유

## 9-1. 대표 원인

```txt
로그인 성공
  ↓
쿠키는 바뀜
  ↓
하지만 현재 화면의 Server Component 결과는 이전 session 기준
  ↓
Header/NavUser가 여전히 비로그인 상태로 보임
```

## 9-2. 해결 흐름

```txt
로그인 성공 후
  ↓
router.replace('/mypage')
  ↓
router.refresh()
  ↓
현재 route의 Server Component 재요청
  ↓
layout.tsx auth() 재실행
  ↓
새 session 기준으로 Header 재렌더링
```

```ts
router.replace('/mypage')
router.refresh()
```

또는 Server Action 내부에서 `redirect('/mypage')`를 사용하면 서버 응답 단계에서 이동을 처리할 수 있습니다.

---

# Part 10. 회원 기능별 흐름 요약

## 10-1. 로그인

```txt
signin/page.tsx(Server)
  ↓ auth()
  ↓ 이미 로그인 → redirect
SigninForm(Client)
  ↓ RHF + zodResolver
signInWithCredentials(Server Action)
  ↓ signIn('credentials')
Auth.js authorize()
  ↓ DB user 조회 + password compare
JWT/session cookie 저장
  ↓ router.replace / redirect
layout.tsx auth() 재실행
  ↓ 로그인 UI 반영
```

## 10-2. 회원가입

```txt
signup/page.tsx(Server)
  ↓ auth()
  ↓ 이미 로그인 → redirect
SignupForm(Client)
  ↓ RHF + zodResolver
signUpAction(Server Action)
  ↓ signupSchema.safeParse
email 중복 확인
  ↓ password hash
DB user 생성
  ↓ redirect('/signin?signup=success')
```

## 10-3. 로그아웃

```txt
SignOutButton
  ↓ form action
signOutAction(Server Action)
  ↓ signOut()
세션 쿠키 제거
  ↓ redirect('/')
layout.tsx auth() 재실행
  ↓ 비로그인 UI 반영
```

## 10-4. 마이페이지 조회

```txt
/private/layout.tsx(Server)
  ↓ auth()
  ↓ 비로그인 redirect
mypage/page.tsx(Server)
  ↓ auth().user.id
memberService.getMyProfile
  ↓ DB 조회
ProfileForm(Client)
  ↓ defaultValues
hydration
  ↓ RHF 수정 가능
```

## 10-5. 마이페이지 수정

```txt
ProfileForm(Client)
  ↓ RHF submit
updateProfileAction(Server Action)
  ↓ auth() 재확인
  ↓ zod 검증
  ↓ DB update
revalidatePath('/mypage')
  ↓ router.refresh()
  ↓ 최신 profile 반영
```

---

# Part 11. 실무에 가까운 선택 기준

## 11-1. Server Component에서 session을 받는 방식

```tsx
const session = await auth()
```

권장되는 기본 방식입니다.

이유는 다음과 같습니다.

- 초기 HTML에 로그인 상태를 반영할 수 있음
- 비로그인 사용자를 서버에서 바로 redirect 가능
- 클라이언트에서 세션 로딩 상태를 별도로 관리하지 않아도 됨
- 보호 페이지 보안 처리가 단순해짐

## 11-2. Client에서 `useSession()`을 쓰는 경우

`useSession()`은 가능하지만 App Router에서는 기본 선택지로 두지 않는 편이 낫습니다.

적합한 경우는 다음입니다.

| 상황                  | 설명                                           |
| --------------------- | ---------------------------------------------- |
| 완전 Client 기반 위젯 | 서버 렌더링과 무관한 작은 위젯                 |
| 실시간 세션 상태 표시 | 클라이언트에서 세션 업데이트가 필요한 경우     |
| OAuth 상태 UI         | 로그인 중/loading UI를 직접 제어하고 싶은 경우 |

## 11-3. React Query와 Auth.js session을 섞을 때 주의점

| 주의점                                     | 설명                                                              |
| ------------------------------------------ | ----------------------------------------------------------------- |
| session 자체를 React Query로 대체하지 않기 | 인증의 source of truth는 Auth.js session/cookie                   |
| `/api/me`는 보조 조회로 사용               | 프로필 상세 데이터, 통계, 내 게시글 등에 적합                     |
| 로그인/로그아웃 후 캐시 정리               | `queryClient.invalidateQueries()` 또는 `queryClient.clear()` 고려 |
| Header는 가능하면 Server session 기준      | UI 불일치 방지                                                    |

---

# Part 12. 자주 헷갈리는 지점

## 12-1. Client Component는 서버에서 아예 실행 안 되나?

아닙니다.

초기 렌더링 단계에서 Client Component도 서버에서 HTML 생성을 위해 렌더링될 수 있습니다.

다만 다음은 hydration 이후 브라우저에서 동작합니다.

- `useEffect`
- event handler
- `window`, `document` 접근
- RHF의 실제 사용자 입력 처리
- 버튼 클릭
- client-side `router.replace`, `router.refresh`

## 12-2. 로그인 성공했는데 Header가 그대로인 이유

대부분 `router.refresh()` 또는 서버 redirect가 빠진 경우입니다.

```txt
쿠키 변경 ≠ 이미 렌더링된 Server Component 자동 변경
```

쿠키가 변경되면 서버 컴포넌트를 다시 요청해야 새 session이 반영됩니다.

## 12-3. RHF defaultValues는 언제 세팅하나?

마이페이지처럼 서버에서 이미 profile을 가져올 수 있는 경우:

```txt
Server에서 데이터 조회
  ↓
Client Form에 defaultValues 전달
```

이 방식이 가장 단순합니다.

비동기로 Client에서 profile을 가져오는 경우에는 `form.reset(data)`가 필요할 수 있습니다.

## 12-4. 회원가입 후 바로 로그인할까?

둘 다 가능합니다.

| 방식                           | 장점                 | 단점                                     |
| ------------------------------ | -------------------- | ---------------------------------------- |
| 회원가입 후 로그인 페이지 이동 | 흐름 명확, 구현 단순 | 사용자가 다시 로그인해야 함              |
| 회원가입 후 자동 로그인        | UX 좋음              | 회원가입 action에서 signIn까지 처리 필요 |

처음 구현은 `회원가입 → 로그인 페이지 이동`이 더 안전하고 단순합니다.

---

# Part 13. 권장 라이브러리

현재 사용 중인 라이브러리 외에 회원 기능에서 실무적으로 자주 같이 쓰는 라이브러리입니다.

| 라이브러리               | 용도                  | 비고                                |
| ------------------------ | --------------------- | ----------------------------------- |
| `next-auth` / Auth.js    | 인증/세션             | App Router에서는 `auth()` 중심 권장 |
| `@auth/prisma-adapter`   | Auth.js + Prisma 연동 | DB 세션/OAuth 저장 시 사용          |
| `bcryptjs` 또는 `bcrypt` | 비밀번호 해싱         | Credentials 로그인 시 필요          |
| `server-only`            | 서버 전용 모듈 보호   | repository/service에 사용 가능      |
| `sonner`                 | toast                 | 로그인 실패/저장 성공 메시지        |
| `zod`                    | schema 검증           | Client/Server 양쪽 검증             |
| `@hookform/resolvers`    | RHF + Zod 연결        | `zodResolver` 사용                  |
| `Prisma`                 | ORM                   | 회원/세션/게시글 DB 처리            |

---

# Part 14. 최종 정리

회원 기능은 다음처럼 나누면 가장 이해하기 쉽습니다.

```txt
초기 화면 판단
  = Server Component + auth()

입력 폼 UX
  = Client Component + RHF/Zod

로그인/회원가입/수정/로그아웃 처리
  = Server Action

현재 사용자 상세 조회/내 게시글/활동 목록
  = Server Component 직접 조회 또는 Route Handler + React Query

URL 상태
  = nuqs

API query string 생성
  = qs
```

## 최종 권장 흐름

```txt
로그인 여부 판단은 Server에서 먼저 한다.
폼 입력은 Client에서 RHF로 처리한다.
최종 검증과 DB 처리는 Server Action에서 다시 한다.
로그인/로그아웃 후에는 redirect 또는 router.refresh로 Server Component를 다시 실행한다.
마이페이지 초기값은 Server에서 가져와 Client Form의 defaultValues로 전달한다.
목록/필터/페이징 성격의 데이터만 React Query + Route Handler로 분리한다.
```

---

# 참고 자료

- Next.js App Router Server/Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Server Actions / Forms: https://nextjs.org/docs/app/guides/forms
- Next.js Mutating Data: https://nextjs.org/docs/app/getting-started/mutating-data
- Auth.js Next.js Reference: https://authjs.dev/reference/nextjs
- Auth.js Get Session: https://authjs.dev/getting-started/session-management/get-session
- Auth.js Credentials Provider: https://authjs.dev/getting-started/authentication/credentials
- Auth.js Signin / Signout: https://authjs.dev/getting-started/session-management/login
- React Hook Form useForm: https://react-hook-form.com/docs/useform
- TanStack Query Hydration: https://tanstack.com/query/latest/docs/framework/react/reference/hydration
