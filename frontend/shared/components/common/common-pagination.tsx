'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationButton,
} from '@/shared/components/ui/custom/pagination'

type CommonPaginationProps = {
  currentPage: number
  totalCount: number
  pageSize: number
  siblingCount?: number
  onPageChange: (page: number) => void
}

export function CommonPagination({
  currentPage,
  totalCount,
  pageSize,
  siblingCount = 1,
  onPageChange
}: CommonPaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) {
    return null
  }

  const getRange = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const pages: (number | 'ellipsis')[] = React.useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount)
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

      let res: (number | 'ellipsis')[] = getRange(startPage, endPage)

      const hasLeftSpill = startPage > 2
      const hasRightSpill = totalPages - endPage > 1
      const spillOffset = totalNumbers - (res.length + 1)

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = getRange(startPage - spillOffset, startPage - 1)
          res = ['ellipsis', ...extraPages, ...res]
          break
        }
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = getRange(endPage + 1, endPage + spillOffset)
          res = [...res, ...extraPages, 'ellipsis']
          break
        }
        case hasLeftSpill && hasRightSpill: {
          res = ['ellipsis', ...res, 'ellipsis']
          break
        }
      }
      return [1, ...res, totalPages]
    }

    return getRange(1, totalPages)
  }, [totalPages, currentPage, siblingCount])

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="cursor-pointer"
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationButton
                isActive={page === currentPage}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </PaginationButton>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
