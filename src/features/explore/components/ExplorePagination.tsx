import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrev,
} from '@/components'
import { useAppSelector } from '@/hooks'

import { selectExploreResponse } from '../explore.slice'

function urlToRoute(url: string) {
  const instance = new URL(`${window.location.origin}/explore${url}`)
  let pathname = instance.pathname
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }
  return pathname + instance.search
}

export function ExplorePagination({ url }: { url: string }) {
  const { pagination } = useAppSelector((state) => selectExploreResponse(state, url))

  if (!pagination) return null

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
          {pagination.pages.map((p) => (
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
