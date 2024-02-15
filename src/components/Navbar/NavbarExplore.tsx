import { Fragment, PropsWithChildren } from 'react'

import { Navigation } from '@/types'

import { NavbarExploreDesktop } from './NavbarExploreDesktop'
import { NavbarExploreMobile } from './NavbarExploreMobile'

export interface NavbarExploreProps extends PropsWithChildren {
  navigation: Navigation
  onExploreOpen: () => void
}

export function NavbarExplore(props: NavbarExploreProps) {
  return (
    <Fragment>
      <NavbarExploreDesktop {...props} />
      <NavbarExploreMobile {...props} />
    </Fragment>
  )
}
