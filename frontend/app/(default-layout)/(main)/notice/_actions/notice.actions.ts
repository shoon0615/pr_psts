'use server'

import { selectNotices } from '@/app/(default-layout)/(main)/notice/_api/notice'
import { Notice } from '@/app/(default-layout)/(main)/notice/_types/notice'

export async function getNotices(): Promise<{
  notices?: Notice[] | null
  error?: string
}> {
  try {
    const notices = await selectNotices(
      '_expand=activityRegion&_expand=activityRegionDetail&_expand=activityType&_expand=activityField&_expand=recruitmentStatus&_expand=activityCycle'
    )
    return { notices }
  } catch (error) {
    console.error(`Failed to fetch notices:`, error)
    return { error: 'Failed to fetch notices.' }
  }
}
