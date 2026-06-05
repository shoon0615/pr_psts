'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'

type ConfirmDialogButtonProps = {
  label?: string
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  onConfirm: () => void
  children?: React.ReactNode
  buttonProps?: React.ComponentProps<typeof Button>
}

export function ConfirmDialogButton({
  label = '삭제',
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'destructive',
  className,
  onConfirm,
  children,
  buttonProps
}: ConfirmDialogButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          <span className="inline-block cursor-pointer">{children}</span>
        ) : (
          <Button
            type="button"
            variant={variant}
            className={className}
            {...buttonProps}
          >
            {label}
          </Button>
        )}
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
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
