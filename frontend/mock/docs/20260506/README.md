# 프로젝트 구성 및 로드맵 분석 보고서

이 문서는 `mock/docs/README2.md`에 기술된 로드맵과 현재 프로젝트의 실제 구현 상태를 대조하고, `README (Swagger).md`의 구성 방식을 참조하여 보완 및 수정이 필요한 사항을 정리한 분석 보고서입니다.

---

## 1. 프로젝트 현황 대조 및 수정 필요 사항

### 1.1 파일 구조 및 경로 불일치
- **API Route 부재**: 로드맵에서는 `api(route.ts) || actions`를 언급하고 있으나, 실제 `app/api/snack/route.ts` 파일은 존재하지 않습니다. (현재 `notice`, `product`만 존재)
- **컴포넌트 누락**: [입력] 섹션에서 언급된 `form.tsx`가 `snack/_components` 또는 `snack/new` 경로에 존재하지 않습니다.
- **폴더 트리 갱신**: `README2.md`에 작성된 트리 구조와 실제 물리적 구조가 일치하지 않는 부분이 있어 최신화가 필요합니다.

### 1.2 기술적 의사결정 보완 (TODO 구체화)
- **Server Actions vs API Route**: 현재 `snack.action.ts`가 구현되어 있으나, fetch를 한 번 더 거쳐 API Route를 호출할지, 혹은 Action에서 직접 Service를 호출할지에 대한 기준이 모호합니다. (Next.js 권장 사항은 직접 호출 또는 Action 활용)
- **Repository 전략**: `snack.repository.ts`에 Prisma(DB)와 Axios(API) 코드가 혼재되어 있습니다. Mock 데이터를 사용하는 현재 단계와 실제 DB를 연결하는 단계의 전환 전략이 필요합니다.
- **Hydration 적용**: `dehydrate` 또는 `ReactQueryStreamedHydration` 적용 여부가 TODO로 남아있어, 서버 사이드 렌더링 성능 최적화를 위한 구체적 가이드가 필요합니다.

---

## 2. 보완된 로드맵 (Swagger 문서 스타일 적용)

### 로드맵(3단 구성): UI(app) → Feature(logic) → Shared(common)

1. **(UI) Page & Components**
   - 클라이언트 접속 및 레이아웃 처리. `list.tsx`, `form.tsx` 등의 단위 컴포넌트로 기능 분리.

2. **(Feature) Snack Logic Layer**
   - `Action`: UI와 서버 로직의 통로 (Server Actions 중심)
   - `Hook`: React Query를 통한 캐싱 및 데이터 관리 (`useSnack`)
   - `Service`: 비즈니스 로직 및 정합성 검증 (`snack.service.ts`)
   - `Schema`: Zod 기반의 데이터 유효성 검사 및 타입 정의 (`snack.schema.ts`)

3. **(Shared) Infrastructure**
   - `Repository`: 데이터 소스(Prisma/Axios) 접근 추상화.
   - `Lib`: 전역 설정 (React-Query, Axios instance).

---

## 3. 핵심 폴더 트리 (현행화 및 제안)

```text
📦frontend
 ┣ 📂app
 ┃ ┣ 📂api
 ┃ ┃ ┗ 📂snack (⚠️ 생성 필요)       # 외부 연동 또는 특정 요구사항 있을 시
 ┃ ┣ 📂(default-layout)/(main)
 ┃ ┃ ┗ 📂snack
 ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┣ 📜list.tsx             # 목록 기능
 ┃ ┃ ┃ ┃ ┣ 📜form.tsx             # ⚠️ 추가 필요 (입력/수정 공용)
 ┃ ┃ ┃ ┃ ┗ 📜loader.tsx           # 스켈레톤/로딩 UI
 ┃ ┃ ┃ ┣ 📂new/📜page.tsx          # 등록 페이지 (form.tsx 활용)
 ┃ ┃ ┃ ┗ 📂[id]/edit/📜page.tsx    # 수정 페이지 (form.tsx 활용)
 ┣ 📂features
 ┃ ┗ 📂snack
 ┃ ┃ ┣ 📂actions/📜snack.action.ts  # Server Actions (Service 호출)
 ┃ ┃ ┣ 📂hooks/📜useSnack.ts        # React Query (useQuery/useMutation)
 ┃ ┃ ┣ 📂services/📜snack.service.ts # 비즈니스 로직 및 가공
 ┃ ┃ ┣ 📂schema/📜snack.schema.ts   # Zod Schema & Types
 ┃ ┃ ┗ 📂repositories/📜snack.repository.ts # 데이터 소스 접근
 ┣ 📂shared
 ┃ ┣ 📂lib/📜react-query.ts         # QueryClient 설정 및 Hydration 유틸
```

---

## 4. 상세 개선 포인트

### 4.1 서비스 계층의 역할 강화
현재 `snack.service.ts`는 Repository의 단순 래퍼(Wrapper) 역할만 수행 중입니다.
- **수정 제안**: Service에서 Zod를 이용한 `safeParse` 검증을 수행하고, 결과에 따른 비즈니스 에러 처리를 담당하도록 개선해야 합니다.

### 4.2 React Query Hydration 가이드
`README2.md`의 TODO를 해결하기 위해 다음과 같은 구조를 권장합니다.
- `page.tsx` (Server Component)에서 `prefetchQuery` 수행
- `HydrationBoundary`로 감싸서 `list.tsx` (Client Component)에 데이터 전달

### 4.3 Form 컴포넌트 구조화
- `form-rhf-demo.md`의 방식을 채택하여 `react-hook-form` + `zod` + `shadcn/ui` 기반의 공용 폼 컴포넌트(`snack/_components/form.tsx`)를 구축하는 것이 유지보수에 유리합니다.

---

## 5. 공통 체크포인트 (운영/품질 관점)

1. **에러 핸들링**: Server Action 결과에 따른 Toast 메시지 처리 표준화 (success/error).
2. **정합성 검증**: 클라이언트(Zod)와 서버(Service) 양측에서의 검증 로직 동기화.
3. **데이터 캐싱**: `revalidatePath` 또는 `revalidateTag`를 통한 Mutation 후 데이터 갱신 전략.
4. **환경 변수**: `snack.repository.ts`의 `apiUrl` 등을 `.env` 기반으로 관리하여 환경별 대응.
