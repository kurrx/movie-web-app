import { useCallback } from 'react'
import { useClickAnyWhere } from 'usehooks-ts'

import { useStore } from '@/hooks'

import { enablePlayerCanAutoStart, selectPlayerCanAutoStart } from '../player.slice'

export function useAppPlayer() {
  const [dispatch, selector] = useStore()
  const canAutoStart = selector(selectPlayerCanAutoStart)

  const onClickAnywhere = useCallback(() => {
    if (canAutoStart) return
    dispatch(enablePlayerCanAutoStart())
  }, [canAutoStart, dispatch])

  useClickAnyWhere(onClickAnywhere)
}
