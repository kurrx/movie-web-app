import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useStore } from '@/hooks'
import { PlayerMenu } from '@/types'

import { useContextWrapper } from '../../../hooks'
import { selectPlayerMenu, setPlayerMenu } from '../../../player.slice'

interface MenuContextValue {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  section: string | null
  setSection: Dispatch<SetStateAction<string | null>>
}

const Context = createContext<MenuContextValue | null>(null)

export const useMenu = () => useContextWrapper(Context, 'Menu')

export interface MenuProviderProps extends PropsWithChildren {
  id: NonNullable<PlayerMenu>
}

export function MenuProvider({ id, children }: MenuProviderProps) {
  const [dispatch, selector] = useStore()
  const menu = selector(selectPlayerMenu)
  const open = useMemo(() => id === menu, [id, menu])
  const [section, setSection] = useState<string | null>(null)

  const setOpen = useCallback(
    (value: SetStateAction<boolean>) => {
      const next = typeof value === 'function' ? value(open) : value
      if (next) {
        dispatch(setPlayerMenu(id))
      } else {
        dispatch(setPlayerMenu(null))
      }
    },
    [dispatch, open, id],
  )

  const context = useMemo<MenuContextValue>(
    () => ({ open, setOpen, section, setSection }),
    [open, setOpen, section],
  )

  useEffect(() => {
    if (!open) {
      setSection(null)
    }
  }, [open])

  return <Context.Provider value={context}>{children}</Context.Provider>
}
