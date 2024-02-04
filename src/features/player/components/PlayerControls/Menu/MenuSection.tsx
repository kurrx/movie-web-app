import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { animate, motion, useMotionValue } from 'framer-motion'
import { PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'

import { cn } from '@/api'
import { ScrollArea } from '@/components'

import { useMenu } from './MenuProvider'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transition: any = { duration: 0.4, ease: [0.4, 0, 0.2, 1] }

interface MainSectionProps {
  main: true
  name?: undefined | 'main'
}

interface SectionProps {
  main?: false
  name: string
}

export type MenuSectionProps = (MainSectionProps | SectionProps) &
  PropsWithChildren & {
    isScrollable?: boolean
    className?: string
    topContent?: ReactNode
  }

export function MenuSection(props: MenuSectionProps) {
  const { main, name, isScrollable, children, className, topContent } = props
  const { open, section, setSection } = useMenu()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMain = useMemo(() => !!main || name === 'main', [main, name])
  const position = useMotionValue(isMain ? 'static' : 'absolute')
  const pointerEvents = useMotionValue(isMain ? 'auto' : 'none')
  const opacity = useMotionValue(isMain ? 1 : 0)
  const x = useMotionValue(isMain ? 0 : '100%')

  const onClick = useCallback(() => {
    setSection(null)
  }, [setSection])

  useEffect(() => {
    if (!open) return
    const isCurrentActive = position.get() === 'static'
    const isNextActive = isMain ? section === null : section === name
    if (isCurrentActive === isNextActive) return
    let nextPosition: 'static' | 'absolute'
    let nextPointerEvents: 'auto' | 'none'
    let nextOpacity: number
    let nextX: string | number
    if (isNextActive) {
      nextPosition = 'static'
      nextPointerEvents = 'auto'
      nextOpacity = 1
      nextX = 0
    } else {
      nextPosition = 'absolute'
      nextPointerEvents = 'none'
      nextOpacity = 0
      nextX = isMain ? '-100%' : '100%'
    }
    position.set(nextPosition)
    pointerEvents.set(nextPointerEvents)
    const opacityAnimation = animate(opacity, nextOpacity, transition)
    const xAnimation = animate(x, nextX, transition)
    return () => {
      opacityAnimation.stop()
      xAnimation.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, section])

  return (
    <motion.div
      style={{ x, opacity, position, pointerEvents }}
      className='left-0 right-0 top-0 w-full'
    >
      {!isMain && (
        <button
          className={cn(
            'w-full h-10 px-2 hover:bg-white/10',
            'flex items-center justify-start',
            'space-x-2 text-md border-b',
          )}
          onClick={onClick}
        >
          <ChevronLeftIcon className='h-6 w-6' />
          <span className='font-bold'>{name}</span>
        </button>
      )}
      {topContent}
      {isScrollable ? (
        <ScrollArea ref={scrollRef} className={cn('h-[22.5rem]', className)}>
          {children}
        </ScrollArea>
      ) : (
        children
      )}
    </motion.div>
  )
}
