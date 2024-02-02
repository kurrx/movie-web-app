import { PropsWithChildren } from 'react'

import { useScrollTop } from '../router'
import { useAppTheme } from '../theme'
import { useWatch } from '../watch'

export function FeaturesProvider({ children }: PropsWithChildren) {
  useAppTheme()
  useScrollTop()
  useWatch()

  return children
}
