import { useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { useAppDispatch } from '@/hooks'

import { setDeviceIsMobile, setDeviceIsTouch } from '../device.slice'

export function useAppDevice() {
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery('(max-width: 932px)')
  const isTouch = useMediaQuery('(pointer: coarse) and (hover: none)')

  useEffect(() => {
    dispatch(setDeviceIsMobile(isMobile))
  }, [dispatch, isMobile])

  useEffect(() => {
    dispatch(setDeviceIsTouch(isTouch))
  }, [dispatch, isTouch])
}
