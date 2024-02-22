import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '@/components'

export function ExploreItemCardLoader() {
  return (
    <Card className='w-full flex overflow-hidden'>
      <div className='relative w-[35%] rounded-lg overflow-hidden shrink-0'>
        <div className='pb-[150%]' />
        <Skeleton className='absolute w-full h-full top-0 left-0' />
      </div>
      <div className='flex flex-col flex-1'>
        <CardHeader className='!pt-6 !px-4 !pb-2'>
          <Skeleton className='rounded-md w-[80%] h-4' />
          <Skeleton className='rounded-md w-[60%] h-4' />
        </CardHeader>
        <CardContent className='flex-1 !px-4 !pb-2'></CardContent>
        <CardFooter className='!px-4 !pb-2 flex-col space-y-2'>
          <Skeleton className='rounded-md w-full h-8' />
        </CardFooter>
      </div>
    </Card>
  )
}
