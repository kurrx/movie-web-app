import { FetchableState } from './store.types'

export interface VPNState extends FetchableState {
  active: boolean
}

export interface DeviceStoreState {
  isMobile: boolean
  isTouch: boolean
  vpn: VPNState
}
