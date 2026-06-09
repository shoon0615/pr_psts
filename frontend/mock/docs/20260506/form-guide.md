# Form 컴포넌트 사용 가이드

`@shared/components/ui/form.tsx`는 [React Hook Form](https://react-hook-form.com/)과 [Radix UI](https://www.radix-ui.com/)를 기반으로 구축된 폼 컴포넌트 라이브러리입니다. 이 가이드는 해당 컴포넌트의 구조와 기본적인 사용 방법을 설명합니다.

## 1. 주요 컴포넌트 구성

- **Form**: `react-hook-form`의 `FormProvider`를 래핑한 컴포넌트로, 폼의 상태를 하위 컴포넌트에 공유합니다.
- **FormField**: 각 입력 필드를 정의하며 `react-hook-form`의 `Controller`를 내부적으로 사용하여 상태를 관리합니다.
- **FormItem**: 폼 필드의 개별 항목(레이블, 입력창, 설명, 에러 메시지)을 감싸는 컨테이너입니다. 접근성을 위한 ID 생성을 담당합니다.
- **FormLabel**: 입력 필드에 대한 레이블입니다. 에러 발생 시 자동으로 강조 스타일이 적용됩니다.
- **FormControl**: 실제 입력 요소(`Input`, `Select`, `Textarea` 등)를 감싸는 컴포넌트로, 접근성 속성(`aria-*`)을 자동으로 연결합니다.
- **FormDescription**: 입력 필드에 대한 추가 설명 텍스트입니다.
- **FormMessage**: 유효성 검사 실패 시 나타나는 에러 메시지를 표시합니다.

---

## 2. 기본 사용 방법

### 필수 라이브러리 설치 확인
```bash
npm install react-hook-form zod @hookform/resolvers/zod @radix-ui/react-label @radix-ui/react-slot
```

### 단계별 적용 가이드

#### 1) 스키마 정의 (Zod)
```typescript
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "사용자 이름은 최소 2글자 이상이어야 합니다.",
  }),
})
```

#### 2) 폼 초기화
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    username: "",
  },
})

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values)
}
```

#### 3) UI 렌더링
```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"

export function ProfileForm() {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자 이름</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                공개적으로 표시될 이름입니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">제출</Button>
      </form>
    </Form>
  )
}
```

---

## 3. 고급 활용 및 팁

### 커스텀 입력 컴포넌트 연결
`FormControl`은 하위 요소로 전달된 컴포넌트에 접근성 관련 속성(`id`, `aria-describedby` 등)을 주입합니다. 만약 커스텀 컴포넌트를 사용한다면 `forwardRef`가 적용되어 있어야 정상적으로 동작합니다.

### 폼 필드 상태 접근
`useFormField` 훅을 사용하면 `FormField` 내부 어디서든 현재 필드의 에러 상태나 ID 등에 접근할 수 있습니다.
```tsx
const { error, formItemId, isDirty } = useFormField()
```

### 접근성(Accessibility)
이 컴포넌트는 다음과 같은 접근성 기능을 자동으로 처리합니다:
- `FormLabel`과 `FormControl`의 ID 기반 연결 (`htmlFor`)
- 에러 발생 시 `aria-invalid` 상태 업데이트
- 설명문 및 에러 메시지와 입력창의 연결 (`aria-describedby`)
