import { useRef } from 'react'
import { NavLink } from 'react-router-dom'

import { cn, SOCIAL_PORTFOLIO_URL } from '@/api'
import { useElementRect } from '@/hooks'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui'

const classes = {
  root: cn('py-4 md:px-8 md:py-0 border-t'),
  container: cn('container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row'),
  text: cn(
    'text-center text-balance text-center text-sm',
    'leading-loose text-muted-foreground md:text-left',
  ),
  link: cn(
    'font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
  ),
}

export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useElementRect(ref, 'footer')

  return (
    <footer ref={ref} className={classes.root}>
      <div className={classes.container}>
        <div className={classes.text}>
          Made by
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={SOCIAL_PORTFOLIO_URL}
                target='_blank'
                rel='noreferrer'
                className={classes.link}
              >
                &nbsp;kurr.dev.
              </a>
            </TooltipTrigger>
            <TooltipContent>Portfolio</TooltipContent>
          </Tooltip>
          &nbsp;Read app&nbsp;
          <NavLink to='/policy' className={classes.link}>
            policy.
          </NavLink>
        </div>
      </div>
    </footer>
  )
}
