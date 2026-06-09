# Toast / Alert 적용 가이드 보강판

현재 상태는 사용자 알림 처리가 거의 없고, 개발 중 확인용 `console.log` 정도만 사용하는 상태를 기준으로 정리합니다.

목표는 아래처럼 역할을 분리하는 것입니다.

```txt
console.log   → 개발자 디버깅용
sonner toast  → 사용자에게 보여주는 가벼운 결과 알림
AlertDialog   → 사용자의 명확한 확인이 필요한 경고/확인 UI
FormMessage   → 필드 단위 입력 오류 표시
```

---

## 1. 결론

앞으로는 일반적인 성공/실패/경고 메시지는 `sonner`의 `toast`로 처리하는 것이 좋습니다.

| 상황                    | 권장 방식                      | 예시                                      |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| 개발 중 값 확인         | `console.log`, `console.error` | 응답 데이터 확인, 에러 객체 확인          |
| 등록/수정/삭제 성공     | `toast.success`                | `등록 완료`, `수정 완료`                  |
| 서버 오류/네트워크 실패 | `toast.error`                  | `등록 실패`, `잠시 후 다시 시도해주세요.` |
| 입력값 누락/주의 안내   | `toast.warning`                | `필수 항목을 입력해주세요.`               |
| 단순 안내               | `toast.info`                   | `검색 조건이 초기화되었습니다.`           |
| 삭제/탈퇴/결제 전 확인  | `AlertDialog`                  | `정말 삭제하시겠습니까?`                  |
| 필드별 검증 오류        | `FormMessage`                  | `브랜드를 선택해주세요.`                  |

`toast`는 사용자의 작업을 막지 않는 non-blocking 알림입니다. 반면 `alert()`는 브라우저 동작을 멈추고, 디자인도 통일하기 어렵기 때문에 일반 알림 용도로는 권장하지 않습니다.

---

## 2. 사용할 라이브러리 기준

현재는 `shadcn/ui`의 `sonner` 사용을 기준으로 잡는 것이 좋습니다.

### 사용 권장

```ts
import { toast } from 'sonner'
```

```tsx
import { Toaster } from '@/shared/components/shadcn/ui/sonner'
```

### 사용 비권장 / 정리 대상

프로젝트에 아래 파일들이 있더라도 새 코드에서는 `sonner`를 우선 사용하는 방향이 좋습니다.

```ts
/** @deprecated sonner 사용 권장 */
import { useToast } from '@/shared/hooks/use-toast'
import { Toast } from '@/shared/components/shadcn/ui/toast'
import { Toaster } from '@/shared/components/shadcn/ui/toaster'
```

정리 기준은 다음과 같습니다.

| 구분           | 상태                        | 앞으로의 방향               |
| -------------- | --------------------------- | --------------------------- |
| `use-toast.ts` | shadcn/ui 구버전 Toast 패턴 | 새 코드에서는 사용하지 않음 |
| `toast.tsx`    | Radix Toast 기반 UI         | 필요 없다면 deprecated 처리 |
| `toaster.tsx`  | Radix Toast 렌더러          | 필요 없다면 deprecated 처리 |
| `sonner.tsx`   | Sonner 기반 Toaster         | 현재 기준으로 사용 권장     |

---

## 3. 설치 및 기본 설정

```bash
npx shadcn@latest add sonner
```

일반적으로 아래 파일이 생성됩니다.

```txt
components/ui/sonner.tsx
```

프로젝트 구조에 맞춰 아래처럼 둘 수 있습니다.

```txt
shared/components/ui/sonner.tsx
```

---

## 4. layout.tsx 전역 Toaster 설정

`toast()`를 호출해도 앱 어딘가에 `<Toaster />`가 렌더링되어 있지 않으면 화면에 표시되지 않습니다.

Next.js App Router 기준으로는 보통 root layout에 한 번만 추가합니다.

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

---

## 5. Toaster 전역 옵션 예제

처음에는 단순 설정으로 시작하는 것이 좋습니다.

```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
/>
```

커스터마이징이 필요하면 아래처럼 `toastOptions`, `icons`를 추가할 수 있습니다.

```tsx
// app/layout.tsx
import { Toaster } from '@/shared/components/shadcn/ui/sonner'
import {
  CheckCircle2,
  Info,
  Loader2,
  TriangleAlert,
  XCircle
} from 'lucide-react'

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
          toastOptions={{
            classNames: {
              toast: 'group toast',
              title: 'text-sm font-semibold',
              description: 'text-sm text-muted-foreground',
              actionButton: 'bg-primary text-primary-foreground',
              cancelButton: 'bg-muted text-muted-foreground',
              closeButton: 'border-border'
            }
          }}
          icons={{
            success: <CheckCircle2 className="size-4" />,
            info: <Info className="size-4" />,
            warning: <TriangleAlert className="size-4" />,
            error: <XCircle className="size-4" />,
            loading: <Loader2 className="size-4 animate-spin" />
          }}
        />
      </body>
    </html>
  )
}
```

### 전역 Toaster 옵션 표

| 옵션                                   | 예시                      | 의미                                 | 권장 기준                            |
| -------------------------------------- | ------------------------- | ------------------------------------ | ------------------------------------ |
| `position`                             | `"top-center"`            | toast 표시 위치                      | 폼 제출 결과는 `top-center`가 무난함 |
| `richColors`                           | `true`                    | success/error/warning/info 색상 강조 | 사용 권장                            |
| `closeButton`                          | `true`                    | 닫기 버튼 표시                       | 사용 권장                            |
| `duration`                             | `3000`                    | 자동 닫힘 시간(ms)                   | 기본 알림은 3000ms 정도              |
| `toastOptions.style`                   | `{ background: 'red' }`   | 모든 toast에 inline style 적용       | 전역 색상 강제는 신중히 사용         |
| `toastOptions.className`               | `'my-toast'`              | 모든 toast에 className 적용          | 간단한 공통 스타일에 사용            |
| `toastOptions.classNames.toast`        | `'group toast'`           | toast wrapper class                  | 세부 커스터마이징 시 사용            |
| `toastOptions.classNames.title`        | `'font-semibold'`         | 제목 class                           | 디자인 시스템에 맞출 때 사용         |
| `toastOptions.classNames.description`  | `'text-muted-foreground'` | 설명 class                           | 디자인 시스템에 맞출 때 사용         |
| `toastOptions.classNames.actionButton` | `'bg-primary'`            | action 버튼 class                    | action 버튼을 자주 쓸 때 사용        |
| `toastOptions.classNames.cancelButton` | `'bg-muted'`              | cancel 버튼 class                    | cancel 버튼을 쓸 때 사용             |
| `toastOptions.classNames.closeButton`  | `'border-border'`         | 닫기 버튼 class                      | 닫기 버튼 디자인 조정 시 사용        |
| `icons.success`                        | `<CheckCircle2 />`        | 성공 아이콘                          | 프로젝트 아이콘 통일 시 사용         |
| `icons.error`                          | `<XCircle />`             | 실패 아이콘                          | 프로젝트 아이콘 통일 시 사용         |
| `icons.warning`                        | `<TriangleAlert />`       | 경고 아이콘                          | 프로젝트 아이콘 통일 시 사용         |
| `icons.info`                           | `<Info />`                | 정보 아이콘                          | 프로젝트 아이콘 통일 시 사용         |
| `icons.loading`                        | `<Loader2 />`             | 로딩 아이콘                          | promise/loading toast에 사용         |

### 전역 style 사용 시 주의

아래처럼 전역으로 강한 색상을 지정하면 `success`, `error`, `warning` 구분이 약해질 수 있습니다.

```tsx
<Toaster
  toastOptions={{
    style: {
      background: 'red'
    }
  }}
/>
```

그래서 실무에서는 보통 `richColors`를 먼저 사용하고, 세부 스타일은 `classNames`로 조정하는 편이 안전합니다.

---

## 6. 기본 toast 사용 예제

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

## 7. toast 타입별 옵션 한눈에 보기

`sonner`는 `toast.success`, `toast.error`, `toast.warning`, `toast.info`, `toast.loading`, `toast.promise` 같은 API를 사용할 수 있습니다.

| API               | 사용 상황        | 기본 예제                         | 주로 함께 쓰는 옵션                 |
| ----------------- | ---------------- | --------------------------------- | ----------------------------------- |
| `toast()`         | 일반 알림        | `toast('저장되었습니다.')`        | `description`, `action`, `duration` |
| `toast.success()` | 성공             | `toast.success('등록 완료')`      | `description`, `action`, `duration` |
| `toast.error()`   | 실패             | `toast.error('등록 실패')`        | `description`, `duration`           |
| `toast.warning()` | 경고             | `toast.warning('입력 확인 필요')` | `description`, `action`             |
| `toast.info()`    | 안내             | `toast.info('안내')`              | `description`, `duration`           |
| `toast.loading()` | 수동 로딩        | `toast.loading('처리 중...')`     | `id`, `duration`                    |
| `toast.promise()` | 비동기 상태 연결 | `toast.promise(promise, options)` | `loading`, `success`, `error`       |
| `toast.dismiss()` | toast 닫기       | `toast.dismiss(id)`               | `id`                                |

### 자주 쓰는 옵션 표

| 옵션          | 타입 예시            | 의미                    | 예시                                         |
| ------------- | -------------------- | ----------------------- | -------------------------------------------- | ---------------------- |
| `description` | `string`             | 제목 아래 보조 설명     | `{ description: '과자가 등록되었습니다.' }`  |
| `duration`    | `number`             | 자동 닫힘 시간(ms)      | `{ duration: 3000 }`                         |
| `position`    | `"top-center"` 등    | 개별 toast 위치         | `{ position: 'top-center' }`                 |
| `action`      | `{ label, onClick }` | toast 안의 action 버튼  | `{ action: { label: '보기', onClick: fn } }` |
| `cancel`      | `{ label, onClick }` | 취소 버튼               | `{ cancel: { label: '닫기', onClick: fn } }` |
| `icon`        | `ReactNode`          | 개별 toast 아이콘       | `{ icon: <CheckIcon /> }`                    |
| `style`       | `CSSProperties`      | 개별 toast inline style | `{ style: { width: 400 } }`                  |
| `className`   | `string`             | 개별 toast class        | `{ className: 'my-toast' }`                  |
| `id`          | `string              | number`                 | toast 식별자                                 | `{ id: 'save-toast' }` |

---

## 8. 공통 appToast 래퍼 만들기

반복되는 메시지 패턴이 많아지면 `toast`를 직접 쓰는 대신 프로젝트용 래퍼를 둘 수 있습니다.

```txt
shared/lib/toast.ts
```

```ts
// shared/lib/toast.ts
import { toast } from 'sonner'

type ToastDescription = string | undefined

type PromiseMessages<T> = {
  loading: string
  success: string | ((data: T) => string)
  error?: string
}

export const appToast = {
  success(message: string, description?: ToastDescription) {
    toast.success(message, { description })
  },

  error(message: string, description = '잠시 후 다시 시도해주세요.') {
    toast.error(message, { description })
  },

  warning(message: string, description?: ToastDescription) {
    toast.warning(message, { description })
  },

  info(message: string, description?: ToastDescription) {
    toast.info(message, { description })
  },

  loading(message: string, id?: string) {
    return toast.loading(message, { id })
  },

  dismiss(id?: string) {
    toast.dismiss(id)
  },

  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error ?? '처리 중 문제가 발생했습니다.'
    })
  }
}
```

### appToast 메서드 표

| 메서드                                    | 목적             | 기본 description             | 사용 예시                                                         |
| ----------------------------------------- | ---------------- | ---------------------------- | ----------------------------------------------------------------- |
| `appToast.success(message, description?)` | 성공 알림        | 없음                         | `appToast.success('등록 완료', '과자가 등록되었습니다.')`         |
| `appToast.error(message, description?)`   | 실패 알림        | `잠시 후 다시 시도해주세요.` | `appToast.error('등록 실패')`                                     |
| `appToast.warning(message, description?)` | 경고 알림        | 없음                         | `appToast.warning('입력 확인 필요', '필수 항목을 입력해주세요.')` |
| `appToast.info(message, description?)`    | 안내 알림        | 없음                         | `appToast.info('검색 초기화')`                                    |
| `appToast.loading(message, id?)`          | 수동 로딩 표시   | 없음                         | `appToast.loading('저장 중...', 'save')`                          |
| `appToast.dismiss(id?)`                   | toast 닫기       | 해당 없음                    | `appToast.dismiss('save')`                                        |
| `appToast.promise(promise, messages)`     | 비동기 상태 연결 | error 기본값 있음            | `appToast.promise(mutateAsync(data), messages)`                   |

### appToast 사용 예시

```ts
import { appToast } from '@/shared/lib/toast'

appToast.success('등록 완료', '과자가 성공적으로 등록되었습니다.')
appToast.error('등록 실패')
appToast.warning('입력 확인 필요', '필수 항목을 모두 입력해주세요.')
appToast.info('안내', '검색 조건이 초기화되었습니다.')
```

처음부터 반드시 래퍼를 만들 필요는 없습니다. 다만 프로젝트에서 메시지 문구, 기본 실패 메시지, 위치, 액션 패턴을 통일하고 싶어지면 `appToast`를 두는 것이 좋습니다.

---

## 9. action 버튼 사용 보완

기존 예제는 아래 형태였습니다.

```ts
toast.success('제출 성공', {
  action: {
    label: '완료',
    onClick: () => console.log('Success')
  },
  actionButtonStyle: { backgroundColor: 'green' }
})
```

이 형태 자체는 가능하지만, 실무에서는 action을 단순 `console.log`로 끝내기보다 사용자가 바로 이어서 할 수 있는 행동을 연결하는 편이 좋습니다.

### action을 쓰기 좋은 경우

| 상황                   | action label | 동작 예시                              |
| ---------------------- | ------------ | -------------------------------------- |
| 등록 완료 후 상세 보기 | `상세 보기`  | `router.push('/snack/1')`              |
| 복사 완료 후 이동      | `열기`       | 새 페이지 이동                         |
| 삭제 후 되돌리기       | `되돌리기`   | optimistic rollback 또는 복구 API 호출 |
| 임시저장 완료          | `계속 작성`  | 현재 화면 유지 또는 editor focus       |
| 업로드 완료            | `파일 보기`  | 업로드 결과 페이지 이동                |

### 9-1. 등록 성공 후 상세 페이지 이동

```tsx
'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useCreateSnackSuccessToast() {
  const router = useRouter()

  return function showCreateSuccessToast(id: number) {
    toast.success('등록 완료', {
      description: '과자가 성공적으로 등록되었습니다.',
      action: {
        label: '상세 보기',
        onClick: () => router.push(`/snack/${id}`)
      }
    })
  }
}
```

### 9-2. 삭제 후 되돌리기 action

삭제 작업은 실제로 되돌리기까지 구현하려면 서버 API나 optimistic update 구조가 필요합니다.

```tsx
import { toast } from 'sonner'

async function handleDelete(id: number) {
  // await deleteSnack(id)

  toast.success('삭제 완료', {
    description: '과자가 삭제되었습니다.',
    action: {
      label: '되돌리기',
      onClick: async () => {
        // await restoreSnack(id)
        toast.success('복구 완료', {
          description: '삭제한 과자가 복구되었습니다.'
        })
      }
    }
  })
}
```

### 9-3. action 스타일은 전역 classNames 우선

개별 toast에서 버튼 색상을 직접 넣는 방식은 빠르게 테스트할 때는 가능하지만, 프로젝트 전체 디자인과 충돌하기 쉽습니다.

```tsx
// 가능은 하지만 반복되면 관리가 어려움
toast.success('제출 성공', {
  action: {
    label: '완료',
    onClick: () => console.log('Success')
  },
  actionButtonStyle: {
    backgroundColor: 'green'
  }
})
```

반복해서 사용한다면 `layout.tsx`의 `<Toaster />`에서 전역 스타일로 관리하는 편이 낫습니다.

```tsx
<Toaster
  toastOptions={{
    classNames: {
      actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
  }}
/>
```

### 9-4. action 사용 시 주의점

| 주의점                                  | 이유                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| 중요한 확인을 action으로 대체하지 않기  | 삭제/탈퇴/결제 확인은 `AlertDialog`가 적합                   |
| action label은 짧게 작성                | toast 영역이 좁기 때문에 `상세 보기`, `되돌리기` 정도가 적합 |
| 복구/되돌리기는 실제 로직 필요          | 단순 toast만으로 데이터가 복구되지는 않음                    |
| 스타일은 가능하면 전역 classNames 사용  | 개별 inline style이 많아지면 유지보수 어려움                 |
| `console.log` action은 개발 중에만 사용 | 사용자 기능으로는 의미가 부족함                              |

---

## 10. toast.promise 실무 예제

`toast.promise`는 비동기 작업의 진행 상태를 `loading → success/error`로 연결할 때 사용합니다.

```tsx
await toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: '등록 완료',
  error: '등록 실패'
})
```

단순 성공/실패 메시지만 필요할 때는 좋지만, 페이지 이동이나 캐시 무효화 흐름까지 복잡해지면 `try/catch`가 더 읽기 쉬운 경우도 있습니다.

---

### 10-1. 등록 + 성공 후 목록 이동

```tsx
'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { CreateSnackInput } from '@/features/snack/schema/snack.schema'

export function SnackCreateForm() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateSnack()

  async function onSubmit(formData: CreateSnackInput) {
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

이 방식은 흐름이 단순합니다.

```txt
mutateAsync 실행
  ↓
toast.promise가 loading 표시
  ↓
성공하면 success 표시
  ↓
목록 페이지 이동
```

---

### 10-2. 등록 결과 data를 success 메시지에 사용

`mutateAsync`의 반환값을 success 메시지에 사용할 수 있습니다.

```tsx
type CreateSnackResult = {
  id: number
  name: string
}

await toast.promise<CreateSnackResult>(mutateAsync(formData), {
  loading: '등록 중...',
  success: data => ({
    message: '등록 완료',
    description: `${data.name} 과자가 등록되었습니다.`
  }),
  error: () => ({
    message: '등록 실패',
    description: '과자 등록 중 문제가 발생했습니다.'
  })
})
```

반환값이 없는 API라면 `success: '등록 완료'`처럼 단순 문자열로 처리하면 됩니다.

---

### 10-3. 수정 저장 예제

```tsx
async function onSubmit(formData: UpdateSnackInput) {
  try {
    await toast.promise(updateSnackAsync(formData), {
      loading: '수정 중...',
      success: '수정 완료',
      error: '수정 실패'
    })
  } catch (error) {
    console.error(error)
  }
}
```

---

### 10-4. 삭제 예제

삭제는 먼저 `AlertDialog`로 확인을 받고, 실제 삭제 요청에서 `toast.promise`를 사용하는 흐름이 좋습니다.

```tsx
async function handleDelete(id: number) {
  try {
    await toast.promise(deleteSnackAsync(id), {
      loading: '삭제 중...',
      success: '삭제 완료',
      error: '삭제 실패'
    })
  } catch (error) {
    console.error(error)
  }
}
```

---

### 10-5. 파일 업로드 예제

```tsx
async function handleUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    await toast.promise(uploadFile(formData), {
      loading: '파일 업로드 중...',
      success: result => ({
        message: '업로드 완료',
        description: `${result.fileName} 파일이 업로드되었습니다.`
      }),
      error: '업로드 실패'
    })
  } catch (error) {
    console.error(error)
  }
}
```

---

### 10-6. 검색/필터 저장 예제

검색 자체는 toast를 남발하지 않는 것이 좋습니다. 다만 저장형 필터나 조건 초기화처럼 사용자에게 결과를 알려야 할 때는 사용할 수 있습니다.

```tsx
async function saveSearchCondition(params: SnackSearchParams) {
  try {
    await toast.promise(saveSnackSearchCondition(params), {
      loading: '검색 조건 저장 중...',
      success: '검색 조건 저장 완료',
      error: '검색 조건 저장 실패'
    })
  } catch (error) {
    console.error(error)
  }
}
```

---

### 10-7. try/catch와 toast.promise를 같이 쓰는 이유

`toast.promise`는 사용자에게 상태 메시지를 보여주는 역할입니다.

`try/catch`는 개발자가 에러를 처리하거나, 실패 시 추가 작업을 막기 위한 제어 흐름입니다.

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

여기서 `mutateAsync`가 실패하면 다음 코드인 `router.push('/snack')`가 실행되지 않습니다. 그래서 성공 후 이동이 필요한 경우 `try/catch` 구조가 안전합니다.

---

## 11. React Query mutation에서 사용하는 방식

### 11-1. hook 내부에서 공통 처리

```tsx
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

장점은 등록 성공/실패 메시지를 여러 화면에서 통일하기 쉽다는 점입니다.

단점은 페이지 이동 같은 화면별 후처리까지 hook 안에 넣으면 hook이 특정 화면에 종속될 수 있다는 점입니다.

---

### 11-2. page/form 컴포넌트에서 처리

```tsx
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
```

장점은 성공 후 이동, 모달 닫기, 폼 초기화 같은 화면별 흐름을 제어하기 좋다는 점입니다.

---

### 11-3. 선택 기준

| 방식                                   | 적합한 경우                                      | 주의점                                                |
| -------------------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| mutation hook 내부 `onSuccess/onError` | 성공/실패 처리가 항상 동일할 때                  | 페이지 이동까지 넣으면 hook 재사용성이 떨어질 수 있음 |
| 컴포넌트 `mutateAsync + try/catch`     | 성공 후 이동, 모달 닫기, 폼 초기화가 필요할 때   | 각 화면에서 메시지가 중복될 수 있음                   |
| `toast.promise`                        | loading/success/error를 한 번에 보여주고 싶을 때 | 복잡한 후처리는 try/catch와 같이 쓰는 편이 좋음       |
| `appToast` 래퍼                        | 메시지 스타일과 기본 문구를 통일하고 싶을 때     | 너무 일찍 추상화하면 오히려 번거로울 수 있음          |

---

## 12. AlertDialog + toast 조합

삭제, 탈퇴, 결제처럼 사용자의 확인이 필요한 작업은 toast만 사용하면 부족합니다.

권장 흐름은 다음과 같습니다.

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

## 13. 기존 console.log를 어떻게 바꿀지

현재 개발 중에는 아래처럼 작성되어 있을 수 있습니다.

```ts
console.log('등록 성공')
console.log('등록 실패', error)
```

앞으로는 사용자 안내와 개발자 로그를 분리합니다.

```ts
console.error(error) // 개발자 확인용

toast.error('등록 실패', {
  description: '과자 등록 중 문제가 발생했습니다.'
})
```

| 목적                    | 사용                                                          |
| ----------------------- | ------------------------------------------------------------- |
| 개발자가 내부 값을 확인 | `console.log`, `console.error`                                |
| 사용자에게 결과 안내    | `toast.success`, `toast.error`, `toast.warning`, `toast.info` |
| 사용자의 선택 필요      | `AlertDialog`                                                 |

---

## 14. 적용 순서

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

### 3단계. 삭제/탈퇴/결제는 AlertDialog 적용

```txt
확인이 필요한 작업 → AlertDialog
작업 결과 안내 → toast
```

### 4단계. 반복 메시지는 appToast로 분리

```txt
shared/lib/toast.ts
```

### 5단계. 전역 스타일이 필요하면 Toaster 옵션 보강

```tsx
<Toaster
  toastOptions={{
    classNames: {
      actionButton: 'bg-primary text-primary-foreground'
    }
  }}
/>
```

---

## 15. 추천 폴더 구조

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

## 16. 최종 기준

| 상황                                     | 최종 선택                          |
| ---------------------------------------- | ---------------------------------- |
| 단순 성공/실패/경고 안내                 | `toast.success/error/warning/info` |
| 비동기 작업의 loading/success/error 표시 | `toast.promise`                    |
| 등록 후 이동, 모달 닫기 등 후처리 필요   | `mutateAsync + try/catch`          |
| 삭제/탈퇴/결제 전 확인 필요              | `AlertDialog` 후 `toast`           |
| 메시지 문구/스타일 반복                  | `appToast` 래퍼                    |
| 전역 위치/색상/아이콘 통일               | `layout.tsx`의 `<Toaster />` 옵션  |

한 줄로 정리하면, 현재처럼 `console.log`만 있는 상태에서는 먼저 `layout.tsx`에 `<Toaster />`를 추가하고, 등록/수정/삭제 같은 mutation 결과부터 `toast.success`, `toast.error`, `toast.promise`로 바꾸는 것이 가장 현실적인 시작점입니다.

---

## 참고

- shadcn/ui Sonner 문서: https://ui.shadcn.com/docs/components/sonner
- shadcn/ui Toast 문서: https://ui.shadcn.com/docs/components/toast
- Sonner 공식 문서: https://sonner.emilkowal.ski/
