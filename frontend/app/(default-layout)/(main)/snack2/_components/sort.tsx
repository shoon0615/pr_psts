'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/shadcn/ui/select'
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from '@/shared/components/shadcn/ui/native-select'
import { useSnackSearchParams } from '@/features/snack/hooks/useSnack'
import { SORT_OPTIONS, SortType } from '@/features/snack/types/snack.type'

// Select
/* export default function SnackSort() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <div className="mb-3 flex items-center gap-2">
      <Select
      value={searchParams.sort}
        onValueChange={value => {
          setSearchParams({
            sort: value as typeof searchParams.sort,
            page: 1
          })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">최신순</SelectItem>
          <SelectItem value="title">이름순</SelectItem>
          <SelectItem value="price">가격순</SelectItem>
        </SelectContent>
      </Select>

      <Select
      value={searchParams.order}
        onValueChange={value => {
          setSearchParams({
            order: value as typeof searchParams.order,
            page: 1
          })
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="정렬 방향" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">내림차순</SelectItem>
          <SelectItem value="asc">오름차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
 */

// NativeSelect
/* export default function SnackSort() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <div className="mb-3 flex items-center gap-2">
      <NativeSelect
        className="w-[150px]"
        value={searchParams.sort}
        onChange={e => {
          const value = e.target.value as SortType
          const option = SORT_OPTIONS.find(item => item.value === value)
          setSearchParams({
            sort: option.value,
            order: option.order,
            page: 1
          })
        }}>
        <NativeSelectOption value="">전체</NativeSelectOption>
        <NativeSelectOption value="title">이름순</NativeSelectOption>
        <NativeSelectOption value="price">가격순</NativeSelectOption>
        {SORT_OPTIONS.map(option => (
          <NativeSelectOption
            key={option.value}
            value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
} */

export default function SnackSort() {
  const { searchParams, setSearchParams } = useSnackSearchParams()

  return (
    <div className="mb-3 flex items-center gap-2">
      <Select
        value={searchParams.sort}
        // defaultValue={searchParams.sort}
        onValueChange={value => {
          const option = SORT_OPTIONS.find(item => item.value === value)
          setSearchParams({
            sort: option.value,
            order: option.order,
            page: 1
          })
        }}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
