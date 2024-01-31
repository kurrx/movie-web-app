import { PropsWithChildren } from 'react'

import { useAppTheme } from './theme'

export function FeaturesProvider({ children }: PropsWithChildren) {
  useAppTheme()

  return children
}
