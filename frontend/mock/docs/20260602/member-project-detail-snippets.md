# 회원 기능 상세 구조 및 스니핏 리포트

이 문서는 Next.js App Router + Auth.js/NextAuth.js + React Hook Form + Zod + React Query 기반 회원 기능 구현 예시입니다.
로그인, 회원가입, 로그아웃, 마이페이지, 프로필 수정, 인증 보호 라우트를 기준으로 작성했습니다.

## 1. 설치 권장 라이브러리

```bash
pnpm add next-auth zod react-hook-form @hookform/resolvers @tanstack/react-query axios sonner bcryptjs
pnpm add -D @types/bcryptjs
```

Prisma를 사용할 경우 다음을 추가합니다.

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

## 2. 환경변수

```env
# .env.local
AUTH_SECRET="replace-with-long-random-secret"
AUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@localhost:5432/app"
```

`AUTH_SECRET`은 운영 환경에서 반드시 설정해야 합니다. 비밀값은 저장소에 커밋하지 않습니다.

## 3. Prisma User 모델 예시

```prisma
// prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
}

enum Role {
  USER
  ADMIN
}
```

Auth.js의 Prisma Adapter를 사용한다면 `Account`, `Session`, `VerificationToken` 모델도 함께 구성합니다.

## 4. Zod 스키마

### 4.1 로그인

```ts
// features/auth/schemas/signin.schema.ts
import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.')
})

export type SigninInput = z.infer<typeof signinSchema>
```

### 4.2 회원가입

```ts
// features/auth/schemas/signup.schema.ts
import { z } from 'zod'

export const signupSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상 입력해주세요.'),
    email: z.string().email('올바른 이메일을 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(8)
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  })

export type SignupInput = z.infer<typeof signupSchema>
```

### 4.3 프로필 수정

```ts
// features/auth/schemas/profile.schema.ts
import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2).max(30),
  image: z.string().url().optional().or(z.literal(''))
})

export type ProfileInput = z.infer<typeof profileSchema>
```

## 5. Auth 설정

```ts
// auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { signinSchema } from '@/features/auth/schemas/signin.schema'
import { userService } from '@/features/auth/services/user.service'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const parsed = signinSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await userService.findByEmail(parsed.data.email)
        if (!user?.passwordHash) return null

        const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!isValidPassword) return null

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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'ADMIN'
      }
      return session
    }
  },
  pages: {
    signIn: '/signin'
  }
})
```

## 6. Route Handler

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'

export const { GET, POST } = handlers
```

## 7. NextAuth 타입 확장

```ts
// types/next-auth.d.ts
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'USER' | 'ADMIN'
    }
  }

  interface User {
    role: 'USER' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'USER' | 'ADMIN'
  }
}
```

## 8. 회원가입 Server Action

```ts
// features/auth/actions/signup.action.ts
'use server'

import bcrypt from 'bcryptjs'
import { signupSchema } from '../schemas/signup.schema'
import { userService } from '../services/user.service'

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm')
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: '입력값을 확인해주세요.'
    }
  }

  const exists = await userService.findByEmail(parsed.data.email)
  if (exists) {
    return {
      ok: false,
      message: '이미 가입된 이메일입니다.'
    }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  await userService.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash
  })

  return {
    ok: true,
    message: '회원가입이 완료되었습니다.'
  }
}
```

## 9. 로그인 Form

```tsx
// features/auth/components/signin-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { signinSchema, type SigninInput } from '../schemas/signin.schema'

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
    const result = await signIn('credentials', {
      ...values,
      redirect: false
    })

    if (result?.error) {
      toast.error('이메일 또는 비밀번호를 확인해주세요.')
      return
    }

    toast.success('로그인되었습니다.')
    router.replace('/')
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="email" {...form.register('email')} placeholder="이메일" />
      <input type="password" {...form.register('password')} placeholder="비밀번호" />
      <button type="submit" disabled={form.formState.isSubmitting}>로그인</button>
    </form>
  )
}
```

## 10. 회원가입 Form

```tsx
// features/auth/components/signup-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { signupAction } from '../actions/signup.action'
import { signupSchema, type SignupInput } from '../schemas/signup.schema'

export function SignupForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const onSubmit = form.handleSubmit(values => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => formData.set(key, value))

    startTransition(async () => {
      const result = await signupAction(formData)

      if (!result.ok) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.replace('/signin')
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input {...form.register('name')} placeholder="이름" />
      <input type="email" {...form.register('email')} placeholder="이메일" />
      <input type="password" {...form.register('password')} placeholder="비밀번호" />
      <input type="password" {...form.register('passwordConfirm')} placeholder="비밀번호 확인" />
      <button type="submit" disabled={isPending}>회원가입</button>
    </form>
  )
}
```

## 11. 로그아웃 버튼

```tsx
// features/auth/components/signout-button.tsx
'use client'

import { signOut } from 'next-auth/react'

export function SignoutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        signOut({ callbackUrl: '/signin' })
      }}>
      로그아웃
    </button>
  )
}
```

## 12. NavUser 컴포넌트

```tsx
// features/auth/components/nav-user.tsx
import Link from 'next/link'
import type { Session } from 'next-auth'
import { SignoutButton } from './signout-button'

type NavUserProps = {
  user?: Session['user'] | null
}

export function NavUser({ user }: NavUserProps) {
  if (!user) {
    return <Link href="/signin">로그인</Link>
  }

  return (
    <div className="flex items-center gap-2">
      {user.image ? <img src={user.image} alt="" className="size-8 rounded-full" /> : null}
      <div>
        <p className="font-medium">{user.name ?? '사용자'}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <SignoutButton />
    </div>
  )
}
```

## 13. 서버 Layout에서 session 전달

```tsx
// app/(default-layout)/layout.tsx
import { auth } from '@/auth'
import { NavUser } from '@/features/auth/components/nav-user'

export default async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div>
      <header>
        <NavUser user={session?.user} />
      </header>
      <main>{children}</main>
    </div>
  )
}
```

이 방식은 Header 전체를 Client Component로 만들 필요가 없다는 장점이 있습니다.

## 14. 보호 페이지

```tsx
// app/(default-layout)/(main)/my/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function MyPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/signin')
  }

  return (
    <div className="space-y-2">
      <h1>마이페이지</h1>
      <p>{session.user.name}</p>
      <p>{session.user.email}</p>
    </div>
  )
}
```

## 15. middleware 보호 라우트

```ts
// middleware.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/my', '/dashboard', '/snack/new']

export default auth(request => {
  const { nextUrl, auth: session } = request
  const isProtectedRoute = protectedRoutes.some(path => nextUrl.pathname.startsWith(path))

  if (isProtectedRoute && !session?.user) {
    const signInUrl = new URL('/signin', nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

## 16. 내 정보 조회 Query

```ts
// features/auth/repositories/user.repository.ts
import { api } from '@/shared/lib/axios/api'

export type CurrentUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: 'USER' | 'ADMIN'
}

export const userRepository = {
  me: async () => {
    const res = await api.get<CurrentUser>('/users/me')
    return res.data
  }
}
```

```ts
// features/auth/queries/user.query.ts
import { queryOptions } from '@tanstack/react-query'
import { userRepository } from '../repositories/user.repository'

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const
}

export const meQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: userRepository.me
  })
```

## 17. 프로필 수정 Mutation

```ts
// features/auth/hooks/user.hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userKeys } from '../queries/user.query'
import { profileSchema, type ProfileInput } from '../schemas/profile.schema'
import { api } from '@/shared/lib/axios/api'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ProfileInput) => {
      const parsed = profileSchema.parse(input)
      const res = await api.put('/users/me', parsed)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.success('프로필이 수정되었습니다.')
    },
    onError: () => {
      toast.error('프로필 수정에 실패했습니다.')
    }
  })
}
```

## 18. `/api/users/me` Route Handler

```ts
// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { profileSchema } from '@/features/auth/schemas/profile.schema'
import { userService } from '@/features/auth/services/user.service'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await userService.findById(session.user.id)
  return NextResponse.json(user)
}

export async function PUT(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const input = profileSchema.parse(body)

  const user = await userService.updateProfile(session.user.id, input)
  return NextResponse.json(user)
}
```

## 19. 권한 체크 유틸

```ts
// features/auth/services/auth-guard.ts
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function requireUser() {
  const session = await auth()

  if (!session?.user) {
    redirect('/signin')
  }

  return session.user
}

export async function requireAdmin() {
  const user = await requireUser()

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  return user
}
```

## 20. 회원 기능 체크리스트

| 체크 항목 | 기준 |
| :--- | :--- |
| 로그인 실패 메시지 | 이메일 존재 여부를 직접 노출하지 않음 |
| 비밀번호 저장 | hash만 저장 |
| 서버 검증 | 모든 action/route handler에서 Zod 재검증 |
| 마이페이지 수정 | session user id 기준으로 처리 |
| 보호 페이지 | page/layout guard 또는 middleware 적용 |
| 권한 제어 | UI 숨김 + 서버 검사 모두 적용 |
| session type | `Session['user']` 확장 타입 정리 |
| 로그아웃 | `signOut` 후 적절한 callbackUrl 적용 |
| secret | 운영 환경에서 필수 설정 |

## 21. 실무 적용 주의점

- Credentials 로그인은 직접 보안 책임이 커집니다. 비밀번호 hash, 실패 횟수 제한, 이메일 인증, rate limit을 별도로 검토해야 합니다.
- OAuth와 Credentials를 함께 쓰면 같은 이메일의 계정 연결 정책을 명확히 해야 합니다.
- middleware는 빠른 접근 차단에 유용하지만, 실제 데이터 변경 API에서도 반드시 세션/권한 검사를 반복해야 합니다.
- session에 너무 많은 사용자 정보를 넣지 말고, 자주 바뀌는 상세 정보는 `/users/me` 조회로 분리하는 것이 좋습니다.
- Client Component에서는 인증 여부를 UX 표시용으로만 사용하고, 보안 판단은 서버에서 처리해야 합니다.


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
