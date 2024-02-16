import { PlayIcon } from '@radix-ui/react-icons'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'
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
} from '@/components'
import { SearchItem } from '@/types'

export interface ExploreItemCardProps {
  item: SearchItem
}

export function ExploreItemCard({ item }: ExploreItemCardProps) {
  const to = useMemo(() => `/watch/${item.typeId}/${item.genreId}/${item.slug}`, [item])

  return (
    <Card className='w-full flex overflow-hidden'>
      <div className='relative w-[35%] rounded-lg overflow-hidden shrink-0'>
        <div className='pb-[150%]' />
        <div
          className='absolute w-full h-full top-0 left-0'
          style={{
            backgroundImage: `url("${item.posterUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {item.rating && (
          <div className='absolute left-[0.5rem] top-[0.5rem]'>
            <KinopoiskBadge rating={item.rating} />
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
        <CardContent className='flex-1 !px-4 !pb-2'></CardContent>
        <CardFooter className='!px-4 !pb-2 flex-col space-y-2'>
          <Button asChild size='sm' className='w-full'>
            <NavLink to={to}>
              <PlayIcon className='h-5 w-5 mr-2' />
              Watch
            </NavLink>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
