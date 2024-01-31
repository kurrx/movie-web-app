import { PropsWithChildren } from 'react'

import { useScrollTop } from '../router'
import { useAppTheme } from '../theme'

export function FeaturesProvider({ children }: PropsWithChildren) {
  useAppTheme()
  useScrollTop()

  return children
}
