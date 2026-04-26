import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'

import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'
import List from '@/app/(default-layout)/(main)/snack/_components/list'

export default function Snack() {
  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Filter and Search Section */}
        <div className="mb-4">
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
                    </Select>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="- 선택 -" />
                      </SelectTrigger>
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
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
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

        {/* List Section */}
        <Loader>
          <List />
        </Loader>
      </div>
    </div>
  )
}
