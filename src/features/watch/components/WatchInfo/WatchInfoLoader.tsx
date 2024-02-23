import { Fragment } from 'react'

import { cn } from '@/api'
import { Skeleton, Table } from '@/components'

export function WatchInfoLoader() {
  return (
    <Fragment>
      <section className='container mt-4'>
        <Skeleton className='h-[1.75rem] w-[15rem] rounded-md' />
        <Skeleton className='mt-1 h-[1.25rem] w-[10rem] rounded-md' />
      </section>
      <section className='w-full overflow-x-scroll space-x-2 flex items-center py-4 px-4 no-scrollbar sm:container'>
        <Skeleton className='h-[2.25rem] w-[7.125rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[7.625rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[7.375rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[5rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[8.25rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[8rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[5.875rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[7.625rem] rounded-full shrink-0' />
        <Skeleton className='h-[2.25rem] w-[5.125rem] rounded-full shrink-0' />
      </section>
      <section className='container'>
        <Skeleton className='w-full h-[7rem] rounded-xl' />
      </section>
      <section className='mt-8'>
        <div className='container'>
          <Skeleton className='h-[1.75rem] w-[5rem] rounded-md' />
        </div>
        <div
          className={cn(
            'mt-4 w-full overflow-x-scroll grid gap-2',
            'grid-flow-col no-scrollbar sm:px-8 px-4',
            'sm:container grid-rows-3',
          )}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className='w-[15rem] shrink-0 flex items-center'>
              <Skeleton className='h-16 w-10 shrink-0 mr-4 !rounded-none' />
              <div className='grow min-w-0'>
                <Skeleton className='h-[1.25rem] w-[8rem] rounded-sm' />
                <Skeleton className='mt-1 h-[0.75rem] w-[3rem] rounded-sm' />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className='mt-8'>
        <div className='container'>
          <Skeleton className='h-[1.75rem] w-[9rem] rounded-md' />
        </div>
        <div
          className={cn(
            'mt-4 w-full overflow-x-scroll grid gap-4',
            'grid-flow-col no-scrollbar sm:px-8 px-4',
            'sm:container grid-rows-3',
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='w-[20rem] shrink-0 flex items-center'>
              <Skeleton className='w-16 h-16 shrink-0 mr-4 rounded-md' />
              <div className='grow min-w-0'>
                <Skeleton className='h-4 w-[15rem] rounded-sm' />
                <Skeleton className='mt-1 h-[0.75rem] w-[3rem] rounded-sm' />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='container mt-8 mb-16'>
        <Skeleton className='h-[1.75rem] w-[8rem] rounded-md' />
        <Table.Root className='mt-4'>
          <Table.Row>
            <Table.TitleCol>
              <Skeleton className='w-[5.75rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.TitleCol>
            <Table.Col>
              <Skeleton className='sm:w-[9.75rem] w-[5rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.Col>
          </Table.Row>
          <Table.Row>
            <Table.TitleCol>
              <Skeleton className='w-[3rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.TitleCol>
            <Table.Col>
              <Skeleton className='sm:w-[10.75rem] w-[6rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.Col>
          </Table.Row>
          <Table.Row>
            <Table.TitleCol>
              <Skeleton className='w-[3rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.TitleCol>
            <Table.Col>
              <Skeleton className='sm:w-[17.125rem] w-[8rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.Col>
          </Table.Row>
          <Table.Row>
            <Table.TitleCol>
              <Skeleton className='w-[6.125rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.TitleCol>
            <Table.Col>
              <Skeleton className='sm:w-[11.5rem] w-[6rem] sm:h-[1.5rem] h-[1.125rem] rounded-sm' />
            </Table.Col>
          </Table.Row>
        </Table.Root>
      </section>
    </Fragment>
  )
}
