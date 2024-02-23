import { PlayIcon } from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'
import { BookMarkIcon, EyeIcon, HeartIcon, StarIcon } from '@/assets'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  KinopoiskBadge,
  Skeleton,
} from '@/components'
import { SearchItem } from '@/types'

export interface ExploreItemCardProps {
  item: SearchItem
}

export function ExploreItemCard({ item }: ExploreItemCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const to = useMemo(() => `/watch/${item.typeId}/${item.genreId}/${item.slug}`, [item])

  return (
    <Card className='w-full flex overflow-hidden'>
      <div className='relative w-[35%] rounded-lg overflow-hidden shrink-0'>
        <div className='pb-[150%]' />
        <img
          src={item.posterUrl}
          alt={item.title}
          className={cn(
            'absolute w-full h-full top-0 left-0 object-cover',
            !imageLoaded ? 'hidden' : 'inline-block',
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <Skeleton
          className={cn('absolute w-full h-full top-0 left-0 ', !imageLoaded ? 'block' : 'hidden')}
        />
        {item.rating && (
          <div className='absolute left-[0.5rem] top-[0.5rem]'>
            <KinopoiskBadge rating={item.rating} />
          </div>
        )}
        {item.myRating && (
          <div className='absolute right-[0.5rem] top-[0.5rem]'>
            <div
              className={cn(
                'h-[1.1rem] w-[1.1rem] flex items-center font-bold',
                'justify-center rounded-full text-white text-[0.6rem]',
                item.myRating >= 7
                  ? 'bg-[#3BB33B]'
                  : item.myRating >= 5
                    ? 'bg-[#777777]'
                    : 'bg-[#FF0200]',
              )}
            >
              {item.myRating}
            </div>
          </div>
        )}
        <Badge
          variant='secondary'
          className={cn(
            'absolute left-[50%] bottom-[0.5rem] select-none leading-[0.8rem]',
            'translate-x-[-50%] pointer-events-none text-[0.6rem] px-1.5',
          )}
        >
          {item.type}
        </Badge>
      </div>
      <div className='flex flex-col flex-1'>
        <CardHeader className='!pt-6 !px-4 !pb-2'>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription className='!text-xs'>{item.description}</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 !px-4 !pb-2 flex items-start justify-start wrap gap-2'>
          {item.saved && <BookMarkIcon className='h-4 w-4 fill-[currentColor]' />}
          {item.favorite && <HeartIcon className='h-4 w-4 fill-[currentColor]' />}
          {item.watched && <EyeIcon className='h-4 w-4' />}
          {item.myRating && <StarIcon className='h-4 w-4 fill-[currentColor]' />}
        </CardContent>
        <CardFooter className='!px-4 !pb-2 flex-col space-y-2'>
          <Button asChild size='sm' className='w-full'>
            <NavLink to={to}>
              <PlayIcon className='h-4 w-4 mr-1' />
              Watch
            </NavLink>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
