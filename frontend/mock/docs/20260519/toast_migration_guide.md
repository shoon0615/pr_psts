# Toast / Alert 적용 가이드

현재 상태는 `console.log` 정도만 사용하고 있고, 사용자에게 보여줄 `alert`, `toast`, `Dialog` 관련 처리는 아직 설정되어 있지 않은 상태를 기준으로 정리합니다.

## 1. 결론

앞으로는 아래 기준으로 분리해서 사용하는 방향이 좋습니다.

| 상황                        | 권장 방식                             | 이유                                                            |
| --------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| 개발 중 값 확인             | `console.log`                         | 개발자 확인용. 사용자에게 보이지 않음                           |
| 단순 결과 알림              | `toast` / `sonner`                    | 저장 완료, 삭제 완료, 실패 메시지 등 non-blocking 알림에 적합   |
| 사용자의 확인이 필요한 작업 | `AlertDialog`                         | 삭제, 탈퇴, 결제 등 사용자가 명확히 확인해야 하는 동작에 적합   |
| 입력 오류 표시              | `FormMessage` + 필요 시 `toast.error` | 필드 단위 오류는 form 내부에 표시하고, 전체 실패는 toast로 보조 |
| 치명적 오류 화면            | `error.tsx`, Error Boundary           | 페이지 자체가 정상적으로 렌더링되지 못하는 경우                 |

즉, 기본 방향은 다음과 같습니다.

```txt
console.log → 개발 중 디버깅 전용
alert      → 가급적 사용하지 않음
sonner     → 일반 알림
AlertDialog → 사용자 확인이 필요한 경고/확인 UI
```

---

## 2. `alert`와 `toast`의 차이

### `alert`

브라우저 기본 제공 UI입니다.

```ts
alert('저장되었습니다.')
```

단점이 명확합니다.

- 브라우저 동작을 멈춥니다.
- 확인 버튼을 누르기 전까지 다음 동작이 진행되지 않습니다.
- 브라우저마다 UI가 다릅니다.
- 디자인 커스터마이징이 어렵습니다.
- React / Next.js UI 흐름과 잘 어울리지 않습니다.

그래서 일반적인 저장 완료, 삭제 완료, 등록 실패 같은 메시지는 `alert`보다 `toast`가 적합합니다.

### `toast`

화면 한쪽에 잠깐 나타나는 알림입니다.

```ts
toast.success('저장되었습니다.')
```

장점은 다음과 같습니다.

- 브라우저 동작을 막지 않습니다.
- 사용자가 확인 버튼을 누르지 않아도 됩니다.
- 앱 전체에서 일관된 디자인을 사용할 수 있습니다.
- 성공, 실패, 경고, 로딩 상태를 표현하기 좋습니다.
- React Query mutation 후처리와 잘 맞습니다.

---

## 3. 사용할 라이브러리 기준

현재 프로젝트에서는 `shadcn/ui`의 `sonner` 사용을 기준으로 잡는 것이 좋습니다.

### 사용 권장

```ts
import { toast } from 'sonner'
```

```tsx
import { Toaster } from '@/shared/components/shadcn/ui/sonner'
```

### 사용 비권장 / 구버전 정리 대상

아래 파일들이 프로젝트에 있더라도 새 코드에서는 사용하지 않는 방향이 좋습니다.

```ts
/** @deprecated sonner 사용 권장 */
import { useToast } from '@/shared/hooks/use-toast'
import { Toast } from '@/shared/components/shadcn/ui/toast'
import { Toaster } from '@/shared/components/shadcn/ui/toaster'
```

이유는 `shadcn/ui`에서 현재 `Sonner` 컴포넌트를 별도 컴포넌트로 제공하고 있고, `toast` 호출도 `sonner` 패키지의 API를 직접 사용하는 구조가 단순하기 때문입니다.

---

## 4. 설치 및 기본 설정

### 4-1. shadcn/ui sonner 추가

```bash
npx shadcn@latest add sonner
```

일반적으로 아래와 같은 파일이 생성됩니다.

```txt
components/ui/sonner.tsx
```

현재 프로젝트 구조에 맞춘다면 예를 들어 아래처럼 둘 수 있습니다.

```txt
shared/components/ui/sonner.tsx
```

---

## 5. 전역 Toaster 설정

`toast()`를 호출해도 화면에 표시되려면 앱 어딘가에 `<Toaster />`가 렌더링되어 있어야 합니다.

Next.js App Router 기준으로는 보통 root layout 또는 provider 영역에 한 번만 추가합니다.

```tsx
// app/layout.tsx
import { Toaster } from '@/shared/components/shadcn/ui/sonner'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  )
}
```

### 권장 기본값

```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
/>
```

| 옵션                    | 의미                                 | 권장 여부                                  |
| ----------------------- | ------------------------------------ | ------------------------------------------ |
| `position="top-center"` | toast 위치                           | 화면 상단 중앙. 폼 제출 결과 알림에 무난함 |
| `richColors`            | success/error/warning 등에 색상 적용 | 사용 권장                                  |
| `closeButton`           | 닫기 버튼 표시                       | 사용 권장                                  |
| `duration={3000}`       | 3초 후 자동 닫힘                     | 기본 알림에 무난함                         |

---

## 6. 기본 사용 예제

### 6-1. 일반 메시지

```tsx
'use client'

import { toast } from 'sonner'

export function SaveButton() {
  return <button onClick={() => toast('저장되었습니다.')}>저장</button>
}
```

### 6-2. 성공 메시지

```tsx
toast.success('제출 성공', {
  description: '과자가 성공적으로 등록되었습니다.'
})
```

### 6-3. 실패 메시지

```tsx
toast.error('제출 실패', {
  description: '잠시 후 다시 시도해주세요.'
})
```

### 6-4. 경고 메시지

```tsx
toast.warning('입력 확인 필요', {
  description: '필수 항목을 모두 입력해주세요.'
})
```

### 6-5. 정보 메시지

```tsx
toast.info('안내', {
  description: '검색 조건이 초기화되었습니다.'
})
```

---

## 7. 기존 `console.log`를 어떻게 바꿀지

현재 개발 중에는 아래처럼 작성되어 있을 가능성이 큽니다.

```ts
console.log('등록 성공')
console.log('등록 실패', error)
```

앞으로는 아래처럼 분리하는 것이 좋습니다.

```ts
console.error(error) // 개발자 확인용

toast.error('등록 실패', {
  description: '과자 등록 중 문제가 발생했습니다.'
})
```

정리하면 다음 기준입니다.

| 목적                      | 사용                                                          |
| ------------------------- | ------------------------------------------------------------- |
| 개발자가 내부 값을 확인   | `console.log`, `console.error`                                |
| 사용자에게 결과를 안내    | `toast.success`, `toast.error`, `toast.warning`, `toast.info` |
| 사용자의 선택을 받아야 함 | `AlertDialog`                                                 |

---

## 8. React Query mutation에서 사용

등록, 수정, 삭제 같은 mutation 작업에서는 `onSuccess`, `onError` 또는 `mutateAsync + try/catch`에서 toast를 사용하면 됩니다.

### 8-1. `onSuccess`, `onError` 방식

```tsx
'use client'

import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSnack } from '@/features/snack/services/snack.service'
import { snackKeys } from '@/features/snack/queries/snack.keys'

export function useCreateSnack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSnack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snackKeys.lists() })

      toast.success('등록 완료', {
        description: '과자가 성공적으로 등록되었습니다.'
      })
    },
    onError: error => {
      console.error(error)

      toast.error('등록 실패', {
        description: '과자 등록 중 문제가 발생했습니다.'
      })
    }
  })
}
```

이 방식은 mutation hook 안에서 공통 후처리를 관리하기 좋습니다.

---

### 8-2. `mutateAsync + try/catch` 방식

등록 성공 후 페이지 이동까지 필요하면 이 방식이 더 명확합니다.

```tsx
'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useCreateSnack } from '@/features/snack/queries/use-create-snack'
import type { CreateSnackInput } from '@/features/snack/schema/snack.schema'

export default function NewSnackPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateSnack()

  async function onSubmit(formData: CreateSnackInput) {
    try {
      await mutateAsync(formData)

      toast.success('등록 완료', {
        description: '과자가 성공적으로 등록되었습니다.'
      })

      router.push('/snack')
    } catch (error) {
      console.error(error)

      toast.error('등록 실패', {
        description: '입력값을 확인하거나 잠시 후 다시 시도해주세요.'
      })
    }
  }

  return (
    <button
      type="submit"
      disabled={isPending}>
      {isPending ? '등록 중...' : '등록'}
    </button>
  )
}
```

이 방식은 다음 흐름이 한눈에 보입니다.

```txt
등록 요청
  ↓
성공
  ↓
toast.success
  ↓
목록 페이지 이동
```

---

## 9. `toast.promise` 사용 예제

`toast.promise`는 비동기 작업의 상태를 `loading`, `success`, `error`로 자동 연결할 때 사용합니다.

```tsx
await toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: '등록 완료',
  error: '등록 실패'
})
```

설명을 포함하고 싶으면 아래처럼 작성할 수 있습니다.

```tsx
await toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: () => ({
    message: '등록 완료',
    description: '과자가 성공적으로 등록되었습니다.'
  }),
  error: () => ({
    message: '등록 실패',
    description: '과자 등록 중 문제가 발생했습니다.'
  })
})
```

다만 `router.push()` 같은 후속 흐름이 있다면 아래처럼 `try/catch`와 함께 쓰는 편이 읽기 쉽습니다.

```tsx
try {
  await toast.promise(mutateAsync(formData), {
    loading: '등록 중...',
    success: '등록 완료',
    error: '등록 실패'
  })

  router.push('/snack')
} catch (error) {
  console.error(error)
}
```

---

## 10. 삭제 기능 예제: AlertDialog + toast

삭제처럼 사용자의 확인이 필요한 작업은 toast만으로 처리하면 부족합니다.

좋은 흐름은 다음과 같습니다.

```txt
삭제 버튼 클릭
  ↓
AlertDialog로 확인
  ↓
사용자가 삭제 확정
  ↓
mutation 실행
  ↓
성공하면 toast.success
  ↓
실패하면 toast.error
```

예제입니다.

```tsx
'use client'

import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/components/shadcn/ui/alert-dialog'

export function DeleteSnackButton({ id }: { id: number }) {
  async function handleDelete() {
    try {
      // await deleteSnack(id)

      toast.success('삭제 완료', {
        description: '과자가 삭제되었습니다.'
      })
    } catch (error) {
      console.error(error)

      toast.error('삭제 실패', {
        description: '삭제 중 문제가 발생했습니다.'
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button">삭제</button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제한 데이터는 복구하기 어렵습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

## 11. 공통 유틸로 감싸기

프로젝트가 커지면 매번 메시지를 직접 작성하기보다 공통 helper를 만들 수 있습니다.

```txt
shared/lib/toast.ts
```

```ts
// shared/lib/toast.ts
import { toast } from 'sonner'

export const appToast = {
  success(message: string, description?: string) {
    toast.success(message, { description })
  },

  error(message: string, description = '잠시 후 다시 시도해주세요.') {
    toast.error(message, { description })
  },

  warning(message: string, description?: string) {
    toast.warning(message, { description })
  },

  info(message: string, description?: string) {
    toast.info(message, { description })
  }
}
```

사용 예제입니다.

```ts
import { appToast } from '@/shared/lib/toast'

appToast.success('등록 완료', '과자가 성공적으로 등록되었습니다.')
appToast.error('등록 실패')
```

다만 처음부터 무리하게 감싸지는 않아도 됩니다.

초기에는 `import { toast } from 'sonner'`를 직접 사용하고, 메시지 패턴이 반복되기 시작하면 `appToast` 같은 helper를 추가하는 정도가 적당합니다.

---

## 12. 권장 적용 순서

### 1단계. 전역 Toaster 추가

```tsx
// app/layout.tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
/>
```

### 2단계. 등록/수정/삭제 mutation에 toast 추가

```ts
toast.success('등록 완료')
toast.error('등록 실패')
```

### 3단계. `console.log` 정리

```ts
console.log('등록 성공') // 제거 또는 개발 중에만 사용
```

사용자에게 보여야 하는 메시지는 toast로 변경합니다.

### 4단계. 삭제/탈퇴/결제 등은 AlertDialog 적용

```txt
확인이 필요한 작업 → AlertDialog
작업 결과 안내 → toast
```

### 5단계. 반복 메시지는 공통 유틸로 분리

```txt
shared/lib/toast.ts
```

---

## 13. 실무 기준 정리

### toast를 쓰기 좋은 경우

```txt
등록 완료
수정 완료
삭제 완료
저장 실패
네트워크 오류
검색 조건 초기화
복사 완료
임시 저장 완료
```

### toast만 쓰면 부족한 경우

```txt
정말 삭제하시겠습니까?
회원 탈퇴를 진행하시겠습니까?
결제를 진행하시겠습니까?
권한을 변경하시겠습니까?
```

이런 경우는 `AlertDialog`로 먼저 확인을 받고, 결과를 `toast`로 알려주는 방식이 좋습니다.

---

## 14. 최종 추천 구조

```txt
app/
└─ layout.tsx
   └─ <Toaster /> 전역 설정

shared/
├─ components/
│  └─ ui/
│     ├─ sonner.tsx
│     └─ alert-dialog.tsx
└─ lib/
   └─ toast.ts        # 선택사항. 반복 메시지가 많아지면 추가

features/
└─ snack/
   ├─ queries/
   │  └─ use-create-snack.ts
   └─ components/
      ├─ snack-form.tsx
      └─ delete-snack-button.tsx
```

---

## 15. 한 줄 결론

현재처럼 `console.log`만 있는 상태라면 먼저 `sonner`의 `<Toaster />`를 전역에 추가하고, 등록/수정/삭제 같은 mutation 결과부터 `toast.success`, `toast.error`로 바꾸는 것이 가장 현실적인 첫 단계입니다.

`alert`는 일반 알림 용도로는 사용하지 말고, 사용자의 확인이 필요한 작업은 `AlertDialog`, 작업 결과 안내는 `toast`로 분리하는 것이 좋습니다.

---

## 참고

- shadcn/ui Sonner 문서: https://ui.shadcn.com/docs/components/sonner
- Sonner 공식 문서: https://sonner.emilkowal.ski/
