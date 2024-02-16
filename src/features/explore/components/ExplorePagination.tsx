import { useMemo } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrev,
} from '@/components'
import { ExplorePagination as IExplorePagination } from '@/types'

import { urlToRoute } from './utils'

export interface ExplorePaginationProps {
  url: string
  pagination: IExplorePagination
}

export function ExplorePagination({ url, pagination }: ExplorePaginationProps) {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const currentIndex = useMemo(() => pagination.pages.findIndex((p) => !p.link), [pagination])
  const showFirstPage = useMemo(
    () => pagination.firstPage || (isMobile && !pagination.firstPage && currentIndex > 1),
    [isMobile, currentIndex, pagination],
  )
  const firstPageLink = useMemo(() => {
    if (pagination.firstPage) return pagination.firstPage.link
    if (showFirstPage) return pagination.pages[0].link!
  }, [pagination, showFirstPage])
  const showLastPage = useMemo(
    () =>
      pagination.lastPage ||
      (isMobile && !pagination.lastPage && currentIndex < pagination.pages.length - 2),
    [isMobile, currentIndex, pagination],
  )
  const lastPageLink = useMemo(() => {
    if (pagination.lastPage) return pagination.lastPage.link
    if (showLastPage) return pagination.pages[pagination.pages.length - 1].link!
  }, [pagination, showLastPage])
  const pages = useMemo(() => {
    let minDistance = -1,
      maxDistance = 1
    if (!pagination.prev) maxDistance++
    if (!pagination.next) minDistance--
    if (!showFirstPage) maxDistance++
    if (!showLastPage) minDistance--
    if (!pagination.prev && !showFirstPage) maxDistance++
    if (!pagination.next && !showLastPage) minDistance--
    return pagination.pages.filter((p, i) => {
      if (!isMobile) return true
      if (i === currentIndex) return true
      const distance = i - currentIndex
      if (distance >= minDistance && distance <= maxDistance) return true
      return false
    })
  }, [pagination, isMobile, currentIndex, showFirstPage, showLastPage])

  return (
    <Pagination className='mt-8'>
      <PaginationContent>
        {showFirstPage && firstPageLink && (
          <PaginationItem>
            <PaginationPrev first to={urlToRoute(firstPageLink)} />
          </PaginationItem>
        )}
        {pagination.prev && (
          <PaginationItem>
            <PaginationPrev to={urlToRoute(pagination.prev)} />
          </PaginationItem>
        )}
        {pages.map((p) => (
          <PaginationItem key={p.page}>
            <PaginationLink to={urlToRoute(p.link || url)} className='text-xs'>
              {p.page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pagination.next && (
          <PaginationItem>
            <PaginationNext to={urlToRoute(pagination.next)} />
          </PaginationItem>
        )}
        {showLastPage && lastPageLink && (
          <PaginationItem>
            <PaginationNext last to={urlToRoute(lastPageLink)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
