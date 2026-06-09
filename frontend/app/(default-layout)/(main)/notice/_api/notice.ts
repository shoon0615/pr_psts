import type { Notice } from '@/app/(default-layout)/(main)/notice/_types/notice'

export async function selectNotices(query = ''): Promise<Notice[]> {
  const res = await fetch(
    `${process.env.JSON_SERVER_API_URL}/notices/?${query}`,
    {
      method: 'GET'
    }
  )
  return await res.json()
}
