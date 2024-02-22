import { Skeleton } from '@/components'

export function ExploreCollectionCardLoader() {
  return (
    <div className='w-full'>
      <div className='relative w-full rounded-xl overflow-hidden'>
        <div className='pb-[calc((15/26)*100%)]' />
        <Skeleton className='absolute w-full h-full top-0 left-0' />
      </div>
    </div>
  )
}
