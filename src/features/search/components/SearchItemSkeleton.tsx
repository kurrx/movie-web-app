import { Skeleton } from '@/components'

export function SearchItemSkeleton() {
  return (
    // eslint-disable-next-line react/no-unknown-property
    <div cmdk-skeleton='' className='flex items-center space-x-4 px-2 py-1.5'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2 flex-1'>
        <Skeleton className='h-3 w-[100%]' />
        <Skeleton className='h-3 w-[70%]' />
      </div>
      <Skeleton className='h-3 w-12 rounded-md' />
    </div>
  )
}
