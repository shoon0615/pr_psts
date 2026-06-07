# 기술 스택 및 설치 가이드

이 문서는 프로젝트의 핵심 기술 스택 리스트와 초기 설정 및 라이브러리 추가 방법을 설명합니다.

## 🛠 1. 핵심 기술 스택 (Spec)

| 분류 | 기술 / 라이브러리 | 비고 |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router) | React 19 기반 |
| **Styling** | Tailwind CSS, shadcn/ui | Radix UI 기반 |
| **State (Server)** | @tanstack/react-query | 캐싱, 동기화, SSR Hydration |
| **State (Client)** | Zustand | 전역 모달, 사이드바 상태 등 |
| **Form** | React Hook Form | 비제어 컴포넌트 기반 폼 관리 |
| **Validation** | Zod | 런타임 및 타입 스키마 검증 |
| **URL State** | nuqs, qs | SearchParams 관리 |
| **Auth** | Auth.js (NextAuth.js v5) | 인증 및 세션 관리 |
| **Database** | Prisma (PostgreSQL) | ORM |
| **UI Feedback** | sonner, lucide-react | 알림 및 아이콘 |
| **TDD** | Vitest, MSW, Playwright | 단위/통합/E2E 테스트 |

---

## 📥 2. 설치 명령어

### 프로젝트 초기 생성
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app
```

### 주요 라이브러리 설치
```bash
# 상태 관리 및 통신
npm install @tanstack/react-query @tanstack/react-query-devtools axios zustand

# 폼 및 검증
npm install react-hook-form zod @hookform/resolvers

# URL 파라미터 관리
npm install nuqs qs
npm install -D @types/qs

# 인증 및 보안
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs

# UI 컴포넌트 (shadcn/ui 기본)
npx shadcn@latest init
npx shadcn@latest add button card input select pagination dialog dropdown-menu toast
```

---

## 📂 3. 프로젝트 초기 설정 가이드

### Next.js Config (next.config.ts)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // React Compiler 등 실험적 기능 설정
  }
};

export default nextConfig;
```

### React Query Provider (app/provider.tsx)
```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 환경 변수 (.env.local)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# Auth
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```
