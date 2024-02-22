import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'

import { selectProfileCounters } from '../profile.slice'
import { ProfileItems } from './ProfileItems'

export function ProfileContent() {
  const counters = useAppSelector(selectProfileCounters)

  return (
    <div className='w-full max-w-full flex-1 flex flex-col'>
      <Title>Profile</Title>
      <div className='container flex-1 flex flex-col mt-8 mb-16'>
        <h1 className='sm:text-4xl text-2xl font-bold'>Profile</h1>
        <ProfileItems counters={counters} />
      </div>
    </div>
  )
}
