import { Cross2Icon } from '@radix-ui/react-icons'
import { useCallback, useMemo, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { convertSeconds } from '@/api'
import { PlayIcon } from '@/assets'
import { Thumbnails } from '@/core'
import { selectDeviceIsMobile } from '@/features/device'
import { useElementRect, useStore } from '@/hooks'
import { LastItemState } from '@/types'

import { clearProfileLast, selectProfileLastItem, selectProfileUser } from '../profile.slice'

interface ProfileLastItemProps {
  item: LastItemState
  onClose: () => void
}

function ProfileLastItemDesktop({ item, onClose }: ProfileLastItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rect = useElementRect(ref)
  const thumbnails = useMemo(
    () => Thumbnails.getBackgroundWithWidth(item.thumbnails, rect.width),
    [item, rect],
  )
  const to = useMemo(() => `/watch${item.url}`, [item.url])
  const time = useMemo(
    () => `${convertSeconds(item.progress)} / ${convertSeconds(item.duration)}`,
    [item],
  )

  return (
    <div className='z-[3] fixed w-[25rem] bottom-0 shadow-xl right-5 rounded-t-xl overflow-hidden bg-background border-x border-t'>
      <div ref={ref} className='relative'>
        <div style={thumbnails} />
        <div className='absolute top-0 left-0 w-full h-full bg-black/40' />
        <div className='absolute bottom-0 left-0 h-1 w-full'>
          <div className='absolute w-full h-full bg-white/40 left-0 top-0' />
          <div
            className='absolute w-full h-full bg-[var(--ui-primary)] left-0 top-0'
            style={{
              transform: `scaleX(${item.progress / item.duration})`,
              transformOrigin: 'left center',
            }}
          />
        </div>
        <div className='absolute bottom-3 left-0 px-3 text-xs font-light text-white/75'>{time}</div>
        <NavLink
          to={to}
          className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white'
        >
          <PlayIcon className='h-[3.75rem] w-[3.75rem]' />
        </NavLink>
        <button className='absolute top-3 right-3 text-white' onClick={onClose}>
          <Cross2Icon className='h-6 w-6' />
        </button>
      </div>
      <NavLink to={to} className='block w-full py-3 px-4 overflow-hidden'>
        <span className='block truncate text-sm font-bold'>{item.title}</span>
        <span className='block truncate text-sm text-muted-foreground'>
          {item.subtitle || 'Continue Watching'}
        </span>
      </NavLink>
    </div>
  )
}

function ProfileLastItemMobile({ item, onClose }: ProfileLastItemProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const rect = useElementRect(ref)
  const thumbnails = useMemo(
    () => Thumbnails.getBackgroundWithHeight(item.thumbnails, rect.height),
    [item, rect],
  )
  const to = useMemo(() => `/watch${item.url}`, [item.url])

  return (
    <div className='z-[3] fixed w-full bottom-0 shadow-xl left-0 overflow-hidden bg-background border-t flex items-center justify-start'>
      <NavLink ref={ref} to={to} className='shrink-0 relative h-[3rem] block'>
        <span className='block' style={thumbnails} />
      </NavLink>
      <NavLink to={to} className='flex-1 overflow-hidden pl-2'>
        <span className='block truncate text-xs font-bold'>{item.title}</span>
        <span className='block truncate text-xs text-muted-foreground'>
          {item.subtitle || 'Continue Watching'}
        </span>
      </NavLink>
      <NavLink to={to} className='h-[3rem] w-[3rem] flex items-center justify-center shrink-0'>
        <PlayIcon className='w-7 h-7' />
      </NavLink>
      <button
        className='h-[3rem] w-[3rem] flex items-center justify-center shrink-0'
        onClick={onClose}
      >
        <Cross2Icon className='w-4 h-4' />
      </button>
    </div>
  )
}

export function ProfileLastItem() {
  const [dispatch, selector] = useStore()
  const isMobile = selector(selectDeviceIsMobile)
  const user = selector(selectProfileUser)
  const lastItem = selector(selectProfileLastItem)
  const { pathname } = useLocation()
  const isWatchRoute = useMemo(() => pathname.startsWith('/watch'), [pathname])

  const onClose = useCallback(() => {
    if (!user || !lastItem) return
    dispatch(clearProfileLast(user.uid))
  }, [dispatch, user, lastItem])

  if (!user || !lastItem || isWatchRoute) return null

  if (isMobile) {
    return <ProfileLastItemMobile item={lastItem} onClose={onClose} />
  }

  return <ProfileLastItemDesktop item={lastItem} onClose={onClose} />
}
