'use client'

import Search from '@/app/(default-layout)/(main)/snack/_components/search'
import Sort from '@/app/(default-layout)/(main)/snack/_components/sort'
import { Field } from '@/shared/components/ui/field'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import Loader from '@/app/(default-layout)/(main)/snack/_components/loader'
import List from '@/app/(default-layout)/(main)/snack/_components/list'
import { useSnackList } from '@/features/snack/hooks/useSnack'

export default function ClientSnackPage() {
  const { data, isFetching } = useSnackList()

  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* <Search isFetching={isFetching} />

        <div className="flex justify-end">
          <Sort />
        </div>

        <Field
          orientation="horizontal"
          className="justify-end">
          <Button
            type="button"
            variant="outline"
            className="mb-3 w-20 bg-gray-100 hover:bg-gray-200"
            asChild>
            <Link href="/snack/new">등록</Link>
          </Button>
        </Field>

        <Loader>
          {data.data.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <List data={data.data} />
              <Pagination totalCount={data.items} />
            </>
          )}
        </Loader> */}
      </div>
    </div>
  )
}
