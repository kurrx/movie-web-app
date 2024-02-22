import { User } from 'firebase/auth'
import randomGradient from 'random-gradient'
import { useMemo, useState } from 'react'

import { cn } from '@/api'
import { Skeleton } from '@/components'

interface AvatarProps {
  id: string
  url: string | null
  alt: string
}

function Avatar({ id, url, alt }: AvatarProps) {
  const highResUrl = useMemo(() => url?.replace('s96-c', 's200-c') || null, [url])
  const [loaded, setLoaded] = useState(!url)

  return (
    <div className='relative w-full h-full rounded-full overflow-hidden'>
      <Skeleton className='absolute w-full h-full left-0 top-0' />
      {highResUrl ? (
        <img
          src={highResUrl}
          alt={alt}
          className={cn('absolute w-full h-full left-0 top-0', !loaded ? 'hidden' : 'inline-block')}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div
          className='absolute w-full h-full left-0 top-0'
          style={{ backgroundImage: randomGradient(id, 'diagonal') }}
        />
      )}
    </div>
  )
}

export function ProfileUser({ user }: { user: User }) {
  return (
    <div className='flex items-center justify-start'>
      <div className='sm:w-[5rem] w-[3rem] sm:h-[5rem] h-[3rem]'>
        <Avatar id={user.uid} url={user.photoURL} alt={user.displayName || user.uid} />
      </div>
      <div className='flex-1 sm:ml-6 ml-4'>
        <h1 className='sm:text-3xl text-md font-bold'>{user.displayName || 'Me'}</h1>
        {user.email && <p className='sm:text-lg text-muted-foreground'>{user.email}</p>}
      </div>
    </div>
  )
}
