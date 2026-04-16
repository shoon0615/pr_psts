// import { Item } from "radix-ui"
// import * as Item from "@/components/ui/item"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemHeader,
  ItemTitle
} from '@/shared/components/ui/item'
import { Badge } from '@/shared/components/ui/badge'
import { Board } from '@/app/(default-layout)/(main)/board/_types/board'

export default function BoardItem({ data }: { data: Board }) {
  return (
    <Item
      variant="outline"
      asChild>
      {/* Use the asChild prop to render the item as a link */}
      <a href="/">
        <ItemHeader>
          <div className="mt-2 flex items-center">
            <Badge variant="secondary">{data.activityRegion?.name}</Badge>
            <Badge
              variant="secondary"
              className="ml-2">
              {data.activityType?.name}
            </Badge>
          </div>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>
            <h4 className="text-md mb-1 font-semibold">{data.title}</h4>
          </ItemTitle>
          <ItemDescription>
            <span className="mb-2 text-sm text-gray-600">
              강남구립 강남노인종합복지관
            </span>
            <span className="mt-2 mb-2 flex items-center text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              봉사기간 2026-02-13 ~ 2026-02-13
            </span>
            <span className="mt-2 flex justify-end">
              <Badge variant="outline">0 / 5명 모집중</Badge>
            </span>
          </ItemDescription>
        </ItemContent>
      </a>
    </Item>
  )
}
