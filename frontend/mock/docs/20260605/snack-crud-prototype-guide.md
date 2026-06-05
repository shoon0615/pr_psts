# Snack CRUD Prototype & Guideline

## 1. 목적
이 문서는 `Next.js + React Query + nuqs + RHF + shadcn/ui` 조합을 활용하여 **Snack 도메인**을 대상으로 한 실무형 CRUD 프로토타입 구현 가이드를 제공한다.
`@mock/docs/20260530/crud-common-components-practical-guide.md`의 설계 원칙을 계승하며, 실제 프로젝트 구조에 맞게 구체화한다.

---

## 2. 설계 원칙
1. **공통 컴포넌트(Shared)와 도메인 컴포넌트(Feature) 분리**
   - `shared/components/common`: 도메인 지식이 없는 순수 UI 로직 (props 기반)
   - `features/snack/components`: 도메인 hook(nuqs, react-query)과 연동된 도메인 전용 UI
2. **URL 중심의 상태 관리 (Search, Filter, Sort, Pagination)**
   - `nuqs`를 사용하여 모든 조회 조건을 URL에 동기화.
   - `page.tsx`에서 `searchParams`를 통해 서버 프리페칭(Prefetching) 수행.
3. **서버 상태(Server State) 관리**
   - `TanStack Query`를 사용하여 데이터 캐싱 및 무효화(Invalidation) 처리.
   - `useSuspenseQuery`를 통한 선언적 로딩 처리.
4. **폼 및 검증 (Form & Validation)**
   - `React Hook Form`과 `Zod`를 결합하여 타입 안전한 입력 처리.
   - `Server Action`을 통한 데이터 변경(Mutation).

---

## 3. 추천 폴더 구조

### Shared (공통)
```text
shared/
└─ components/
   └─ common/                 # 공통 UI 컴포넌트
      ├─ common-search-form.tsx
      ├─ common-sort-select.tsx
      ├─ common-pagination.tsx
      ├─ common-table.tsx
      ├─ empty-state.tsx
      ├─ error-state.tsx
      ├─ confirm-dialog-button.tsx
      ├─ action-menu.tsx
      └─ submit-button.tsx
```

### Features (도메인)
```text
features/
└─ snack/
   ├─ actions/                # Server Actions
   ├─ components/             # 도메인 컴포넌트 (공통 컴포넌트 조합)
   │  ├─ snack-search.tsx
   │  ├─ snack-sort.tsx
   │  ├─ snack-table.tsx
   │  ├─ snack-pagination.tsx
   │  ├─ snack-form.tsx
   │  └─ snack-detail.tsx
   ├─ hooks/                  # 도메인 전용 커스텀 훅
   ├─ prefetch/               # SSR 데이터 프리페치
   ├─ queries/                # Query Key & Options
   ├─ repositories/           # API/DB 접근
   ├─ schema/                 # Zod 스키마
   ├─ services/               # 비즈니스 로직
   └─ types/                  # 타입 정의
```

---

## 4. 구현 로드맵 (Roadmap)

### Phase 1: 공통 인프라 구축 (Shared)
- [ ] `shared/components/common` 폴더 생성 및 기본 공통 컴포넌트 구현
  - `CommonSearchForm`, `CommonPagination`, `CommonTable` 등

### Phase 2: 스낵 도메인 로직 정립 (Feature Core)
- [ ] `snack.schema.ts` & `snack.type.ts` 고도화
- [ ] `snack.query.ts`를 통한 Query Options 정의
- [ ] `useSnack.ts` 커스텀 훅 완성 (목록, 상세, 생성, 수정, 삭제)

### Phase 3: 도메인 컴포넌트 개발 (Domain UI)
- [ ] `SnackSearch`, `SnackSort`, `SnackPagination` (nuqs 연동)
- [ ] `SnackTable` (CommonTable 기반)
- [ ] `SnackForm` (RHF + Zod 기반, 생성/수정 공용)

### Phase 4: 페이지 조립 (App Layer)
- [ ] `app/.../snack/page.tsx` (목록 조회 및 검색)
- [ ] `app/.../snack/new/page.tsx` (등록)
- [ ] `app/.../snack/[id]/page.tsx` (상세)
- [ ] `app/.../snack/[id]/edit/page.tsx` (수정)

---

## 5. 주요 코드 패턴

### 5.1 공통 테이블 (CommonTable) 사용 예시
```tsx
// features/snack/components/snack-table.tsx
export function SnackTable({ data }: { data: Snack[] }) {
  return (
    <CommonTable
      data={data}
      getRowKey={item => item.id}
      columns={[
        { key: 'title', header: '이름', cell: item => <Link href={`/snack/${item.id}`}>{item.title}</Link> },
        { key: 'brand', header: '브랜드', cell: item => item.brand },
        { key: 'price', header: '가격', cell: item => `${item.price.toLocaleString()}원` },
      ]}
    />
  )
}
```

### 5.2 도메인 검색 (SnackSearch)
```tsx
// features/snack/components/snack-search.tsx
export function SnackSearch() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <CommonSearchForm
      onSubmit={values => setSearchParams({ ...values, page: 1 })}
      onReset={() => setSearchParams({ brand: '', category: '', page: 1 })}
    >
      <Input name="brand" defaultValue={searchParams.brand} placeholder="브랜드" />
      <Input name="category" defaultValue={searchParams.category} placeholder="카테고리" />
    </CommonSearchForm>
  )
}
```

---

## 6. 기대 효과
- **일관된 코드 스타일**: 모든 CRUD 도메인이 동일한 패턴을 따름으로써 유지보수성 향상.
- **재사용성 극대화**: 공통 컴포넌트를 통해 새로운 도메인 확장 시 개발 속도 단축.
- **안정적인 상태 관리**: URL과 서버 상태가 동기화되어 사용자 경험(UX) 최적화.
