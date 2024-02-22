import { Pagination, PaginationContent, Skeleton } from '@/components'

export function ExplorePaginationLoader() {
  return (
    <Pagination className='mt-8'>
      <PaginationContent>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className='h-[2.25rem] w-[2.25rem] rounded-md' />
        ))}
      </PaginationContent>
    </Pagination>
  )
}
