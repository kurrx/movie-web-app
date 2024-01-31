import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { SetStateAction, useCallback } from 'react'

import { useAppDispatch } from './useStore'

export type UseStoreBooleanAction = ActionCreatorWithPayload<SetStateAction<boolean>, string>

export function useStoreBoolean(action: UseStoreBooleanAction) {
  const dispatch = useAppDispatch()

  const set = useCallback(
    (value: SetStateAction<boolean>) => {
      dispatch(action(value))
    },
    [dispatch, action],
  )
  const setTrue = useCallback(() => set(true), [set])
  const setFalse = useCallback(() => set(false), [set])
  const toggle = useCallback(() => set((prev) => !prev), [set])

  return { set, setTrue, setFalse, toggle }
}
