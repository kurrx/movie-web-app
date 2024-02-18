import { CheckIcon, DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useCallback, useMemo } from 'react'

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components'
import { Theme } from '@/types'

import { useTheme } from '../hooks'

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme()
  const Icon = useMemo(() => {
    switch (theme) {
      case 'light':
        return SunIcon
      case 'dark':
        return MoonIcon
      default:
        return DesktopIcon
    }
  }, [theme])

  const onValueChange = useCallback(
    (v: string) => {
      setTheme(v as Theme)
    },
    [setTheme],
  )

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Icon className='h-3 w-3 mr-2' />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => onValueChange('light')}>
            <SunIcon className='h-3 w-3 mr-2' />
            Light
            {theme === 'light' && <CheckIcon className='ml-auto h-3 w-3' />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onValueChange('dark')}>
            <MoonIcon className='h-3 w-3 mr-2' />
            Dark
            {theme === 'dark' && <CheckIcon className='ml-auto h-3 w-3' />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onValueChange('system')}>
            <DesktopIcon className='h-3 w-3 mr-2' />
            System
            {theme === 'system' && <CheckIcon className='ml-auto h-3 w-3' />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
