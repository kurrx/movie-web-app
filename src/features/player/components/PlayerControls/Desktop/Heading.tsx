import { PropsWithChildren } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerHeadingVisible } from '../../../player.slice'
import { useProps } from '../../PlayerProps'

function Root({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerHeadingVisible)

  return (
    <div
      id='player-heading'
      className={cn(
        'absolute left-0 top-0 w-full transition-opacity',
        'flex items-center justify-between',
        'data-[visible=false]:opacity-0 px-6 pt-4',
        'data-[visible=false]:pointer-events-none',
      )}
      data-visible={visible}
    >
      {children}
    </div>
  )
}

function Title() {
  const { title } = useProps()

  return (
    <div id='player-heading-title' className='grow min-w-0'>
      <div className='truncate text-white text-lg font-medium select-text'>{title}</div>
    </div>
  )
}

function Buttons({ children }: PropsWithChildren) {
  return (
    <div id='player-heading-buttons' className='flex items-center shrink-0 justify-end'>
      {children}
    </div>
  )
}

export const Heading = { Root, Title, Buttons }
