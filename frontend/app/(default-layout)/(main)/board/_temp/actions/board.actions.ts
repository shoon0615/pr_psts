'use server'

import { selectBoards } from '@/app/(default-layout)/(main)/board/_temp/lib/board'
import { Board } from '@/app/(default-layout)/(main)/board/_temp/types/board'

export async function getBoards(): Promise<{
  boards?: Board[] | null
  error?: string
}> {
  try {
    const boards = await selectBoards(
      '_expand=activityRegion&_expand=activityRegionDetail&_expand=activityType&_expand=activityField&_expand=recruitmentStatus&_expand=activityCycle'
    )
    return { boards }
  } catch (error) {
    console.error(`Failed to fetch boards:`, error)
    return { error: 'Failed to fetch boards.' }
  }
}
