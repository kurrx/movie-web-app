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
      <DropdownMenuSubTrigger className='flex items-center justify-start'>
        <Icon className='h-4 w-4 mr-2' />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            className='flex items-center justify-start'
            onClick={() => onValueChange('light')}
          >
            <SunIcon className='h-4 w-4 mr-2' />
            Light
            {theme === 'light' && <CheckIcon className='ml-auto h-4 w-4' />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className='flex items-center justify-start'
            onClick={() => onValueChange('dark')}
          >
            <MoonIcon className='h-4 w-4 mr-2' />
            Dark
            {theme === 'dark' && <CheckIcon className='ml-auto h-4 w-4' />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className='flex items-center justify-start'
            onClick={() => onValueChange('system')}
          >
            <DesktopIcon className='h-4 w-4 mr-2' />
            System
            {theme === 'system' && <CheckIcon className='ml-auto h-4 w-4' />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
