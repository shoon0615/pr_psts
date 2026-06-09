# Radix Select SSR / Hydration 이슈 정리

## 문제 상황

`shadcn/ui` + `Radix Select` 사용 시 다음 현상이 발생함.

```tsx
<FormSelect
  name="category"
  label="카테고리"
  placeholder="- 선택 -"
  items={[
    { label: '중앙', value: 'central' },
    { label: '서울', value: 'seoul' },
    { label: '부산', value: 'busan' }
  ]}
/>
```

최초 접속 시:

```txt
placeholder 만 먼저 보임
options DOM 없음
```

이후 hydration 완료 후:

```txt
client console.log 출력
Select 정상 동작
options 사용 가능
```

---

# 실제 원인

## ❌ 잘못 이해하기 쉬운 원인

```txt
react-query 문제
prefetch 문제
items 비동기 문제
defaultValues 문제
```

위 문제와 무관할 수 있음.

하드코딩 데이터에서도 동일 현상 발생 가능.

---

# 실제 원인

## ✅ SSR → Hydration → Radix 초기화 순서 문제

Radix Select는 native select가 아님.

```html
<select>
  <option>서울</option>
</select>
```

구조가 아니라:

```txt
Trigger(Button)
+
Portal 기반 Popup(Content)
```

구조로 동작함.

---

# SSR 시점

서버 HTML에는 대략 아래 정도만 존재함.

```html
<button role="combobox">
  <span>- 선택 -</span>
</button>
```

즉:

```txt
placeholder 만 존재
SelectContent 없음
SelectItem 없음
Portal 없음
```

---

# Hydration 이후

브라우저 JS 로딩 완료 후:

```txt
Portal 초기화
floating position 계산
keyboard navigation 초기화
focus management 연결
```

등이 수행됨.

그 후 Select가 완성됨.

---

# 실제 사용자 입장에서 보이는 흐름

```txt
1차:
SSR HTML 렌더링
↓
placeholder 만 존재

2차:
hydration 완료
↓
Radix Select 초기화
↓
Select 정상 동작
```

---

# 왜 console.log 가 늦게 찍히는가

예시:

```tsx
'use client'

export default function SnackSearch() {
  console.log('SnackSearch')

  return <FormSelect />
}
```

`use client` 컴포넌트는:

```txt
서버 HTML 생성
↓
브라우저 hydration
↓
client component 실행
↓
console.log 출력
```

순서로 동작함.

즉:

```txt
console.log 가 늦게 찍히는 건 정상
```

---

# 핵심 정리

현재 현상은:

```txt
데이터 로딩 지연
```

이 아니라:

```txt
Radix Select hydration 초기화 타이밍
```

문제에 가까움.

---

# native select 와 차이

## native select

```html
<select>
  <option>서울</option>
  <option>부산</option>
</select>
```

특징:

```txt
최초 HTML 에 option 존재
SSR 즉시 렌더링 가능
```

---

## Radix Select

```html
<button>- 선택 -</button>
```

특징:

```txt
options 는 hydration 이후 popup 구조로 생성
Portal 기반
```

---

# 해결 방법

# 1. 그대로 사용 (권장 가능)

조건:

```txt
placeholder 먼저 보이는 것이 허용 가능
```

실제로 대부분 프로젝트에서 문제 없이 사용됨.

---

# 2. dynamic + ssr:false (실무에서 가장 많이 사용)

## 목적

```txt
hydration 완료 전에는 Select 자체를 렌더링하지 않음
```

---

## 적용 예시

### page.tsx

```tsx
import dynamic from 'next/dynamic'

const SnackSearch = dynamic(() => import('./snack-search.client'), {
  ssr: false,

  loading: () => (
    <div className="bg-muted h-10 w-full animate-pulse rounded-md border" />
  )
})

export default function Page() {
  return (
    <>
      <SnackSearch />
    </>
  )
}
```

---

## 동작 흐름

```txt
SSR:
loading skeleton 출력

hydration 완료:
Select 렌더링
```

---

# SEO 영향

검색 필터만 CSR 처리하는 경우:

```txt
SEO 영향 거의 없음
```

왜냐면 SEO 핵심은:

```txt
본문
목록
제목
메타데이터
링크
```

등이기 때문.

즉:

```txt
검색 필터 UI만 CSR 처리
→ 실무에서 자주 사용
```

---

# useEffect 방식

## ❌ 단순 useEffect + setState

```tsx
useEffect(() => {
  setMounted(true)
}, [])
```

React 19 / 최신 ESLint 규칙에서:

```txt
Calling setState synchronously within an effect
```

경고가 발생할 수 있음.

---

# requestAnimationFrame 방식

```tsx
useEffect(() => {
  const frame = requestAnimationFrame(() => {
    setMounted(true)
  })

  return () => cancelAnimationFrame(frame)
}, [])
```

---

# 추천 우선순위

```txt
1. dynamic(..., { ssr:false })
2. native select 사용
3. requestAnimationFrame 방식
```

---

# 최종 결론

현재 현상은 대부분:

```txt
Radix Select의 SSR / hydration 특성
```

으로 보는 것이 맞음.

즉:

```txt
placeholder 먼저 보임
↓
hydration
↓
Select 초기화
```

흐름은 정상 동작에 가까움.

만약:

```txt
최초 HTML 에 option DOM 이 반드시 존재해야 함
```

요구사항이라면:

```txt
native select 사용이 적합
```

이고,

```txt
hydration 전에는 loading/skeleton 만 보이게 하고 싶음
```

이라면:

```txt
dynamic + ssr:false + loading skeleton
```

구조가 가장 실무적임.
