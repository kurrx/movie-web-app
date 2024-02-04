import { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'

import { cn } from '@/api'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components'
import { useAppDispatch } from '@/hooks'

import { setPlayerTooltipHovered } from '../../../player.slice'
import { useNodes } from '../../PlayerNodes'

export interface PlayerTooltipProps extends PropsWithChildren {
  content?: ReactNode
  className?: string
  disabled?: boolean
}

export function PlayerTooltip({ content, className, disabled, children }: PlayerTooltipProps) {
  const dispatch = useAppDispatch()
  const { content: container } = useNodes()
  const [open, setOpen] = useState(false)

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (disabled && open) return
      setOpen(open)
      dispatch(setPlayerTooltipHovered(open))
    },
    [dispatch, disabled],
  )

  useEffect(() => {
    if (disabled) {
      setOpen(false)
      dispatch(setPlayerTooltipHovered(false))
    }
  }, [dispatch, disabled])

  return (
    <Tooltip disableHoverableContent open={open} onOpenChange={onOpenChange}>
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
