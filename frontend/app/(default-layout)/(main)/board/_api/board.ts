import type { Board } from '@/app/(default-layout)/(main)/board/_types/board'

export async function selectBoards(query = ''): Promise<Board[]> {
  const res = await fetch(
    `${process.env.JSON_SERVER_API_URL}/boards/?${query}`,
    {
      method: 'GET'
    }
  )
  return await res.json()
}
