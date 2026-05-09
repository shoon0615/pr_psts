# Frontend / Swagger Architecture Review (Refined)

## 문서 목적

이 문서는 아래 내용을 기준으로 전체 프로젝트 구조를 검토하고 정리한다.

- `README (Swagger).md`
  - Swagger/OpenAPI 구성 방식
  - 문서화 구조
  - DocsDTO 전략
  - ControllerDocs 패턴
- `README2.md`
  - Frontend 구조
  - React Query / RHF / Zod
  - CRUD 로드맵
  - Feature 구조
  - 추후 확장 방향

또한 아래 내용을 함께 포함한다.

- 현재 구조 평가
- 실무 기준 개선 방향
- 레이어 책임 정리
- 데이터 흐름 정리
- 부족한 부분
- 보완 권장 사항
- 추후 확장 전략

---

# 로드맵(전체 구조)

## 1. 조회(Read)

```text
Client Page
 ↓
React Query
 ↓
route.ts
 ↓
service
 ↓
repository
 ↓
Prisma / External API
```

### 목적

- 캐싱 최적화
- API 독립성 확보
- Swagger 연동
- 외부 API 확장
- SSR/Hydration 대응

---

## 2. 입력(Create)

```text
form.tsx
 ↓
react-hook-form
 ↓
zodResolver
 ↓
server action
 ↓
service
 ↓
repository
```

### 목적

- 타입 안정성
- 서버 실행 보장
- validation 일원화
- revalidatePath 활용
- redirect 처리

---

## 3. 수정(Update)

```text
edit/page.tsx
 ↓
react-hook-form
 ↓
server action
 ↓
service
 ↓
repository
```

---

## 4. 삭제(Delete)

```text
Button Event
 ↓
server action
 ↓
service
 ↓
repository
```

---

# 핵심 방향성 (가장 중요)

## route.ts 와 server actions 역할 분리

현재 문서에서는 아래 흐름이 혼합되어 있다.

```text
Client
 ├─ route.ts(fetch)
 ├─ server action
 └─ direct service call
```

이 구조를 동시에 메인 전략으로 사용할 경우:

- 캐싱 전략 충돌
- 타입 흐름 혼란
- 인증 처리 중복
- 에러 처리 중복
- 테스트 포인트 증가
- 유지보수 복잡도 증가

문제가 발생할 가능성이 높다.

---

# 권장 구조

| 작업 | 추천 방식 |
|---|---|
| 조회(Read) | route.ts + React Query |
| 생성(Create) | Server Actions |
| 수정(Update) | Server Actions |
| 삭제(Delete) | Server Actions |

---

# 한번에 보기: 권장 폴더 구조

```text
📦frontend
 ┣ 📂app
 ┃ ┣ 📂(default-layout)
 ┃ ┣ 📂(public)
 ┃ ┣ 📂api
 ┃ ┗ 📜provider.tsx
 ┃
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
 ┃
 ┣ 📂shared
 ┃ ┣ 📂components
 ┃ ┣ 📂hooks
 ┃ ┣ 📂lib
 ┃ ┣ 📂errors
 ┃ ┣ 📂constants
 ┃ ┗ 📂types
```

---

# service 레이어 책임 정리

## service 의 역할

service 는:

```text
비즈니스 로직 계층
```

이다.

---

## service 에서 수행해야 하는 것

```text
- 권한 체크
- 상태 검증
- 데이터 조합
- 트랜잭션
- 정책 처리
- repository orchestration
```

---

## service 에 넣지 말아야 하는 것

```text
❌ toast
❌ loading 상태
❌ router.push
❌ alert
❌ modal 상태
❌ UI 이벤트
```

---

# repository 구조 개선 권장

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

# schema 와 types 역할 정리

## schema

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

## types

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
  title: z.string(),
})

export type Snack = z.infer<typeof snackSchema>
```

---

# shared 구조 규칙

## shared 에 넣어도 되는 것

```text
- 공통 UI
- 공통 hooks
- 공통 utils
- axios instance
- react-query 설정
- constants
```

---

## shared 에 넣으면 안되는 것

```text
❌ snack 전용 로직
❌ board 전용 hooks
❌ domain 정책
❌ feature 전용 validation
```

---

# React Query hooks 구조 개선 권장

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

# Loader 전략 개선 권장

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

# Swagger 구조 평가

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

# 개선 권장 사항

현재:

```text
SwaggerResponseDocs extends SwaggerResponse
```

패턴은 장기적으로 결합도가 높아질 가능성이 존재한다.

---

# 권장 방식

```text
SwaggerRequestDocs
SwaggerResponseDocs
```

를 실제 DTO 와 완전히 분리하는 것을 추천한다.

---

# 현재 가장 부족한 부분

## 1. API 계약(Contract) 계층

추천 구조:

```text
contracts/
```

또는

```text
shared/contracts
```

---

## 역할

```text
- Request 타입
- Response 타입
- Error Response
- Pagination
- 공통 API 응답 구조
```

---

## 2. Error Handling 구조

추천:

```text
shared/errors
```

예시:

```text
ApiError
ValidationError
BusinessError
UnauthorizedError
```

---

## 3. Response Wrapper

권장 구조:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

---

## 4. Query Key Factory

```ts
export const snackKeys = {
  all: ['snack'],
  lists: () => [...snackKeys.all, 'list'],
  detail: (id: number) => [...snackKeys.all, id]
}
```

---

## 5. env 구조 개선

추천:

```text
env.server.ts
env.client.ts
```

---

## 6. 인증(Auth) 전략

정리 필요 항목:

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

# Zustand 와 React Query 역할 차이

| 역할 | React Query | Zustand |
|---|---|---|
| 서버 데이터 | ✅ | ❌ |
| 캐싱 | ✅ | ❌ |
| API 상태 | ✅ | ❌ |
| UI 상태 | ❌ | ✅ |

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

# 최종 결론

현재 프로젝트는:

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
