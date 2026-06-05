# TypeScript

> Next.js App Router 기반 프로젝트에서 TypeScript를 실무적으로 사용하는 기준을 정리한 문서입니다.  
> 이 문서는 TypeScript 문법 전체를 설명하기보다, **CRUD + Auth 프로젝트에서 자주 사용하는 타입 설계 패턴**에 초점을 둡니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 사용하는가?](#3-왜-사용하는가)
- [4. 실무 기준](#4-실무-기준)
- [5. type / interface](#5-type--interface)
- [6. DTO / Entity / Form 타입](#6-dto--entity--form-타입)
- [7. z.infer](#7-zinfer)
- [8. as const](#8-as-const)
- [9. satisfies](#9-satisfies)
- [10. Generic](#10-generic)
- [11. Utility Type](#11-utility-type)
- [12. API Response 타입](#12-api-response-타입)
- [13. SearchParams 타입](#13-searchparams-타입)
- [14. Auth 타입](#14-auth-타입)
- [15. CRUD 적용 예제](#15-crud-적용-예제)
- [16. 코드 스니핏](#16-코드-스니핏)
- [17. Caution](#17-caution)
- [18. Best Practice](#18-best-practice)
- [19. 요약](#19-요약)

---

# 1. 한눈에 보기

TypeScript는 프로젝트의 데이터 흐름을 안전하게 연결하기 위한 도구입니다.

```txt
Schema
  ↓
Type
  ↓
Form
  ↓
Action
  ↓
Service
  ↓
Repository
  ↓
Response
```

---

## 핵심 사용처

| 영역          | 사용 예                              |
| ------------- | ------------------------------------ |
| Form          | CreateSnackInput, SignupInput        |
| API           | ApiResponse<T>, PaginatedResponse<T> |
| Query         | queryKey, queryOptions 타입          |
| Search        | SnackSearchParams                    |
| Auth          | Session user 확장                    |
| Prisma        | Prisma model 타입, select 결과       |
| 공통 컴포넌트 | Generic FormInput<T>                 |

---

## 핵심 기준

```txt
입력 타입
→ Zod에서 추론

응답 타입
→ API/Repository에서 명시

옵션 상수
→ as const

구조 검증
→ satisfies

공통 컴포넌트
→ Generic

부분 수정
→ Partial

필드 선택
→ Pick / Omit
```

---

# 2. 언제 사용하는가?

TypeScript는 모든 파일에서 사용하지만, 특히 다음 영역에서 중요합니다.

- Form 입력값
- Server Action 입력값
- Repository 반환값
- API 응답값
- SearchParams
- Auth Session
- Query Key
- 공통 Form 컴포넌트
- 옵션 배열
- Prisma select 결과

---

## 타입이 특히 중요한 경우

```txt
Client
  ↓
Server Action
  ↓
Service
  ↓
Repository
```

이 흐름에서 입력/출력 타입이 불명확하면 런타임 오류가 쉽게 발생합니다.

---

# 3. 왜 사용하는가?

JavaScript만 사용하면 다음 문제가 생깁니다.

```ts
function formatPrice(price) {
  return price.toLocaleString("ko-KR");
}
```

`price`가 숫자인지 문자열인지 알 수 없습니다.

TypeScript를 사용하면 다음처럼 명확해집니다.

```ts
function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}
```

---

## 장점

| 장점     | 설명                        |
| -------- | --------------------------- |
| 자동완성 | 객체 필드 추론              |
| 안정성   | 잘못된 타입 전달 방지       |
| 리팩토링 | 필드 변경 시 영향 파악 쉬움 |
| 문서화   | 타입 자체가 설명 역할       |
| 협업     | 함수 입력/출력 계약 명확    |

---

# 4. 실무 기준

## 권장

```txt
Zod Schema
→ 입력 타입 추론

Repository
→ 반환 타입 명시

Options
→ as const

Config
→ satisfies

공통 컴포넌트
→ Generic

API 응답
→ ApiResponse<T>
```

---

## 타입 위치

```txt
features/snack/types/snack.type.ts
features/snack/schema/snack.schema.ts
shared/types/api.type.ts
shared/types/pagination.type.ts
```

---

## 타입을 나누는 기준

| 타입               | 위치                                 |
| ------------------ | ------------------------------------ |
| 도메인 타입        | features/{domain}/types              |
| Form 입력 타입     | schema에서 z.infer                   |
| API 공통 응답      | shared/types                         |
| Pagination 타입    | shared/types                         |
| Auth 확장 타입     | next-auth.d.ts 또는 auth type 파일   |
| 공통 컴포넌트 타입 | 컴포넌트 파일 내부 또는 shared/types |

---

# 5. type / interface

## type

유니온, 유틸리티 타입 조합, 함수 타입에 편합니다.

```ts
type SortOrder = "asc" | "desc";

type Snack = {
  id: string;
  title: string;
};
```

---

## interface

객체 구조 확장에 편합니다.

```ts
interface User {
  id: string;
  email: string;
}
```

---

## 실무 기준

현재 프로젝트에서는 대부분 `type`을 기본으로 사용해도 충분합니다.

```txt
DTO
FormInput
SearchParams
Response
Union
Utility 조합
→ type
```

`interface`는 라이브러리 타입 확장이나 선언 병합이 필요한 경우에 사용합니다.

예:

```txt
next-auth Session 확장
```

---

# 6. DTO / Entity / Form 타입

## Entity

DB 또는 핵심 도메인 데이터입니다.

```ts
export type Snack = {
  id: string;
  title: string;
  brand: string;
  category: string;
  contents?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};
```

---

## Form Input

사용자 입력값입니다.

```ts
export type CreateSnackInput = {
  title: string;
  brand: string;
  category: string;
  contents?: string;
  price: number;
};
```

---

## DTO

API 요청/응답용 데이터입니다.

```ts
export type SnackListResponse = {
  items: Snack[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
```

---

## 구분 이유

| 타입       | 기준             |
| ---------- | ---------------- |
| Entity     | DB/도메인 기준   |
| Form Input | 사용자 입력 기준 |
| DTO        | API 통신 기준    |

한 타입을 모든 곳에서 재사용하면 편해 보이지만, 점점 필드가 어긋납니다.

---

# 7. z.infer

Zod schema에서 TypeScript 타입을 추론합니다.

---

## 기본 예시

```ts
import { z } from "zod";

export const createSnackSchema = z.object({
  title: z.string().min(2),
  price: z.coerce.number().min(0),
});

export type CreateSnackInput = z.infer<typeof createSnackSchema>;
```

---

## 장점

```txt
Schema 변경
  ↓
Type 자동 변경
```

Form 타입을 따로 작성하지 않아도 됩니다.

---

## 사용 기준

| 상황                    | 권장                       |
| ----------------------- | -------------------------- |
| Form 입력 타입          | z.infer                    |
| Server Action 입력 검증 | schema.parse               |
| API query params        | z.infer                    |
| DB Entity               | 직접 type 또는 Prisma 타입 |

---

# 8. as const

`as const`는 값을 literal type으로 고정합니다.

---

## 예시

```ts
export const SORT_FIELDS = ["createdAt", "title", "price"] as const;
```

타입 추출:

```ts
export type SortField = (typeof SORT_FIELDS)[number];
```

결과:

```ts
type SortField = "createdAt" | "title" | "price";
```

---

## Query Key에서 사용

```ts
export const snackKeys = {
  all: ["snacks"] as const,
  lists: () => [...snackKeys.all, "list"] as const,
  detail: (id: string) => [...snackKeys.all, "detail", id] as const,
};
```

---

## 옵션 배열에서 사용

```ts
export const SORT_OPTIONS = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "이름순", value: "title:asc" },
  { label: "가격 낮은순", value: "price:asc" },
] as const;
```

---

# 9. satisfies

`satisfies`는 값의 구조를 검사하면서도 값 자체의 구체적인 타입은 유지합니다.

---

## 예시

```ts
type Option = {
  label: string;
  value: string;
};

export const BRAND_OPTIONS = [
  { label: "롯데", value: "lotte" },
  { label: "해태", value: "haitai" },
] satisfies Option[];
```

---

## as const와 함께 사용

```ts
type SelectOption = {
  label: string;
  value: string;
};

export const CATEGORY_OPTIONS = [
  { label: "과자", value: "snack" },
  { label: "음료", value: "drink" },
] as const satisfies readonly SelectOption[];
```

---

## 장점

- 구조가 맞는지 검사
- 오타 방지
- literal type 유지
- 옵션 배열 관리에 적합

---

# 10. Generic

Generic은 재사용 가능한 타입을 만들 때 사용합니다.

---

## API Response

```ts
export type ApiResponse<T> = {
  data: T;
  message?: string;
};
```

사용:

```ts
type SnackResponse = ApiResponse<Snack>;
```

---

## FormInput

```tsx
import type { Control, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};
```

---

## Pagination

```ts
export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
```

사용:

```ts
type SnackListResponse = PaginatedResponse<Snack>;
```

---

# 11. Utility Type

TypeScript 기본 유틸리티 타입은 DTO 설계에 자주 사용합니다.

---

## Partial

모든 필드를 optional로 만듭니다.

```ts
type UpdateSnackInput = Partial<CreateSnackInput>;
```

수정 Form에 적합합니다.

---

## Pick

일부 필드만 선택합니다.

```ts
type SnackSummary = Pick<Snack, "id" | "title" | "price">;
```

---

## Omit

일부 필드를 제외합니다.

```ts
type CreateSnackInput = Omit<Snack, "id" | "createdAt" | "updatedAt">;
```

주의:

DB Entity에서 바로 Omit해 Form 타입을 만들면, 나중에 Entity가 바뀔 때 Form 타입도 예상치 않게 바뀔 수 있습니다.

실무에서는 Zod schema 기반 타입 추론을 더 권장합니다.

---

## Required

optional 필드를 required로 만듭니다.

```ts
type RequiredSnack = Required<Snack>;
```

---

## NonNullable

null/undefined를 제거합니다.

```ts
type User = NonNullable<Session["user"]>;
```

---

# 12. API Response 타입

## 공통 응답

```ts
// shared/types/api.type.ts
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  message: string;
  errors?: unknown;
};
```

---

## Pagination 응답

```ts
// shared/types/pagination.type.ts
export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
```

---

## 사용 예

```ts
export type SnackListResponse = PaginatedResponse<Snack>;
```

Repository:

```ts
async list(params: SnackSearchParams): Promise<SnackListResponse> {
  const { data } = await api.get<SnackListResponse>('/snacks', { params })
  return data
}
```

---

# 13. SearchParams 타입

URL query는 기본적으로 문자열입니다.

따라서 Zod를 통해 변환한 뒤 타입을 사용합니다.

---

## Schema

```ts
export const snackSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  keyword: z.string().optional().default(""),
  sort: z.enum(["createdAt", "title", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
```

---

## Type

```ts
export type SnackSearchParams = z.infer<typeof snackSearchParamsSchema>;
```

---

## Parser

```ts
export function parseSnackSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): SnackSearchParams {
  return snackSearchParamsSchema.parse({
    page: firstValue(searchParams.page),
    keyword: firstValue(searchParams.keyword),
    sort: firstValue(searchParams.sort),
    order: firstValue(searchParams.order),
  });
}
```

---

# 14. Auth 타입

Auth.js를 사용할 때 session.user에 id, role 등을 추가하면 타입 확장이 필요합니다.

---

## 예시

```ts
// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}
```

JWT 타입도 확장할 수 있습니다.

```ts
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
```

---

## 사용

```ts
const session = await auth();

if (session?.user?.role === "admin") {
  // admin logic
}
```

---

# 15. CRUD 적용 예제

## Snack 타입 구조

```txt
Snack
→ Entity

CreateSnackInput
→ Form 입력

UpdateSnackInput
→ 수정 입력

SnackSearchParams
→ 검색 조건

SnackListResponse
→ 목록 응답
```

---

## Board 타입 구조

```txt
Board
→ Entity

CreateBoardInput
→ 작성 입력

UpdateBoardInput
→ 수정 입력

BoardSearchParams
→ 검색 조건
```

---

## Auth 타입 구조

```txt
SigninInput
→ 로그인 입력

SignupInput
→ 회원가입 입력

Session.user
→ 로그인 사용자 정보
```

---

# 16. 코드 스니핏

## Snack Schema + Type

```ts
// features/snack/schema/snack.schema.ts
import { z } from "zod";

export const createSnackSchema = z.object({
  title: z.string().min(2),
  brand: z.string().min(1),
  category: z.string().min(1),
  contents: z.string().optional(),
  price: z.coerce.number().min(0),
});

export const updateSnackSchema = createSnackSchema.partial();

export const snackSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  keyword: z.string().optional().default(""),
  brand: z.string().optional().default(""),
  category: z.string().optional().default(""),
  sort: z.enum(["createdAt", "title", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateSnackInput = z.infer<typeof createSnackSchema>;
export type UpdateSnackInput = z.infer<typeof updateSnackSchema>;
export type SnackSearchParams = z.infer<typeof snackSearchParamsSchema>;
```

---

## Snack Entity / Response

```ts
// features/snack/types/snack.type.ts
import type { PaginatedResponse } from "@/shared/types/pagination.type";

export type Snack = {
  id: string;
  title: string;
  brand: string;
  category: string;
  contents?: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type SnackListResponse = PaginatedResponse<Snack>;
```

---

## Options with satisfies

```ts
type SortOption = {
  label: string;
  value: `${"createdAt" | "title" | "price"}:${"asc" | "desc"}`;
};

export const SNACK_SORT_OPTIONS = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "이름순", value: "title:asc" },
  { label: "가격 낮은순", value: "price:asc" },
  { label: "가격 높은순", value: "price:desc" },
] as const satisfies readonly SortOption[];
```

---

## Query Key Type

```ts
export const snackKeys = {
  all: ["snacks"] as const,
  lists: () => [...snackKeys.all, "list"] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, "detail"] as const,
  detail: (id: string) => [...snackKeys.details(), id] as const,
};
```

---

## Generic FormInput

```tsx
import type { Control, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormInputProps<T>) {
  // useController 연결
  return null;
}
```

---

## Repository Return Type

```ts
export const snackRepository = {
  async list(params: SnackSearchParams): Promise<SnackListResponse> {
    const { data } = await api.get<SnackListResponse>("/snacks", { params });
    return data;
  },
};
```

---

# 17. Caution

## 1. any 남용 금지

`any`는 TypeScript 검사를 끕니다.

불확실한 값은 `unknown`을 사용하고 검증 후 사용합니다.

```ts
function action(input: unknown) {
  const payload = schema.parse(input);
}
```

---

## 2. as 남용 금지

`as`는 타입을 강제로 덮어씁니다.

가능하면 schema 검증, 타입 가드, satisfies를 먼저 고려합니다.

---

## 3. Entity를 Form 타입으로 무조건 재사용하지 않기

나쁜 예:

```ts
type CreateSnackInput = Omit<Snack, "id">;
```

Entity가 바뀌면 Form 타입도 의도치 않게 바뀔 수 있습니다.

권장:

```ts
type CreateSnackInput = z.infer<typeof createSnackSchema>;
```

---

## 4. URL 값은 문자열이다

`page`가 숫자로 보여도 실제 URL에서는 문자열입니다.

권장:

```ts
z.coerce.number();
```

---

## 5. option value 타입을 string으로만 두지 않기

정렬/필터 옵션은 가능한 literal union으로 제한합니다.

---

## 6. Session 타입 확장 누락 주의

session.user.id, role을 사용하려면 타입 확장이 필요합니다.

---

# 18. Best Practice

## 권장

- 입력 타입은 Zod schema에서 추론
- API 응답 타입은 명시
- options 배열은 `as const satisfies` 사용
- queryKey는 `as const` 사용
- 공통 응답은 Generic 사용
- Form 공통 컴포넌트는 Generic 사용
- Auth Session은 module augmentation으로 확장
- `unknown → schema.parse → typed payload` 흐름 사용
- URL query는 Zod로 변환 후 사용

---

## 비권장

- `any` 사용
- 검증 없는 `as` 남용
- Entity 타입을 모든 곳에 재사용
- API 응답 타입 생략
- queryKey 문자열 하드코딩
- option value를 단순 string으로 방치
- URL searchParams를 숫자로 착각
- session.user 타입 에러를 `as any`로 무시

---

# 19. 요약

## 타입 설계 흐름

```txt
Zod Schema
  ↓
z.infer
  ↓
Form / Action Input

Entity Type
  ↓
Domain Data

ApiResponse<T>
  ↓
Repository Return

as const / satisfies
  ↓
Options / QueryKey
```

---

## 핵심 기준

```txt
Form 입력 타입은 Zod에서 만든다.

API 응답 타입은 명시한다.

상수 옵션은 as const와 satisfies를 사용한다.

공통 컴포넌트는 Generic으로 만든다.

Auth Session은 타입 확장한다.

any와 as 남용은 피한다.
```
