import { cn } from '@/shared/lib/utils'
import { LoaderIcon } from 'lucide-react'

import { Suspense } from 'react'
// import { ErrorBoundary } from 'react-error-boundary';
// import { Notifications } from '@/shared/components/ui/notifications';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

// export default function SpinnerCustom({
export default function Loader({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }>
      {/* <ErrorBoundary FallbackComponent={MainErrorFallback}>
        {children}
        <Notifications />
      </ErrorBoundary> */}
      {children}
    </Suspense>
  )
}
