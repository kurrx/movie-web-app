import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLSpanElement
type RefProps = HTMLAttributes<Ref>

export type DropdownMenuShortcutProps = RefProps

export const DropdownMenuShortcut = forwardRef<Ref, DropdownMenuShortcutProps>(
  function DropdownMenuShortcut(props, ref) {
    const { className, ...restProps } = props

    return (
      <span
        ref={ref}
        className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
        {...restProps}
      />
    )
  },
)
