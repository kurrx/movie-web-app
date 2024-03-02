import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { mediaQuery } from '@/api'
import { AppStoreState, DeviceStoreState } from '@/types'

const initialState: DeviceStoreState = {
  isMobile: mediaQuery('(max-width: 932px)'),
  isTouch: mediaQuery('(pointer: coarse) and (hover: none)'),
}

const deviceSlice = createSlice({
  name: 'device',
  initialState,

  reducers: {
    setDeviceIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload
    },

    setDeviceIsTouch(state, action: PayloadAction<boolean>) {
      state.isTouch = action.payload
    },
  },
})

export const { setDeviceIsMobile, setDeviceIsTouch } = deviceSlice.actions

export const selectDeviceIsMobile = (state: AppStoreState) => state.device.isMobile
export const selectDeviceIsTouch = (state: AppStoreState) => state.device.isTouch

export const deviceReducer = deviceSlice.reducer
