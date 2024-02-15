import { useCallback, useMemo } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrev,
} from '@/components'
import { ExploreResponse } from '@/types'

function urlToRoute(url: string) {
  const instance = new URL(`${window.location.origin}/explore${url}`)
  let pathname = instance.pathname
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }
  return pathname + instance.search
}

export interface ExplorePaginationProps {
  url: string
  pagination: NonNullable<ExploreResponse['pagination']>
}

export function ExplorePagination({ url, pagination }: ExplorePaginationProps) {
  const currentIndex = useMemo(() => pagination.pages.findIndex((p) => !p.link), [pagination])

  const getDistance = useCallback((index: number) => Math.abs(currentIndex - index), [currentIndex])

  return (
    <div className='container mt-8'>
      <Pagination>
        <PaginationContent>
          {pagination.firstPage && (
            <PaginationItem>
              <PaginationPrev first to={urlToRoute(pagination.firstPage.link)} />
            </PaginationItem>
          )}
          {pagination.prev && (
            <PaginationItem>
              <PaginationPrev to={urlToRoute(pagination.prev)} />
            </PaginationItem>
          )}
          {pagination.pages.map((p, index) => (
            <PaginationItem key={p.page}>
              <PaginationLink
                to={urlToRoute(p.link || url)}
                className='text-xs'
                data-distance={getDistance(index)}
              >
                {p.page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pagination.next && (
            <PaginationItem>
              <PaginationNext to={urlToRoute(pagination.next)} />
            </PaginationItem>
          )}
          {pagination.lastPage && (
            <PaginationItem>
              <PaginationNext last to={urlToRoute(pagination.lastPage.link)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
