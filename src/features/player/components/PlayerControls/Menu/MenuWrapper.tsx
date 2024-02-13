import { ReactNode, useMemo } from 'react'

import { cn } from '@/api'
import {
  AutoHeight,
  Dialog,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components'
import { selectDeviceIsMobile } from '@/features/device'
import { useAppSelector } from '@/hooks'

import { useNodes } from '../../PlayerNodes'
import { Button } from '../Desktop/Buttons/Button'
import { MenuProvider, MenuProviderProps, useMenu } from './MenuProvider'

export interface MenuWrapperProps extends MenuProviderProps {
  tooltip: string
  badge?: string | null
  Icon?: ReactNode | ((open: boolean) => ReactNode)
  MobileIcon?: ReactNode | ((open: boolean) => ReactNode)
}

function MobileWrapper({ id, tooltip, MobileIcon, Icon, children }: MenuWrapperProps) {
  const { content } = useNodes()
  const { open, setOpen } = useMenu()
  const ButtonIcon = useMemo(() => MobileIcon || Icon, [MobileIcon, Icon])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button id={id} tooltip={tooltip} className='relative'>
            {typeof ButtonIcon === 'function' ? ButtonIcon(open) : ButtonIcon}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        closeHidden
        container={content}
        className='px-0 py-2 overflow-hidden rounded-lg'
        location='bottom'
        onFocus={(e) => {
          const target = e.target as HTMLElement
          target.blur()
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <AutoHeight>{children}</AutoHeight>
      </DialogContent>
    </Dialog>
  )
}

function DesktopWrapper({ id, tooltip, badge, Icon, children }: MenuWrapperProps) {
  const { content } = useNodes()
  const { open, setOpen } = useMenu()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <Button id={id} tooltip={tooltip} className='relative'>
            {typeof Icon === 'function' ? Icon(open) : Icon}
            {badge && (
              <span
                className={cn(
                  'absolute top-[0.625rem] right-[0.3125rem]',
                  'flex items-center justify-center',
                  'h-[0.5625rem] w-[0.8125rem] rounded-[0.0625rem] bg-[var(--ui-primary)]',
                  'text-white text-[0.4375rem] font-bold leading-none',
                )}
              >
                {badge}
              </span>
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        container={content}
        side='top'
        sideOffset={14}
        align='center'
        collisionPadding={{ left: 12, right: 12 }}
        className='rounded-lg w-[18rem] py-2 px-0 dark overflow-hidden relative'
        onFocus={(e) => {
          const target = e.target as HTMLElement
          target.blur()
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <AutoHeight>{children}</AutoHeight>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MenuWrapper(props: MenuWrapperProps) {
  const { id } = props
  const isMobile = useAppSelector(selectDeviceIsMobile)
  const Component = useMemo(() => (isMobile ? MobileWrapper : DesktopWrapper), [isMobile])

  return (
    <MenuProvider id={id}>
      <Component {...props} />
    </MenuProvider>
  )
}
