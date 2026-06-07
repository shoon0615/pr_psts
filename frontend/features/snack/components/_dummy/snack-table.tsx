/* 'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import { columns } from './columns'
import { useBoardListQuery } from '../_hooks/useBoardListQuery'

export default function BoardTable() {
  const { data, isLoading } = useBoardListQuery()

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
} */
