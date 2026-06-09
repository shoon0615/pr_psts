# Toast / Sonner 적용 가이드

> 현재 상태: `console.log` 중심  
> 목표 상태: 사용자에게 필요한 피드백은 `sonner toast`로 제공하고, 중요한 확인/경고는 `Dialog` 또는 `AlertDialog`로 분리

---

## 1. 결론

현재 프로젝트에서는 브라우저 기본 `alert()`보다 `sonner` 기반 `toast`를 기본 알림 방식으로 사용하는 것이 좋습니다.

```txt
console.log   → 개발 중 디버깅
toast         → 사용자에게 보여줄 성공/실패/진행/안내 메시지
Dialog        → 사용자의 입력이나 확인이 필요한 일반 모달
AlertDialog   → 삭제, 탈퇴, 결제 취소처럼 위험하거나 되돌리기 어려운 확인
```

---

## 2. alert 대신 toast를 사용하는 이유

### 2-1. alert의 특징

```ts
alert('저장되었습니다.')
```

`alert()`는 브라우저 기본 UI입니다.

| 항목         | 설명                                       |
| ------------ | ------------------------------------------ |
| 동작 방식    | blocking 방식                              |
| 사용자 흐름  | 확인 버튼을 누르기 전까지 다음 동작이 멈춤 |
| 디자인       | 브라우저 기본 디자인                       |
| 커스터마이징 | 거의 불가능                                |
| 권장 용도    | 거의 사용하지 않음                         |

### 2-2. toast의 특징

```ts
toast.success('저장 완료', {
  description: '변경사항이 정상적으로 저장되었습니다.'
})
```

| 항목         | 설명                                         |
| ------------ | -------------------------------------------- |
| 동작 방식    | non-blocking 방식                            |
| 사용자 흐름  | 알림이 떠도 화면 조작 가능                   |
| 디자인       | 프로젝트 UI에 맞춰 통일 가능                 |
| 커스터마이징 | 전역 설정, 개별 옵션, 아이콘, 액션 버튼 가능 |
| 권장 용도    | 성공, 실패, 경고, 안내, 비동기 진행 상태     |

---

## 3. 사용 기준

| 상황               | 권장 방식                     | 예시                  |
| ------------------ | ----------------------------- | --------------------- |
| 단순 성공 알림     | `toast.success()`             | 등록 완료, 수정 완료  |
| 단순 실패 알림     | `toast.error()`               | 저장 실패, 조회 실패  |
| 입력 누락 안내     | `toast.warning()`             | 필수값 누락           |
| 일반 안내          | `toast.info()` 또는 `toast()` | 새로운 데이터 있음    |
| 비동기 진행 상태   | `toast.promise()`             | 등록 중 → 성공/실패   |
| 사용자의 확인 필요 | `Dialog`                      | 상세 안내, 선택 필요  |
| 위험한 작업 확인   | `AlertDialog`                 | 삭제, 탈퇴, 결제 취소 |
| 개발자 확인        | `console.log()`               | API 응답 확인, 디버깅 |

---

## 4. 설치 및 기본 설정

### 4-1. 설치

```bash
pnpm add sonner
```

shadcn/ui를 사용 중이라면 다음 명령으로 추가할 수 있습니다.

```bash
pnpm dlx shadcn@latest add sonner
```

---

## 5. layout.tsx 전역 설정

Sonner의 `<Toaster />`는 앱에 한 번 배치하면 됩니다. Next.js App Router 기준으로는 `app/layout.tsx` 또는 공통 layout에 넣습니다.

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Toaster } from '@/shared/components/shadcn/ui/sonner'

export default function RootLayout({ children }: { children: ReactNode }) {
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

### 5-1. 프로젝트 기본 추천 설정

```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
  visibleToasts={3}
/>
```

| 옵션            | 추천값         | 이유                                             |
| --------------- | -------------- | ------------------------------------------------ |
| `position`      | `"top-center"` | 폼 제출, 저장 결과를 사용자가 바로 인지하기 좋음 |
| `richColors`    | `true`         | success/error/warning/info 상태 구분이 명확함    |
| `closeButton`   | `true`         | 사용자가 직접 닫을 수 있음                       |
| `duration`      | `3000`         | 너무 짧지도 길지도 않은 기본값                   |
| `visibleToasts` | `3`            | 알림이 과도하게 쌓이는 것을 방지                 |

---

## 6. Toaster 전역 옵션 표

`<Toaster />`에 설정한 옵션은 전체 toast의 기본값으로 적용됩니다. 단, 개별 `toast()` 호출에서 같은 옵션을 지정하면 개별 옵션이 우선합니다.

| 옵션              | 타입                         | 기본값               | 설명                               | 사용 예                             |
| ----------------- | ---------------------------- | -------------------- | ---------------------------------- | ----------------------------------- |
| `theme`           | `string`                     | `"light"`            | toast 테마                         | `"light"`, `"dark"`, `"system"`     |
| `richColors`      | `boolean`                    | `false`              | 타입별 색상 강조                   | `richColors`                        |
| `expand`          | `boolean`                    | `false`              | 여러 toast를 기본 확장 상태로 표시 | `expand`                            |
| `visibleToasts`   | `number`                     | `3`                  | 한 번에 보이는 toast 개수          | `visibleToasts={5}`                 |
| `id`              | `string`                     | `-`                  | 여러 Toaster를 구분하는 ID         | `id="global"`                       |
| `position`        | `string`                     | `"bottom-right"`     | toast 표시 위치                    | `"top-center"`                      |
| `closeButton`     | `boolean`                    | `false`              | 닫기 버튼 표시                     | `closeButton`                       |
| `offset`          | `string \| number \| object` | `32px`               | 데스크톱 화면 여백                 | `offset={16}`                       |
| `mobileOffset`    | `string \| number \| object` | `16px`               | 모바일 화면 여백                   | `mobileOffset={{ bottom: '16px' }}` |
| `swipeDirections` | `string[]`                   | 위치 기반            | 스와이프 방향 설정                 | `['left', 'right']`                 |
| `dir`             | `string`                     | `"ltr"`              | 텍스트 방향                        | `"ltr"`, `"rtl"`                    |
| `hotkey`          | `string[]`                   | `['altKey', 'KeyT']` | toast 영역 포커스 단축키           | `['ctrlKey', 'KeyT']`               |
| `invert`          | `boolean`                    | `false`              | 테마 반전                          | `invert`                            |
| `toastOptions`    | `object`                     | `{}`                 | 모든 toast에 적용할 기본 옵션      | `toastOptions={{ duration: 5000 }}` |
| `gap`             | `number`                     | `14`                 | toast 간 간격                      | `gap={12}`                          |
| `icons`           | `object`                     | `-`                  | 타입별 아이콘 커스터마이징         | `{ success: <SuccessIcon /> }`      |

---

## 7. Toaster 전역 커스터마이징 예제

### 7-1. 기본 전역 설정

```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
/>
```

### 7-2. 여러 toast 표시 개수 조정

```tsx
<Toaster
  position="top-center"
  visibleToasts={5}
/>
```

### 7-3. toast를 기본 확장 상태로 표시

```tsx
<Toaster
  expand
  visibleToasts={6}
/>
```

### 7-4. 위치 설정

```tsx
<Toaster position="top-center" />
```

사용 가능한 위치는 다음과 같습니다.

| position 값       | 위치        |
| ----------------- | ----------- |
| `"top-left"`      | 상단 왼쪽   |
| `"top-center"`    | 상단 가운데 |
| `"top-right"`     | 상단 오른쪽 |
| `"bottom-left"`   | 하단 왼쪽   |
| `"bottom-center"` | 하단 가운데 |
| `"bottom-right"`  | 하단 오른쪽 |

### 7-5. offset 설정

```tsx
<Toaster offset={16} />
```

```tsx
<Toaster offset="10vh" />
```

```tsx
<Toaster
  offset={{
    bottom: '24px',
    right: '16px',
    left: '16px'
  }}
/>
```

```tsx
<Toaster
  mobileOffset={{
    bottom: '16px'
  }}
/>
```

### 7-6. 여러 Toaster 분리

특정 영역별로 toast 위치를 분리하고 싶을 때 사용합니다.

```tsx
<Toaster id="global" position="top-right" />
<Toaster id="canvas" position="bottom-left" />
```

```tsx
import { toast } from 'sonner'

toast('전역 알림', {
  toasterId: 'global'
})

toast('캔버스 알림', {
  toasterId: 'canvas'
})
```

일반적인 프로젝트에서는 Toaster를 하나만 두는 것이 더 단순합니다.  
여러 Toaster는 관리자 화면, 에디터, 캔버스, 사이드 패널처럼 알림 영역을 의도적으로 분리해야 할 때만 고려합니다.

### 7-7. next-themes와 동적 테마 연동

```tsx
'use client'

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'
import { useTheme } from 'next-themes'

export function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <SonnerToaster
      theme={resolvedTheme as ToasterProps['theme']}
      position="top-center"
      richColors
      closeButton
    />
  )
}
```

### 7-8. toastOptions로 전역 스타일 설정

```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
  toastOptions={{
    style: {
      background: 'red'
    }
  }}
/>
```

다만 이 방식은 모든 toast에 직접 style이 적용됩니다.  
실무에서는 색상을 과하게 직접 지정하기보다 `richColors`, `classNames`, Tailwind class, 또는 headless 방식을 우선 검토하는 편이 좋습니다.

### 7-9. classNames로 내부 요소 스타일 지정

```tsx
<Toaster
  toastOptions={{
    classNames: {
      toast: 'toast',
      title: 'title',
      description: 'description',
      actionButton: 'action-button',
      cancelButton: 'cancel-button',
      closeButton: 'close-button'
    }
  }}
/>
```

Tailwind를 사용할 때 기본 스타일을 덮어써야 한다면 `!` modifier가 필요할 수 있습니다.

```tsx
<Toaster
  toastOptions={{
    classNames: {
      description: '!text-red-900'
    }
  }}
/>
```

### 7-10. icons로 타입별 아이콘 변경

```tsx
<Toaster
  icons={{
    success: <SuccessIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
    loading: <LoadingIcon />
  }}
/>
```

특정 타입 아이콘을 제거할 수도 있습니다.

```tsx
<Toaster
  icons={{
    success: null
  }}
/>
```

---

## 8. toast 개별 옵션 표

`toast()` 또는 `toast.success()` 등에 전달하는 두 번째 인자 옵션입니다.

```tsx
toast.success('제출 성공', {
  description: '과자가 성공적으로 등록되었습니다.',
  duration: 3000
})
```

| 옵션                 | 타입                           | 기본값            | 설명                                      |
| -------------------- | ------------------------------ | ----------------- | ----------------------------------------- |
| `description`        | `ReactNode`                    | `-`               | 제목 아래 보조 설명                       |
| `closeButton`        | `boolean`                      | `false`           | 해당 toast에 닫기 버튼 표시               |
| `invert`             | `boolean`                      | `false`           | 해당 toast 테마 반전                      |
| `duration`           | `number`                       | `4000`            | 자동 닫힘 시간(ms)                        |
| `position`           | `string`                       | `"bottom-right"`  | 해당 toast 표시 위치                      |
| `dismissible`        | `boolean`                      | `true`            | 사용자가 닫을 수 있는지 여부              |
| `icon`               | `ReactNode`                    | `-`               | 개별 toast 아이콘                         |
| `action`             | `ReactNode` 또는 action object | `-`               | 주요 액션 버튼                            |
| `cancel`             | `ReactNode` 또는 cancel object | `-`               | 보조 취소 버튼                            |
| `id`                 | `string`                       | `-`               | toast 식별자. 업데이트/닫기에 사용        |
| `testId`             | `string`                       | `-`               | 테스트 식별자                             |
| `toasterId`          | `string`                       | `-`               | 특정 Toaster로 보낼 때 사용               |
| `onDismiss`          | `function`                     | `-`               | 사용자가 닫거나 스와이프해서 닫을 때 실행 |
| `onAutoClose`        | `function`                     | `-`               | duration 만료로 자동 닫힐 때 실행         |
| `containerAriaLabel` | `string`                       | `"Notifications"` | 접근성 label                              |
| `actionButtonStyle`  | `object`                       | `{}`              | action 버튼 inline style                  |
| `cancelButtonStyle`  | `object`                       | `{}`              | cancel 버튼 inline style                  |
| `style`              | `object`                       | `-`               | 개별 toast style                          |
| `classNames`         | `object`                       | `-`               | 개별 toast 내부 class                     |
| `unstyled`           | `boolean`                      | `false`           | 기본 스타일 제거 후 직접 스타일링         |

---

## 9. 기본 toast 사용 예제

### 9-1. 기본 메시지

```tsx
import { toast } from 'sonner'

toast('저장되었습니다.')
```

### 9-2. 성공 메시지

```tsx
toast.success('제출 성공', {
  description: '과자가 성공적으로 등록되었습니다.'
})
```

### 9-3. 실패 메시지

```tsx
toast.error('제출 실패', {
  description: '잠시 후 다시 시도해주세요.'
})
```

### 9-4. 경고 메시지

```tsx
toast.warning('입력 확인 필요', {
  description: '필수 항목을 모두 입력해주세요.'
})
```

### 9-5. 안내 메시지

```tsx
toast.info('새로운 데이터가 있습니다.', {
  description: '목록을 새로고침하면 최신 데이터를 확인할 수 있습니다.'
})
```

---

## 10. action / cancel 사용법 보완

기존 예제입니다.

```tsx
toast.success('제출 성공', {
  action: {
    label: '완료',
    onClick: () => console.log('Success')
  },
  actionButtonStyle: { backgroundColor: 'green' }
})
```

이 예제 자체는 동작할 수 있지만, 실무 코드로는 다음 부분을 보완하는 것이 좋습니다.

| 항목                          | 보완 이유                                             |
| ----------------------------- | ----------------------------------------------------- |
| `console.log`                 | 사용자 동작 처리로 보기 어렵고, 실제 후속 행동이 없음 |
| `actionButtonStyle` 직접 색상 | 디자인 시스템과 분리될 수 있음                        |
| `완료` 버튼                   | 누르지 않아도 toast는 자동으로 닫히므로 의미가 약함   |
| success toast의 action        | 대부분 성공 toast에는 action이 없어도 충분함          |

### 10-1. action이 필요한 대표 상황

| 상황              | action 예시   |
| ----------------- | ------------- |
| 삭제 후 되돌리기  | `실행 취소`   |
| 저장 후 상세 이동 | `상세 보기`   |
| 생성 후 목록 이동 | `목록 보기`   |
| 세션 만료 안내    | `로그인 이동` |
| 업로드 완료       | `파일 열기`   |

### 10-2. 삭제 후 실행 취소

```tsx
toast.success('삭제 완료', {
  description: '항목이 목록에서 제거되었습니다.',
  action: {
    label: '실행 취소',
    onClick: () => {
      restoreSnack(id)
    }
  }
})
```

### 10-3. 등록 후 상세 페이지 이동

```tsx
toast.success('등록 완료', {
  description: '과자가 성공적으로 등록되었습니다.',
  action: {
    label: '상세 보기',
    onClick: () => {
      router.push(`/snack/${createdSnack.id}`)
    }
  }
})
```

### 10-4. 저장 실패 후 다시 시도

```tsx
toast.error('저장 실패', {
  description: '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
  action: {
    label: '다시 시도',
    onClick: () => {
      submitForm()
    }
  }
})
```

### 10-5. action과 cancel 함께 사용

```tsx
toast.warning('변경사항이 저장되지 않았습니다.', {
  description: '페이지를 이동하면 작성 중인 내용이 사라질 수 있습니다.',
  action: {
    label: '저장',
    onClick: () => {
      saveDraft()
    }
  },
  cancel: {
    label: '닫기',
    onClick: () => {
      // 필요한 경우 취소 처리
    }
  }
})
```

### 10-6. JSX action 사용

```tsx
toast('작업이 완료되었습니다.', {
  action: (
    <button
      type="button"
      onClick={() => router.push('/snack')}
      className="bg-primary text-primary-foreground rounded-md px-2 py-1">
      목록 보기
    </button>
  )
})
```

### 10-7. action 클릭 시 toast가 닫히지 않게 하기

Sonner의 action은 클릭 시 기본적으로 toast를 닫습니다.  
닫히지 않게 하려면 `event.preventDefault()`를 사용할 수 있습니다.

```tsx
toast('업로드 중 문제가 발생했습니다.', {
  action: {
    label: '재시도',
    onClick: event => {
      event.preventDefault()
      retryUpload()
    }
  }
})
```

---

## 11. toast.promise 실무 예제

`toast.promise()`는 Promise 상태에 따라 `loading → success/error` toast를 자동으로 전환합니다.

```tsx
toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: '등록 완료',
  error: '등록 실패'
})
```

### 11-1. React Query mutateAsync와 함께 사용

```tsx
async function onSubmit(formData: CreateSnackInput) {
  try {
    await toast.promise(mutateAsync(formData), {
      loading: '등록 중...',
      success: '과자가 성공적으로 등록되었습니다.',
      error: '등록에 실패했습니다.'
    })

    router.push('/snack')
  } catch (error) {
    // toast.promise에서 실패 메시지는 이미 보여줌
    // 여기서는 라우팅 방지, 로깅, 필드 에러 매핑 등을 처리
    console.error(error)
  }
}
```

### 11-2. 성공 결과 데이터를 메시지에 사용

```tsx
async function onSubmit(formData: CreateSnackInput) {
  const createdSnack = await toast.promise(mutateAsync(formData), {
    loading: '등록 중...',
    success: data => {
      return `${data.name} 등록 완료`
    },
    error: '등록 실패'
  })

  router.push(`/snack/${createdSnack.id}`)
}
```

### 11-3. success에서 상세 옵션 반환

```tsx
await toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: data => {
    return {
      message: '등록 완료',
      description: `${data.name} 항목이 생성되었습니다.`
    }
  },
  error: error => {
    return {
      message: '등록 실패',
      description:
        error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'
    }
  }
})
```

### 11-4. 삭제 처리

```tsx
async function onDelete(id: number) {
  await toast.promise(deleteSnack(id), {
    loading: '삭제 중...',
    success: '삭제되었습니다.',
    error: '삭제에 실패했습니다.'
  })

  queryClient.invalidateQueries({ queryKey: snackKeys.lists() })
}
```

### 11-5. 파일 업로드

```tsx
async function onUpload(file: File) {
  await toast.promise(uploadFile(file), {
    loading: '파일 업로드 중...',
    success: result => {
      return {
        message: '업로드 완료',
        description: `${result.fileName} 파일이 업로드되었습니다.`
      }
    },
    error: '파일 업로드에 실패했습니다.'
  })
}
```

### 11-6. 여러 요청 동시 처리

```tsx
await toast.promise(
  Promise.all([updateSnack(snackId, formData), updateSnackTags(snackId, tags)]),
  {
    loading: '변경사항 저장 중...',
    success: '변경사항이 저장되었습니다.',
    error: '일부 변경사항 저장에 실패했습니다.'
  }
)
```

### 11-7. toast.promise를 사용할 때 주의점

| 항목                                 | 설명                                             |
| ------------------------------------ | ------------------------------------------------ |
| Promise가 실제로 reject 되어야 함    | 내부에서 에러를 삼키면 error toast가 나오지 않음 |
| 성공 후 라우팅은 `await` 이후 처리   | 성공 toast 표시와 라우팅 순서를 제어하기 쉬움    |
| 필드별 validation 에러는 form에 표시 | toast는 전체 실패 요약에 적합                    |
| 너무 긴 작업은 별도 진행률 UI 고려   | toast는 간단한 상태 전달에 적합                  |

---

## 12. loading toast를 직접 제어하는 방법

`toast.promise()` 대신 직접 `loading → success/error`를 제어하고 싶을 때 사용합니다.

```tsx
async function onSubmit(formData: CreateSnackInput) {
  const toastId = toast.loading('등록 중...')

  try {
    const data = await mutateAsync(formData)

    toast.success('등록 완료', {
      id: toastId,
      description: `${data.name} 항목이 생성되었습니다.`
    })

    router.push('/snack')
  } catch (error) {
    toast.error('등록 실패', {
      id: toastId,
      description: '잠시 후 다시 시도해주세요.'
    })
  }
}
```

이 방식은 다음 상황에서 유용합니다.

| 상황                           | 이유                                              |
| ------------------------------ | ------------------------------------------------- |
| 중간 단계가 여러 개일 때       | `업로드 중 → 처리 중 → 완료`처럼 단계별 갱신 가능 |
| toast ID를 직접 관리해야 할 때 | 같은 toast를 업데이트 가능                        |
| 성공/실패 외의 분기가 있을 때  | 일부 성공, 일부 실패 같은 케이스 처리 가능        |

---

## 13. toast 업데이트 / 닫기

### 13-1. toast 업데이트

```tsx
const toastId = toast('처리 시작')

toast.success('처리 완료', {
  id: toastId
})
```

같은 `id`를 사용하면 기존 toast가 새 내용으로 업데이트됩니다.

### 13-2. 특정 toast 닫기

```tsx
const toastId = toast('임시 알림')

toast.dismiss(toastId)
```

### 13-3. 모든 toast 닫기

```tsx
toast.dismiss()
```

### 13-4. 자동으로 사라지지 않는 toast

```tsx
toast('중요한 안내입니다.', {
  duration: Infinity
})
```

이 경우 사용자가 닫거나 `toast.dismiss()`를 호출하기 전까지 유지됩니다.

---

## 14. onDismiss / onAutoClose

toast가 닫히는 방식에 따라 콜백을 분리할 수 있습니다.

```tsx
toast('이벤트가 생성되었습니다.', {
  onDismiss: toast => {
    console.log(`사용자가 닫음: ${toast.id}`)
  },
  onAutoClose: toast => {
    console.log(`자동으로 닫힘: ${toast.id}`)
  }
})
```

| 콜백          | 실행 시점                                          |
| ------------- | -------------------------------------------------- |
| `onDismiss`   | 사용자가 닫기 버튼을 누르거나 스와이프해서 닫을 때 |
| `onAutoClose` | `duration` 시간이 지나 자동으로 닫힐 때            |

실무에서는 analytics, 간단한 로깅, 특정 상태 정리에 사용할 수 있습니다.  
단, 핵심 비즈니스 로직을 toast 닫힘 이벤트에 의존시키는 것은 피하는 편이 좋습니다.

---

## 15. 공통 toast 래퍼 만들기

매번 `toast.success(...)`, `toast.error(...)`를 직접 쓰면 메시지 형식이 흩어질 수 있습니다.  
공통 래퍼를 만들어두면 프로젝트 전체 알림 문구와 기본 옵션을 통일하기 쉽습니다.

### 15-1. 기본 래퍼

```ts
// shared/lib/toast/app-toast.ts
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

### 15-2. 래퍼 함수 옵션 표

| 함수                 | 기본 용도 | message | description 기본값             | 내부 toast        |
| -------------------- | --------- | ------- | ------------------------------ | ----------------- |
| `appToast.success()` | 성공 알림 | 필수    | 없음                           | `toast.success()` |
| `appToast.error()`   | 실패 알림 | 필수    | `"잠시 후 다시 시도해주세요."` | `toast.error()`   |
| `appToast.warning()` | 경고 알림 | 필수    | 없음                           | `toast.warning()` |
| `appToast.info()`    | 안내 알림 | 필수    | 없음                           | `toast.info()`    |

### 15-3. 사용 예제

```tsx
appToast.success('제출 성공', '과자가 성공적으로 등록되었습니다.')

appToast.error('제출 실패')

appToast.warning('입력 확인 필요', '필수 항목을 모두 입력해주세요.')

appToast.info('새로운 데이터가 있습니다.')
```

### 15-4. action 지원 래퍼

```ts
// shared/lib/toast/app-toast.ts
import { toast } from 'sonner'
import type { ReactNode } from 'react'

type ToastAction = {
  label: string
  onClick: () => void
}

type AppToastOptions = {
  description?: string
  action?: ToastAction | ReactNode
  duration?: number
}

export const appToast = {
  success(message: string, options?: AppToastOptions) {
    toast.success(message, options)
  },

  error(message: string, options?: AppToastOptions) {
    toast.error(message, {
      description: options?.description ?? '잠시 후 다시 시도해주세요.',
      action: options?.action,
      duration: options?.duration
    })
  },

  warning(message: string, options?: AppToastOptions) {
    toast.warning(message, options)
  },

  info(message: string, options?: AppToastOptions) {
    toast.info(message, options)
  }
}
```

### 15-5. promise 래퍼

```ts
// shared/lib/toast/app-toast.ts
import { toast } from 'sonner'

export const appToast = {
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string
    }
  ) {
    return toast.promise(promise, messages)
  }
}
```

```tsx
await appToast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: '등록 완료',
  error: '등록 실패'
})
```

---

## 16. custom / headless toast

### 16-1. JSX를 title로 전달

```tsx
toast(
  <div className="flex flex-col gap-1">
    <strong>커스텀 알림</strong>
    <span className="text-muted-foreground text-sm">
      JSX를 사용해 toast 내용을 구성할 수 있습니다.
    </span>
  </div>
)
```

### 16-2. description에 JSX 사용

```tsx
toast('문서 확인 필요', {
  description: (
    <button
      type="button"
      onClick={() => router.push('/docs')}
      className="underline">
      문서 보러가기
    </button>
  )
})
```

### 16-3. unstyled 사용

```tsx
toast('커스텀 스타일 toast', {
  unstyled: true,
  classNames: {
    toast: 'rounded-xl border bg-background p-4 shadow-md',
    title: 'font-semibold',
    description: 'text-sm text-muted-foreground'
  }
})
```

단순 스타일 변경은 `toastOptions.classNames`로 처리하고, 완전히 다른 UI가 필요하면 headless 방식을 고려합니다.

---

## 17. React Hook Form / Server Action / React Query 기준 사용 위치

### 17-1. React Hook Form 제출 성공

```tsx
async function onSubmit(formData: CreateSnackInput) {
  await toast.promise(mutateAsync(formData), {
    loading: '등록 중...',
    success: '등록 완료',
    error: '등록 실패'
  })

  router.push('/snack')
}
```

### 17-2. validation 에러

필드 단위 에러는 toast보다 form field 근처에 보여주는 것이 우선입니다.

```tsx
if (!isValid) {
  toast.warning('입력 확인 필요', {
    description: '필수 항목을 모두 입력해주세요.'
  })

  return
}
```

| 에러 종류         | 권장 위치                  |
| ----------------- | -------------------------- |
| 필드별 validation | input 하단 메시지          |
| 폼 전체 실패      | toast                      |
| 서버 저장 실패    | toast                      |
| 인증 만료         | toast + 로그인 이동 action |
| 삭제 확인         | AlertDialog                |

### 17-3. Server Action과 함께 사용

Server Action 자체에서는 클라이언트 toast를 직접 띄우는 구조가 아닙니다.  
클라이언트 컴포넌트에서 action 결과를 받은 뒤 toast를 호출하는 방식이 명확합니다.

```tsx
'use client'

import { toast } from 'sonner'
import { createSnackAction } from '../actions/create-snack.action'

async function onSubmit(formData: FormData) {
  const result = await createSnackAction(formData)

  if (!result.ok) {
    toast.error('등록 실패', {
      description: result.message
    })
    return
  }

  toast.success('등록 완료')
}
```

---

## 18. 실무 적용 순서

### 18-1. 1단계: Toaster 전역 추가

```tsx
<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
/>
```

### 18-2. 2단계: console.log를 사용자 메시지와 개발 로그로 분리

```tsx
// 개발 확인용
console.log('formData', formData)

// 사용자 피드백용
toast.success('저장 완료')
```

### 18-3. 3단계: 성공/실패 toast 도입

```tsx
try {
  await mutateAsync(formData)

  toast.success('등록 완료', {
    description: '과자가 성공적으로 등록되었습니다.'
  })

  router.push('/snack')
} catch (error) {
  toast.error('등록 실패', {
    description: '잠시 후 다시 시도해주세요.'
  })
}
```

### 18-4. 4단계: 비동기 처리는 toast.promise로 정리

```tsx
await toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  success: '등록 완료',
  error: '등록 실패'
})
```

### 18-5. 5단계: 공통 appToast 래퍼 도입

```tsx
appToast.success('등록 완료', '과자가 성공적으로 등록되었습니다.')
appToast.error('등록 실패')
```

---

## 19. 추천 폴더 구조

```txt
shared/
├─ components/
│  └─ ui/
│     └─ sonner.tsx
├─ lib/
│  └─ toast/
│     └─ app-toast.ts
```

### `shared/components/ui/sonner.tsx`

```tsx
'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      duration={3000}
      visibleToasts={3}
    />
  )
}
```

### `shared/lib/toast/app-toast.ts`

```ts
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
  },

  dismiss(id?: string | number) {
    toast.dismiss(id)
  }
}
```

---

## 20. 기존 use-toast와 sonner 구분

shadcn/ui의 예전 toast 구조를 사용 중이라면 다음 파일들이 있을 수 있습니다.

```ts
/** @deprecated 구버전 toast 구조 */
import { useToast } from '@/shared/hooks/use-toast'
import {
  Toast,
  ToastProvider,
  ToastViewport
} from '@/shared/components/shadcn/ui/toast'
import { Toaster } from '@/shared/components/shadcn/ui/toaster'
```

Sonner를 기준으로 정리한다면 다음처럼 단순화합니다.

```ts
import { toast } from 'sonner'
import { Toaster } from '@/shared/components/shadcn/ui/sonner'
```

| 구분                | 기존 use-toast                 | sonner                          |
| ------------------- | ------------------------------ | ------------------------------- |
| 호출 방식           | `const { toast } = useToast()` | `toast.success()`               |
| Provider/Viewport   | 별도 구성 필요                 | `<Toaster />` 중심              |
| 사용 위치           | React hook 기반                | 컴포넌트/유틸에서 호출하기 쉬움 |
| shadcn/ui 현재 권장 | 과거 방식                      | 현재 문서 기준 사용             |

---

## 21. 최종 추천 예제

### layout

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Toaster } from '@/shared/components/shadcn/ui/sonner'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### Toaster 컴포넌트

```tsx
// shared/components/ui/sonner.tsx
'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      duration={3000}
      visibleToasts={3}
    />
  )
}
```

### form submit

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCreateSnack } from '@/features/snack/hooks/use-snack'

export function SnackCreateForm() {
  const router = useRouter()
  const { mutateAsync } = useCreateSnack()

  async function onSubmit(formData: CreateSnackInput) {
    try {
      await toast.promise(mutateAsync(formData), {
        loading: '등록 중...',
        success: '과자가 성공적으로 등록되었습니다.',
        error: '과자 등록에 실패했습니다.'
      })

      router.push('/snack')
    } catch (error) {
      console.error(error)
    }
  }

  return <form>{/* form fields */}</form>
}
```

---

## 22. 정리

| 항목               | 추천                                            |
| ------------------ | ----------------------------------------------- |
| 기본 알림          | `sonner toast`                                  |
| 전역 설정 위치     | `layout.tsx`                                    |
| 프로젝트 기본 위치 | `top-center`                                    |
| 기본 옵션          | `richColors`, `closeButton`, `duration={3000}`  |
| 성공/실패/경고     | `toast.success`, `toast.error`, `toast.warning` |
| 비동기 처리        | `toast.promise`                                 |
| 복잡한 확인        | `Dialog` / `AlertDialog`                        |
| 공통화             | `appToast` 래퍼                                 |
| 완전 커스텀        | `headless` 또는 `unstyled`                      |
