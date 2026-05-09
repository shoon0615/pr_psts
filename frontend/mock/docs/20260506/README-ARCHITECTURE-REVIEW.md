# Frontend / Swagger Architecture Review

## 문서 목적

현재 작성된:

- Swagger(OpenAPI) 구조
- Frontend(App Router + React Query + RHF + Zod) 구조
- CRUD/문서화 전략
- 계층 분리 방향성

을 기준으로,

- 현재 구조 검토
- 실무 기준 개선 방향
- 아키텍처 보완 포인트
- 역할 책임 정리
- 추후 확장 전략

을 통합적으로 정리한다.

---

# 1. 현재 구조 총평

현재 구조는 단순 학습용 수준을 넘어서:

```text
실무 지향 아키텍처 초안
```

수준까지 충분히 올라와 있다.

특히 아래 요소들은 상당히 좋은 방향이다.

- Feature 기반 구조
- App Router 기준 설계
- React Query 도입
- react-hook-form + zod
- service / repository 분리
- Swagger 문서 DTO 분리
- validation 과 문서 책임 분리
- TDD 고려
- Docs 기반 구조화 시도

다만 현재 단계에서는:

```text
route.ts vs server actions
```

같은 핵심 전략이 아직 혼합되어 있으며,

일부 레이어 책임이 불명확하기 때문에
지금 기준을 정리하지 않으면 이후 유지보수 난이도가 크게 증가할 가능성이 존재한다.

---

# 2. 핵심 방향성 (가장 중요)

---

# 2-1. route.ts 와 server actions 역할 분리 필요

현재 문서에서는 아래 흐름이 혼합되어 있다.

```text
Client
 ├─ route.ts(fetch)
 ├─ server action
 └─ direct service call
```

이 구조를 동시에 메인 전략으로 가져가면:

- 캐싱 전략 충돌
- 타입 흐름 혼란
- 인증 처리 중복
- 에러 처리 중복
- 테스트 포인트 증가
- 유지보수 복잡도 증가

문제가 발생한다.

---

# 권장 구조

## 조회(Read)

```text
Client Component
  ↓
React Query
  ↓
route.ts
  ↓
service
  ↓
repository
```

### 이유

- React Query 캐싱 최적화
- 브라우저 fetch 캐싱 활용
- Swagger 연동 자연스러움
- 외부 API 확장 가능
- 모바일 앱 연동 가능
- API 독립성 확보

---

## 입력/수정/삭제(Mutation)

```text
Client Form
  ↓
server action
  ↓
service
  ↓
repository
```

### 이유

- 타입 안정성
- 서버 실행 보장
- revalidatePath 활용 가능
- redirect 처리 용이
- form 처리 자연스러움
- 보안상 유리

---

# 최종 권장 기준

| 작업 | 추천 방식              |
| ---- | ---------------------- |
| 조회 | route.ts + React Query |
| 생성 | Server Actions         |
| 수정 | Server Actions         |
| 삭제 | Server Actions         |

---

# 3. service 레이어 책임 정리

현재 service 책임 범위가 일부 불명확하다.

---

# service 의 역할

service 는:

```text
비즈니스 로직 계층
```

이다.

---

# service 에서 수행해야 하는 것

```text
- 권한 체크
- 상태 검증
- 데이터 조합
- 트랜잭션
- repository orchestration
- 정책 처리
- 비즈니스 규칙
```

---

# service 에 넣지 말아야 하는 것

```text
❌ toast
❌ loading 상태
❌ router.push
❌ alert
❌ modal 상태
❌ react-hook-form 상태
❌ UI 이벤트
```

---

# 권장 흐름

```text
page.tsx
 └─ 이벤트/UI

form.tsx
 └─ form 상태 관리

action
 └─ 서버 진입점

service
 └─ 비즈니스 로직

repository
 └─ DB/API 접근
```

---

# 4. repository 구조 개선 권장

현재 구조:

```text
repository
 └─ DB(prisma) || BO API(axios)
```

방향 자체는 좋다.

다만:

```text
Prisma
Axios
```

를 하나의 repository 안에 혼합하지 않는 것을 추천한다.

---

# 추천 구조

```text
repositories/
 ├─ snack.prisma.repository.ts
 ├─ snack.api.repository.ts
 └─ snack.mock.repository.ts
```

---

# 이유

각 접근 방식은:

- 에러 처리 방식
- retry 정책
- timeout 정책
- 캐싱 정책
- 트랜잭션 여부

가 전부 다르다.

따라서 역할 분리가 유지보수에 유리하다.

---

# 5. schema 와 types 역할 명확화 필요

현재:

```text
schema
types
```

가 동시에 존재한다.

이 경우 반드시 책임을 명확히 해야 한다.

---

# schema

```text
런타임 검증
```

예시:

```ts
z.object({
  title: z.string()
})
```

---

# types

```text
TypeScript 타입 정의
```

예시:

```ts
interface Snack {
  id: number
}
```

---

# 가장 추천하는 방식

```text
schema → infer → type 생성
```

---

# 예시

```ts
export const snackSchema = z.object({
  title: z.string()
})

export type Snack = z.infer<typeof snackSchema>
```

---

# 장점

```text
schema = source of truth
```

구조가 된다.

실무에서도 매우 많이 사용된다.

---

# 6. shared 구조 규칙 필요

현재 shared 구조는 매우 좋은 방향이다.

다만 기준 없이 사용하면:

```text
shared 만 비대해지는 문제
```

가 발생한다.

---

# shared 에 넣어도 되는 것

```text
- 공통 UI
- 공통 hooks
- 공통 utils
- axios instance
- react-query 설정
- constants
- formatter
```

---

# shared 에 넣으면 안되는 것

```text
❌ snack 전용 로직
❌ board 전용 hooks
❌ domain 정책
❌ 특정 feature validation
```

---

# 7. React Query hooks 구조 개선 권장

현재:

```text
hooks/useSnack.ts
```

단일 파일 구조는 규모가 커질수록 비효율적이다.

---

# 추천 구조

```text
hooks/
 ├─ queries/
 │   ├─ useSnackList.ts
 │   ├─ useSnackDetail.ts
 │   └─ useSnackSearch.ts
 │
 └─ mutations/
     ├─ useCreateSnack.ts
     ├─ useUpdateSnack.ts
     └─ useDeleteSnack.ts
```

---

# 이유

- 유지보수 용이
- query key 관리 쉬움
- 테스트 분리 가능
- mutation 책임 분리 가능

---

# 8. Loader 전략 개선 권장

현재 Loader 컴포넌트 분리 방향이 존재한다.

하지만 App Router 에서는:

```text
loading.tsx
Suspense
```

가 이미 존재한다.

---

# 권장 구조

## 전역 로딩

```text
app/loading.tsx
```

---

## 페이지 단위 로딩

```text
segment/loading.tsx
```

---

## 컴포넌트 단위 로딩

```tsx
<Suspense fallback={<Skeleton />}>
```

---

# 결론

별도의 Loader.tsx 를 남발하기보다:

```text
loading.tsx + Suspense + Skeleton
```

조합이 더 Next.js 실무 구조에 가깝다.

---

# 9. Swagger 구조 평가

현재 Swagger 구조:

```text
Controller
ControllerDocs
DocsDTO
```

는 매우 좋은 방향이다.

---

# 특히 좋은 부분

```text
실제 DTO 와 DocsDTO 분리
```

구조는 문서 품질 유지에 매우 유리하다.

---

# 현재 구조의 장점

```text
- validation 과 문서 책임 분리
- example 관리 쉬움
- Swagger 가독성 향상
- API 문서 유지보수 용이
```

---

# 개선 권장 사항

현재:

```text
SwaggerResponseDocs extends SwaggerResponse
```

패턴은 장기적으로는 결합도가 높아질 가능성이 존재한다.

---

# 권장 방식

문서 DTO 완전 독립화

```text
SwaggerRequestDocs
SwaggerResponseDocs
```

를 실제 DTO 와 완전히 분리하는 것을 추천한다.

---

# 10. 현재 가장 부족한 부분

---

# 10-1. API 계약(Contract) 계층 부재

현재 구조는:

```text
Frontend 중심
```

설계가 강하다.

하지만 실제 실무에서는:

```text
Swagger ↔ Backend ↔ Frontend
```

간 API 계약 계층이 매우 중요하다.

---

# 추천 구조

```text
contracts/
```

또는

```text
shared/contracts
```

---

# 예시

```text
contracts/
 ├─ snack.contract.ts
 ├─ auth.contract.ts
 └─ board.contract.ts
```

---

# 역할

```text
- Request 타입
- Response 타입
- Error Response
- Pagination
- 공통 API 응답 구조
```

---

# 10-2. Error Handling 구조 부재

추가 추천:

```text
shared/errors
```

---

# 예시

```text
ApiError
ValidationError
BusinessError
UnauthorizedError
```

---

# 10-3. Response Wrapper 부재

권장 구조:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

---

# 이유

- API 일관성
- 프론트 처리 단순화
- 에러 핸들링 표준화

---

# 10-4. Query Key Factory 부재

규모가 커질 경우 반드시 필요하다.

---

# 예시

```ts
export const snackKeys = {
  all: ['snack'],
  lists: () => [...snackKeys.all, 'list'],
  detail: (id: number) => [...snackKeys.all, id]
}
```

---

# 10-5. env 구조 개선 필요

현재:

```text
env.d.ts
```

는 매우 좋은 방향이다.

다만 추가적으로:

```text
env.server.ts
env.client.ts
```

분리를 추천한다.

---

# 10-6. 인증(Auth) 전략 명확화 필요

현재:

```text
auth || cache 이용??
```

정도로만 존재한다.

하지만 실제 구현 전 아래 전략이 먼저 필요하다.

---

# 정리 필요 항목

```text
- JWT vs Session
- refresh token
- middleware
- role
- cache invalidation
- protected route
- server session
```

---

# 11. 현재 폴더 구조 개선안

```text
📦frontend
 ┣ 📂app
 ┣ 📂features
 ┃ ┗ 📂snack
 ┃   ┣ 📂actions
 ┃   ┣ 📂components
 ┃   ┣ 📂hooks
 ┃   ┃ ┣ 📂queries
 ┃   ┃ ┗ 📂mutations
 ┃   ┣ 📂repositories
 ┃   ┣ 📂schema
 ┃   ┣ 📂services
 ┃   ┣ 📂contracts
 ┃   ┣ 📂types
 ┃   ┗ 📂utils
 ┣ 📂shared
 ┃ ┣ 📂components
 ┃ ┣ 📂hooks
 ┃ ┣ 📂lib
 ┃ ┣ 📂errors
 ┃ ┣ 📂constants
 ┃ ┗ 📂types
```

---

# 12. 추후 추가 추천 항목

---

# 우선순위 높음

## 1. 인증(Auth)

```text
- JWT
- Refresh Token
- Middleware
- RBAC(Role)
```

---

## 2. TDD

```text
- Vitest
- RTL
- MSW
```

---

## 3. 상태관리

현재 Zustand 계획은 좋은 방향이다.

다만 Zustand 는:

```text
서버 상태 관리
```

용도가 아니라:

```text
클라이언트 UI 상태 관리
```

에 가깝다.

---

# Zustand 추천 사용 예시

```text
- modal
- sidebar
- theme
- filter 상태
- cart
- multi-step form
```

---

# React Query 와 역할 차이

| 역할        | React Query | Zustand |
| ----------- | ----------- | ------- |
| 서버 데이터 | ✅          | ❌      |
| 캐싱        | ✅          | ❌      |
| API 상태    | ✅          | ❌      |
| UI 상태     | ❌          | ✅      |

---

# 13. 최종 결론

현재 프로젝트는:

```text
단순 CRUD 학습 프로젝트
```

를 넘어서:

```text
실무형 FullStack Architecture 실험 구조
```

로 충분히 발전 가능한 상태다.

특히:

- Swagger 문서 분리
- App Router 구조
- Feature 기반 분리
- service/repository 구조
- React Query
- RHF + Zod
- TDD 고려

는 매우 좋은 방향이다.

다만 지금 단계에서 가장 중요한 것은:

```text
레이어 책임 확정
```

이다.

특히:

```text
route.ts
server actions
service
repository
```

의 역할을 지금 고정해두는 것이 매우 중요하다.

이 부분만 안정적으로 정리되면 이후:

- 게시판
- 인증
- 결제
- 장바구니
- 관리자
- Swagger 고도화
- 테스트 자동화

까지 자연스럽게 확장 가능한 구조가 된다.
