import { EnterIcon, ExitIcon, PersonIcon } from '@radix-ui/react-icons'
import randomGradient from 'random-gradient'
import { Fragment, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn, googleLogout } from '@/api'
import { BookMarkIcon, EyeIcon, HeartIcon, LoaderIcon, StarIcon } from '@/assets'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Skeleton,
} from '@/components'
import { ThemeSwitcher } from '@/features/theme'
import { useAppSelector, useStoreBoolean } from '@/hooks'

import {
  selectProfileCounters,
  selectProfileLoading,
  selectProfileUser,
  setProfileDialog,
} from '../profile.slice'

interface AvatarProps {
  id: string
  url: string | null
  alt: string
}

function Avatar({ id, url, alt }: AvatarProps) {
  const [loaded, setLoaded] = useState(!url)

  return (
    <span className='relative w-full h-full'>
      <Skeleton className='absolute w-full h-full left-0 top-0' />
      {url ? (
        <img
          src={url}
          alt={alt}
          className={cn('absolute w-full h-full left-0 top-0', !loaded ? 'hidden' : 'inline-block')}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <span
          className='absolute w-full h-full left-0 top-0'
          style={{ backgroundImage: randomGradient(id, 'diagonal') }}
        />
      )}
    </span>
  )
}

export function ProfileMenu() {
  const user = useAppSelector(selectProfileUser)
  const loading = useAppSelector(selectProfileLoading)
  const counters = useAppSelector(selectProfileCounters)
  const { setTrue: openLoginDialog } = useStoreBoolean(setProfileDialog)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='relative h-8 w-8 rounded-full overflow-hidden ml-2 bg-accent'
          disabled={loading}
        >
          {loading ? (
            <LoaderIcon className='h-4 w-4' />
          ) : !user ? (
            <PersonIcon className='h-4 w-4' />
          ) : (
            <Avatar
              key={`${user.uid}-${user.photoURL}`}
              id={user.uid}
              url={user.photoURL}
              alt={user.displayName || user.uid}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' sideOffset={15}>
        {user && (
          <Fragment>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{user?.displayName || 'Profile'}</p>
                {user?.email && (
                  <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {counters && counters.total > 0 && (
              <Fragment>
                <DropdownMenuItem asChild className='flex items-center justify-start'>
                  <NavLink to='/profile'>
                    <PersonIcon className='h-4 w-4 mr-2' />
                    Profile
                    <DropdownMenuShortcut>{counters.total}</DropdownMenuShortcut>
                  </NavLink>
                </DropdownMenuItem>
                {counters.saved > 0 && (
                  <DropdownMenuItem className='flex items-center justify-start'>
                    <BookMarkIcon className='h-4 w-4 mr-2 fill-transparent' />
                    Saved
                    <DropdownMenuShortcut>{counters.saved}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                {counters.favorite > 0 && (
                  <DropdownMenuItem className='flex items-center justify-start'>
                    <HeartIcon className='h-4 w-4 mr-2' />
                    Favorite
                    <DropdownMenuShortcut>{counters.favorite}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                {counters.watched > 0 && (
                  <DropdownMenuItem className='flex items-center justify-start'>
                    <EyeIcon className='h-4 w-4 mr-2' />
                    Watched
                    <DropdownMenuShortcut>{counters.watched}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                {counters.rated > 0 && (
                  <DropdownMenuItem className='flex items-center justify-start'>
                    <StarIcon className='h-4 w-4 mr-2' />
                    Rated
                    <DropdownMenuShortcut>{counters.rated}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
        {!user && (
          <DropdownMenuItem className='flex items-center justify-start' onClick={openLoginDialog}>
            <EnterIcon className='h-4 w-4 mr-2' />
            Login
          </DropdownMenuItem>
        )}
        <ThemeSwitcher />
        {user && (
          <Fragment>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(
                'bg-logout/0 !text-logout focus:bg-logout/20',
                'flex items-center justify-start',
              )}
              onClick={googleLogout}
            >
              <ExitIcon className='h-4 w-4 mr-2' />
              Logout
            </DropdownMenuItem>
          </Fragment>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
