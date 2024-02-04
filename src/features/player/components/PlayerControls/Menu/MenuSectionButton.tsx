import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ReactNode, useCallback } from 'react'

import { cn } from '@/api'

import { useMenu } from './MenuProvider'

export interface MenuSectionButtonProps {
  children: string
  icon?: ReactNode
  value?: ReactNode
  active?: boolean
  className?: string
}

export function MenuSectionButton(props: MenuSectionButtonProps) {
  const { children, icon, value, active, className } = props
  const { setSection } = useMenu()

  const onClick = useCallback(() => {
    setSection(children)
  }, [children, setSection])

  return (
    <button
      className={cn(
        'w-full h-10 pl-5 pr-2 hover:bg-white/10',
        'flex items-center justify-between',
        'space-x-2 text-xs [&_svg]:w-5 [&_svg]:h-5',
        'data-[active=true]:bg-white/10',
        className,
      )}
      data-active={active}
      onClick={onClick}
    >
      <span className='font-medium flex items-center justify-center shrink-0 [&_svg]:mr-2'>
        {icon}
        {children}
      </span>
      <span className='flex items-center justify-center space-x-2'>
        {value && (
          <span className='text-muted-foreground flex items-center justify-end flex-1'>
            {value}
          </span>
        )}
        <ChevronRightIcon />
      </span>
    </button>
  )
}
