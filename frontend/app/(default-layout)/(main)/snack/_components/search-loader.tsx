'use client'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Spinner } from '@/shared/components/ui/spinner'

import dynamic from 'next/dynamic'

const SnackSearchClient = dynamic(
  () => import('@/app/(default-layout)/(main)/snack/_components/search'),
  {
    ssr: false,
    loading: () => (
      <div className="mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="size-8" />
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                className="flex items-center"
                disabled>
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
    )
  }
)

export default function SnackSearch() {
  return <SnackSearchClient />
}
