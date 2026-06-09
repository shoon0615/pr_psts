'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/shadcn/ui/dropdown-menu'
import { Button } from '@/shared/components/shadcn/ui/button'
import { MoreHorizontal } from 'lucide-react'

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
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map(item => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className={
              item.destructive ? 'text-destructive focus:text-destructive' : ''
            }>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
