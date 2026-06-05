# Form

> Next.js App Router 기반 프로젝트에서 Form 입력, 검증, 제출 흐름을 정리한 문서입니다.  
> 이 문서는 **단순 작업은 Next/Form 또는 기본 form**, **실무 CRUD Form은 React Hook Form + Zod**를 기준으로 설명합니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 Form 구조가 필요한가?](#3-왜-form-구조가-필요한가)
- [4. 실무 기준](#4-실무-기준)
- [5. Form 방식 비교](#5-form-방식-비교)
- [6. Next/Form](#6-nextform)
- [7. React Hook Form](#7-react-hook-form)
- [8. Zod](#8-zod)
- [9. RHF + Zod 구조](#9-rhf--zod-구조)
- [10. defaultValues](#10-defaultvalues)
- [11. Controller / useController](#11-controller--usecontroller)
- [12. 공통 Form 컴포넌트](#12-공통-form-컴포넌트)
- [13. CRUD 적용 예제](#13-crud-적용-예제)
- [14. 코드 스니핏](#14-코드-스니핏)
- [15. Caution](#15-caution)
- [16. Best Practice](#16-best-practice)
- [17. 요약](#17-요약)

---

# 1. 한눈에 보기

Form은 사용자의 입력을 수집하고 검증한 뒤 서버로 전달하는 역할을 합니다.

```txt
Input
  ↓
Form State
  ↓
Validation
  ↓
Submit
  ↓
Server
```

---

## 사용 기준

| 상황 | 권장 방식 |
|---|---|
| 단순 검색 | 기본 form 또는 Next/Form |
| URL 기반 검색 | Next/Form 또는 nuqs |
| 복잡한 입력 폼 | React Hook Form |
| 타입 기반 검증 | Zod |
| 실무 CRUD Form | RHF + Zod |
| shadcn/ui Select 연결 | RHF useController |
| 서버 최종 검증 | Zod parse / safeParse |

---

## 핵심 결론

```txt
검색 Form
→ Next/Form 또는 nuqs

생성/수정 Form
→ React Hook Form + Zod

서버 검증
→ Zod 재검증

공통 입력 컴포넌트
→ useController 기반
```

---

# 2. 언제 사용하는가?

Form은 다음 기능에서 사용합니다.

- 로그인
- 회원가입
- 게시글 작성
- 게시글 수정
- 상품 등록
- 상품 수정
- 검색
- 필터
- 마이페이지 수정

---

## Form을 사용하지 않아도 되는 경우

단순 버튼 클릭, 토글, 모달 열림/닫힘은 Form으로 처리하지 않습니다.

| 상황 | 권장 |
|---|---|
| 좋아요 | Button + mutation |
| 북마크 | Button + mutation |
| 모달 열기 | Zustand 또는 useState |
| 사이드바 열기 | Zustand |
| 테마 변경 | Zustand 또는 next-themes |

---

# 3. 왜 Form 구조가 필요한가?

작은 Form은 직접 작성해도 문제가 없어 보입니다.

```tsx
const [title, setTitle] = useState('')
const [price, setPrice] = useState('')
```

하지만 입력 필드가 늘어나면 다음 문제가 생깁니다.

- 상태 코드 증가
- 에러 처리 중복
- submit 로직 중복
- validation 중복
- 타입 불일치
- 서버 검증 누락
- 공통 UI 작성 어려움

---

## 구조화된 Form 흐름

```txt
Schema
  ↓
defaultValues
  ↓
useForm
  ↓
FormInput / FormSelect
  ↓
handleSubmit
  ↓
mutation
  ↓
Server Action
  ↓
Server Validation
```

---

# 4. 실무 기준

## 권장

```txt
RHF
+
Zod
+
zodResolver
+
Server Validation
```

---

## 역할 분리

| 역할 | 담당 |
|---|---|
| 입력 상태 | React Hook Form |
| 클라이언트 검증 | Zod + zodResolver |
| 서버 검증 | Zod parse |
| UI 컴포넌트 | shared/components/form |
| 변경 요청 | useMutation |
| 서버 처리 | Server Action |
| 비즈니스 규칙 | service |
| DB/API 접근 | repository |

---

# 5. Form 방식 비교

| 방식 | 장점 | 단점 | 사용 기준 |
|---|---|---|---|
| 기본 HTML form | 단순, 브라우저 기본 동작 | 복잡한 상태 관리 어려움 | 매우 단순한 제출 |
| Controlled Component | React 상태로 직접 제어 | 코드 증가, 리렌더링 증가 | 소규모 입력 |
| Next/Form | App Router 검색/submit에 적합 | 복잡한 입력 상태 관리에는 부족 | 검색, URL 이동 |
| React Hook Form | 성능 좋고 실무 Form에 적합 | 초기 패턴 필요 | 생성/수정/회원가입 |
| RHF + Zod | 타입/검증 통합 | schema 설계 필요 | 실무 기본 |

---

# 6. Next/Form

`next/form`은 Next.js App Router에서 Form 제출과 라우팅을 편하게 처리하기 위한 기능입니다.

```tsx
import Form from 'next/form'
```

---

## 언제 사용하는가?

적합:

- 검색
- 필터
- query string 기반 이동
- 단순 submit
- 입력 상태를 복잡하게 관리하지 않아도 되는 경우

---

## 예시

```tsx
import Form from 'next/form'

export function SnackSearchForm() {
  return (
    <Form action="/snack">
      <input name="keyword" placeholder="검색어" />
      <button type="submit">검색</button>
    </Form>
  )
}
```

결과:

```txt
/snack?keyword=검색어
```

---

## Next/Form이 적합하지 않은 경우

다음 경우에는 RHF를 사용하는 편이 좋습니다.

- 입력 필드가 많다.
- 에러 메시지를 필드별로 보여줘야 한다.
- shadcn/ui Select, DatePicker 등과 연결해야 한다.
- 동적 배열 입력이 있다.
- 생성/수정 Form이다.
- submit 전 복잡한 validation이 필요하다.

---

# 7. React Hook Form

React Hook Form은 Form 상태를 효율적으로 관리하는 라이브러리입니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| useForm | Form 상태 생성 |
| register | native input 연결 |
| handleSubmit | submit 처리 |
| control | controlled component 연결 |
| reset | 값 초기화 |
| setValue | 값 직접 변경 |
| watch | 값 감시 |
| formState | 에러, dirty, submitting 상태 |

---

## 기본 예시

```tsx
'use client'

import { useForm } from 'react-hook-form'

type FormValues = {
  title: string
  price: number
}

export function SnackForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      price: 0
    }
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('title')} />
      <input type="number" {...form.register('price', { valueAsNumber: true })} />
      <button type="submit">저장</button>
    </form>
  )
}
```

---

# 8. Zod

Zod는 TypeScript 친화적인 schema validation 라이브러리입니다.

---

## 사용하는 이유

- Client/Server에서 같은 schema 사용 가능
- 타입 추론 가능
- RHF와 연결 가능
- API 입력값 검증 가능
- FormInput 타입과 연결 가능

---

## 기본 예시

```ts
import { z } from 'zod'

export const createSnackSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력해주세요.'),
  price: z.coerce.number().min(0, '가격은 0원 이상이어야 합니다.')
})

export type CreateSnackInput = z.infer<typeof createSnackSchema>
```

---

## 자주 사용하는 기능

| 기능 | 사용 예 |
|---|---|
| z.string() | 문자열 |
| z.number() | 숫자 |
| z.coerce.number() | 문자열을 숫자로 변환 |
| z.enum() | 정해진 값만 허용 |
| .optional() | 선택값 |
| .default() | 기본값 |
| .refine() | 필드 간 검증 |
| .partial() | 수정 Form |

---

# 9. RHF + Zod 구조

## 기본 흐름

```txt
Zod Schema
  ↓
z.infer
  ↓
useForm<T>
  ↓
zodResolver
  ↓
Form UI
  ↓
handleSubmit
```

---

## 예시

```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  createSnackSchema,
  type CreateSnackInput
} from '../schema/snack.schema'

export function SnackForm() {
  const form = useForm<CreateSnackInput>({
    resolver: zodResolver(createSnackSchema),
    defaultValues: {
      title: '',
      brand: '',
      category: '',
      contents: '',
      price: 0
    }
  })

  function onSubmit(values: CreateSnackInput) {
    console.log(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* fields */}
    </form>
  )
}
```

---

# 10. defaultValues

RHF에서는 `defaultValues`를 명시하는 것이 중요합니다.

---

## 생성 Form

```ts
const createSnackDefaultValues = {
  title: '',
  brand: '',
  category: '',
  contents: '',
  price: 0
}
```

---

## 수정 Form

```tsx
const form = useForm<UpdateSnackInput>({
  resolver: zodResolver(updateSnackSchema),
  defaultValues: {
    title: snack.title,
    brand: snack.brand,
    category: snack.category,
    contents: snack.contents ?? '',
    price: snack.price
  }
})
```

---

## 비동기 데이터 주의

`defaultValues`는 최초 1회 기준입니다.

비동기로 데이터를 받아온 뒤 값이 바뀌어야 한다면 `reset`을 사용합니다.

```tsx
useEffect(() => {
  form.reset({
    title: data.title,
    price: data.price
  })
}, [data, form])
```

---

# 11. Controller / useController

shadcn/ui, Radix UI 같은 controlled component는 `register`만으로 연결하기 어려운 경우가 많습니다.

이때 `Controller` 또는 `useController`를 사용합니다.

---

## Controller

```tsx
<Controller
  control={form.control}
  name="brand"
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      {/* SelectItem */}
    </Select>
  )}
/>
```

---

## useController

공통 Form 컴포넌트를 만들 때는 `useController`가 더 적합합니다.

```tsx
const { field, fieldState } = useController({
  control,
  name
})
```

---

## 실무 기준

| 상황 | 권장 |
|---|---|
| 한 번만 연결 | Controller |
| 공통 컴포넌트 작성 | useController |
| shadcn/ui Select 공통화 | useController |
| FormInput 공통화 | useController 또는 register |

---

# 12. 공통 Form 컴포넌트

## 목표

Form마다 input 코드를 반복하지 않도록 공통 컴포넌트를 만듭니다.

```txt
FormInput
FormSelect
FormTextarea
FormDatePicker
```

---

## FormInput 예시

```tsx
'use client'

import {
  useController,
  type Control,
  type FieldValues,
  type Path
} from 'react-hook-form'

type FormInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: string
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text'
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({ control, name })

  return (
    <div>
      <label>{label}</label>
      <input {...field} type={type} placeholder={placeholder} />
      {error?.message && <p>{error.message}</p>}
    </div>
  )
}
```

---

## FormSelect 예시

```tsx
'use client'

import {
  useController,
  type Control,
  type FieldValues,
  type Path
} from 'react-hook-form'

type FormSelectItem = {
  label: string
  value: string
}

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  items: FormSelectItem[]
  placeholder?: string
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  items,
  placeholder = '선택'
}: FormSelectProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({ control, name })

  return (
    <div>
      <label>{label}</label>
      <select value={field.value ?? ''} onChange={field.onChange}>
        <option value="">{placeholder}</option>
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error?.message && <p>{error.message}</p>}
    </div>
  )
}
```

> shadcn/ui Select를 사용할 경우 내부 구현은 Radix Select에 맞춰 변경하면 됩니다.  
> 핵심은 `value={field.value}`와 `onValueChange={field.onChange}` 연결입니다.

---

# 13. CRUD 적용 예제

## 검색 Form

검색은 URL 상태와 연결하는 것이 일반적입니다.

```txt
Search Form
  ↓
URL query string
  ↓
page.tsx searchParams
  ↓
queryKey
  ↓
useSuspenseQuery
```

단순 검색은 Next/Form 또는 nuqs를 사용합니다.

---

## 생성 Form

```txt
SnackForm
  ↓
RHF
  ↓
Zod
  ↓
useCreateSnack
  ↓
createSnackAction
```

---

## 수정 Form

```txt
Page에서 상세 데이터 prefetch
  ↓
EditForm defaultValues
  ↓
RHF
  ↓
useUpdateSnack
```

---

## 회원가입 Form

```txt
SignupForm
  ↓
RHF
  ↓
signupSchema
  ↓
signUpAction
  ↓
authService.signup
```

---

# 14. 코드 스니핏

## Snack Form

```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateSnack } from '../hooks/use-snack'
import {
  createSnackSchema,
  type CreateSnackInput
} from '../schema/snack.schema'

const defaultValues: CreateSnackInput = {
  title: '',
  brand: '',
  category: '',
  contents: '',
  price: 0
}

export function SnackCreateForm() {
  const form = useForm<CreateSnackInput>({
    resolver: zodResolver(createSnackSchema),
    defaultValues
  })

  const { mutateAsync, isPending } = useCreateSnack()

  async function onSubmit(values: CreateSnackInput) {
    await mutateAsync(values)
    form.reset(defaultValues)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('title')} placeholder="제목" />
      <input {...form.register('brand')} placeholder="브랜드" />
      <input {...form.register('category')} placeholder="카테고리" />
      <textarea {...form.register('contents')} placeholder="내용" />
      <input type="number" {...form.register('price')} />

      <button type="submit" disabled={isPending}>
        {isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
```

---

## Snack Edit Form

```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateSnack } from '../hooks/use-snack'
import {
  createSnackSchema,
  type CreateSnackInput
} from '../schema/snack.schema'
import type { Snack } from '../types/snack.type'

export function SnackEditForm({ snack }: { snack: Snack }) {
  const form = useForm<CreateSnackInput>({
    resolver: zodResolver(createSnackSchema),
    defaultValues: {
      title: snack.title,
      brand: snack.brand,
      category: snack.category,
      contents: snack.contents ?? '',
      price: snack.price
    }
  })

  const { mutateAsync, isPending } = useUpdateSnack(snack.id)

  async function onSubmit(values: CreateSnackInput) {
    await mutateAsync(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('title')} />
      <input {...form.register('brand')} />
      <input {...form.register('category')} />
      <textarea {...form.register('contents')} />
      <input type="number" {...form.register('price')} />

      <button type="submit" disabled={isPending}>
        {isPending ? '수정 중...' : '수정'}
      </button>
    </form>
  )
}
```

---

## Signup Form

```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signUpAction } from '../actions/auth.action'
import { signupSchema, type SignupInput } from '../schema/auth.schema'

const defaultValues: SignupInput = {
  displayName: '',
  email: '',
  password: '',
  passwordConfirm: ''
}

export function SignupForm() {
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues
  })

  async function onSubmit(values: SignupInput) {
    await signUpAction(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('displayName')} placeholder="이름" />
      <input {...form.register('email')} placeholder="이메일" />
      <input {...form.register('password')} type="password" placeholder="비밀번호" />
      <input
        {...form.register('passwordConfirm')}
        type="password"
        placeholder="비밀번호 확인"
      />

      <button type="submit">회원가입</button>
    </form>
  )
}
```

---

## Server Action에서 재검증

```ts
'use server'

import { createSnackSchema } from '../schema/snack.schema'
import { snackService } from '../services/snack.service'

export async function createSnackAction(input: unknown) {
  const payload = createSnackSchema.parse(input)

  return snackService.create(payload)
}
```

Client에서 이미 검증했더라도 Server에서 다시 검증해야 합니다.

---

# 15. Caution

## 1. Client Validation만 믿지 않기

Client 검증은 UX 목적입니다.

보안 기준은 반드시 Server Validation입니다.

```txt
Client Validation
→ 사용자 경험

Server Validation
→ 보안 / 데이터 무결성
```

---

## 2. defaultValues를 생략하지 않기

RHF에서 `defaultValues`가 없으면 controlled/uncontrolled 관련 문제가 생기거나 값 추적이 불명확해질 수 있습니다.

---

## 3. input type number를 그대로 믿지 않기

브라우저 input 값은 기본적으로 문자열입니다.

권장:

```ts
z.coerce.number()
```

또는 RHF register 옵션:

```tsx
register('price', { valueAsNumber: true })
```

단, schema 기준으로 일관되게 처리하려면 `z.coerce.number()`가 편합니다.

---

## 4. shadcn/ui Select는 register로 직접 연결하지 않기

Radix 기반 Select는 native select가 아닙니다.

권장:

```txt
Controller 또는 useController
```

---

## 5. 수정 Form에서 defaultValues 갱신 착각하지 않기

`defaultValues`는 최초 1회 적용됩니다.

비동기 데이터 변경 시:

```tsx
form.reset(data)
```

---

## 6. FormData와 객체 입력을 혼동하지 않기

Server Action은 `FormData`도 받을 수 있고 객체도 받을 수 있습니다.

| 방식 | 사용 |
|---|---|
| `<form action={action}>` | FormData |
| `useMutation(() => action(values))` | 객체 |

RHF + useMutation을 사용한다면 객체 입력이 더 자연스럽습니다.

---

# 16. Best Practice

## 권장

- 생성/수정/회원가입은 RHF + Zod 사용
- 검색은 URL 기반으로 처리
- 단순 검색은 Next/Form 또는 nuqs 사용
- schema는 features의 schema 폴더에 배치
- Client/Server에서 같은 schema 재사용
- defaultValues는 명시
- 공통 FormInput은 useController 기반으로 작성
- shadcn/ui Select는 Controller/useController로 연결
- Server Action에서 Zod로 재검증
- mutation 성공 후 invalidateQueries 처리

---

## 비권장

- 모든 입력을 useState로 관리
- Client Validation만 수행
- Form마다 schema 중복 작성
- number input 값을 문자열 그대로 서버에 전달
- shadcn/ui Select를 register로 직접 연결
- 수정 Form에서 reset 없이 비동기 defaultValues 기대
- Server Action 내부에서 검증 없이 service 호출
- Form 컴포넌트 안에서 직접 DB/API 접근

---

# 17. 요약

## 기준

```txt
단순 검색
→ Next/Form 또는 nuqs

실무 Form
→ React Hook Form + Zod

서버 검증
→ Zod parse

공통 컴포넌트
→ useController
```

---

## 생성/수정 흐름

```txt
Form
  ↓
RHF
  ↓
Zod
  ↓
useMutation
  ↓
Server Action
  ↓
Service
  ↓
Repository
```

---

## 핵심 원칙

```txt
Form State는 RHF

Validation은 Zod

Server 최종 검증은 필수

공통 UI는 shared/components/form

도메인 Form은 features/{domain}/components
```
