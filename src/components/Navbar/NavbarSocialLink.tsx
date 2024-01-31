import { PropsWithChildren } from 'react'

import { cn } from '@/api'

import { buttonVariants, Tooltip, TooltipContent, TooltipTrigger } from '../ui'

const classes = {
  root: cn(buttonVariants({ variant: 'ghost' }), 'w-9 px-0'),
  link: cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md'),
  label: cn('sr-only'),
}

export interface NavbarSocialLinkProps extends PropsWithChildren {
  href: string
  label: string
}

export function NavbarSocialLink(props: NavbarSocialLinkProps) {
  const { href, label, children } = props

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a className={classes.link} href={href} target='_blank' rel='noreferrer'>
          <span className={classes.root}>
            {children}
            <span className={classes.label}>{label}</span>
          </span>
        </a>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
