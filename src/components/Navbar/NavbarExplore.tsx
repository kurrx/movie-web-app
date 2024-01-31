import { PropsWithChildren } from 'react'

import { Navigation } from '@/types'

import { NavbarExploreDesktop } from './NavbarExploreDesktop'
import { NavbarExploreMobile } from './NavbarExploreMobile'

export interface NavbarExploreProps extends PropsWithChildren {
  navigation: Navigation
}

export function NavbarExplore(props: NavbarExploreProps) {
  return (
    <>
      <NavbarExploreDesktop {...props} />
      <NavbarExploreMobile {...props} />
    </>
  )
}
