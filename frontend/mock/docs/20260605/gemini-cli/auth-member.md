# 인증 및 회원 기능 가이드

이 프로젝트는 `Auth.js (NextAuth.js v5)`를 사용하여 안전한 인증과 세션 관리를 수행합니다.

## 🔐 1. 인증 아키텍처

Next.js App Router의 기능을 최대한 활용하여 서버 중심의 인증 처리를 지향합니다.

*   **인증 라이브러리**: `Auth.js` (NextAuth v5 beta)
*   **전략**: JWT (Stateless) 기반 세션 관리
*   **제공자 (Providers)**:
    *   `Credentials`: 이메일/비밀번호 기반 직접 인증
    *   `OAuth`: Google, GitHub 등 (확장 가능)

---

## 🏗 2. 세션 조회 및 권한 보호

### Server Component에서의 세션 조회
```tsx
import { auth } from '@/shared/lib/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect('/signin');
  }

  return <div>Welcome, {session.user.name}</div>;
}
```

### Middleware를 이용한 라우트 보호 (middleware.ts)
```typescript
import { auth } from "@/shared/lib/auth"

export default auth((req) => {
  const isPrivate = req.nextUrl.pathname.startsWith("/mypage")
  if (isPrivate && !req.auth) {
    const url = req.nextUrl.clone()
    url.pathname = "/signin"
    return Response.redirect(url)
  }
})
```

---

## 📝 3. 회원 기능 구현 패턴

### 회원가입 흐름
1.  **Client**: `SignupForm`에서 입력 및 RHF/Zod 1차 검증
2.  **Server**: `signupAction` (Server Action) 실행
3.  **Server**: `bcryptjs`를 통한 비밀번호 해싱 후 DB 저장
4.  **Server**: 성공 시 로그인 페이지로 redirect

### 로그인 성공 후 처리
로그인 성공 후에는 반드시 `router.refresh()`를 호출하여 서버 컴포넌트(Header 등)의 세션 정보를 갱신해야 합니다.

```tsx
const result = await signIn('credentials', { ...values, redirect: false });
if (result?.ok) {
  router.push('/mypage');
  router.refresh(); // 레이아웃 갱신 핵심
}
```

---

## 🛠 4. 확장된 타입 정의 (next-auth.d.ts)

사용자 ID나 Role 정보를 세션에서 접근하기 위해 타입을 확장합니다.

```typescript
import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN'
    } & DefaultSession["user"]
  }
}
```

---

## ⚠️ 5. 보안 가이드라인

*   **비밀번호**: 절대 평문으로 저장하지 않으며 `bcryptjs` 해싱을 의무화합니다.
*   **세션 정보**: `session.user`에는 민감한 정보(주소, 전화번호 등)를 담지 않고 필요 시 DB에서 재조회합니다.
*   **CSRF**: Auth.js가 제공하는 기본 CSRF 보호 기능을 유지하며, Server Action 사용 시 추가적인 보안 계층을 확보합니다.
