# NextAuth 기준 회원가입 / 회원 정보 구성 정리

## 1. 핵심 결론

NextAuth/Auth.js에서 `session.user`는 보통 **브라우저에 내려줘도 되는 최소 사용자 정보**만 포함한다.

```ts
export interface DefaultUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}
```

즉, `DefaultUser`는 “회원 테이블 전체 구조”가 아니라 **세션에 노출할 사용자 요약 정보**에 가깝다.

회원가입에서는 일반적으로 다음 정보를 따로 다룬다.

- 로그인 식별자: `email` 또는 `username`
- 비밀번호: `password`
- 기본 프로필: `name`, `image`
- 추가 개인정보: `birthDate`, `phone`, `address`
- 권한/상태: `role`, `status`
- 관리용 필드: `createdAt`, `updatedAt`, `deletedAt`

중요한 점은 **password, address, phone, birthDate 같은 민감하거나 불필요한 정보는 session.user에 넣지 않는 것**이다.

---

## 2. 일반적인 데이터 분리

회원가입/인증 구조는 보통 아래처럼 나눈다.

```txt
회원가입 Form
  ↓
Zod 검증
  ↓
Server Action 또는 Route Handler
  ↓
password hash 처리
  ↓
DB User 생성
  ↓
로그인 시 Credentials Provider 검증
  ↓
JWT / Session callback에서 최소 정보만 session.user로 반환
```

---

## 3. DB User 모델 예시

Prisma 기준 예시다.

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String

  name         String
  image        String?

  birthDate    DateTime?
  phone        String?
  address      String?
  addressDetail String?
  zipCode      String?

  role         UserRole  @default(USER)
  status       UserStatus @default(ACTIVE)

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  deletedAt    DateTime?
}

enum UserRole {
  USER
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  WITHDRAWN
}
```

### 포인트

`password` 원문은 저장하지 않는다.

DB에는 보통 `passwordHash`만 저장한다.

```txt
입력 password → bcrypt/argon2 hash → passwordHash 저장
```

세션에는 `passwordHash`도 절대 넣지 않는다.

---

## 4. 회원가입 Form 타입 예시

프론트엔드 Form에서는 `password`, `passwordConfirm`이 필요하다.

```ts
export type SignupFormValues = {
  name: string
  email: string
  password: string
  passwordConfirm: string
  birthDate?: Date
  phone?: string
  zipCode?: string
  address?: string
  addressDetail?: string
}
```

이 타입은 **회원가입 화면 전용 타입**이다.

DB User 타입이나 Session User 타입과 같게 만들면 안 된다.

---

## 5. Zod 회원가입 스키마 예시

```ts
import { z } from 'zod'

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, '이름은 2자 이상 입력해주세요.')
      .max(30, '이름은 30자까지만 입력해주세요.'),

    email: z.string().email('올바른 이메일을 입력해주세요.'),

    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(100, '비밀번호가 너무 깁니다.'),

    passwordConfirm: z.string().min(8, '비밀번호 확인을 입력해주세요.'),

    birthDate: z.coerce.date().optional(),

    phone: z.string().optional(),

    zipCode: z.string().optional(),
    address: z.string().optional(),
    addressDetail: z.string().optional()
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  })

export type SignupInput = z.infer<typeof signupSchema>
```

---

## 6. 회원가입 요청 DTO 예시

서버로 넘길 때는 보통 Form 타입 그대로 넘기지 않고, 서버에서 필요한 형태로 정리한다.

```ts
export type CreateUserInput = {
  name: string
  email: string
  password: string
  birthDate?: Date
  phone?: string
  zipCode?: string
  address?: string
  addressDetail?: string
}
```

`passwordConfirm`은 검증용이므로 DB 저장 대상이 아니다.

---

## 7. Server Action 예시

```ts
'use server'

import bcrypt from 'bcryptjs'
import { signupSchema } from './signup.schema'
import { prisma } from '@/shared/lib/prisma'

export async function signupAction(formData: FormData) {
  const rawValues = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm'),
    birthDate: formData.get('birthDate') || undefined,
    phone: formData.get('phone') || undefined,
    zipCode: formData.get('zipCode') || undefined,
    address: formData.get('address') || undefined,
    addressDetail: formData.get('addressDetail') || undefined
  }

  const parsed = signupSchema.safeParse(rawValues)

  if (!parsed.success) {
    return {
      ok: false,
      message: '입력값을 확인해주세요.',
      errors: parsed.error.flatten().fieldErrors
    }
  }

  const values = parsed.data

  const exists = await prisma.user.findUnique({
    where: { email: values.email }
  })

  if (exists) {
    return {
      ok: false,
      message: '이미 가입된 이메일입니다.'
    }
  }

  const passwordHash = await bcrypt.hash(values.password, 12)

  await prisma.user.create({
    data: {
      name: values.name,
      email: values.email,
      passwordHash,
      birthDate: values.birthDate,
      phone: values.phone,
      zipCode: values.zipCode,
      address: values.address,
      addressDetail: values.addressDetail
    }
  })

  return {
    ok: true,
    message: '회원가입이 완료되었습니다.'
  }
}
```

---

## 8. NextAuth Credentials 로그인 예시

회원가입 때 저장한 `passwordHash`를 로그인 시 검증한다.

```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/shared/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
        const password = String(credentials?.password ?? '')

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) return null
        if (user.status !== 'ACTIVE') return null

        const isValidPassword = await bcrypt.compare(
          password,
          user.passwordHash
        )

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
        session.user.role = token.role as 'USER' | 'ADMIN'
      }

      return session
    }
  }
})
```

---

## 9. NextAuth 타입 확장 예시

`DefaultUser`에 없는 `id`, `role` 등을 session에서 사용하려면 타입 확장이 필요하다.

```ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    role: 'USER' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'USER' | 'ADMIN'
  }
}
```

실제 파일은 보통 아래처럼 둔다.

```txt
src/types/next-auth.d.ts
```

또는 프로젝트 설정에 따라:

```txt
types/next-auth.d.ts
```

---

## 10. Session에 넣는 정보와 넣지 않는 정보

### 보통 넣는 정보

```ts
session.user = {
  id: 'user_id',
  name: '홍길동',
  email: 'test@example.com',
  image: null,
  role: 'USER'
}
```

### 보통 넣지 않는 정보

```ts
password
passwordHash
phone
address
addressDetail
zipCode
birthDate
residentNumber
accessToken
refreshToken
```

정확히 말하면 `birthDate`, `phone`, `address`를 기술적으로 넣을 수는 있다.

하지만 일반적인 구조에서는 넣지 않는 편이 낫다.

이유는 다음과 같다.

- 클라이언트에 노출될 필요가 없음
- 세션/JWT 크기가 커짐
- 개인정보 노출 위험 증가
- 변경 가능성이 있는 정보는 DB에서 최신 조회하는 편이 안전함

---

## 11. 마이페이지 정보 조회 구조

마이페이지에서는 session의 `id`만 사용해서 서버에서 다시 조회하는 방식이 일반적이다.

```txt
Client / Server Component
  ↓
auth()로 session 확인
  ↓
session.user.id 추출
  ↓
DB에서 User 상세 조회
  ↓
마이페이지에 필요한 정보만 반환
```

예시:

```ts
import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

export async function getMyProfile() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      birthDate: true,
      phone: true,
      zipCode: true,
      address: true,
      addressDetail: true,
      role: true,
      createdAt: true
    }
  })

  return user
}
```

---

## 12. 권장 폴더 구조 예시

```txt
src/
  app/
    (auth)/
      signin/
        page.tsx
      signup/
        page.tsx
    (default-layout)/
      mypage/
        page.tsx

  features/
    auth/
      actions/
        signup.action.ts
      schemas/
        signup.schema.ts
        signin.schema.ts
      components/
        signup-form.tsx
        signin-form.tsx
      types/
        auth.type.ts

    user/
      services/
        user.service.ts
      types/
        user.type.ts

  shared/
    lib/
      auth.ts
      prisma.ts

  types/
    next-auth.d.ts
```

---

## 13. 타입을 나누는 기준

### 1) DB User

DB에 저장되는 전체 회원 정보.

```ts
User
```

예: Prisma가 생성하는 `User` 타입.

---

### 2) SignupInput

회원가입 화면에서 입력받는 값.

```ts
SignupInput
```

`passwordConfirm`이 포함될 수 있다.

---

### 3) AuthUser

로그인 성공 후 NextAuth `authorize()`에서 반환하는 최소 사용자 정보.

```ts
export type AuthUser = {
  id: string
  name: string
  email: string
  image?: string | null
  role: 'USER' | 'ADMIN'
}
```

---

### 4) SessionUser

브라우저에서 `useSession()` 또는 `auth()`를 통해 접근하는 사용자 정보.

```ts
export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: 'USER' | 'ADMIN'
}
```

---

### 5) MyProfile

마이페이지에서 보여줄 상세 사용자 정보.

```ts
export type MyProfile = {
  id: string
  name: string
  email: string
  image?: string | null
  birthDate?: Date | null
  phone?: string | null
  zipCode?: string | null
  address?: string | null
  addressDetail?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
}
```

---

## 14. 전체 흐름 요약

```txt
[회원가입]
SignupForm
  → signupSchema 검증
  → signupAction
  → password hash
  → User 생성

[로그인]
SigninForm
  → signIn('credentials')
  → authorize()
  → email로 user 조회
  → passwordHash 비교
  → AuthUser 반환
  → jwt callback
  → session callback
  → session.user에 최소 정보 저장

[마이페이지]
auth()
  → session.user.id 확인
  → DB에서 User 상세 조회
  → 필요한 개인정보만 화면에 표시
```

---

## 15. 실무 기준 정리

회원가입에서 `id`, `password`, `birthDate`, `address` 등을 입력받는 것은 일반적이다.

하지만 NextAuth의 `DefaultUser`나 `session.user`는 회원가입 전체 정보를 담는 용도가 아니다.

일반적으로는 다음처럼 역할을 분리한다.

| 구분 | 포함 데이터 | 목적 |
|---|---|---|
| Signup Form | password, passwordConfirm, address 등 | 회원가입 입력 |
| DB User | passwordHash, address, birthDate 등 | 회원 원본 저장 |
| Auth User | id, email, name, role | 로그인 인증 결과 |
| Session User | id, email, name, image, role | 클라이언트에서 사용하는 최소 정보 |
| MyProfile | address, birthDate, phone 등 | 마이페이지 상세 조회 |

가장 중요한 기준은 다음이다.

```txt
세션에는 “인증/인가에 필요한 최소 정보”만 넣고,
상세 개인정보는 필요할 때 DB에서 다시 조회한다.
```
