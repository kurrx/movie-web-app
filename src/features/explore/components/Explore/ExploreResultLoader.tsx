import { Skeleton } from '@/components'

import { ExploreItemsLoader } from '../ExploreItemsLoader'

export function ExploreResultLoader() {
  return (
    <div className='container flex-1 flex flex-col mt-8 mb-16'>
      <Skeleton className='sm:w-[60%] w-[80%] sm:h-10 h-8 rounded-md' />
      <div className='flex items-center justify-start space-x-2 mt-4'>
        <Skeleton className='w-[5.5rem] h-8 rounded-md' />
        <Skeleton className='w-[6.25rem] h-8 rounded-md' />
      </div>
      <ExploreItemsLoader pagination count={12} />
    </div>
  )
}
