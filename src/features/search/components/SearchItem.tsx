import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { cn } from '@/api'
import { Badge, CommandItem, Skeleton } from '@/components'
import { SearchItem as ISearchItem } from '@/types'

const classes = {
  root: cn('flex grow items-center max-w-full w-full overflow-hidden'),
  image: {
    root: cn('rounded-full object-cover h-12 w-12 shrink-0 mr-4'),
    skeleton: cn('h-12 w-12 shrink-0 rounded-full mr-4'),
  },
  content: {
    root: cn('grow min-w-0'),
    title: cn('truncate font-bold'),
    description: cn('truncate mt-0.5 text-xs'),
    badge: cn('shrink-0 ml-4'),
  },
}

export interface SearchItemProps extends ISearchItem {
  onSelect: (v: string) => void
}

export function SearchItem(props: SearchItemProps) {
  const { onSelect, ...item } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const value = useMemo(() => `[${item.id}] ${item.title}`, [item])
  const route = useMemo(() => `/watch/${item.typeId}/${item.genreId}/${item.slug}`, [item])
  const [imageLoaded, setImageLoaded] = useState(false)

  const onSelectHandler = useCallback(() => {
    onSelect(value)
    if (pathname !== route) {
      navigate(route)
    }
  }, [navigate, onSelect, value, route, pathname])

  return (
    <CommandItem value={value} onSelect={onSelectHandler}>
      <div className={classes.root}>
        <img
          src={item.posterUrl}
          alt={item.title}
          className={cn(classes.image.root, !imageLoaded ? 'hidden' : 'inline-block')}
          onLoad={() => setImageLoaded(true)}
        />
        <Skeleton className={cn(classes.image.skeleton, !imageLoaded ? 'block' : 'hidden')} />
        <div className={classes.content.root}>
          <p className={classes.content.title}>{item.title}</p>
          <p className={classes.content.description}>{item.description}</p>
        </div>
        <Badge variant='outline' className={classes.content.badge}>
          {item.type}
        </Badge>
      </div>
    </CommandItem>
  )
}
