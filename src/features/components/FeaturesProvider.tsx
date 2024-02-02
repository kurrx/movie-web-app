import { PropsWithChildren } from 'react'

import { useAppDevice } from '../device'
import { useAppPlayer } from '../player'
import { useScrollTop } from '../router'
import { useAppTheme } from '../theme'
import { useWatch } from '../watch'

export function FeaturesProvider({ children }: PropsWithChildren) {
  useAppTheme()
  useAppPlayer()
  useAppDevice()
  useScrollTop()
  useWatch()

  return children
}
