# 프로젝트 아키텍처 및 로드맵 정리 (2026-05-08 기준) - gemini-3-flash

이 문서는 2026년 5월 6일 설계된 초기 목표와 현재 구현된 프로젝트 구성을 비교하여, **현재의 아키텍처 표준과 향후 개발 방향성**을 한눈에 파악하기 위해 정리된 가이드입니다.

- `README (Swagger).md`의 **[로드맵 → 한눈에 보기 → 스니펫]** 형식을 차용했습니다.
- **아키텍처 리뷰(Refined)**에서 제안된 레이어 책임을 실제 코드로 어떻게 실현했는지 중점적으로 다룹니다.

---

## 로드맵(3단 구성): Entry(Hydration) → Logic(Feature) → Data(Repository)

1. **(Entry) Server-side Hydration & Prefetch**
   - `page.tsx`(Server Component)에서 `prefetch/` 로직을 통해 초기 데이터를 획득합니다.
   - `HydrationBoundary`를 사용하여 클라이언트 컴포넌트에 데이터를 안전하게 전달합니다.

2. **(Logic) Feature-based Logic & Query Factory**
   - `queries/`에서 **Query Key Factory**를 통해 캐시 키 충돌을 방지하고 계층적으로 관리합니다.
   - `hooks/`에서 React Query의 `useQuery`와 `useMutation`을 통해 클라이언트 UI와 동기화합니다.

3. **(Data) Orchestrated Service & Polyglot Repository**
   - `services/`에서 비즈니스 정합성(Zod validation) 및 정책 처리를 담당합니다.
   - `repositories/`에서 Prisma(DB)와 Axios(API) 구현체를 교체 가능하게 구성합니다.

---

## 한눈에 보기: 폴더 트리(주석 포함)

```text
📦frontend/features/snack
┣ 📂actions/
┃ ┗ 📜snack.action.ts          # Server Actions (Mutation 진입점, Service 호출)
┃
┣ 📂hooks/
┃ ┗ 📜useSnack.ts              # UI 바인딩용 Custom Hooks (React Query)
┃
┣ 📂prefetch/
┃ ┗ 📜snack.prefetch.ts        # Server Component용 초기 데이터 프리페치 로직
┃
┣ 📂queries/
┃ ┗ 📜snack.query.ts           # Query Key Factory + Query Options (공통 캐시 설정)
┃
┣ 📂repositories/              # 데이터 소스 접근 추상화
┃ ┣ 📜snack.json.repository.ts  # JSON Server / REST API 연동
┃ ┣ 📜snack.prisma.repository..ts # Prisma / Local DB 연동 (⚠️파일명 오타: ..ts)
┃ ┗ 📂dummy/
┃   ┗ 📜snack.repository.ts     # 개발용 목업 데이터
┃
┣ 📂services/
┃ ┗ 📜snack.service.ts         # 비즈니스 로직(검증/가공) 및 Repository 조립
┃
┣ 📂schema/
┃ ┗ 📜snack.schema.ts          # Zod 기반 스키마 (런타임 검증 + 타입 추론)
┃
┗ 📂types/
  ┗ 📜snack.type.ts            # API 규격 및 도메인 인터페이스
```

---

## 스니펫(안내가 가능한 정도의 요약 코드)

### Entry: Prefetching Logic

서버에서 데이터를 미리 로드하여 클라이언트 사이드 로딩 시간을 최소화합니다.

```ts
// snack.prefetch.ts
export const prefetchSnackPage = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery(snackListQueryOptions)
}
```

### Logic: Query Key Factory

중복되지 않는 유일한 캐시 키를 생성하고 관리합니다.

```ts
// snack.query.ts
export const snackKeys = {
  all: ['snack'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (filters: string) => [...snackKeys.lists(), { filters }] as const
}
```

### Data: Service & Repository Selection

비즈니스 로직과 물리적 데이터 저장소의 연결을 유연하게 처리합니다.

```ts
// snack.service.ts
import { snackRepository } from '../repositories/snack.json.repository'

export const getSnackList = async (params: any) => {
  // 1. Zod 검증 (TODO)
  // 2. Repository 호출
  return await snackRepository.findAll(params)
}
```

---

## 상세 설명 및 보완 포인트

### 1. 설계 의도와 구현 성숙도

- **진화된 포인트**: 단순히 `fetch`를 사용하던 초기 방식에서 `nuqs`를 통한 타입 안전한 쿼리 스트링 관리와 `prefetch` 레이어 도입으로 SSR 완성도가 높아졌습니다.
- **분리 전략**: `actions`(CUD)와 `queries`(Read)를 명확히 분리하여 Next.js의 캐싱 및 재검증(`revalidatePath`) 효과를 극대화했습니다.

### 2. 구체적인 보완 사항 (Checkpoints)

- **API 계약 계층화**: 현재는 `types/`에 단순 선언되어 있으나, 백엔드와 공유 가능한 `contract/` 구조로 발전시켜야 합니다.
- **에러 처리 표준화**: `shared/errors`를 정의하여 API 에러, 유효성 에러 등을 UI(`toast`)와 연동하는 로직이 추가되어야 합니다.
- **파일명 컨벤션**: `snack.prisma.repository..ts`와 같은 파일명 오타는 휴먼 에러를 유발하므로 즉시 수정이 필요합니다.

### 3. 향후 확장 전략

- **인증(Auth)**: `shared/lib/auth`를 통해 JWT/Middleware 기반의 보호된 라우팅 구현.
- **상태 관리**: 복잡한 UI 상태(멀티 스텝 폼 등)는 `Zustand`로, 서버 데이터는 `React Query`로 이원화.
- **테스트**: `Vitest`와 `MSW`를 사용하여 Repository 레이어부터 단위 테스트 적용.
