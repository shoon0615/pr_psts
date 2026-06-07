# State

> Next.js App Router 기반 프로젝트에서 전역 상태를 어떻게 나눌지 정리한 문서입니다.  
> 이 문서는 Zustand를 중심으로 **Client State / UI State**를 관리하는 기준을 설명합니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 전역 상태 기준이 필요한가?](#3-왜-전역-상태-기준이-필요한가)
- [4. 상태 종류 구분](#4-상태-종류-구분)
- [5. 실무 기준](#5-실무-기준)
- [6. useState / Context / Redux / Zustand 비교](#6-usestate--context--redux--zustand-비교)
- [7. Zustand](#7-zustand)
- [8. Store 설계 기준](#8-store-설계-기준)
- [9. Modal Store](#9-modal-store)
- [10. Sidebar Store](#10-sidebar-store)
- [11. Theme / Layout State](#11-theme--layout-state)
- [12. Auth State 주의](#12-auth-state-주의)
- [13. React Query와 Zustand 역할 분리](#13-react-query와-zustand-역할-분리)
- [14. CRUD 적용 예제](#14-crud-적용-예제)
- [15. 코드 스니핏](#15-코드-스니핏)
- [16. Caution](#16-caution)
- [17. Best Practice](#17-best-practice)
- [18. 요약](#18-요약)

---

# 1. 한눈에 보기

상태는 역할별로 나누어 관리합니다.

```txt
Server State
→ TanStack Query

Form State
→ React Hook Form

URL State
→ nuqs

Client/UI State
→ Zustand
```

---

## 상태별 담당 기술

| 상태 | 담당 기술 | 예시 |
|---|---|---|
| Server State | TanStack Query | 목록, 상세, 사용자 데이터 |
| Form State | React Hook Form | 입력값, 에러, submit 상태 |
| URL State | nuqs | 검색, 정렬, 필터, 페이징 |
| Client State | Zustand | 모달, 사이드바, 선택 UI, 레이아웃 상태 |
| Local State | useState | 단일 컴포넌트 내부 상태 |

---

## 핵심 기준

```txt
API 데이터
→ TanStack Query

입력값
→ React Hook Form

URL에 남길 상태
→ nuqs

여러 컴포넌트가 공유하는 UI 상태
→ Zustand

한 컴포넌트 안에서만 쓰는 상태
→ useState
```

---

# 2. 언제 사용하는가?

Zustand는 다음 상황에서 사용합니다.

- 전역 모달
- Confirm Dialog
- Sidebar open/close
- Drawer open/close
- Layout 상태
- 선택된 메뉴
- 전역 Toast 트리거
- 여러 컴포넌트가 공유하는 UI 상태
- 페이지 간 유지해야 하는 Client State

---

## 사용하면 좋은 경우

```txt
A 컴포넌트에서 열고
B 컴포넌트에서 닫아야 한다

또는

여러 영역에서 같은 UI 상태를 공유한다
```

예:

```txt
Header Button
  ↓
Sidebar 열기

List Delete Button
  ↓
Confirm Dialog 열기

Command Palette
  ↓
전역 검색 모달 열기
```

---

## 사용하지 않는 경우

| 상황 | 권장 |
|---|---|
| 서버 목록 데이터 | TanStack Query |
| 상세 데이터 | TanStack Query |
| 로그인 세션 | Auth.js |
| Form 입력값 | React Hook Form |
| 검색 조건 | nuqs |
| 한 컴포넌트 내부 open 상태 | useState |

---

# 3. 왜 전역 상태 기준이 필요한가?

전역 상태를 무분별하게 사용하면 다음 문제가 생깁니다.

- 어떤 데이터가 어디서 바뀌는지 추적 어려움
- React Query 캐시와 중복
- Auth Session과 중복
- Form 값과 중복
- 불필요한 리렌더링
- Store가 거대해짐

---

## 나쁜 예

```txt
useAppStore
├─ user
├─ snacks
├─ boards
├─ searchParams
├─ formValues
├─ modalOpen
├─ sidebarOpen
└─ theme
```

문제:

- 서버 데이터와 UI 상태가 섞임
- 변경 범위가 커짐
- 역할이 불명확함

---

## 좋은 예

```txt
React Query
→ snacks, boards, user data

Auth.js
→ session

RHF
→ form values

nuqs
→ search params

Zustand
→ modal, sidebar, layout
```

---

# 4. 상태 종류 구분

## Server State

서버가 원본인 상태입니다.

예:

- 목록 데이터
- 상세 데이터
- 사용자 정보
- 댓글
- 카테고리
- 브랜드

담당:

```txt
TanStack Query
```

---

## Form State

사용자가 입력 중인 값입니다.

예:

- 제목
- 내용
- 이메일
- 비밀번호
- 가격
- 선택값

담당:

```txt
React Hook Form
```

---

## URL State

URL에 남아야 하는 상태입니다.

예:

- page
- keyword
- category
- sort
- order

담당:

```txt
nuqs
```

---

## Client/UI State

브라우저 UI 상태입니다.

예:

- modal open
- sidebar collapsed
- drawer open
- selected item id
- command palette open

담당:

```txt
Zustand
```

---

# 5. 실무 기준

## Zustand를 사용하는 기준

다음 조건 중 하나 이상이면 Zustand를 검토합니다.

- 여러 컴포넌트에서 같은 상태가 필요하다.
- props drilling이 깊어진다.
- page를 이동해도 UI 상태를 유지하고 싶다.
- Context로 만들기에는 provider가 과하다.
- Redux를 쓰기에는 상태가 단순하다.

---

## Zustand를 사용하지 않는 기준

다음은 Zustand로 옮기지 않습니다.

```txt
API 데이터
Form 입력값
URL query
Auth session
```

이유:

각각 이미 더 적합한 도구가 있습니다.

---

# 6. useState / Context / Redux / Zustand 비교

| 도구 | 장점 | 단점 | 사용 기준 |
|---|---|---|---|
| useState | 가장 단순 | 컴포넌트 내부 한정 | 지역 상태 |
| Context API | React 기본 기능 | 값 변경 시 리렌더링 관리 필요 | 테마, Provider 성격 |
| Redux Toolkit | 구조적, 대규모에 강함 | 설정/보일러플레이트 있음 | 복잡한 전역 상태 |
| Zustand | 단순, 가벼움, selector 사용 쉬움 | 규칙 없이 쓰면 store 비대화 | UI 전역 상태 |

---

## 현재 프로젝트 기준

```txt
대부분의 서버 데이터
→ React Query

복잡한 Form
→ RHF

UI 전역 상태
→ Zustand
```

따라서 Redux까지 도입할 필요는 낮고, Zustand가 적당합니다.

---

# 7. Zustand

Zustand는 간단한 전역 상태 관리 라이브러리입니다.

```bash
npm install zustand
```

---

## 기본 예시

```ts
import { create } from 'zustand'

type CounterStore = {
  count: number
  increase: () => void
}

export const useCounterStore = create<CounterStore>(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 }))
}))
```

사용:

```tsx
'use client'

import { useCounterStore } from '@/shared/store/counter.store'

export function CounterButton() {
  const count = useCounterStore(state => state.count)
  const increase = useCounterStore(state => state.increase)

  return <button onClick={increase}>{count}</button>
}
```

---

## selector 사용

Zustand는 필요한 값만 선택해서 사용할 수 있습니다.

```ts
const open = useModalStore(state => state.open)
```

권장:

```ts
const open = useModalStore(state => state.open)
const closeModal = useModalStore(state => state.closeModal)
```

비권장:

```ts
const store = useModalStore()
```

이 방식은 store의 다른 값 변경에도 리렌더링될 가능성이 커집니다.

---

# 8. Store 설계 기준

## 위치

전역 UI store는 `shared`에 둘 수 있습니다.

```txt
shared/
└─ store/
   ├─ modal.store.ts
   ├─ sidebar.store.ts
   └─ layout.store.ts
```

도메인 전용 UI 상태라면 feature 내부에 둡니다.

```txt
features/snack/store/snack-ui.store.ts
```

---

## 기준

| 상태 | 위치 |
|---|---|
| 전체 앱 모달 | shared/store |
| 전체 레이아웃 sidebar | shared/store |
| Snack 전용 선택 상태 | features/snack/store |
| Board 전용 editor 상태 | features/board/store |

---

## 네이밍

```txt
useModalStore
useSidebarStore
useLayoutStore
useSnackUiStore
```

---

# 9. Modal Store

전역 Confirm Dialog를 열고 닫는 예시입니다.

---

## 흐름

```txt
DeleteButton
  ↓
openConfirm
  ↓
ConfirmDialog
  ↓
onConfirm 실행
```

---

## Store

```ts
// shared/store/confirm.store.ts
import { create } from 'zustand'

type ConfirmState = {
  open: boolean
  title: string
  description?: string
  onConfirm?: () => void | Promise<void>
  openConfirm: (payload: {
    title: string
    description?: string
    onConfirm: () => void | Promise<void>
  }) => void
  closeConfirm: () => void
}

export const useConfirmStore = create<ConfirmState>(set => ({
  open: false,
  title: '',
  description: undefined,
  onConfirm: undefined,

  openConfirm: payload =>
    set({
      open: true,
      title: payload.title,
      description: payload.description,
      onConfirm: payload.onConfirm
    }),

  closeConfirm: () =>
    set({
      open: false,
      title: '',
      description: undefined,
      onConfirm: undefined
    })
}))
```

---

## 사용

```tsx
'use client'

import { useConfirmStore } from '@/shared/store/confirm.store'
import { useDeleteSnack } from '@/features/snack/hooks/use-snack'

export function SnackDeleteButton({ id }: { id: string }) {
  const openConfirm = useConfirmStore(state => state.openConfirm)
  const { mutateAsync } = useDeleteSnack()

  return (
    <button
      onClick={() =>
        openConfirm({
          title: '삭제하시겠습니까?',
          description: '삭제 후 복구할 수 없습니다.',
          onConfirm: () => mutateAsync(id)
        })
      }
    >
      삭제
    </button>
  )
}
```

---

## ConfirmDialog Root

```tsx
'use client'

import { useConfirmStore } from '@/shared/store/confirm.store'

export function ConfirmDialogRoot() {
  const open = useConfirmStore(state => state.open)
  const title = useConfirmStore(state => state.title)
  const description = useConfirmStore(state => state.description)
  const onConfirm = useConfirmStore(state => state.onConfirm)
  const closeConfirm = useConfirmStore(state => state.closeConfirm)

  if (!open) return null

  async function handleConfirm() {
    await onConfirm?.()
    closeConfirm()
  }

  return (
    <div role="dialog">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button onClick={closeConfirm}>취소</button>
      <button onClick={handleConfirm}>확인</button>
    </div>
  )
}
```

---

# 10. Sidebar Store

레이아웃 사이드바 상태 예시입니다.

---

## Store

```ts
// shared/store/sidebar.store.ts
import { create } from 'zustand'

type SidebarStore = {
  open: boolean
  toggle: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

export const useSidebarStore = create<SidebarStore>(set => ({
  open: true,

  toggle: () => set(state => ({ open: !state.open })),

  openSidebar: () => set({ open: true }),

  closeSidebar: () => set({ open: false })
}))
```

---

## 사용

```tsx
'use client'

import { useSidebarStore } from '@/shared/store/sidebar.store'

export function SidebarTrigger() {
  const toggle = useSidebarStore(state => state.toggle)

  return <button onClick={toggle}>메뉴</button>
}
```

---

# 11. Theme / Layout State

테마는 직접 Zustand로 만들 수도 있지만, Next.js에서는 `next-themes` 같은 전용 라이브러리를 사용하는 경우가 많습니다.

---

## 기준

| 상태 | 권장 |
|---|---|
| dark/light theme | next-themes |
| sidebar open | Zustand |
| layout density | Zustand |
| command palette open | Zustand |

---

## Layout Store 예시

```ts
// shared/store/layout.store.ts
import { create } from 'zustand'

type LayoutStore = {
  density: 'comfortable' | 'compact'
  setDensity: (density: 'comfortable' | 'compact') => void
}

export const useLayoutStore = create<LayoutStore>(set => ({
  density: 'comfortable',
  setDensity: density => set({ density })
}))
```

---

# 12. Auth State 주의

Auth Session은 Zustand에 복제하지 않는 것이 좋습니다.

---

## 나쁜 예

```ts
useAuthStore.setState({
  user: session.user
})
```

문제:

- Auth.js session과 Zustand user가 불일치할 수 있음
- 로그아웃 시 동기화 누락 가능
- source of truth가 둘로 나뉨

---

## 좋은 기준

```txt
로그인 세션
→ Auth.js

사용자 UI 메뉴 open/close
→ Zustand
```

---

## 예시

```tsx
const session = await auth()
```

또는 Client에서는:

```tsx
const { data: session } = useSession()
```

Zustand에는 세션 자체가 아니라 UI 상태만 둡니다.

---

# 13. React Query와 Zustand 역할 분리

## React Query

```txt
서버가 원본인 데이터
```

예:

- snack list
- board detail
- current user profile
- categories

---

## Zustand

```txt
브라우저 UI가 원본인 상태
```

예:

- confirm dialog open
- selected row id
- sidebar open
- command palette open

---

## 비교

| 상태 | React Query | Zustand |
|---|---|---|
| Snack 목록 | ✅ | ❌ |
| Board 상세 | ✅ | ❌ |
| 로그인 세션 | ❌ Auth.js | ❌ |
| Confirm Dialog | ❌ | ✅ |
| Sidebar open | ❌ | ✅ |
| Form 입력값 | ❌ RHF | ❌ |
| 검색 page | ❌ nuqs | ❌ |

---

# 14. CRUD 적용 예제

## 삭제 Confirm

```txt
DeleteButton
  ↓
Zustand confirm store
  ↓
ConfirmDialogRoot
  ↓
useMutation
  ↓
Server Action
```

---

## 선택된 행 상태

목록에서 선택된 row를 여러 컴포넌트가 공유해야 한다면 Zustand를 사용할 수 있습니다.

```txt
SnackTable
  ↓ select id
SnackPreview
  ↓ selected id 사용
```

단, 상세 데이터 자체는 React Query로 조회합니다.

---

## 사이드바 상태

```txt
Header Trigger
  ↓
Zustand sidebar store
  ↓
Sidebar Component
```

---

# 15. 코드 스니핏

## Store 폴더

```txt
shared/
└─ store/
   ├─ confirm.store.ts
   ├─ sidebar.store.ts
   └─ layout.store.ts
```

---

## Confirm Store

```ts
// shared/store/confirm.store.ts
import { create } from 'zustand'

type ConfirmPayload = {
  title: string
  description?: string
  onConfirm: () => void | Promise<void>
}

type ConfirmStore = {
  open: boolean
  title: string
  description?: string
  onConfirm?: () => void | Promise<void>
  openConfirm: (payload: ConfirmPayload) => void
  closeConfirm: () => void
}

export const useConfirmStore = create<ConfirmStore>(set => ({
  open: false,
  title: '',
  description: undefined,
  onConfirm: undefined,

  openConfirm: payload =>
    set({
      open: true,
      title: payload.title,
      description: payload.description,
      onConfirm: payload.onConfirm
    }),

  closeConfirm: () =>
    set({
      open: false,
      title: '',
      description: undefined,
      onConfirm: undefined
    })
}))
```

---

## Sidebar Store

```ts
// shared/store/sidebar.store.ts
import { create } from 'zustand'

type SidebarStore = {
  open: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarStore>(set => ({
  open: true,
  toggle: () => set(state => ({ open: !state.open })),
  setOpen: open => set({ open })
}))
```

---

## Selected Item Store

도메인 전용 UI 상태는 feature 내부에 둘 수 있습니다.

```ts
// features/snack/store/snack-ui.store.ts
import { create } from 'zustand'

type SnackUiStore = {
  selectedSnackId: string | null
  selectSnack: (id: string) => void
  clearSelectedSnack: () => void
}

export const useSnackUiStore = create<SnackUiStore>(set => ({
  selectedSnackId: null,
  selectSnack: id => set({ selectedSnackId: id }),
  clearSelectedSnack: () => set({ selectedSnackId: null })
}))
```

---

## 선택된 id로 상세 조회

```tsx
'use client'

import { useSnackUiStore } from '../store/snack-ui.store'
import { useSnackDetail } from '../hooks/use-snack'

export function SnackPreview() {
  const selectedSnackId = useSnackUiStore(state => state.selectedSnackId)

  if (!selectedSnackId) {
    return <p>선택된 간식이 없습니다.</p>
  }

  return <SnackPreviewContent id={selectedSnackId} />
}

function SnackPreviewContent({ id }: { id: string }) {
  const { data } = useSnackDetail(id)

  return <div>{data.title}</div>
}
```

주의:

```txt
selectedSnackId
→ Zustand

snack detail data
→ React Query
```

---

# 16. Caution

## 1. Store를 하나로 몰아넣지 않기

나쁜 예:

```txt
useAppStore
```

모든 상태를 하나의 store에 넣으면 유지보수가 어렵습니다.

권장:

```txt
useConfirmStore
useSidebarStore
useLayoutStore
```

---

## 2. 서버 데이터를 Zustand에 넣지 않기

나쁜 예:

```ts
set({ snacks: fetchedSnacks })
```

서버 데이터는 React Query가 관리합니다.

---

## 3. Auth Session을 Zustand에 복제하지 않기

세션은 Auth.js가 원본입니다.

---

## 4. Form 값을 Zustand에 넣지 않기

입력값은 RHF가 관리합니다.

예외적으로 multi-step form처럼 페이지 간 입력값을 유지해야 하는 경우에는 별도 설계가 필요합니다.

---

## 5. URL 상태를 Zustand에 넣지 않기

검색/정렬/페이징은 URL에 남아야 합니다.

담당:

```txt
nuqs
```

---

## 6. selector 없이 store 전체를 구독하지 않기

비권장:

```ts
const store = useConfirmStore()
```

권장:

```ts
const open = useConfirmStore(state => state.open)
```

---

# 17. Best Practice

## 권장

- 상태 종류를 먼저 구분
- 서버 데이터는 React Query 사용
- Form 값은 RHF 사용
- URL 상태는 nuqs 사용
- UI 전역 상태만 Zustand 사용
- store는 목적별로 작게 분리
- selector로 필요한 값만 구독
- shared store와 feature store를 구분
- Auth Session은 Auth.js를 source of truth로 유지
- persist는 필요한 상태에만 제한적으로 사용

---

## 비권장

- useAppStore 하나에 모든 상태 저장
- React Query 데이터를 Zustand에 복제
- Auth Session을 Zustand에 복제
- Form 값을 Zustand에 저장
- URL query를 Zustand에 저장
- 모든 modal을 개별 useState props drilling으로 관리
- selector 없이 store 전체 구독
- persist를 무분별하게 적용

---

# 18. 요약

## 상태별 담당

```txt
Server State
→ TanStack Query

Form State
→ React Hook Form

URL State
→ nuqs

Client/UI State
→ Zustand

Local State
→ useState
```

---

## Zustand 사용 기준

```txt
여러 컴포넌트가 공유하는 UI 상태
또는
props drilling이 심한 UI 상태
```

---

## 핵심 원칙

```txt
서버 데이터는 Zustand에 넣지 않는다.

Form 값은 Zustand에 넣지 않는다.

Auth Session은 Zustand에 넣지 않는다.

URL 상태는 Zustand에 넣지 않는다.

Zustand는 UI 전역 상태에 집중한다.
```
