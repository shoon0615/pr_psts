# CRUD 서비스에서 실무적으로 사용하는 공통 컴포넌트 정리

## 문서 목적

이 문서는 Next.js + React Query + nuqs + RHF + shadcn/ui 조합을 기준으로,  
CRUD 서비스에서 반복적으로 등장하는 **공통 컴포넌트**를 어떻게 설계하고 사용하는지 정리한다.

핵심 주제는 다음이다.

```txt
CRUD 구조 자체가 아니라,
CRUD 화면에서 반복되는 공통 컴포넌트를 어떻게 분리하고 조합하는가
```

---

# 1. 공통 컴포넌트의 기준

CRUD 서비스에서는 보통 아래 컴포넌트들이 반복된다.

```txt
목록 페이지
- Search
- Sort
- Filter
- List
- Table
- Pagination
- EmptyState
- Loading
- ErrorState

상세 페이지
- DetailView
- DetailSection
- InfoRow
- ActionButtons

등록/수정 페이지
- Form
- FormField
- SubmitButton
- CancelButton

삭제/상태 변경
- ConfirmDialog
- ActionMenu
- Toast
```

---

# 2. 공통 컴포넌트와 도메인 컴포넌트 구분

## 공통 컴포넌트

여러 도메인에서 재사용 가능해야 한다.

예:

```txt
CommonSearchForm
CommonSortSelect
CommonPagination
CommonTable
EmptyState
ConfirmDialogButton
FormSubmitButton
DetailInfoRow
```

공통 컴포넌트는 보통 다음 특징을 가진다.

```txt
- 도메인 hook을 직접 사용하지 않음
- useSnackList 같은 hook에 의존하지 않음
- value, onChange, data, renderItem 등을 props로 받음
- users, snacks, boards, products 등 여러 곳에서 재사용 가능
```

---

## 도메인 컴포넌트

특정 기능에 강하게 묶인 컴포넌트다.

예:

```txt
SnackSearch
SnackSort
SnackList
SnackForm
SnackDetail
```

도메인 컴포넌트는 다음처럼 작성해도 된다.

```tsx
const { searchParams, setSearchParams } = useSnackSearchParams()
const { data } = useSnackList()
```

즉, 도메인 hook을 직접 사용해도 된다.

---

# 3. 실무에서 자주 쓰는 조합

가장 많이 사용하는 구조는 다음과 같다.

```txt
Page
 ├─ DomainSearch
 │   └─ CommonSearchForm
 ├─ DomainSort
 │   └─ CommonSortSelect
 ├─ DomainList
 │   └─ CommonList or CardList
 ├─ DomainPagination
 │   └─ CommonPagination
 └─ EmptyState
```

즉, 실무에서는 완전히 공통 컴포넌트만으로 화면을 만들기보다  
**도메인 컴포넌트가 공통 컴포넌트를 감싸는 구조**를 많이 사용한다.

---

# 4. 추천 폴더 구조

```txt
shared/
└─ components/
   └─ common/
      ├─ common-search-form.tsx
      ├─ common-sort-select.tsx
      ├─ common-pagination.tsx
      ├─ common-list.tsx
      ├─ common-table.tsx
      ├─ empty-state.tsx
      ├─ error-state.tsx
      ├─ confirm-dialog-button.tsx
      ├─ action-menu.tsx
      ├─ submit-button.tsx
      └─ detail-info-row.tsx

features/
└─ snack/
   └─ components/
      ├─ snack-search.tsx
      ├─ snack-sort.tsx
      ├─ snack-list.tsx
      ├─ snack-pagination.tsx
      ├─ snack-form.tsx
      └─ snack-detail.tsx
```

---

# 5. 목록 페이지 전체 조합

```tsx
export default function ClientSnackPage() {
  const { data, isFetching } = useSnackList()

  return (
    <>
      <SnackSearch isFetching={isFetching} />

      <div className="flex justify-end">
        <SnackSort />
      </div>

      {data.data.length === 0 ? (
        <EmptyState
          title="과자가 없습니다."
          description="검색 조건을 변경하거나 새 과자를 등록해보세요."
        />
      ) : (
        <>
          <SnackList data={data.data} />
          <SnackPagination totalCount={data.items} />
        </>
      )}
    </>
  )
}
```

여기서 중요한 점은 다음이다.

```txt
ClientSnackPage
- 목록 데이터를 가져온다.
- 화면을 조합한다.
- 세부 UI 로직은 각 컴포넌트로 위임한다.
```

---

# 6. CommonSearchForm

## 목적

검색 폼 UI와 submit 흐름을 공통화한다.

```tsx
type CommonSearchFormProps<TValues> = {
  defaultValues: TValues
  isFetching?: boolean
  onSubmit: (values: TValues) => void
  onReset?: () => void
  children: React.ReactNode
}

export function CommonSearchForm<TValues>({
  defaultValues,
  isFetching,
  onSubmit,
  onReset,
  children
}: CommonSearchFormProps<TValues>) {
  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const values = Object.fromEntries(formData) as TValues

        onSubmit(values)
      }}
      className="rounded-md border p-4">
      <div className="grid gap-3 md:grid-cols-3">{children}</div>

      <div className="mt-4 flex justify-end gap-2">
        {onReset && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}>
            초기화
          </Button>
        )}

        <Button
          type="submit"
          disabled={isFetching}>
          {isFetching ? '검색 중...' : '검색'}
        </Button>
      </div>
    </form>
  )
}
```

---

# 7. SnackSearch에서 CommonSearchForm 사용

```tsx
export function SnackSearch({ isFetching }: { isFetching?: boolean }) {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <CommonSearchForm
      defaultValues={{
        brand: searchParams.brand,
        category: searchParams.category,
        contents: searchParams.contents
      }}
      isFetching={isFetching}
      onSubmit={values => {
        setSearchParams({
          brand: String(values.brand ?? ''),
          category: String(values.category ?? ''),
          contents: String(values.contents ?? ''),
          page: 1
        })
      }}
      onReset={() => {
        setSearchParams({
          brand: null,
          category: null,
          contents: null,
          page: 1
        })
      }}>
      <Input
        name="brand"
        defaultValue={searchParams.brand}
        placeholder="브랜드"
      />

      <Input
        name="category"
        defaultValue={searchParams.category}
        placeholder="카테고리"
      />

      <Input
        name="contents"
        defaultValue={searchParams.contents}
        placeholder="내용"
      />
    </CommonSearchForm>
  )
}
```

이 구조의 장점:

```txt
- CommonSearchForm은 snack을 모른다.
- SnackSearch가 nuqs와 도메인 검색 조건을 안다.
- 다른 도메인에서도 CommonSearchForm 재사용 가능
```

---

# 8. CommonSortSelect

## 목적

정렬 UI를 공통화한다.

```tsx
export type SortOption<TValue extends string = string> = {
  label: string
  value: TValue
}

type CommonSortSelectProps<TValue extends string> = {
  value: TValue
  options: SortOption<TValue>[]
  placeholder?: string
  onChange: (value: TValue) => void
}

export function CommonSortSelect<TValue extends string>({
  value,
  options,
  placeholder = '정렬',
  onChange
}: CommonSortSelectProps<TValue>) {
  return (
    <Select
      value={value}
      onValueChange={value => onChange(value as TValue)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

---

# 9. SnackSort에서 CommonSortSelect 사용

```tsx
const SNACK_SORT_OPTIONS = [
  {
    label: '이름순 ↑',
    value: 'title:asc'
  },
  {
    label: '이름순 ↓',
    value: 'title:desc'
  },
  {
    label: '가격순 ↑',
    value: 'price:asc'
  },
  {
    label: '가격순 ↓',
    value: 'price:desc'
  }
] as const

type SnackSortValue = (typeof SNACK_SORT_OPTIONS)[number]['value']
```

```tsx
export function SnackSort() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <CommonSortSelect<SnackSortValue>
      value={`${searchParams.sort}:${searchParams.order}` as SnackSortValue}
      options={SNACK_SORT_OPTIONS}
      onChange={value => {
        const [sort, order] = value.split(':') as [
          'title' | 'price',
          'asc' | 'desc'
        ]

        setSearchParams({
          sort,
          order,
          page: 1
        })
      }}
    />
  )
}
```

이 구조의 장점:

```txt
- CommonSortSelect는 sort/order 구조를 모른다.
- SnackSort가 도메인 정렬 정책을 가진다.
- BoardSort, UserSort, ProductSort에서도 재사용 가능
```

---

# 10. CommonPagination

## 목적

페이지 버튼 UI를 공통화한다.

```tsx
type CommonPaginationProps = {
  currentPage: number
  totalCount: number
  pageSize: number
  siblingCount?: number
  onPageChange: (page: number) => void
}

export function CommonPagination({
  currentPage,
  totalCount,
  pageSize,
  siblingCount = 2,
  onPageChange
}: CommonPaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) {
    return null
  }

  const start = Math.max(1, currentPage - siblingCount)
  const end = Math.min(totalPages, currentPage + siblingCount)

  const pages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  )

  return (
    <nav className="mt-6 flex justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}>
        이전
      </Button>

      {pages.map(page => (
        <Button
          key={page}
          type="button"
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}>
          {page}
        </Button>
      ))}

      <Button
        type="button"
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        다음
      </Button>
    </nav>
  )
}
```

---

# 11. SnackPagination에서 CommonPagination 사용

```tsx
const PAGE_SIZE = 10

export function SnackPagination({ totalCount }: { totalCount: number }) {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <CommonPagination
      currentPage={searchParams.page}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
      onPageChange={page => {
        setSearchParams({ page })
      }}
    />
  )
}
```

이 구조의 장점:

```txt
- CommonPagination은 nuqs를 모른다.
- SnackPagination이 URL 상태 변경을 담당한다.
- 다른 CRUD 목록에서도 그대로 사용 가능
```

---

# 12. CommonList

## 목적

카드형 목록 렌더링을 공통화한다.

```tsx
type CommonListProps<T> = {
  data: T[]
  getKey: (item: T) => React.Key
  renderItem: (item: T) => React.ReactNode
}

export function CommonList<T>({
  data,
  getKey,
  renderItem
}: CommonListProps<T>) {
  return (
    <div className="space-y-3">
      {data.map(item => (
        <div
          key={getKey(item)}
          className="rounded-md border p-4">
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
```

---

# 13. SnackList에서 CommonList 사용

```tsx
type Snack = {
  id: number
  title: string
  brand: string
  category: string
  price: number
}

export function SnackList({ data }: { data: Snack[] }) {
  return (
    <CommonList
      data={data}
      getKey={item => item.id}
      renderItem={item => (
        <Link href={`/snack/${item.id}`}>
          <div className="font-medium">{item.title}</div>

          <div className="text-muted-foreground text-sm">
            {item.brand} · {item.category}
          </div>

          <div className="mt-2 font-semibold">
            {item.price.toLocaleString('ko-KR')}원
          </div>
        </Link>
      )}
    />
  )
}
```

주의:

```txt
List는 useSnackList를 직접 호출하지 않는 편이 일반적이다.
List는 받은 data를 렌더링하는 View 성격이 강하기 때문이다.
```

---

# 14. CommonTable

## 목적

관리자 페이지나 CRUD 목록에서 가장 많이 쓰는 테이블 공통화 방식이다.

```tsx
type Column<T> = {
  key: string
  header: React.ReactNode
  cell: (item: T) => React.ReactNode
  className?: string
}

type CommonTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  getRowKey: (item: T) => React.Key
}

export function CommonTable<T>({
  data,
  columns,
  getRowKey
}: CommonTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead
              key={column.key}
              className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map(item => (
          <TableRow key={getRowKey(item)}>
            {columns.map(column => (
              <TableCell
                key={column.key}
                className={column.className}>
                {column.cell(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

# 15. SnackTable 사용 예시

```tsx
export function SnackTable({ data }: { data: Snack[] }) {
  return (
    <CommonTable
      data={data}
      getRowKey={item => item.id}
      columns={[
        {
          key: 'title',
          header: '이름',
          cell: item => <Link href={`/snack/${item.id}`}>{item.title}</Link>
        },
        {
          key: 'brand',
          header: '브랜드',
          cell: item => item.brand
        },
        {
          key: 'category',
          header: '카테고리',
          cell: item => item.category
        },
        {
          key: 'price',
          header: '가격',
          cell: item => `${item.price.toLocaleString('ko-KR')}원`
        }
      ]}
    />
  )
}
```

실무에서는 카드형 목록보다 테이블형 목록이 필요한 관리자 CRUD에서 이 패턴이 많이 사용된다.

---

# 16. EmptyState

## 목적

조회 결과가 없을 때의 UI를 공통화한다.

```tsx
type EmptyStateProps = {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = '데이터가 없습니다.',
  description = '조건을 변경하거나 새 데이터를 등록해보세요.',
  action
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <p className="text-lg font-semibold">{title}</p>

      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
```

사용 예시:

```tsx
<EmptyState
  title="등록된 과자가 없습니다."
  description="새 과자를 등록해보세요."
  action={
    <Button asChild>
      <Link href="/snack/new">등록</Link>
    </Button>
  }
/>
```

---

# 17. ErrorState

## 목적

에러 화면을 공통화한다.

```tsx
type ErrorStateProps = {
  title?: string
  description?: string
  onReset?: () => void
}

export function ErrorState({
  title = '문제가 발생했습니다.',
  description = '잠시 후 다시 시도해주세요.',
  onReset
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-md border p-8 text-center">
      <p className="text-lg font-semibold">{title}</p>

      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      {onReset && (
        <Button
          type="button"
          className="mt-4"
          onClick={onReset}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
```

Next.js `error.tsx` 사용 예시:

```tsx
'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      description="목록을 불러오지 못했습니다."
      onReset={reset}
    />
  )
}
```

---

# 18. ConfirmDialogButton

## 목적

삭제, 취소, 상태 변경처럼 사용자 확인이 필요한 액션을 공통화한다.

```tsx
type ConfirmDialogButtonProps = {
  label: string
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  onConfirm: () => void
}

export function ConfirmDialogButton({
  label,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'destructive',
  className,
  onConfirm
}: ConfirmDialogButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={variant}
          className={className}>
          {label}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

삭제 예시:

```tsx
<ConfirmDialogButton
  label="삭제"
  title="정말 삭제하시겠습니까?"
  description="삭제한 데이터는 복구할 수 없습니다."
  onConfirm={() => deleteMutation.mutate(id)}
/>
```

---

# 19. ActionMenu

## 목적

상세/목록의 수정, 삭제, 복사, 상태 변경 메뉴를 공통화한다.

```tsx
type ActionMenuItem = {
  label: string
  onClick: () => void
  destructive?: boolean
}

type ActionMenuProps = {
  items: ActionMenuItem[]
}

export function ActionMenu({ items }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {items.map(item => (
          <DropdownMenuItem
            key={item.label}
            variant={item.destructive ? 'destructive' : undefined}
            onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

사용 예시:

```tsx
<ActionMenu
  items={[
    {
      label: '수정',
      onClick: () => router.push(`/snack/${id}/edit`)
    },
    {
      label: '삭제',
      destructive: true,
      onClick: () => setOpenDeleteDialog(true)
    }
  ]}
/>
```

---

# 20. DetailInfoRow

## 목적

상세 페이지의 라벨/값 표시를 공통화한다.

```tsx
type DetailInfoRowProps = {
  label: React.ReactNode
  value?: React.ReactNode
}

export function DetailInfoRow({ label, value }: DetailInfoRowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 border-b py-3">
      <dt className="text-muted-foreground text-sm">{label}</dt>

      <dd className="text-sm">{value ?? '-'}</dd>
    </div>
  )
}
```

사용 예시:

```tsx
<dl className="rounded-md border px-4">
  <DetailInfoRow
    label="이름"
    value={data.title}
  />

  <DetailInfoRow
    label="브랜드"
    value={data.brand}
  />

  <DetailInfoRow
    label="가격"
    value={`${data.price.toLocaleString('ko-KR')}원`}
  />
</dl>
```

---

# 21. DetailActionButtons

## 목적

상세 페이지 하단 액션을 공통화한다.

```tsx
type DetailActionButtonsProps = {
  listHref: string
  editHref?: string
  onDelete?: () => void
}

export function DetailActionButtons({
  listHref,
  editHref,
  onDelete
}: DetailActionButtonsProps) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <Button
        variant="outline"
        asChild>
        <Link href={listHref}>목록</Link>
      </Button>

      {editHref && (
        <Button asChild>
          <Link href={editHref}>수정</Link>
        </Button>
      )}

      {onDelete && (
        <ConfirmDialogButton
          label="삭제"
          title="정말 삭제하시겠습니까?"
          description="삭제한 데이터는 복구할 수 없습니다."
          onConfirm={onDelete}
        />
      )}
    </div>
  )
}
```

---

# 22. FormSubmitButton

## 목적

등록/수정 폼의 제출 버튼을 공통화한다.

```tsx
type FormSubmitButtonProps = {
  isPending?: boolean
  createLabel?: string
  updateLabel?: string
  mode: 'create' | 'update'
}

export function FormSubmitButton({
  isPending,
  createLabel = '등록',
  updateLabel = '수정',
  mode
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isPending}>
      {isPending ? '처리 중...' : mode === 'create' ? createLabel : updateLabel}
    </Button>
  )
}
```

사용 예시:

```tsx
<FormSubmitButton
  mode="create"
  isPending={mutation.isPending}
/>
```

```tsx
<FormSubmitButton
  mode="update"
  isPending={mutation.isPending}
/>
```

---

# 23. SnackForm

## 목적

등록/수정에서 같은 Form 컴포넌트를 재사용한다.

```tsx
type SnackFormProps = {
  mode: 'create' | 'update'
  defaultValues: SnackFormValues
  onSubmit: (values: SnackFormValues) => void
  isPending?: boolean
}

export function SnackForm({
  mode,
  defaultValues,
  onSubmit,
  isPending
}: SnackFormProps) {
  const form = useForm<SnackFormValues>({
    resolver: zodResolver(snackSchema),
    defaultValues
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>가격</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  value={field.value}
                  onChange={event => {
                    field.onChange(event.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            asChild>
            <Link href="/snack">취소</Link>
          </Button>

          <FormSubmitButton
            mode={mode}
            isPending={isPending}
          />
        </div>
      </form>
    </Form>
  )
}
```

---

# 24. Create 페이지에서 SnackForm 사용

```tsx
export default function NewSnackPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSnack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snackKeys.lists()
      })

      router.replace('/snack')
    }
  })

  return (
    <SnackForm
      mode="create"
      defaultValues={{
        title: '',
        brand: '',
        category: '',
        contents: '',
        price: ''
      }}
      isPending={mutation.isPending}
      onSubmit={values => {
        mutation.mutate(values)
      }}
    />
  )
}
```

---

# 25. Edit 페이지에서 SnackForm 사용

```tsx
export default function EditSnackPage({ id }: { id: number }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data } = useSnackDetail(id)

  const mutation = useMutation({
    mutationFn: updateSnack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snackKeys.detail(id)
      })

      queryClient.invalidateQueries({
        queryKey: snackKeys.lists()
      })

      router.replace(`/snack/${id}`)
    }
  })

  return (
    <SnackForm
      mode="update"
      defaultValues={{
        title: data.title,
        brand: data.brand,
        category: data.category,
        contents: data.contents ?? '',
        price: String(data.price)
      }}
      isPending={mutation.isPending}
      onSubmit={values => {
        mutation.mutate({
          id,
          ...values
        })
      }}
    />
  )
}
```

---

# 26. 공통 컴포넌트를 무조건 만들면 안 되는 경우

공통화가 오히려 안 좋은 경우도 많다.

## 1. 도메인 규칙이 강한 경우

예:

```txt
SnackSearch
BoardSearch
UserSearch
```

검색 조건이 서로 다르면 하나의 거대한 CommonSearch로 만들지 않는 편이 낫다.

이 경우 추천 구조:

```txt
SnackSearch
 └─ CommonSearchForm

BoardSearch
 └─ CommonSearchForm
```

---

## 2. props가 너무 많아지는 경우

나쁜 예:

```tsx
<CommonCrudPage
  title="과자"
  searchFields={...}
  sortOptions={...}
  columns={...}
  createHref={...}
  editHref={...}
  deleteMutation={...}
  queryKey={...}
  repository={...}
/>
```

이런 형태는 처음에는 편해 보이지만, 실제로는 예외 처리가 많아져서 유지보수가 어려워진다.

---

## 3. 화면별 UX가 다른 경우

예:

```txt
상품 목록
- 카드형
- 이미지 필요
- 가격 표시 필요

회원 목록
- 테이블형
- 상태 뱃지 필요
- 권한 표시 필요

게시글 목록
- 제목/작성자/조회수 필요
```

이런 경우 `CommonList` 하나로 모든 걸 처리하려고 하면 복잡해진다.

---

# 27. 실무에서 권장하는 공통화 수준

## 적극 권장

```txt
Button
Input
Select
ConfirmDialogButton
EmptyState
ErrorState
Pagination
Table
ActionMenu
SubmitButton
DetailInfoRow
```

## 상황에 따라 권장

```txt
SearchForm
SortSelect
FilterGroup
CardList
FormLayout
DetailLayout
```

## 신중하게 접근

```txt
CrudPage
CrudForm
CrudList
CrudTable
```

이름이 `Crud`로 시작하는 너무 큰 컴포넌트는 실무에서 오히려 관리가 어려워질 수 있다.

---

# 28. 최종 추천 패턴

CRUD 서비스에서 가장 무난한 실무 구조는 다음이다.

```txt
공통 컴포넌트
- UI와 반복 패턴 담당
- 도메인 모름
- props 기반

도메인 컴포넌트
- URL 상태
- React Query
- Mutation
- 도메인 정책
- 공통 컴포넌트 조합

Page
- 데이터 조회
- 화면 배치
- 도메인 컴포넌트 조합
```

---

# 29. 전체 예시 구조

```txt
ClientSnackPage
 ├─ SnackSearch
 │   └─ CommonSearchForm
 ├─ SnackSort
 │   └─ CommonSortSelect
 ├─ SnackList
 │   └─ CommonList
 ├─ SnackPagination
 │   └─ CommonPagination
 └─ EmptyState

SnackDetailPage
 ├─ DetailInfoRow
 ├─ DetailActionButtons
 └─ ConfirmDialogButton

NewSnackPage
 └─ SnackForm
     ├─ FormSubmitButton
     └─ shadcn FormField

EditSnackPage
 └─ SnackForm
     ├─ FormSubmitButton
     └─ shadcn FormField
```

---

# 30. 요약

CRUD 서비스에서 실무적으로 공통 컴포넌트를 설계할 때 핵심은  
**도메인 로직과 공통 UI를 분리하는 것**이다.

가장 추천하는 방식은 다음이다.

```txt
Common 컴포넌트
- 재사용 가능한 UI
- props 기반
- 도메인 hook 사용 안 함

Domain 컴포넌트
- useSnackSearchParams
- useSnackList
- useMutation
- queryKey
- router 이동
- Common 컴포넌트 조합

Page 컴포넌트
- 화면 배치
- 데이터 조회
- Empty / Loading / Error 분기
```

예를 들어 목록 페이지에서는 다음 구조가 가장 무난하다.

```txt
Page
 ├─ SnackSearch       → CommonSearchForm 사용
 ├─ SnackSort         → CommonSortSelect 사용
 ├─ SnackList         → CommonList 또는 CommonTable 사용
 ├─ SnackPagination   → CommonPagination 사용
 └─ EmptyState
```

등록/수정 페이지에서는 다음 구조가 좋다.

```txt
NewPage/EditPage
 └─ SnackForm
     ├─ shadcn FormField
     ├─ FormSubmitButton
     └─ CancelButton
```

삭제나 상태 변경은 다음처럼 처리한다.

```txt
ConfirmDialogButton
ActionMenu
Toast
Mutation
invalidateQueries
```

공통화를 할 때 가장 피해야 할 것은  
모든 CRUD를 하나의 거대한 `CommonCrudPage`로 묶는 것이다.

실무에서는 보통 다음 정도가 가장 유지보수하기 좋다.

```txt
작은 공통 컴포넌트는 적극 공통화
도메인 정책은 도메인 컴포넌트에 유지
Page는 조합만 담당
```

즉, CRUD 서비스의 실무형 공통 컴포넌트 설계는  
**큰 만능 컴포넌트가 아니라 작은 공통 컴포넌트를 도메인 컴포넌트가 조합하는 방식**이 가장 안정적이다.
