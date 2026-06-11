import { http, HttpResponse } from 'msw'
import { protos } from '@/shared/tests/mocks/proto.json'

// const apiUrl = process.env.NEXT_PUBLIC_API_URL
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/proto`

export const protoHandlers = [
  http.get(`${apiUrl}`, () => {
    return HttpResponse.json({
      data: protos,
      totalCount: protos.length
    })
  })
]
