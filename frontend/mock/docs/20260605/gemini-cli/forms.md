# Form 및 검증 가이드

이 프로젝트는 `React Hook Form`과 `Zod`를 결합하여 타입 안전하고 성능이 뛰어난 폼 구현을 표준으로 합니다.

## 📝 1. 기본 구현 패턴 (RHF + Zod)

### 스키마 정의 (Schema)
```typescript
// features/snack/schema/snack.schema.ts
export const snackFormSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다.').max(32),
  price: z.coerce.number().int().min(0),
});

export type SnackFormInput = z.infer<typeof snackFormSchema>;
```

### 폼 초기화 및 사용
```tsx
const form = useForm<SnackFormInput>({
  resolver: zodResolver(snackFormSchema),
  defaultValues: { title: '', price: 0 },
});

const onSubmit = form.handleSubmit((data) => {
  mutate(data);
});
```

---

## 🏗 2. 공통 폼 컴포넌트 표준

`shared/components/ui/form.tsx` (shadcn/ui 기반)를 사용하여 접근성과 일관된 스타일을 유지합니다.

```tsx
<Form {...form}>
  <form onSubmit={onSubmit} className="space-y-4">
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>과자명</FormLabel>
          <FormControl>
            <Input placeholder="이름을 입력하세요" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">제출</Button>
  </form>
</Form>
```

---

## ⚡️ 3. Next/Form 활용 (검색 폼)

조회/검색 폼의 경우, 복잡한 검증이 필요 없다면 `next/form`을 사용하여 Progressive Enhancement를 지원합니다.

```tsx
import Form from 'next/form';

export function SnackSearchForm() {
  return (
    <Form action="/snack" className="flex gap-2">
      <Input name="keyword" placeholder="검색어" />
      <Button type="submit">검색</Button>
    </Form>
  );
}
```

---

## ⚠️ 4. 주의 사항

*   **Radix Select SSR**: Radix UI의 Select는 hydration 이후에 options가 생성되므로, 초기 렌더링 시 깜빡임이 발생할 수 있습니다. 중요한 경우 `ssr: false`로 dynamic import 하거나 native select 사용을 고려하세요.
*   **Dirty Fields**: 대규모 폼의 경우 `dirtyFields`를 활용하여 변경된 데이터만 서버로 전송하는 최적화를 권장합니다.
*   **Server Validation**: 클라이언트 검증과 별개로 **Server Action/Route Handler에서도 반드시 Zod 검증을 재수행**해야 합니다.
