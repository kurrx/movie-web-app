import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useCallback } from 'react'

import { cn } from '@/api'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components'
import { Theme } from '@/types'

import { useTheme } from '../hooks'

const classes = {
  icon: {
    light: cn(
      'h-[1.2rem] w-[1.2rem] rotate-0 scale-100',
      'transition-all dark:-rotate-90 dark:scale-0',
    ),
    dark: cn(
      'absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0',
      'transition-all dark:rotate-0 dark:scale-100',
    ),
  },
  label: cn('sr-only'),
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme()

  const onValueChange = useCallback(
    (v: string) => {
      setTheme(v as Theme)
    },
    [setTheme],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <SunIcon className={classes.icon.light} />
          <MoonIcon className={classes.icon.dark} />
          <span className={classes.label}>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup value={theme} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
