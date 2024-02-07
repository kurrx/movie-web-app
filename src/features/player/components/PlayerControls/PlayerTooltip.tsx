import { PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '@/api'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components'
import { selectDeviceIsMobile } from '@/features/device'
import { useStore } from '@/hooks'

import { selectPlayerMenu, setPlayerTooltipHovered } from '../../player.slice'
import { useNodes } from '../PlayerNodes'

export interface PlayerTooltipProps extends PropsWithChildren {
  content?: ReactNode
  className?: string
  disabled?: boolean
}

export function PlayerTooltip({ content, className, disabled, children }: PlayerTooltipProps) {
  const [dispatch, selector] = useStore()
  const { content: container } = useNodes()
  const isMobile = selector(selectDeviceIsMobile)
  const menu = selector(selectPlayerMenu)
  const [open, setOpen] = useState(false)
  const combinedDisabled = useMemo(() => disabled || menu !== null, [disabled, menu])

  const onOpenChange = useCallback(
    (open: boolean) => {
      if ((combinedDisabled && open) || isMobile) return
      setOpen(open)
      dispatch(setPlayerTooltipHovered(open))
    },
    [dispatch, combinedDisabled, isMobile],
  )

  useEffect(() => {
    if (combinedDisabled) {
      setOpen(false)
      dispatch(setPlayerTooltipHovered(false))
    }
  }, [dispatch, combinedDisabled])

  return (
    <Tooltip disableHoverableContent open={open && !isMobile} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        container={container}
        className={cn('light', className)}
        side='top'
        sideOffset={14}
        align='center'
        collisionPadding={{ left: 12, right: 12 }}
        collisionBoundary={container}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
