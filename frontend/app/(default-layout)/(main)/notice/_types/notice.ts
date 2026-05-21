import type { Base } from '@/shared/types/base.type'
import type { Common } from '@/features/common/types/common.type'

export const brands = [
  { label: '오리온', value: '001' },
  { label: '크라운', value: '002' },
  { label: '해태', value: '003' },
  { label: '롯데', value: '004' },
  { label: '켈로그', value: '005' }
] as const

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
