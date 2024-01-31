import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLSpanElement
type RefProps = HTMLAttributes<Ref>

export type CommandShortcutProps = RefProps

export const CommandShortcut = forwardRef<Ref, CommandShortcutProps>(
  function CommandShortcut(props, ref) {
    const { className, ...restProps } = props

    return (
      <span
        ref={ref}
        className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
        {...restProps}
      />
    )
  },
)
