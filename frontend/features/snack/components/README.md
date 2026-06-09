## TanStack Table의 실무 핵심

TanStack Table은:

> "UI Table 라이브러리"

가 아니라

> "Table State Engine"

에 가깝습니다.

즉:

```text
정렬
필터
선택
컬럼 상태
페이지 상태
```

를 관리해주는 역할입니다.

실제 UI는 직접 만듭니다.

---

그래서 실무에서 많이 하는 패턴

```text
TanStack Table
+ shadcn/ui table
+ react-query
+ nuqs
```

조합이 현재 Next.js 관리자 페이지에서 굉장히 많이 사용됩니다.

---

## Temp

prefetch 는 초기 진입 데이터만 미리 캐시에 넣는 역할입니다.
검색 버튼으로 조건이 바뀌면, 핵심은 queryKey가 바뀌느냐입니다.

### 결론

검색 조건을 queryKey에 포함하면 됩니다.

```typescript
queryKey: ['boards', searchParams]
```

그러면 흐름은 이렇게 됩니다.

```text
1. page.tsx 에서 초기 조건으로 prefetch
2. HydrationBoundary 로 클라이언트에 캐시 전달
3. List(use client) 의 useQuery 가 같은 queryKey 사용
4. 최초 화면은 prefetch 된 데이터 즉시 사용
5. 검색 버튼 클릭
6. 검색 조건 변경
7. queryKey 변경
8. TanStack Query 가 새 조건으로 다시 조회
```

---

## 검색 버튼 클릭 시 실제로 일어나는 일

### 1. URL이 바뀜

```typescript
/boards?keyword=java&regionId=01
```

### 2. useSearchParams() 값이 바뀜

```typescript
keyword: 'java'
regionId: '01'
```

### 3. queryKey가 바뀜

```typescript
;['boards', { keyword: '', regionId: '' }]
```

에서

```typescript
;['boards', { keyword: 'java', regionId: '01' }]
```

### 4. 새 queryFn 실행

```typescript
boardService.getBoards({
  keyword: 'java',
  regionId: '01'
})
```

### 중요한 점

검색 버튼을 눌렀을 때 refetch()만 직접 호출하는 방식은 비추천입니다.

```typescript
refetch()
```

이 방식은 현재 queryKey 기준으로 다시 조회합니다.

즉, 검색 조건이 queryKey에 반영되지 않으면 새 조건 검색이 꼬일 수 있습니다.

### 추천 방식

```
검색 버튼 클릭
→ URL query string 변경
→ useSearchParams 변경
→ queryKey 변경
→ 자동 조회
```

이 흐름이 Next.js App Router + TanStack Query에서 가장 깔끔합니다.

---

```
prefetch 함수
→ 서버에서 미리 캐시에 넣는 역할

hook
→ 클라이언트에서 캐시를 읽고 필요하면 fetch 하는 역할
```

```
초기 진입
→ 서버에서 prefetch
→ hydrated cache 사용

검색 버튼 클릭
→ URL query string 변경
→ queryKey 변경
→ useQuery가 새 조건으로 조회
```

즉, 초기 조회는 SSR/prefetch로 최적화하고, 이후 검색은 React Query의 클라이언트 캐시/재조회 흐름으로 처리할 수 있습니다.

### ReactQueryStreamedHydration은 다음 상황에서만 고려하세요.

- useSuspenseQuery 중심으로 화면을 설계할 때
- Suspense fallback / loading.tsx / streaming UI를 적극 활용할 때
- 여러 위젯이 독립적으로 늦게 로딩되어도 되는 대시보드형 화면일 때

### 핵심 차이

| 방식                        | 개념                                             |
| --------------------------- | ------------------------------------------------ |
| HydrationBoundary           | 서버에서 데이터 완성 후 전달                     |
| ReactQueryStreamedHydration | UI 먼저 보내고 데이터는 Suspense 단위로 스트리밍 |

### HydrationBoundary

#### 1. 안정적

초기 데이터가 이미 존재(SSR 완료 상태로 전달)

#### 2. SEO 유리

HTML 생성 시 데이터 포함됨

#### 3. 검색 화면에 적합

검색 버튼  
→ queryKey 변경  
→ 재조회

#### 4. 디버깅 쉬움

> 어디서 fetch 되는지 명확

### ReactQueryStreamedHydration

```
Server Rendering 시작
  ↓
UI 먼저 스트리밍
  ↓
Suspense 경계별 데이터 로딩
  ↓
준비된 부분부터 점진 렌더
```

- 관리자 대시보드
- 통계 페이지
- 모니터링 화면
- BI 화면
- 실시간 지표

> `SNS / 콘텐츠 앱` 독립 로딩 가능

```
피드
댓글
추천
광고
실시간 위젯
```

#### 왜 적합하냐?

각 위젯이 독립적이기 때문입니다.

예:

```
매출 차트 → 3초
유저 통계 → 1초
알림 → 0.5초
```

`HydrationBoundary`: 3초 기다린 뒤 전체 렌더

`Streamed`:  
0.5초 알림 먼저  
1초 유저 통계  
3초 차트

> UX 훨씬 좋음

---

### 중요한 실무 포인트

실무에서는 검색 영역을 단순 UI로 안 보고:

```
"URL 상태 관리 시스템"
```

처럼 봅니다.

그래서 핵심은:

```
검색 조건
↔ URL
↔ react-query key
↔ pagination
↔ cache
```

를 얼마나 안정적으로 연결하느냐입니다.

이 부분이 관리자 페이지 품질 차이를 꽤 크게 만듭니다.

---

## data

### 1. useEffect

브라우저에서 첫 렌더링이 끝난 뒤 실행

```typescript
const [data, setData] = React.useState([])
React.useEffect(() => {
  setData(fetch())
}, [])
```

### 2. useQuery

기본적으로 컴포넌트가 마운트되면 자동으로 첫 조회 수행

### 3. prefetchQuery + OnSubmit(setSearchParams(nuqs))

`useEffect | useQuery` 둘 다 빈 혹은 로딩 화면을 전달 후 데이터를 가져옴  
즉, 초기 HTML 에 목록 데이터가 없기에 SEO 처리가 안되며, 그 외 설정도 맞춰야함
