import Item from '@/app/(default-layout)/(main)/board/_components/board-item'

import { Card, CardContent } from '@/shared/components/ui/card'
import NotFound from '@/app/(default-layout)/(main)/board/_components/not-found'

import { getBoards } from '@/app/(default-layout)/(main)/board/_actions/board.actions'

export default async function BoardList() {
  // const data = Array(7).fill({})
  const { boards: data } = await getBoards()

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
        data.map(board => (
          <Item
            key={board.id}
            data={board}
          />
        ))
      )}
    </div>
  )
}
