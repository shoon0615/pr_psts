'use client'

import React from 'react'
import { useSnackDetail2 } from '@/features/snack/hooks/useSnack'
import { SnackDetail } from '@/features/snack/components/snack-detail'

export function SnackDetailContent({ id }: { id: string }) {
  const { data } = useSnackDetail2(id)
  return <SnackDetail data={data} />
}
