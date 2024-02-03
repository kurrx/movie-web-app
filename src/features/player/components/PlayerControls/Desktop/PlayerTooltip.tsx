import { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'

import { cn } from '@/api'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components'

import { useNodes } from '../../PlayerNodes'

export interface PlayerTooltipProps extends PropsWithChildren {
  content?: ReactNode
  className?: string
  disabled?: boolean
}

export function PlayerTooltip({ content, className, disabled, children }: PlayerTooltipProps) {
  const { content: container } = useNodes()
  const [open, setOpen] = useState(false)

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!disabled) {
        setOpen(open)
      }
    },
    [disabled],
  )

  useEffect(() => {
    if (disabled) {
      setOpen(false)
    }
  }, [disabled])

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
