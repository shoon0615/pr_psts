'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationButton
} from '@/shared/components/ui/custom/pagination'
import { useSnackSearchParams } from '@/features/snack/hooks/useSnack'

export default function SnackPagination({
  totalPages: totalCount
}: {
  totalPages: number
}) {
  const { searchParams, setSearchParams } = useSnackSearchParams()
  // const { page: currentPage } = searchParams
  const currentPage = searchParams.page

  const pageSize = 10
  const pages = Array.from(
    { length: Math.ceil(totalCount / pageSize) },
    (_, index) => index + 1
  )

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text="이전"
            disabled={currentPage === 1}
            // href={`?page=${currentPage - 1}`}
            onClick={event => {
              event.preventDefault()
              setSearchParams({
                ...searchParams,
                page: searchParams.page - 1
              })
            }}
          />
        </PaginationItem>

        {/* <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}

        {pages.map(page => (
          <PaginationItem key={page}>
            {/* <PaginationButton */}
            <PaginationLink
              isActive={page === currentPage}
              disabled={page === currentPage}
              onClick={() => {
                setSearchParams({
                  ...searchParams,
                  page: page
                })
              }}
              /* onClick={event => {
                event.preventDefault()
                movePage(page)
              }} */
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>10</PaginationLink>
        </PaginationItem> */}

        <PaginationItem>
          <PaginationNext
            text="다음"
            disabled={currentPage === pages.length}
            onClick={() =>
              setSearchParams({
                ...searchParams,
                page: searchParams.page + 1
              })
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
