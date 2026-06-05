'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CommonTable, Column } from '@/shared/components/common/common-table'
import { ActionMenu } from '@/shared/components/common/action-menu'
import { ConfirmDialogButton } from '@/shared/components/common/confirm-dialog-button'
import { Snack } from '@/features/snack/types/snack.type'
import { useRemoveSnack } from '@/features/snack/hooks/useSnack'
import { toast } from 'sonner'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export function SnackTable({ data }: { data: Snack[] }) {
  const router = useRouter()
  const { mutateAsync: removeSnack } = useRemoveSnack('')

  const handleDelete = async (id: string) => {
    try {
      await removeSnack(id)
      toast.success('삭제되었습니다.')
    } catch (error) {
      toast.error('삭제에 실패했습니다.')
    }
  }

  const columns: Column<Snack>[] = [
    {
      key: 'title',
      header: '이름',
      cell: item => (
        <Link
          href={`/snack/${item.id}`}
          className="hover:underline font-medium"
        >
          {item.title}
        </Link>
      )
    },
    {
      key: 'brand',
      header: '브랜드',
      cell: item => item.brand
    },
    {
      key: 'price',
      header: '가격',
      cell: item => `${item.price.toLocaleString()}원`
    },
    {
      key: 'actions',
      header: '관리',
      className: 'w-[80px] text-center',
      cell: item => (
        <ActionMenu
          items={[
            {
              label: '상세 보기',
              onClick: () => router.push(`/snack/${item.id}`)
            },
            {
              label: '수정',
              onClick: () => router.push(`/snack/${item.id}/edit`)
            },
            {
              label: '삭제',
              destructive: true,
              onClick: () => {
                // ActionMenu inside a table often triggers a confirmation dialog
                // Here we use the ConfirmDialogButton as a separate trigger or 
                // we can just keep the current Trash icon for quick delete
              }
            }
          ]}
        />
      )
    }
  ]

  // If we want a separate delete button with confirmation:
  const actionColumn: Column<Snack> = {
    key: 'quick-actions',
    header: '',
    className: 'w-[100px]',
    cell: item => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/snack/${item.id}/edit`)}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">수정</span>
        </Button>
        <ConfirmDialogButton
          title="정말 삭제하시겠습니까?"
          description={`'${item.title}' 간식을 삭제하시겠습니까?`}
          onConfirm={() => handleDelete(item.id)}
          variant="ghost"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          label=""
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">삭제</span>
        </ConfirmDialogButton>
      </div>
    )
  }

  const finalColumns = [...columns.slice(0, -1), actionColumn]

  return (
    <CommonTable
      data={data}
      columns={finalColumns}
      getRowKey={item => item.id}
    />
  )
}
