# Testing

> Next.js App Router 기반 프로젝트에서 테스트 전략을 어떻게 구성할지 정리한 문서입니다.  
> 이 문서는 특정 테스트 라이브러리 문법을 모두 설명하기보다, **CRUD + 인증 서비스에서 무엇을 어떤 도구로 테스트할지**에 초점을 둡니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 테스트가 필요한가?](#3-왜-테스트가-필요한가)
- [4. 실무 기준](#4-실무-기준)
- [5. 테스트 종류](#5-테스트-종류)
- [6. Vitest](#6-vitest)
- [7. Testing Library](#7-testing-library)
- [8. MSW](#8-msw)
- [9. Playwright](#9-playwright)
- [10. Cypress](#10-cypress)
- [11. 무엇을 테스트할 것인가?](#11-무엇을-테스트할-것인가)
- [12. CRUD 테스트 전략](#12-crud-테스트-전략)
- [13. Auth 테스트 전략](#13-auth-테스트-전략)
- [14. 폴더 구조](#14-폴더-구조)
- [15. 코드 스니핏](#15-코드-스니핏)
- [16. Caution](#16-caution)
- [17. Best Practice](#17-best-practice)
- [18. 요약](#18-요약)

---

# 1. 한눈에 보기

테스트는 크게 3단계로 나눕니다.

```txt
Unit Test
→ 작은 함수/유틸/schema 테스트

Integration Test
→ 컴포넌트 + hook + API mock 테스트

E2E Test
→ 실제 사용자 흐름 테스트
```

---

## 도구 기준

| 테스트 | 도구 | 대상 |
|---|---|---|
| Unit | Vitest | util, schema, service 일부 |
| Component | Testing Library | Form, List, Button |
| API Mock | MSW | Route Handler/API 응답 mock |
| E2E | Playwright 또는 Cypress | 로그인, CRUD 흐름 |
| CI | GitHub Actions | 자동 실행 |

---

## 핵심 기준

```txt
작은 로직
→ Vitest

사용자 UI 상호작용
→ Testing Library

API 응답 mock
→ MSW

브라우저 전체 흐름
→ Playwright / Cypress
```

---

# 2. 언제 사용하는가?

테스트는 다음 상황에서 필요합니다.

- Form validation이 많다.
- 검색/정렬/페이징 조건이 복잡하다.
- 인증/권한 로직이 있다.
- Server Action, Service, Repository가 분리되어 있다.
- 리팩토링이 자주 발생한다.
- 배포 전 자동 검증이 필요하다.
- 사이드 프로젝트를 포트폴리오 품질로 만들고 싶다.

---

## 테스트 우선순위

처음부터 모든 것을 테스트하지 않아도 됩니다.

우선순위는 다음이 좋습니다.

```txt
1. schema / util
2. service 권한 로직
3. form validation
4. 목록 empty/loading/error
5. 로그인/회원가입 E2E
6. CRUD E2E
```

---

# 3. 왜 테스트가 필요한가?

수동 확인만으로는 다음 문제가 생깁니다.

- 수정할 때 기존 기능이 깨졌는지 모름
- 검색 조건 조합을 매번 직접 확인해야 함
- 인증/권한 누락을 놓치기 쉬움
- 배포 전 확인 시간이 길어짐
- Form validation이 변경될 때 영향 범위 파악 어려움

---

## 테스트가 주는 이점

| 이점 | 설명 |
|---|---|
| 안정성 | 수정 후 기존 기능 검증 |
| 문서화 | 기능 의도와 사용법이 테스트로 남음 |
| 리팩토링 | 구조 변경 시 회귀 버그 방지 |
| 자동화 | CI에서 배포 전 검증 |
| 신뢰도 | 포트폴리오 품질 향상 |

---

# 4. 실무 기준

## 권장

```txt
schema / util
→ unit test

component interaction
→ component test

API response
→ MSW mock

critical user flow
→ E2E
```

---

## 권장하지 않음

```txt
모든 내부 구현 테스트
모든 컴포넌트 snapshot 테스트
CSS class 중심 테스트
라이브러리 자체 동작 테스트
```

테스트는 구현 방식보다 **사용자에게 보이는 동작**과 **비즈니스 규칙**을 검증하는 것이 좋습니다.

---

# 5. 테스트 종류

## Unit Test

작은 단위의 로직을 검증합니다.

대상:

- util
- formatter
- zod schema
- pagination 계산
- service 권한 로직 일부

예:

```txt
formatPrice(10000)
→ "10,000"
```

---

## Integration Test

여러 요소가 연결된 동작을 검증합니다.

대상:

- Form submit
- Validation error
- List empty state
- Search component
- Mutation 후 callback

---

## E2E Test

실제 브라우저에서 사용자 흐름을 검증합니다.

대상:

- 회원가입
- 로그인
- 글 작성
- 글 수정
- 글 삭제
- 검색
- 페이징

---

# 6. Vitest

Vitest는 Vite 기반 테스트 러너입니다.

---

## 언제 사용하는가?

- TypeScript 함수 테스트
- Zod schema 테스트
- util 테스트
- service 로직 테스트
- hook 일부 테스트

---

## 설치 예시

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## 설정 예시

```ts
// vitest.config.ts
/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
})
```

---

## setup

```ts
// test/setup.ts
import '@testing-library/jest-dom/vitest'
```

---

# 7. Testing Library

Testing Library는 사용자의 관점에서 컴포넌트를 테스트하는 도구입니다.

---

## 핵심 기준

나쁜 테스트:

```txt
className이 있는지 확인
state가 내부적으로 무엇인지 확인
```

좋은 테스트:

```txt
버튼을 클릭하면 에러 메시지가 보인다
입력 후 제출하면 onSubmit이 호출된다
목록이 없으면 empty message가 보인다
```

---

## 자주 사용하는 API

| API | 역할 |
|---|---|
| render | 컴포넌트 렌더링 |
| screen | 화면에서 요소 찾기 |
| fireEvent | 이벤트 발생 |
| userEvent | 실제 사용자에 가까운 이벤트 |
| waitFor | 비동기 대기 |

---

# 8. MSW

MSW(Mock Service Worker)는 API 요청을 mock 처리하는 도구입니다.

---

## 언제 사용하는가?

- React Query 컴포넌트 테스트
- API 응답 성공/실패 테스트
- 목록 empty state 테스트
- E2E 전 단계의 통합 테스트
- 실제 서버 없이 UI 개발

---

## 장점

```txt
컴포넌트는 실제 axios/fetch 호출
  ↓
MSW가 요청 가로채기
  ↓
mock response 반환
```

컴포넌트 입장에서는 실제 API를 호출하는 것처럼 동작합니다.

---

# 9. Playwright

Playwright는 브라우저 기반 E2E 테스트 도구입니다.

---

## 언제 사용하는가?

- 로그인 전체 흐름
- 회원가입 전체 흐름
- CRUD 전체 흐름
- 브라우저 라우팅
- 권한 페이지 접근
- 실제 사용자 시나리오

---

## 예시 흐름

```txt
페이지 접속
  ↓
로그인
  ↓
글 작성
  ↓
목록 확인
  ↓
수정
  ↓
삭제
```

---

# 10. Cypress

Cypress도 E2E 테스트 도구입니다.

---

## Playwright와 비교

| 구분 | Playwright | Cypress |
|---|---|---|
| 브라우저 지원 | 강함 | 강함 |
| 병렬/CI | 좋음 | 좋음 |
| Next.js E2E | 많이 사용 | 많이 사용 |
| 설치 크기 | 비교적 큼 | 비교적 큼 |
| DX | 좋음 | 좋음 |

둘 중 하나만 선택해도 충분합니다.

---

## 현재 프로젝트 기준

Devcontainer 환경에서는 Cypress 실행 시 시스템 라이브러리 의존성이 문제가 될 수 있습니다.

따라서 다음 기준이 현실적입니다.

```txt
E2E 신규 도입
→ Playwright 우선 검토

이미 Cypress 기반
→ 필요한 시스템 의존성 설치 후 유지
```

---

# 11. 무엇을 테스트할 것인가?

## 테스트할 것

- schema validation
- 검색 params parsing
- pagination 계산
- 권한 service 로직
- Form submit validation
- 목록 empty state
- 로그인 성공/실패
- 보호 페이지 redirect
- CRUD 주요 흐름

---

## 테스트하지 않아도 되는 것

- shadcn/ui 내부 동작
- React Query 내부 캐싱 구현
- Auth.js 내부 구현
- Prisma 자체 동작
- Tailwind class 자체
- 단순 렌더링만 있는 컴포넌트 전체

---

# 12. CRUD 테스트 전략

## 목록 조회

확인:

- 데이터가 있으면 목록 표시
- 데이터가 없으면 empty state 표시
- API 실패 시 error state 표시
- 검색 조건 변경 시 query 호출 변경

---

## 생성

확인:

- 필수값 누락 시 에러 표시
- 정상 입력 시 mutation 호출
- 성공 후 목록 갱신
- 성공 후 toast 또는 redirect

---

## 수정

확인:

- 기존 데이터가 defaultValues로 표시
- 수정 후 update action 호출
- 권한 없으면 실패 처리
- 성공 후 상세/목록 갱신

---

## 삭제

확인:

- Confirm Dialog 표시
- 확인 클릭 시 delete action 호출
- 성공 후 목록 갱신
- 실패 시 에러 표시

---

# 13. Auth 테스트 전략

## 로그인

확인:

- 이메일 형식 검증
- 비밀번호 길이 검증
- 잘못된 credentials 실패
- 성공 시 redirect

---

## 회원가입

확인:

- 비밀번호 확인 불일치 에러
- 이미 가입된 이메일 처리
- 성공 시 로그인 페이지 또는 자동 로그인 처리

---

## 보호 페이지

확인:

- 비로그인 사용자는 signin으로 redirect
- 로그인 사용자는 접근 가능
- 일반 사용자는 admin 페이지 접근 불가

---

## 권한

확인:

- 작성자는 수정 가능
- 작성자가 아니면 수정 불가
- admin은 수정 가능

---

# 14. 폴더 구조

## 기본 구조

```txt
test/
├─ setup.ts
├─ mocks/
│  ├─ handlers.ts
│  └─ server.ts
└─ utils/
   └─ render.tsx
```

---

## 도메인 테스트

```txt
features/
├─ snack/
│  ├─ schema/
│  │  └─ snack.schema.test.ts
│  ├─ services/
│  │  └─ snack.service.test.ts
│  └─ components/
│     └─ snack-form.test.tsx
├─ board/
│  └─ services/
│     └─ board.service.test.ts
└─ auth/
   ├─ schema/
   │  └─ auth.schema.test.ts
   └─ services/
      └─ auth.service.test.ts
```

---

## E2E 구조

```txt
e2e/
├─ auth.spec.ts
├─ snack.spec.ts
└─ board.spec.ts
```

---

# 15. 코드 스니핏

## Zod Schema Test

```ts
// features/auth/schema/auth.schema.test.ts
import { describe, expect, it } from 'vitest'
import { signupSchema } from './auth.schema'

describe('signupSchema', () => {
  it('비밀번호와 비밀번호 확인이 다르면 실패한다', () => {
    const result = signupSchema.safeParse({
      displayName: '홍길동',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password456'
    })

    expect(result.success).toBe(false)
  })

  it('정상 입력이면 성공한다', () => {
    const result = signupSchema.safeParse({
      displayName: '홍길동',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    })

    expect(result.success).toBe(true)
  })
})
```

---

## Pagination Test

```ts
// shared/utils/pagination.test.ts
import { describe, expect, it } from 'vitest'
import { getPaginationRange } from './pagination'

describe('getPaginationRange', () => {
  it('현재 페이지 기준으로 페이지 범위를 반환한다', () => {
    expect(getPaginationRange(5, 10)).toEqual([3, 4, 5, 6, 7])
  })

  it('첫 페이지 근처에서는 1보다 작아지지 않는다', () => {
    expect(getPaginationRange(1, 10)).toEqual([1, 2, 3])
  })
})
```

---

## Component Test

```tsx
// features/snack/components/snack-list.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

function SnackListMock({ items }: { items: { id: string; title: string }[] }) {
  if (items.length === 0) {
    return <p>등록된 간식이 없습니다.</p>
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}

describe('SnackList', () => {
  it('데이터가 없으면 empty message를 보여준다', () => {
    render(<SnackListMock items={[]} />)

    expect(screen.getByText('등록된 간식이 없습니다.')).toBeInTheDocument()
  })

  it('데이터가 있으면 목록을 보여준다', () => {
    render(<SnackListMock items={[{ id: '1', title: '초코 과자' }]} />)

    expect(screen.getByText('초코 과자')).toBeInTheDocument()
  })
})
```

---

## MSW Handler

```ts
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/snacks', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: '초코 과자',
        price: 1000
      }
    ])
  })
]
```

---

## MSW Server

```ts
// test/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

---

## setup.ts

```ts
// test/setup.ts
import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Playwright E2E 예시

```ts
// e2e/auth.spec.ts
import { expect, test } from '@playwright/test'

test('로그인 페이지에 접근할 수 있다', async ({ page }) => {
  await page.goto('/signin')

  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()
})

test('로그인 후 snack 페이지로 이동한다', async ({ page }) => {
  await page.goto('/signin')

  await page.getByLabel('이메일').fill('test@example.com')
  await page.getByLabel('비밀번호').fill('password123')
  await page.getByRole('button', { name: '로그인' }).click()

  await expect(page).toHaveURL(/\/snack/)
})
```

---

## CRUD E2E 예시

```ts
// e2e/snack.spec.ts
import { expect, test } from '@playwright/test'

test('간식을 생성하고 목록에서 확인한다', async ({ page }) => {
  await page.goto('/snack/new')

  await page.getByLabel('제목').fill('초코 과자')
  await page.getByLabel('브랜드').fill('롯데')
  await page.getByLabel('카테고리').fill('과자')
  await page.getByLabel('가격').fill('1000')

  await page.getByRole('button', { name: '저장' }).click()

  await expect(page).toHaveURL(/\/snack/)
  await expect(page.getByText('초코 과자')).toBeVisible()
})
```

---

# 16. Caution

## 1. 구현 세부사항보다 사용자 동작을 테스트하기

나쁜 예:

```txt
state 값이 true인지 확인
```

좋은 예:

```txt
삭제 버튼 클릭 시 확인 모달이 보이는지 확인
```

---

## 2. 라이브러리 자체를 테스트하지 않기

테스트 대상이 아닙니다.

- React Query 캐시 내부 구현
- RHF 내부 상태 처리
- Auth.js 내부 세션 구현
- Prisma Client 자체 동작

---

## 3. 너무 많은 snapshot 테스트 지양

snapshot은 구조 변경에 민감합니다.

UI가 자주 바뀌는 프로젝트에서는 유지보수 비용이 커질 수 있습니다.

---

## 4. E2E만 믿지 않기

E2E는 느리고 실패 원인 추적이 어려울 수 있습니다.

권장 조합:

```txt
Unit
+
Integration
+
E2E 핵심 흐름
```

---

## 5. 테스트 DB / Mock 데이터 분리

실제 개발 DB와 테스트 DB를 분리해야 합니다.

---

## 6. Devcontainer에서 브라우저 테스트 의존성 주의

Cypress/Playwright는 Linux 시스템 라이브러리가 필요할 수 있습니다.

Devcontainer 환경에서는 공식 image 또는 필요한 의존성 설치가 필요합니다.

---

# 17. Best Practice

## 권장

- schema 테스트부터 작성
- util 테스트 작성
- service 권한 로직 테스트
- Form validation 테스트
- 목록 empty/loading/error 테스트
- 핵심 사용자 흐름만 E2E로 작성
- API mock은 MSW 사용
- 테스트용 render util 작성
- CI에서 test 실행
- E2E는 안정적인 selector 사용

---

## 비권장

- 모든 컴포넌트 snapshot 테스트
- className 중심 테스트
- 내부 state 직접 테스트
- 모든 기능을 E2E로만 테스트
- 테스트에서 실제 외부 API 의존
- 테스트 DB와 개발 DB 혼용
- 라이브러리 내부 구현 테스트
- 불안정한 text/DOM 구조에 과도하게 의존

---

# 18. 요약

## 테스트 역할 분리

```txt
Vitest
→ unit / integration

Testing Library
→ component interaction

MSW
→ API mock

Playwright / Cypress
→ E2E
```

---

## 우선순위

```txt
1. schema
2. util
3. service 권한 로직
4. form validation
5. CRUD 핵심 흐름
6. Auth 핵심 흐름
```

---

## 핵심 원칙

```txt
사용자 동작을 테스트한다.

비즈니스 규칙을 테스트한다.

라이브러리 내부 구현은 테스트하지 않는다.

E2E는 핵심 흐름에 집중한다.

Mock과 실제 환경을 구분한다.
```
