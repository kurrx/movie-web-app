import { CheckIcon } from '@radix-ui/react-icons'
import type { Context as ReactContext } from 'react'
import { createContext, PropsWithChildren, ReactElement, useCallback, useMemo } from 'react'

import { cn } from '@/api'

import { useContextWrapper } from '../../../hooks'
import { useMenu } from './MenuProvider'

type CloseOnChange = 'menu' | 'section'

interface ContextValue<T = unknown> {
  selected: T
  closeOnChange?: CloseOnChange
  onSelectedChange: (value: T) => void
  equals: (a: T, b: T) => boolean
}

const Context = createContext<ContextValue>(null!)

function useContext<T>() {
  return useContextWrapper(Context as ReactContext<ContextValue<T>>, 'MenuSectionSelect')
}

export interface MenuSectionSelectValueProps<T> extends PropsWithChildren {
  value: T
}

export function MenuSectionSelectValue<T>(props: MenuSectionSelectValueProps<T>) {
  const { value, children } = props
  const { setSection, setOpen } = useMenu()
  const { selected, closeOnChange, onSelectedChange, equals } = useContext<T>()
  const isSelected = useMemo(() => equals(value, selected), [value, selected, equals])

  const onClick = useCallback(() => {
    if (isSelected) return
    onSelectedChange(value)
    if (!closeOnChange) return
    switch (closeOnChange) {
      case 'section':
        setSection(null)
        break
      case 'menu':
        setOpen(false)
        break
    }
  }, [isSelected, value, closeOnChange, onSelectedChange, setSection, setOpen])

  return (
    <button
      className={cn(
        'w-full h-10 pl-10 hover:bg-white/10',
        'flex items-center justify-start',
        'text-xs relative',
      )}
      onClick={onClick}
    >
      {isSelected && (
        <CheckIcon className='absolute h-5 w-5 top-[50%] left-2.5 translate-y-[-50%]' />
      )}
      <span className='font-medium flex items-center justify-start flex-1'>{children}</span>
    </button>
  )
}

export interface MenuSectionSelectProps<T> {
  selected: T
  onSelectedChange: (value: T) => void
  closeOnChange?: CloseOnChange
  equals?: (a: T, b: T) => boolean
  children:
    | ReactElement<MenuSectionSelectValueProps<T>>
    | Array<ReactElement<MenuSectionSelectValueProps<T>>>
}

export function MenuSectionSelect<T>(props: MenuSectionSelectProps<T>) {
  const Provider = (Context as ReactContext<ContextValue<T>>).Provider
  const { selected, closeOnChange, onSelectedChange, equals = (a, b) => a === b, children } = props
  const context = useMemo<ContextValue<T>>(
    () => ({ selected, closeOnChange, onSelectedChange, equals }),
    [selected, closeOnChange, onSelectedChange, equals],
  )

  return <Provider value={context}>{children}</Provider>
}
