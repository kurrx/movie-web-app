import { selectDeviceIsMobile } from '@/features/device'
import { useAppSelector } from '@/hooks'

import { DesktopControls } from './Desktop'
import { MobileControls } from './Mobile'

export function PlayerControls() {
  const isMobile = useAppSelector(selectDeviceIsMobile)

  if (isMobile) {
    return <MobileControls />
  }

  return <DesktopControls />
}
