import { useCallback, useEffect } from 'react'
import { useClickAnyWhere, useEventListener } from 'usehooks-ts'

import { useStore } from '@/hooks'

import { savePlayerSettings } from '../player.schemas'
import {
  enablePlayerCanAutoStart,
  selectPlayerCanAutoStart,
  selectPlayerSettings,
} from '../player.slice'

export function useAppPlayer() {
  const [dispatch, selector] = useStore()
  const canAutoStart = selector(selectPlayerCanAutoStart)
  const settings = selector(selectPlayerSettings)

  const onInteract = useCallback(() => {
    if (canAutoStart) return
    dispatch(enablePlayerCanAutoStart())
  }, [canAutoStart, dispatch])

  useEffect(() => {
    savePlayerSettings(settings)
  }, [settings])

  useClickAnyWhere(onInteract)

  useEventListener('keydown', onInteract)
}
