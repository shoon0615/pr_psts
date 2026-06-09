# 프로젝트 구성 및 로드맵 요약 (2026-05-08 기준) - gemini-3.1-flash

이 문서는 2026년 5월 6일 작성된 초기 로드맵과 아키텍처 리뷰를 바탕으로, 현재 프로젝트(특히 `Snack` 피처)의 **구체적인 구현 현황과 개선된 아키텍처**를 한눈에 파악하기 위해 정리된 보고서입니다.

- `@mock/docs/20260506/README (Swagger).md`의 구성 방식을 참조하여 작성되었습니다.
- **구성/의도/체크포인트** 중심으로 현재의 성숙도를 진단합니다.

---

## 로드맵(3단 구성): Page(Entry) → Feature(Logic) → Infrastructure(Data)

1. **(Entry) Server-side Prefetching & Hydration**
   - `page.tsx`(Server Component)에서 `prefetch/` 로직을 호출하여 초기 데이터를 채웁니다.
   - `queryOptions`를 공유하여 서버와 클라이언트 간의 쿼리 설정을 일원화합니다.

2. **(Logic) Query Factory & Feature Hooks**
   - `queries/`에서 **Query Key Factory**를 통해 캐시 키를 중앙 관리합니다.
   - `hooks/`에서 React Query를 사용해 클라이언트 상태 및 데이터 동기화를 처리합니다.

3. **(Data) Orchestrated Service & Pluggable Repository**
   - `services/`에서 비즈니스 정책 및 데이터 가공을 담당합니다.
   - `repositories/`에서 Prisma(DB), JSON(API), Dummy 등 다양한 데이터 소스를 추상화하여 제공합니다.

---

## 한번에 보기: 폴더 트리(주석 포함)

```text
📦frontend/features/snack
┣ 📂actions/
┃ ┗ 📜snack.action.ts          # Server Actions (CUD 작업 전담, Service 호출)
┃
┣ 📂hooks/
┃ ┗ 📜useSnack.ts              # React Query 커스텀 훅 (useQuery, useMutation)
┃
┣ 📂prefetch/
┃ ┗ 📜snack.prefetch.ts        # Server-side Hydration을 위한 Prefetch 로직
┃
┣ 📂queries/
┃ ┗ 📜snack.query.ts           # Query Key Factory + Query Options 정의
┃
┣ 📂repositories/              # 데이터 소스별 구현체 분리
┃ ┣ 📜snack.api.repository.ts  # 외부 API / JSON Server 연동
┃ ┣ 📜snack.prisma.repository..ts # Prisma / DB 직접 연동 (⚠️파일명 오타 주의)
┃ ┗ 📂dummy/
┃   ┗ 📜snack.repository.ts     # 개발/테스트용 Mock Repository
┃
┣ 📂services/
┃ ┗ 📜snack.service.ts         # 비즈니스 로직 및 Repository 오케스트레이션
┃
┣ 📂schema/
┃ ┗ 📜snack.schema.ts          # Zod 기반 Runtime Validation 및 Infer Type
┃
┗ 📂types/
  ┗ 📜snack.type.ts            # 도메인 모델 및 API Contract 타입 정의
```

---

## 스니펫(핵심 패턴 요약)

### 1. Query Key Factory (queries/)

문자열 기반 키 관리의 실수를 방지하고 계층 구조를 명확히 합니다.

```ts
export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (filters: any) => [...snackKeys.lists(), { filters }] as const,
  detail: (id: string) => [...snackKeys.all, 'detail', id] as const
}
```

### 2. Prefetch & Hydration (prefetch/)

서버에서 데이터를 미리 가져와 사용자 경험(LCP)을 개선합니다.

```ts
export const prefetchSnackPage = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery(snackListQueryOptions)
}
```

### 3. Repository Switch (services/)

상황에 따라 데이터 소스를 유연하게 변경할 수 있는 구조입니다.

```ts
// snack.service.ts
import { snackRepository } from '../repositories/snack.json.repository'
// import { snackRepository } from "../repositories/snack.prisma.repository";

export const selectAllSnack = async () => {
  return await snackRepository.findAll()
}
```

---

## 상세 구현 현황 및 보완 사항

### 1. 주요 개선 사항 (2026-05-06 대비)

- **성능 최적화**: `prefetch/` 레이어를 추가하여 Server-side Rendering 시 데이터 유실 없는 Hydration을 구현했습니다.
- **유지보수성**: `queries/` 폴더를 분리하고 `Query Key Factory`를 도입하여 대규모 프로젝트 대응이 가능해졌습니다.
- **유연성**: Repository 패턴을 명확히 분리하여 Prisma(DB)와 JSON(API) 간의 전환이 코드 한 줄로 가능해졌습니다.
- **검색 고도화**: `nuqs`를 도입하여 URL 쿼리 파라미터와 React 상태를 타입 안전하게 동기화합니다.

### 2. 구체적인 보완 필요 사항 (Checkpoints)

- **API Contract 레이어**: 프론트와 백엔드 간의 공통 응답 규격(`{ success, data, message }`)을 정의할 `contract/` 레이어의 실질적 도입이 필요합니다.
- **Service 레이어 내실화**: 현재 Service가 단순 Repository 래퍼 수준입니다. Zod를 활용한 `safeParse` 검증 및 비즈니스 정책(권한 체크 등) 코드를 보완해야 합니다.
- **Error Handling 표준화**: `shared/errors`를 활용한 전역 에러 처리 및 Toast 연동 로직을 구체화해야 합니다.
- **파일명 정리**: `snack.prisma.repository..ts`와 같은 파일명 오타 수정이 필요합니다.

### 3. 향후 확장 로드맵

- [ ] **Auth 통합**: JWT/Session 기반의 인증 로직을 `shared/lib/auth`에 구현.
- [ ] **TDD 도입**: Vitest + MSW를 사용하여 Repository 및 Service 단위 테스트 작성.
- [ ] **Zustand 활용**: 모달, 사이드바 등 순수 UI 상태 관리를 위한 전역 스토어 구축.
