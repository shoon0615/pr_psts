import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from 'path-to-regexp'
// import { auth as getSession } from '@/shared/lib/auth'
import { getSession } from '@/shared/actions/auth'

/** 인증이 필요한 페이지 접근 제어! */
const matchersForAuth = [
  // path-to-regexp v6 이전
  /* '/dashboard/*',
  '/myaccount/*',
  '/settings/' */

  // path-to-regexp v6 이후
  /* '/dashboard/:path*',
  '/settings/:path(.*)' */
  '/dashboard/*path',
  '/myaccount/*path',
  '/settings/*path',
  '/snack/*path'
]

/** 인증 후 회원가입 및 로그인 접근 제어! */
const matchersForSignIn = ['/signup/*path', '/signin/*path']

// export async function middleware(request: NextRequest) {   // Next.js 16 변경사항 → middleware.ts 가 proxy.ts 로 변경(function 도 마찬가지)
export async function proxy(request: NextRequest) {
  // 인증이 필요한 페이지 접근 제어!
  if (isMatch(request.nextUrl.pathname, matchersForAuth)) {
    return (await getSession()) // 세션 정보 확인
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/signin', request.url))
    // : NextResponse.redirect(new URL(`/signin?callbackUrl=${request.url}`, request.url))
  }
  // 인증 후 회원가입 및 로그인 접근 제어!
  if (isMatch(request.nextUrl.pathname, matchersForSignIn)) {
    return (await getSession())
      ? NextResponse.redirect(new URL('/', request.url))
      : NextResponse.next()
  }
  return NextResponse.next()
}

// 경로 일치 확인!
function isMatch(pathname: string, urls: string[]) {
  /* 단순 prefix 체크 */
  // return urls.some(url => pathname.startsWith(url))

  /* 동적 라우트 패턴 매칭까지 체크 → ex: `/users/:id`, `/posts/:id/edit` */
  return urls.some(url => !!match(url)(pathname))
}
