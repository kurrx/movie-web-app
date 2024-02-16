import { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'

export interface TableProps extends PropsWithChildren {
  className?: string
}

function Root({ children, className }: TableProps) {
  return <div className={cn('mt-2', className)}>{children}</div>
}

function Row({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        'flex items-baseline sm:py-2',
        'py-1 sm:text-base text-sm',
        'text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

function TitleCol({ children, className }: TableProps) {
  return <div className={cn('w-[10rem] font-light', className)}>{children}</div>
}

function Col({ children, className }: TableProps) {
  return <div className={cn('flex-1 font-medium', className)}>{children}</div>
}

interface LinkProps extends PropsWithChildren {
  to: string
  className?: string
}

function Link({ children, to, className }: LinkProps) {
  return (
    <NavLink
      to={to}
      className={cn('text-primary hover:text-[var(--ui-primary)] transition-colors', className)}
    >
      {children}
    </NavLink>
  )
}

export const Table = { Root, Row, TitleCol, Col, Link }
