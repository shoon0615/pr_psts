import type { Base, Common } from '@/features/common/types/common.type'

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
