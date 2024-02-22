import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'

import { selectProfileUser } from '../profile.slice'

export function ProfileContent() {
  const user = useAppSelector(selectProfileUser)

  if (!user) return null

  return (
    <div className='w-full max-w-full flex-1 flex flex-col'>
      <Title>Profile</Title>
    </div>
  )
}
