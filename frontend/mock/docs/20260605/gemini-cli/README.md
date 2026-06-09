# 프로젝트 가이드 및 기술 표준 (2026-06-05)

이 문서는 프로젝트의 전체 구조, 기술 스택, 그리고 주요 구현 패턴을 한눈에 파악하기 위한 통합 가이드입니다. 각 항목의 상세 내용은 하위 문서를 참조해 주세요.

---

## 📑 목차

1.  **[기술 스택 및 설치 (Tech Stack)](#1-기술-스택-및-설치)**
2.  **[아키텍처 및 폴더 구조 (Architecture)](#2-아키텍처-및-폴더-구조)**
3.  **[주요 기능별 구현 패턴 (Key Patterns)](#3-주요-기능별-구현-패턴)**
    *   [서버 상태 관리 (React Query)](#서버-상태-관리-react-query)
    *   [폼 및 검증 (Form & Validation)](#폼-및-검증-form--validation)
    *   [URL 상태 관리 (Search & Filter)](#url-상태-관리-search--filter)
    *   [인증 및 회원 (Auth & Member)](#인증-및-회원-auth--member)
4.  **[UI/UX 가이드라인 (UI & Feedback)](#4-uiux-가이드라인)**
5.  **[테스트 및 배포 (TDD & CI/CD)](#5-테스트-및-배포)**

---

## 🛠 1. 기술 스택 및 설치

프로젝트에서 사용되는 핵심 라이브러리와 초기 설정 방법입니다.

*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, shadcn/ui
*   **State**: React Query (Server), Zustand (Client)
*   **Validation**: Zod
*   **Auth**: Auth.js (NextAuth v5)

👉 **[상세 기술 스택 및 설치 가이드 (tech-stack.md)](./tech-stack.md)**

---

## 🏗 2. 아키텍처 및 폴더 구조

관심사 분리를 위해 **Feature 기반 레이어드 아키텍처**를 채택하고 있습니다.

### 핵심 레이어 구조
*   **Action**: Server Actions (CUD 작업)
*   **Hook**: UI 바인딩 및 React Query 커스텀 훅
*   **Prefetch**: SSR 데이터 프리페치 로직
*   **Query**: Query Key Factory 및 Query Options
*   **Service**: 비즈니스 로직 및 오케스트레이션
*   **Repository**: 데이터 소스 접근 (API/DB)
*   **Schema**: Zod 기반 검증 스키마

👉 **[상세 아키텍처 및 폴더 구조 설명 (architecture.md)](./architecture.md)**

---

## 🚀 3. 주요 기능별 구현 패턴

### 서버 상태 관리 (React Query)
*   Query Key Factory를 통한 중앙 집중식 키 관리
*   Server Component에서의 Prefetching & Hydration
*   `useMutation`을 이용한 낙관적 업데이트 및 캐시 무효화

👉 **[React Query 상세 가이드 (react-query.md)](./react-query.md)**

### 폼 및 검증 (Form & Validation)
*   `React Hook Form`과 `Zod`를 결합한 타입 안전한 폼 구현
*   `Next/Form`을 활용한 검색 최적화 및 Progressive Enhancement
*   공통 폼 컴포넌트 (`FormField`, `FormControl`) 사용 표준

👉 **[Form & Validation 상세 가이드 (forms.md)](./forms.md)**

### URL 상태 관리 (Search & Filter)
*   `nuqs`: URL 쿼리 스트링을 React 상태처럼 관리 (조회/필터/페이징)
*   `qs`: 복잡한 객체/배열의 API 요청 문자열 변환

👉 **[Search & Filter 상세 가이드 (search-filter.md)](./search-filter.md)**

### 인증 및 회원 (Auth & Member)
*   Auth.js 기반 Credentials 및 OAuth 인증
*   Middleware를 활용한 라우트 보호
*   Server Component에서의 세션 조회 (`auth()`) 및 클라이언트 연동

👉 **[인증 및 회원 기능 상세 가이드 (auth-member.md)](./auth-member.md)**

---

## 🎨 4. UI/UX 가이드라인

*   **Feedback**: `sonner` (Toast), `AlertDialog` (중요 확인)
*   **Common Components**: `EmptyState`, `ErrorState`, `CommonTable`, `Pagination`
*   **Patterns**: Loading Skeleton, Radix UI SSR Hydration 대응

👉 **[UI/UX 및 공통 컴포넌트 가이드 (ui-feedback.md)](./ui-feedback.md)**

---

## 🧪 5. 테스트 및 배포

*   **Test**: Vitest (Unit/Integration), Playwright (E2E), MSW (Mocking)
*   **CI/CD**: GitHub Actions, Docker, Vercel

👉 **[테스트 및 배포 프로세스 (dev-ops.md)](./dev-ops.md)**
