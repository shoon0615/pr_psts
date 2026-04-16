import type { Base, Common } from '@/shared/types/common'

interface BoardDetail {
  title: string
  contents: string
  hits: number
  activityRegionId?: string | null
  activityRegionDetailId?: string
  activityTypeId?: string
  activityFieldId: string
  recruitmentStatuId: string
  activityCycleId: string
}

export interface Board extends Base, BoardDetail {
  activityRegion?: Common
  activityRegionDetail?: Common
  activityType?: Common
  activityField?: Common
  recruitmentStatu: Common
  activityCycle?: Common
}
