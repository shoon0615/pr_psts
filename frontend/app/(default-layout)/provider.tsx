'use client'

// import React from 'react'
import {
  QueryClient,
  QueryClientProvider,
  environmentManager,
  HydrationBoundary,
  dehydrate
} from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryConfig } from '@/shared/lib/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Next.js 는 Server(Node)/Client(브라우저) 환경이 섞이기에 정확한 판별을 매니저가 관리
 * @see isServer `typeof window === 'undefined'` 와 동일(단순 window 환경 체크)
 * @see environmentManager 단순 체크 -> 환경 매니저가 통합 관리
 * @returns
 */
function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function AppProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {process.env.DEV && <ReactQueryDevtools />}

        {/* <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary> */}

        {/* <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration> */}

        {children}
      </QueryClientProvider>
    </>
  )
}
