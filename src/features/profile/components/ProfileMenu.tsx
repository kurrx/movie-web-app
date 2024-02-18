import { useAppSelector } from '@/hooks'

import { selectProfileIsLoggedIn } from '../profile.slice'
import { LoginDialog } from './LoginDialog'

export function ProfileMenu() {
  const isLoggedIn = useAppSelector(selectProfileIsLoggedIn)

  if (!isLoggedIn) return <LoginDialog />

  return null
}
