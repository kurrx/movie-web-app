import { useMemo } from 'react'

import { capitalizeFirstLetter, cn } from '@/api'
import { Skeleton } from '@/components'
import { explore } from '@/features/router'
import { ProfileCounters } from '@/types'

interface BadgeProps {
  badge: keyof ProfileCounters
  count: number
}

function Badge({ badge, count }: BadgeProps) {
  const text = useMemo(() => {
    switch (badge) {
      case 'total':
      case 'saved':
      case 'favorite':
      case 'watched':
      case 'rated':
        return capitalizeFirstLetter(badge)
      case 'seriesType':
        return 'Series'
      case 'moviesType':
        return 'Movies'
      case 'films':
      case 'cartoons':
      case 'series':
      case 'animation':
        return explore[badge].title
    }
  }, [badge])

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        'text-xs font-medium transition-colors',
        'bg-secondary text-secondary-foreground shadow-sm',
        'h-8 rounded-full pl-1 pr-3',
      )}
    >
      <span
        className={cn(
          'bg-[var(--ui-primary)] text-white mr-2 min-w-6 font-bold',
          'rounded-full flex items-center h-6 px-2',
          'justify-center',
        )}
      >
        {count}
      </span>
      {text}
    </div>
  )
}

const badges = [
  'total',
  'saved',
  'favorite',
  'watched',
  'rated',
  'seriesType',
  'moviesType',
  'films',
  'cartoons',
  'series',
  'animation',
] as const

export function ProfileBadges({ counters }: { counters: ProfileCounters | null }) {
  const hasAnyBadges = useMemo(
    () => badges.some((badge) => !!counters && counters[badge] > 0),
    [counters],
  )

  if (!counters) {
    return (
      <div className='mt-6'>
        <div className='container'>
          <Skeleton className='h-[1.75rem] w-[5rem]' />
          <Skeleton className='mt-1 h-4 w-[8rem]' />
        </div>
        <div
          className={cn(
            'w-full overflow-x-scroll space-x-2 flex',
            'items-center no-scrollbar mt-4',
            'px-4 sm:container',
          )}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className='h-8 rounded-full w-20' />
          ))}
        </div>
      </div>
    )
  }

  if (!hasAnyBadges) return null

  return (
    <div className='mt-6'>
      <div className='container'>
        <h2 className='text-lg font-bold'>Badges</h2>
        <p className='text-sm font-medium text-muted-foreground'>Your profile statistics</p>
      </div>
      <div
        className={cn(
          'w-full overflow-x-scroll space-x-2 flex',
          'items-center no-scrollbar mt-4',
          'px-4 sm:container',
        )}
      >
        {badges
          .filter((badge) => counters[badge] > 0)
          .map((badge) => (
            <Badge key={badge} badge={badge} count={counters[badge]} />
          ))}
      </div>
    </div>
  )
}
