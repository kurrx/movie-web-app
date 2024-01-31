import { cn } from '@/api'
import { Button } from '@/components'
import { useStoreBoolean } from '@/hooks'

import { setSearchOpen } from '../search.slice'

const classes = {
  root: cn(
    'relative h-8 w-full justify-start rounded-[0.5rem]',
    'bg-background text-sm font-normal text-muted-foreground',
    'shadow-none sm:pr-12 md:w-40 lg:w-64',
  ),
  label: cn('inline-flex'),
  shortcut: {
    wrapper: cn(
      'pointer-events-none absolute right-[0.3rem] top-[0.3rem]',
      'hidden h-5 select-none items-center gap-1 rounded border',
      'bg-muted px-1.5 font-mono text-[10px] font-medium',
      'opacity-100 sm:flex',
    ),
    cmd: cn('text-xs'),
  },
}

export interface SearchButtonProps {
  disabled?: boolean
}

export function SearchButton({ disabled }: SearchButtonProps) {
  const { setTrue: open } = useStoreBoolean(setSearchOpen)

  return (
    <Button variant='outline' className={classes.root} disabled={disabled} onClick={open}>
      <span className={classes.label}>Search...</span>
      <kbd className={classes.shortcut.wrapper}>
        <span className={classes.shortcut.cmd}>⌘</span>K
      </kbd>
    </Button>
  )
}
