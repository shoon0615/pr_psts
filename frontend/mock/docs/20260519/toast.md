# toast?

화면 한쪽에 잠깐 나타나는 알림입니다.

## 설치 및 기본 설정

```bash
npx shadcn@latest add sonner
pnpm dlx shadcn@latest add sonner
```

일반적으로 아래와 같은 파일이 생성됩니다.

```txt
components/ui/sonner.tsx
```

`toast()`를 호출해도 화면에 표시되려면 앱 어딘가에 `<Toaster />`가 렌더링되어 있어야 합니다.

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Toaster } from '@/shared/components/ui/sonner'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
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

## 1. alert

브라우저 기본 제공 UI

**⚬ alert 를 지양하는 이유**

- `blocking` 브라우저 동작을 멈추고, 확인 버튼을 누르기 전까지 화면 동작이 중단됩니다.
- `UI Design` OS/브라우저마다 UI 가 상이하고, 디자인 불가 → UX 저하로 이어짐
- 회원 탈퇴/결제 등의 중요한 경우에는 여전히 사용되지만, shadcn 의 `Dialog/AlertDialog` 로 디자인 설정

**⚬ 대체 전략**

1. **가벼운 정보 전달/알림**: `Sonner` (Toast) 사용 (Non-blocking)
2. **중요한 결정/확인**: `AlertDialog` (Shadcn UI) 사용 (Modal-based)

```typescript
/* 삭제 이전 */
<AlertDialog>정말 삭제하시겠습니까?</AlertDialog>

/* 삭제 이후 */
toast.success('삭제 완료')
```

## 2. toast

shadcn 제공 라이브러리

- `non-blocking` 브라우저 동작을 막지 않으며, 사용자가 확인 버튼을 누르지 않아도 됩니다.
- 앱 전체에서 일관된 디자인을 사용할 수 있습니다.
- 성공, 실패, 경고, 로딩 상태를 표현하기 좋습니다.

```ts
/** @deprecated `구버전` */
import * from '@/shared/hooks/use-toast'
import * from '@/shared/components/ui/toast'
import * from '@/shared/components/ui/toaster'
```

```ts
import { Toaster, toast, useSonner } from 'sonner'
import { Toaster } from '@/shared/components/ui/custom/sonner'
```

### 스니핏

```ts
// 기본
toast('제출 성공')

toast.success('제출 성공', {
  description: '과자가 성공적으로 등록되었습니다.'
})

toast({
  variant: 'destructive',
  title: '입력 확인 필요',
  description: '모든 필드를 올바르게 입력해주세요.'
})
```

```ts
// 심화
toast.success('제출 성공', {
  action: {
    label: '완료',
    onClick: () => console.log('Success')
  },
  actionButtonStyle: { backgroundColor: 'green' }
})
```

**⚬ action이 필요한 대표 상황**

| 상황              | action 예시   |
| ----------------- | ------------- |
| 삭제 후 되돌리기  | `실행 취소`   |
| 저장 후 상세 이동 | `상세 보기`   |
| 생성 후 목록 이동 | `목록 보기`   |
| 세션 만료 안내    | `로그인 이동` |
| 업로드 완료       | `파일 열기`   |

```ts
// 실무
await toast.promise(mutateAsync(formData), {
  loading: '등록 중...',
  // success: '등록 완료',
  success: (data: { name: string }) => {
    return {
      message: `${data.name} toast has been added`,
      description: 'Custom description for the success state'
    }
  },
  error: '등록 실패'
})
```

```tsx
// layout.tsx 에서 전역 설정
toast.success('제출 성공', {
  className: 'my-classname',
  position: 'top-center',
  description: '과자가 성공적으로 등록되었습니다.',
  duration: 3000,
  icon: <MyIcon />,
})

<Toaster
  position="top-center"
  richColors
  closeButton
  duration={3000}
/>
```

**⚬ toast 분류**

| 상황                        | 권장 방식                      | 예시                                      |
| --------------------------- | ------------------------------ | ----------------------------------------- |
| 개발자 확인                 | `console.log`, `console.error` | 응답 데이터 확인, 에러 객체 확인, 디버깅  |
| 등록/수정/삭제 성공         | `toast.success`                | `등록 완료`, `수정 완료`                  |
| 서버 오류/네트워크 실패     | `toast.error`                  | `등록 실패`, `잠시 후 다시 시도해주세요.` |
| 입력값 누락/주의 안내(경고) | `toast.warning`                | `필수 항목을 입력해주세요.`               |
| 단순 안내                   | `toast.info`                   | `검색 조건이 초기화되었습니다.`           |
| 수동 로딩                   | `toast.loading`                | `처리 중...`                              |
| 비동기 상태 연결            | `toast.promise`                | `등록 중 → 성공/실패`                     |
| toast 닫기                  | `toast.dismiss`                | 알림 닫기                                 |
| 사용자의 확인 필요          | `Dialog`                       | 상세 안내, 선택 필요                      |
| 삭제/탈퇴/결제 전 확인      | `AlertDialog`                  | `정말 삭제하시겠습니까?`                  |
| 필드별 검증 오류            | `FormMessage`                  | `브랜드를 선택해주세요.`                  |

**⚬ toast 개별 옵션 표**

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

**⚬ Toaster 전역 옵션 표**

`<Toaster />`에 설정한 옵션은 전체 toast의 기본값으로 적용됩니다.  
단, 개별 `toast()` 호출에서 같은 옵션을 지정하면 개별 옵션이 우선합니다.

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

### 3. Alert

TODO:

```
Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction
```

```tsx
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '@/shared/components/ui/alert'

export default function Example() {
  return (
    <>
      <Alert>
        <AlertTitle>Success! Your changes have been saved.</AlertTitle>
      </Alert>
      <Alert>
        <AlertTitle>Success! Your changes have been saved.</AlertTitle>
        <AlertDescription>
          This is an alert with title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertDescription>
          This one has a description only. No title. No icon.
        </AlertDescription>
      </Alert>
    </>
  )
}
```

### 4. AlertDialog

사용자의 명시적인 확인이나 취소가 필요한 중요한 작업에 사용

```
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

```tsx
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
} from '@/shared/components/ui/alert-dialog'

function DeleteConfirm() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">삭제</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 삭제된 데이터는 영구적으로 제거됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleSafeDelete()}>
            삭제 확정
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

| 상황                 | 추천 도구                     | 특징                            |
| :------------------- | :---------------------------- | :------------------------------ |
| 성공, 정보 알림      | `toast.success`, `toast.info` | 자동 사라짐, 방해 최소화        |
| 일시적 에러          | `toast.error`                 | 사용자가 인지 후 닫기 가능      |
| 비동기 처리 중       | `toast.promise`               | 로딩 -> 결과 연동               |
| **위험한 작업 확인** | `AlertDialog`                 | 사용자가 버튼을 눌러야만 진행됨 |
| **데이터 영구 삭제** | `AlertDialog`                 | 명확한 경고 문구와 함께 사용    |
