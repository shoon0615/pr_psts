# State Management & Data Fetching

데이터 흐름 및 서버 상태 관리 전략입니다.

## Data Fetching
- **Axios**: API 통신을 위한 기본 클라이언트로 사용합니다. (`shared/lib/axios/` 설정 참조)
- **TanStack Query (v5)**: 
  - 서버 상태(Server State) 관리, 캐싱, 동기화를 담당합니다.
  - `shared/lib/react-query.ts` 에서 전역 설정을 관리합니다.
  - `@tanstack/react-query-next-experimental`를 통해 Next.js와의 통합을 지원합니다.

## State Management
- **nuqs**: URL Query String을 진실의 원천(Single Source of Truth)으로 사용하는 상태 관리 방식을 선호합니다.
- **React Context**: 필요한 경우 `(default-layout)/provider.tsx` 등에서 전역 컨텍스트를 제공합니다.

## Forms
- **React Hook Form**: 클라이언트 측 폼 상태 관리 및 유효성 검사를 수행합니다.
- **Zod (기본 연동)**: 스키마 기반 유효성 검사를 권장합니다. (`features/*/schema/` 참조)
