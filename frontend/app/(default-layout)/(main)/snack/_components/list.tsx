'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import Image from 'next/image'
import qrImage from '@/.gemini/image.png'

import {
  useSnacks,
  useSnackList,
  useSnackList2
} from '@/features/snack/hooks/useSnack'

export default function SnackList() {
  // const { data } = useSnacks()
  const { data } = useSnackList2()

  // const { data, isFetching } = useQuery(boardListQueryOptions(queryParams))
  // {isFetching && <p>조회 중...</p>}
  // {(data?.items ?? []).map(board => (

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {data.map(snack => (
        <div
          key={snack.id}
          className="group flex flex-col">
          {/* Main Card Body */}
          <Link
            // prefetch={true}
            href={`/snack/${snack.id}`}
            className="flex flex-col">
            <Card className="z-10 flex flex-col border-gray-200 py-0 transition-all duration-300 group-hover:rounded-b-none group-hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-6 text-center">
                {/* Image Placeholder (QR Code Area) */}
                <div className="mb-4 flex aspect-square w-full max-w-[240px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={qrImage}
                      alt="QR Code"
                      fill
                      className="object-contain"
                      onError={e => {
                        const target = e.target as HTMLImageElement
                        target.src =
                          'https://placehold.co/240x240/f9fafb/e5e7eb?text=QR'
                      }}
                    />
                  </div>
                </div>

                <h3 className="mb-2 text-lg leading-tight font-bold text-gray-900">
                  {snack.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {snack.contents}
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Outside Hover Area (Size changes here) */}
          <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-32 group-hover:opacity-100">
            <div className="relative -mt-[1px] rounded-b-xl border border-t-0 border-gray-200 bg-white p-4 shadow-lg">
              <Button
                variant="secondary"
                className="w-full border border-transparent bg-gray-100 font-semibold text-gray-900 transition-all hover:border-gray-300 hover:bg-gray-200">
                바로 구매
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
