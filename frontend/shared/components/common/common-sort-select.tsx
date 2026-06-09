'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/shadcn/ui/select'

export type SortOption<TValue extends string = string> = {
  label: string
  value: TValue
}

type CommonSortSelectProps<TValue extends string> = {
  value: TValue
  options: SortOption<TValue>[] | readonly SortOption<TValue>[]
  placeholder?: string
  onChange: (value: TValue) => void
  className?: string
}

export function CommonSortSelect<TValue extends string>({
  value,
  options,
  placeholder = '정렬',
  onChange,
  className
}: CommonSortSelectProps<TValue>) {
  return (
    <Select
      value={value}
      onValueChange={val => onChange(val as TValue)}>
      <SelectTrigger className={className ?? 'w-[160px]'}>
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
