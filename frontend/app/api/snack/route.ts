/** TODO: */
/* export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title')
  const res = await fetch(
    `https://omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${title}`
  )
  const data = await res.json()
  return Response.json({ data })
} */

export async function GET(request: Request) {
  return Response.json({ data: false })
}

/** TODO: */
/* import { selectAllSnack } from '@/features/snack/services/snack.service'
import { NextResponse } from 'next/server'
export async function GET() {
  const data = await selectAllSnack()
  // return Response.json(data)
  
  const validated = SnackArraySchema.parse(data)  // 응답 검증 추가
  // const validated = SnackArraySchema.safeParse(data)
  return NextResponse.json(validated)
} */
