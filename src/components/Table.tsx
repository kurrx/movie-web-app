import { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

function Root({ children }: PropsWithChildren) {
  return <div className='mt-2'>{children}</div>
}

function Row({ children }: PropsWithChildren) {
  return (
    <div className='flex items-baseline sm:py-2 py-1 sm:text-base text-sm text-muted-foreground'>
      {children}
    </div>
  )
}

function TitleCol({ children }: PropsWithChildren) {
  return <div className='w-[10rem] font-light'>{children}</div>
}

function Col({ children }: PropsWithChildren) {
  return <div className='flex-1 font-medium'>{children}</div>
}

function Link({ children, to }: PropsWithChildren<{ to: string }>) {
  return (
    <NavLink to={to} className='text-primary hover:text-[var(--ui-primary)] transition-colors'>
      {children}
    </NavLink>
  )
}

export const Table = { Root, Row, TitleCol, Col, Link }
