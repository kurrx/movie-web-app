import { Skeleton, Table } from '@/components'

import { ExploreItemsLoader } from '../ExploreItemsLoader'

export function ExplorePersonResultLoader() {
  return (
    <div className='container mt-8 mb-16'>
      <div className='flex sm:flex-row flex-col'>
        <div className='shrink-0'>
          <div className='relative w-full flex items-center justify-center'>
            <div className='relative sm:w-[15rem] w-[12rem] rounded-xl'>
              <div className='pb-[150%]' />
              <Skeleton className='absolute w-full h-full left-0 top-0 rounded-xl' />
            </div>
          </div>
        </div>
        <div className='flex-1 sm:ml-8 mt-4 sm:mt-0'>
          <Skeleton className='lg:w-[40%] w-[60%] sm:h-10 h-8 sm:mx-0 mx-auto rounded-md' />
          <Skeleton className='lg:w-[30%] w-[40%] h-6 mt-1 sm:mx-0 mx-auto rounded-md' />
          <Table.Root className='mt-4'>
            <Table.Row>
              <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>
                <Skeleton className='w-[3rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.TitleCol>
              <Table.Col className='text-primary'>
                <Skeleton className='w-[8.75rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.Col>
            </Table.Row>
            <Table.Row>
              <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>
                <Skeleton className='w-[4.625rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.TitleCol>
              <Table.Col className='text-primary'>
                <Skeleton className='w-[14.5rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.Col>
            </Table.Row>
            <Table.Row>
              <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>
                <Skeleton className='w-[5rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.TitleCol>
              <Table.Col className='text-primary'>
                <Skeleton className='w-[16rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.Col>
            </Table.Row>
            <Table.Row>
              <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>
                <Skeleton className='w-[3rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.TitleCol>
              <Table.Col className='text-primary'>
                <Skeleton className='w-[2.75rem] sm:h-[1.125rem] h-4 rounded-sm' />
              </Table.Col>
            </Table.Row>
          </Table.Root>
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className='mt-8'>
          <Skeleton className='rounded-md h-5 w-[3.625rem]' />
          <Skeleton className='mt-2 rounded-md h-4 w-[15rem]' />
          <ExploreItemsLoader count={3} />
        </div>
      ))}
    </div>
  )
}
