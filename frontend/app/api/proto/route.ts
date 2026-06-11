import { NextRequest, NextResponse } from 'next/server'
import { protoSearchParamsCache } from '@/features/proto/types/proto.type'
import { protoService as service } from '@/features/proto/services/proto.service'

/** 목록 조회 (검색/필터/정렬/페이징) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = Object.fromEntries(searchParams.entries())
    const payload = protoSearchParamsCache.parse(query)
    const data = await service.getList(payload)
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
