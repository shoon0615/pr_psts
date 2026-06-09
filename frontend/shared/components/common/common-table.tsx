'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/shadcn/ui/table'
import { cn } from '@/shared/lib/utils'

export type Column<T> = {
  key: string
  header: React.ReactNode
  cell: (item: T) => React.ReactNode
  className?: string
}

type CommonTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  getRowKey: (item: T) => React.Key
  className?: string
}

export function CommonTable<T>({
  data,
  columns,
  getRowKey,
  className
}: CommonTableProps<T>) {
  return (
    <Table className={cn('rounded-md border', className)}>
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
        {!Array.isArray(data) || data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center">
              데이터가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          data.map(item => (
            <TableRow key={getRowKey(item)}>
              {columns.map(column => (
                <TableCell
                  key={column.key}
                  className={column.className}>
                  {column.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
