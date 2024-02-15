import { Fragment } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
          {pagination.prev && (
            <PaginationItem>
              <PaginationPrev to={urlToRoute(pagination.prev)} />
            </PaginationItem>
          )}
          {pagination.firstPage && (
            <Fragment>
              <PaginationItem>
                <PaginationLink to={urlToRoute(pagination.firstPage.link)}>
                  {pagination.firstPage.page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </Fragment>
          )}
          {pagination.pages.map((p) => (
            <PaginationItem key={p.page}>
              <PaginationLink to={urlToRoute(p.link || url)}>{p.page}</PaginationLink>
            </PaginationItem>
          ))}
          {pagination.lastPage && (
            <Fragment>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to={urlToRoute(pagination.lastPage.link)}>
                  {pagination.lastPage.page}
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          )}
          {pagination.next && (
            <PaginationItem>
              <PaginationNext to={urlToRoute(pagination.next)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
