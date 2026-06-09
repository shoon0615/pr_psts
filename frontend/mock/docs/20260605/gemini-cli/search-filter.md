# URL 상태 관리 및 검색/필터 가이드

이 프로젝트는 URL Query String을 "Source of Truth"로 삼아 새로고침이나 공유 시에도 동일한 UI 상태를 유지하는 것을 원칙으로 합니다.

## 🔗 1. nuqs를 활용한 URL 상태 동기화

`nuqs`를 사용하여 URL 파라미터를 React 상태처럼 쉽고 타입 안전하게 관리합니다.

### 상태 정의 (Schema)
```typescript
// features/snack/schema/snack-search-params.ts
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export const snackSearchParams = {
  page: parseAsInteger.withDefault(1),
  keyword: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  sort: parseAsString.withDefault('latest'),
};
```

### 컴포넌트 사용
```tsx
const [searchParams, setSearchParams] = useQueryStates(snackSearchParams, {
  shallow: false, // URL 변경 시 서버 컴포넌트 재실행 (prefetch 연동용)
  history: 'replace', // 뒤로가기 기록 방지
});

const handleSearch = (newKeyword: string) => {
  setSearchParams({ keyword: newKeyword, page: 1 });
};
```

---

## 🛠 2. qs를 활용한 API 요청 문자열 변환

복잡한 배열이나 중첩된 객체를 API 쿼리 스트링으로 변환할 때는 `qs` 라이브러리를 사용합니다.

```typescript
// shared/lib/qs.ts
import qs from 'qs';

export const toQueryString = (params: object) => {
  return qs.stringify(params, {
    addQueryPrefix: true,
    arrayFormat: 'repeat',
    skipNulls: true,
  });
};
```

### Repository에서의 활용
```typescript
const getSnacks = async (params: SnackSearchParams) => {
  const queryString = toQueryString(params);
  const { data } = await api.get(`/snacks${queryString}`);
  return data;
};
```

---

## 🚀 3. 실무 추천 패턴: 필터 + 정렬 + 페이징

| 기능 | 권장 구현 |
| :--- | :--- |
| **검색어 입력** | 로컬 `useState`로 값을 들고 있다가, 검색 버튼 클릭 시 `setSearchParams` 수행 |
| **필터/정렬 변경** | 선택 즉시 `setSearchParams`를 통해 URL 반영 및 `page`를 1로 초기화 |
| **페이지네이션** | `nuqs`의 `page` 상태를 변경하여 React Query 재조회 유도 |

### 필터 변경 예시
```tsx
<Select
  value={searchParams.brand || 'all'}
  onValueChange={(val) => setSearchParams({ brand: val === 'all' ? null : val, page: 1 })}
>
  {/* options */}
</Select>
```

---

## ✅ 4. Checklist

- [ ] 필터나 정렬이 변경될 때 `page`가 1로 초기화되는가?
- [ ] 빈 문자열이나 `null` 값이 URL에서 적절히 제거되는가? (`clearOnDefault: true`)
- [ ] 서버 컴포넌트 프리페칭이 필요한 경우 `shallow: false` 옵션이 적용되었는가?
