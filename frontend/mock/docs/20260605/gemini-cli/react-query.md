# React Query 사용 가이드

이 프로젝트는 서버 상태 관리를 위해 `@tanstack/react-query`를 사용하며, SSR 최적화와 계층적 키 관리를 표준으로 삼고 있습니다.

## 🔑 1. Query Key Factory

문자열 기반 키 관리의 실수를 방지하고 계층 구조를 명확히 하기 위해 Factory 패턴을 사용합니다.

```typescript
// features/snack/queries/snack.query.ts
export const snackKeys = {
  all: ['snacks'] as const,
  lists: () => [...snackKeys.all, 'list'] as const,
  list: (params: SnackSearchParams) => [...snackKeys.lists(), params] as const,
  details: () => [...snackKeys.all, 'detail'] as const,
  detail: (id: string) => [...snackKeys.details(), id] as const,
};
```

---

## 📥 2. SSR Prefetching & Hydration

사용자 경험(LCP) 향상을 위해 서버 컴포넌트에서 데이터를 미리 가져옵니다.

### Prefetch 함수 정의
```typescript
// features/snack/prefetch/snack.prefetch.ts
export const prefetchSnackList = async (queryClient: QueryClient, params: SnackSearchParams) => {
  await queryClient.prefetchQuery(snackListQueryOptions(params));
};
```

### Page 적용 (Server Component)
```tsx
// app/snack/page.tsx
export default async function Page({ searchParams }) {
  const params = await parseSearchParams(searchParams);
  const queryClient = getQueryClient();
  
  await prefetchSnackList(queryClient, params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SnackList params={params} />
    </HydrationBoundary>
  );
}
```

---

## 🛠 3. useMutation & Cache Invalidation

데이터 변경 후 관련 캐시를 즉시 무효화하여 UI 동기화를 유지합니다.

```typescript
// features/snack/hooks/useSnack.ts
export const useCreateSnack = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: snackRepository.create,
    onSuccess: async () => {
      // 리스트 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: snackKeys.lists() });
      toast.success('등록되었습니다.');
      router.push('/snack');
    },
  });
};
```

---

## ⚙️ 4. 권장 설정 (Default Options)

*   **staleTime**: 60초 (자주 바뀌지 않는 목록 기준)
*   **gcTime**: 5분
*   **retry**: false (클라이언트 사이드 불필요한 재시도 방지)
*   **refetchOnWindowFocus**: false (의도치 않은 백그라운드 요청 방지)

---

## 💡 Tip: useSuspenseQuery 사용

데이터 로딩 상태를 선언적으로 처리하기 위해 `useSuspenseQuery` 사용을 권장합니다. 상위 `Suspense` 바운더리에서 `loader.tsx`를 통해 스켈레톤 UI를 노출할 수 있습니다.

```tsx
const { data } = useSuspenseQuery(snackListQueryOptions(params));
```
