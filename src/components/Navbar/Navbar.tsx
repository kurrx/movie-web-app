import { useMemo, useRef } from 'react'
import { NavLink } from 'react-router-dom'

import { APP_NAME, cn, SOCIAL_GITHUB_URL, SOCIAL_X_URL } from '@/api'
import { GithubLogoIcon, LogoIcon, XLogoIcon } from '@/assets'
import {
  explore,
  ProfileMenu,
  SearchButton,
  selectDeviceIsMobile,
  selectPlayerInitialized,
  selectPlayerTheater,
  selectSearchDisabled,
  setExploreOpen,
} from '@/features'
import { useAppSelector, useElementRect, useStoreBoolean } from '@/hooks'

import { NavbarExplore } from './NavbarExplore'
import { NavbarSocialLink } from './NavbarSocialLink'

const classes = {
  root: cn('sticky top-0 z-50 w-full border-b border-border/40 bg-background'),
  container: cn('container flex items-center h-14 max-w-screen-2xl'),
  content: cn('flex flex-1 items-center justify-between space-x-2 md:justify-end'),
  logo: {
    wrapper: cn('mr-4 hidden md:flex'),
    link: cn(
      'md:mr-3 flex items-center space-x-2 focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
    ),
    icon: cn('h-5 w-5'),
    text: cn('font-bold'),
  },
  search: cn('w-full flex-1 md:w-auto md:flex-none'),
  socials: {
    wrapper: cn('flex items-center'),
    icon: {
      github: cn('h-4 w-4'),
      x: cn('h-3 w-3'),
    },
  },
}

export function Navbar() {
  const ref = useRef<HTMLElement>(null)
  const searchDisabled = useAppSelector(selectSearchDisabled)
  const playerInitialized = useAppSelector(selectPlayerInitialized)
  const playerTheater = useAppSelector(selectPlayerTheater)
  const isMobile = useAppSelector(selectDeviceIsMobile)
  const isDark = useMemo(
    () => (isMobile ? playerInitialized : playerInitialized && playerTheater),
    [isMobile, playerInitialized, playerTheater],
  )
  const { setTrue: onExploreOpen } = useStoreBoolean(setExploreOpen)

  useElementRect(ref, 'navbar')

  return (
    <header ref={ref} className={cn(classes.root, isDark && 'dark text-white')}>
      <div className={classes.container}>
        <NavbarExplore navigation={explore} onExploreOpen={onExploreOpen}>
          <NavLink className={classes.logo.link} to='/'>
            <LogoIcon className={classes.logo.icon} />
            <span className={classes.logo.text}>{APP_NAME}</span>
          </NavLink>
        </NavbarExplore>

        <div className={classes.content}>
          <div className={classes.search}>
            <SearchButton disabled={searchDisabled} />
          </div>
          <div className={classes.socials.wrapper}>
            <NavbarSocialLink href={SOCIAL_GITHUB_URL} label='Github'>
              <GithubLogoIcon className={classes.socials.icon.github} />
            </NavbarSocialLink>
            <NavbarSocialLink href={SOCIAL_X_URL} label='Twitter'>
              <XLogoIcon className={classes.socials.icon.x} />
            </NavbarSocialLink>
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
