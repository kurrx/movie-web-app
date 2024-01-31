import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { AppStoreDispatch, AppStoreState } from '@/types'

export type Dispatch = () => AppStoreDispatch
export type Selector = TypedUseSelectorHook<AppStoreState>

export const useAppDispatch: Dispatch = useDispatch
export const useAppSelector: Selector = useSelector

export function useStore() {
  const dispatch = useAppDispatch()
  return [dispatch, useAppSelector] as const
}
