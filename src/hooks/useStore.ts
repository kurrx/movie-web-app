import { useDispatch, useSelector } from 'react-redux'

import { Dispatch, Selector } from '@/types'

export const useAppDispatch: Dispatch = useDispatch
export const useAppSelector: Selector = useSelector

export function useStore() {
  const dispatch = useAppDispatch()
  return [dispatch, useAppSelector] as const
}
