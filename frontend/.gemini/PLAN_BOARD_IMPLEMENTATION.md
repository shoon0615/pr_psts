# 📋 게시판(Board) 프로젝트 구현 상세 계획

## 🏗 최종 파일 및 레이어 구조 (Final Project Structure)

```text
📦frontend
 ┣ 📂actions
 ┃ ┗ 📜board.actions.ts         <-- Entry: Server Actions (입구)
 ┣ 📂app
 ┃ ┣ 📂(default-layout)
 ┃ ┃ ┣ 📂(main)
 ┃ ┃ ┃ ┗ 📂board
 ┃ ┃ ┃   ┣ 📂_components        <-- UI: 게시판 내부 컴포넌트
 ┃ ┃ ┃   ┗ 📜page.tsx           <-- Page: 게시판 리스트 뷰
 ┃ ┃ ┗ 📜layout.tsx             <-- Layout: 기본 레이아웃
 ┃ ┗ 📂api
 ┃   ┗ 📂board
 ┃     ┗ 📜route.ts             <-- Entry: 데이터 조회 API
 ┣ 📂components
 ┃ ┣ 📂providers
 ┃ ┃ ┗ 📜query-provider.tsx     <-- Config: React Query 설정
 ┃ ┗ 📂board
 ┃   ┗ 📜board-form.tsx         <-- UI: React-Hook-Form + Zod
 ┣ 📂hooks
 ┃ ┗ 📜use-board-query.ts       <-- State: React Query 커스텀 훅
 ┣ 📂lib
 ┃ ┣ 📂services
 ┃ ┃ ┗ 📜board.service.ts       <-- Logic: 핵심 비즈니스 로직 (Core)
 ┃ ┣ 📂validations
 ┃ ┃ ┗ 📜board.ts               <-- Schema: 데이터 검증 스키마
 ┃ ┗ 📜utils.ts
 ┗ 📂types
   ┗ 📜board.ts                 <-- Types: 인터페이스 정의
```

본 문서는 게시판 기능을 구현하기 위한 아키텍처 설계와 파일 구조를 정의합니다. Server Actions를 입구로 사용하고 실제 로직은 별도 서비스 레이어에서 처리하는 구조를 지향합니다.

## 1. 프로젝트 요약 및 단계

| 단계  | 레이어           | 주요 파일 및 경로                                                                 | 목적                                                    |
| :---- | :--------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **1** | **UI & Route**   | `app/(default-layout)/layout.tsx`<br>`app/(default-layout)/(main)/board/page.tsx` | 전체 레이아웃 및 게시판 리스트 페이지 구성              |
| **2** | **Types & Lib**  | `types/board.ts`<br>`lib/services/board.service.ts`                               | 인터페이스 정의 및 실제 데이터 처리 로직(Service Layer) |
| **3** | **Data Entry**   | `actions/board.actions.ts`<br>`app/api/board/route.ts`                            | Server Actions(CUD/R) 및 필요시 API Route(R) 구현       |
| **4** | **Validation**   | `lib/validations/board.ts`                                                        | Zod를 이용한 클라이언트/서버 데이터 검증                |
| **5** | **State & Form** | `lib/react-query/provider.tsx`<br>`components/board/board-form.tsx`               | React Query(상태 관리) 및 React-Hook-Form 적용          |

---

## 2. 권장 레이어 구조 및 역할

### 🛠 1. 서비스 레이어 (Service Layer)

- **파일:** `lib/services/board.service.ts`
- **역할:** DB 접근(Prisma 등) 또는 외부 API와의 통신을 담당하는 순수 로직입니다. Server Action과 API Route 양쪽에서 import 하여 사용합니다.

### 🚀 2. 서버 액션 (Server Actions)

- **파일:** `actions/board.actions.ts`
- **역할:** 클라이언트 컴포넌트에서 직접 호출하는 "입구"입니다. 유저 권한 체크, 요청 데이터 파싱 후 `board.service.ts`의 함수를 호출합니다.

### 🌐 3. API 라우트 (API Routes)

- **파일:** `app/api/board/route.ts`
- **역할:** 클라이언트 사이드에서 `fetch` 또는 `React Query`를 통해 데이터를 "조회"할 때 사용합니다.

### 📝 4. 검증 및 타입 (Validation & Types)

- **파일:** `types/board.ts`, `lib/validations/board.ts`
- **역할:** TypeScript 인터페이스와 Zod 스키마를 정의하여 데이터 흐름의 안전성을 보장합니다.

---

## 3. 만들어야 할 파일 리스트

### [UI / Layout]

- `app/(default-layout)/layout.tsx`: 전역 레이아웃 (헤더, 푸터 포함)
- `app/(default-layout)/(main)/board/page.tsx`: 게시판 메인 리스트 페이지
- `app/(default-layout)/(main)/board/[id]/page.tsx`: 게시글 상세 페이지

### [Core Logic]

- `types/board.ts`: 게시판 관련 TS 타입 정의
- `lib/services/board.service.ts`: 게시판 CRUD 핵심 로직 함수
- `lib/validations/board.ts`: Zod 기반 게시판 데이터 검증 스키마

### [Server Interaction]

- `actions/board.actions.ts`: Create/Update/Delete 처리를 위한 입구
- `app/api/board/route.ts`: 데이터 조회를 위한 엔드포인트 (선택 사항)

### [Client State Management]

- `components/providers/query-provider.tsx`: React Query 설정
- `hooks/use-board-query.ts`: 게시판 데이터 페칭을 위한 커스텀 훅
- `components/board/board-form.tsx`: React-Hook-Form + Zod가 적용된 글쓰기 컴포넌트

---

## 4. 향후 로드맵

1. **Zod & React-Hook-Form 연동**: 클라이언트 폼 유효성 검사 강화
2. **React Query 적용**: 데이터 캐싱 및 낙관적 업데이트(Optimistic Updates) 구현
3. **RTK (선택 사항)**: 전역 상태(유저 설정, 알림 등)가 필요한 경우 추가
