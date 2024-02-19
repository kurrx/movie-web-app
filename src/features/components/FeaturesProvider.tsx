import { PropsWithChildren } from 'react'

import { useAppDevice } from '../device'
import { useAppPlayer } from '../player'
import { useAppProfile } from '../profile'
import { useScrollTop } from '../router'
import { useAppTheme } from '../theme'

export function FeaturesProvider({ children }: PropsWithChildren) {
  useAppTheme()
  useAppPlayer()
  useAppDevice()
  useAppProfile()
  useScrollTop()

  return children
}
