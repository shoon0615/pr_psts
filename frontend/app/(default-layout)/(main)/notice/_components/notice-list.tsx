import Item from '@/app/(default-layout)/(main)/notice/_components/notice-item'

import { Card, CardContent } from '@/shared/components/ui/card'
import NotFound from '@/app/(default-layout)/(main)/notice/_components/not-found'

import { getNotices } from '@/app/(default-layout)/(main)/notice/_actions/notice.actions'

export default async function NoticeList() {
  // const data = Array(7).fill({})
  const { notices: data } = await getNotices()

  // if (!data?.length) return <NotFound />
  return (
    <div
      className={`grid gap-4 ${
        !data?.length
          ? 'grid-cols-1'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
      }`}>
      {!data?.length ? (
        <Card>
          <CardContent className="p-2">
            <NotFound />
          </CardContent>
        </Card>
      ) : (
        // data.map(() => (
        // data.map((_, i) => (
        data.map(notice => (
          <Item
            key={notice.id}
            data={notice}
          />
        ))
      )}
    </div>
  )
}
