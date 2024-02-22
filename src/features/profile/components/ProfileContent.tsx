import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'

import { selectProfileCounters, selectProfileUser } from '../profile.slice'
import { ProfileBadges } from './ProfileBadges'
import { ProfileItems } from './ProfileItems'
import { ProfileUser } from './ProfileUser'

export function ProfileContent() {
  const user = useAppSelector(selectProfileUser)
  const counters = useAppSelector(selectProfileCounters)

  return (
    <div className='w-full max-w-full flex-1 flex flex-col'>
      <Title>Profile</Title>
      <div className='container flex flex-col mt-8'>
        <ProfileUser user={user!} />
      </div>
      <ProfileBadges counters={counters} />
      <div className='container flex-1 flex flex-col mb-16'>
        <ProfileItems counters={counters} />
      </div>
    </div>
  )
}
