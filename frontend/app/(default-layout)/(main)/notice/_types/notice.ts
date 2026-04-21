import type { Base, Common } from '@/shared/types/common'

interface NoticeDetail {
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

export interface Notice extends Base, NoticeDetail {
  activityRegion?: Common
  activityRegionDetail?: Common
  activityType?: Common
  activityField?: Common
  recruitmentStatu: Common
  activityCycle?: Common
}
