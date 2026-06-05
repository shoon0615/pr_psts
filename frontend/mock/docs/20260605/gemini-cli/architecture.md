# 아키텍처 및 폴더 구조 가이드

이 프로젝트는 관심사 분리(Separation of Concerns)와 유지보수성을 극대화하기 위해 **Feature 기반 레이어드 아키텍처**를 채택하고 있습니다.

## 📂 1. 전체 프로젝트 구조

```text
frontend/
┣ 📂 app/                     # App Router (Routing, Layout, Page)
┃ ┣ 📂 (default-layout)/      # 공통 레이아웃 그룹
┃ ┣ 📂 (main)/                 # 메인 비즈니스 페이지 (snack, notice 등)
┃ ┣ 📂 (public)/               # 인증 미필요 페이지 (signin, signup 등)
┃ ┗ 📂 api/                    # Route Handlers (Internal API)
┃
┣ 📂 features/                # 도메인별 핵심 로직 (캡슐화된 기능 단위)
┃ ┗ 📂 snack/                 # 예: Snack 도메인
┃   ┣ 📂 actions/             # Server Actions (Mutation 로직)
┃   ┣ 📂 components/          # 도메인 전용 컴포넌트
┃   ┣ 📂 hooks/               # 커스텀 훅 (React Query, Domain Logic)
┃   ┣ 📂 prefetch/            # SSR용 데이터 프리페치 함수
┃   ┣ 📂 queries/             # Query Keys & Options 정의
┃   ┣ 📂 repositories/        # 데이터 소스 접근 (API 호출, DB 쿼리)
┃   ┣ 📂 schema/              # Zod 검증 스키마
┃   ┣ 📂 services/            # 비즈니스 로직 및 레이어 오케스트레이션
┃   ┗ 📂 types/               # 도메인 관련 타입 정의
┃
┣ 📂 shared/                  # 공통 인프라 및 UI 컴포넌트
┃ ┣ 📂 components/            # 공통 UI (ui/, custom/)
┃ ┣ 📂 hooks/                 # 공통 유틸리티 훅
┃ ┣ 📂 lib/                   # 라이브러리 설정 (axios, auth, prisma)
┃ ┗ 📂 types/                 # 공통 기본 타입
┃
┗ 📂 mock/                    # 테스트용 데이터 및 문서
```

---

## 🏗 2. 레이어별 역할 및 책임 (Responsibility)

| 레이어 | 책임 | 특징 |
| :--- | :--- | :--- |
| **Page (Entry)** | 라우팅 및 데이터 프리페치 | Server Component 중심, `searchParams` 처리 |
| **Action** | 상태 변경 작업 (CUD) | `'use server'` 선언, `revalidatePath` 처리 |
| **Service** | 비즈니스 정책 및 가공 | 레포지토리 조립, 데이터 변환, 권한 체크 |
| **Repository** | 데이터 소스 추상화 | Axios(API), Prisma(DB), JSON(Mock) 연동 |
| **Hook** | UI와의 상태 바인딩 | `useQuery`, `useMutation` 등을 래핑하여 제공 |
| **Query** | 캐시 설정 관리 | Query Key Factory, `staleTime`, `queryFn` 정의 |
| **Schema** | 데이터 정합성 검증 | Zod를 이용한 런타임 검증 및 타입 추론 |

---

## 🔄 3. 데이터 흐름 (Data Flow)

### 조회 (Read) 흐름
1. **Server**: `page.tsx`에서 `searchParams` 파싱
2. **Server**: `prefetch/` 로직 호출 → `queryClient.prefetchQuery()`
3. **Client**: `HydrationBoundary`를 통해 데이터 전달
4. **Client**: 컴포넌트에서 `useSnackList()` (커스텀 훅) 호출
5. **Client**: 캐시된 데이터 즉시 렌더링 (Hydration)

### 변경 (Create/Update/Delete) 흐름
1. **Client**: UI에서 이벤트 발생 (form submit 등)
2. **Client**: `useMutation`을 래핑한 훅 실행
3. **Client**: `actions/` (Server Action) 호출
4. **Server**: `services/`에서 비즈니스 로직 처리 및 `repositories/` 호출
5. **Server**: DB/API 반영 후 결과 반환
6. **Client**: `onSuccess`에서 `invalidateQueries`로 캐시 무효화 및 UI 갱신

---

## 📝 4. 명명 규칙 (Naming Convention)

*   **파일**: `도메인.역할.ts` (예: `snack.service.ts`, `snack.repository.ts`)
*   **컴포넌트**: PascalCase (예: `SnackList.tsx`)
*   **상수**: UPPER_SNAKE_CASE (예: `SNACK_SORT_OPTIONS`)
*   **타입**: PascalCase (예: `SnackDetailResponse`)
