import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Badge } from '@/shared/components/ui/badge'
import { Label } from '@/shared/components/ui/label'
import { Separator } from '@/shared/components/ui/custom/separator'

import * as o from '@/app/(default-layout)/(main)/board/_components/options'
import List from '@/app/(default-layout)/(main)/board/_components/board-list'

export default function Board() {
  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      {/* Filter and Search Section */}
      <div className="mb-4">
        {/* Activity Type and Period Filters as a distinct card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            {/* Activity Type Filters */}
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">활동분야</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">시설봉사</Badge>
                <Badge variant="secondary">재가봉사</Badge>
                <Badge>전문봉사</Badge>{' '}
                {/* Assuming default variant for blue */}
                <Badge variant="secondary">지역사회봉사</Badge>
                <Badge variant="secondary">해외봉사</Badge>
                <Badge variant="secondary">기타봉사</Badge>
              </div>
            </div>
            {/* Activity Period Filters */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">활동주기</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive">정기</Badge>{' '}
                {/* Assuming red for destructive */}
                <Badge variant="secondary">비정기</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Filters and Search as another distinct card */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
              {/* Row 1 (Visual) */}
              <div>
                <Label
                  htmlFor="activity-region-province"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  활동지역
                </Label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="- 선택 -" />
                    </SelectTrigger>
                    <o.ActivityRegionProvince />
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="- 선택 -" />
                    </SelectTrigger>
                    <o.ActivityRegionProvinceDetail />
                  </Select>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="activity-type"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  활동유형
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="- 선택 -" />
                  </SelectTrigger>
                  <o.ActivityType />
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="activity-field"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  활동분야
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="- 선택 -" />
                  </SelectTrigger>
                  <o.ActivityField />
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="recruitment-status"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  모집현황
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="- 선택 -" />
                  </SelectTrigger>
                  <o.RecruitmentStatus />
                </Select>
              </div>

              {/* Checkbox: 청소년도 참여 가능해요. - This appears to be below the first row of filters, aligned left.
                  In a 3-column grid, this means it will take the first available slot after the 3 items above.
                  It will then be followed by other items. */}
              <div className="flex items-center lg:col-span-2">
                {' '}
                {/* This will naturally take the first column spot in the next row */}
                <Checkbox id="youth-participation" />
                <Label
                  htmlFor="youth-participation"
                  className="ml-2 block text-sm leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  청소년도 참여 가능해요.
                </Label>
              </div>

              {/* Next row of filters: 봉사기간, 모집기간, 활동주기 */}

              <div>
                <Label
                  htmlFor="volunteer-period-start"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  봉사기간
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    id="volunteer-period-start"
                    defaultValue="2026-02-10"
                  />
                  <Separator separator="~" />
                  <Input
                    type="date"
                    id="volunteer-period-end"
                    defaultValue="2026-03-12"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium text-gray-700">
                  모집기간
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    id="recruitment-period-start"
                    defaultValue="2026-02-10"
                  />
                  <Separator separator="~" />
                  <Input
                    type="date"
                    id="recruitment-period-end"
                    defaultValue="2026-03-12"
                  />
                </div>
              </div>
              {/* <div className="flex items-center lg:col-span-2"> */}
              <div className="lg:col-span-2">
                <Label
                  htmlFor="activity-cycle"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  활동주기
                </Label>
                <Select>
                  <SelectTrigger className="w-full lg:w-[calc((100%-2rem)/2)]">
                    <SelectValue placeholder="- 선택 -" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="regular">정기</SelectItem>
                    <SelectItem value="irregular">비정기</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search fields: 검색조건, 검색어 입력 + 상세검색 */}
              <div>
                <Label
                  htmlFor="search-condition"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  검색조건
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="봉사명" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="service-name">봉사명</SelectItem>
                    <SelectItem value="content">내용</SelectItem>
                    <SelectItem value="center-name">센터명</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search fields: 검색조건, 검색어 입력 + 상세검색 */}
              <div>
                <Label
                  htmlFor="search-keyword"
                  className="mb-1 block text-sm font-medium text-gray-700">
                  검색어 입력
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    id="search-keyword"
                    placeholder="검색어 입력"
                    className="flex-grow"
                  />
                  <Button variant="outline">상세검색</Button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                검색
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Count Section */}
      <div className="mt-4">
        <p className="text-lg font-bold">총 3043 건</p>
      </div>

      {/* List Section */}
      <List />
    </div>
  )
}
