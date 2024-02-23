import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { fetchIsVPNActive, mediaQuery } from '@/api'
import { FetchState } from '@/core'
import { AppStoreState, DeviceStoreState, ThunkApiConfig } from '@/types'

const initialState: DeviceStoreState = {
  isMobile: mediaQuery('(max-width: 932px)'),
  isTouch: mediaQuery('(pointer: coarse) and (hover: none)'),
  vpn: {
    active: false,
    state: FetchState.LOADING,
    error: null,
    requestId: null,
  },
}

export const validateVpn = createAsyncThunk<true, void, ThunkApiConfig>(
  'device/validateVpn',
  async (_, { signal }) => await fetchIsVPNActive({ signal }),
  {
    condition(arg, api) {
      return api.getState().device.vpn.state !== FetchState.SUCCESS
    },
  },
)

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

    dismissVpnError(state) {
      state.vpn.error = null
      state.vpn.state = FetchState.SUCCESS
      state.vpn.active = true
    },
  },

  extraReducers(builder) {
    builder
      .addCase(validateVpn.pending, (state, action) => {
        state.vpn.state = FetchState.LOADING
        state.vpn.requestId = action.meta.requestId
        state.vpn.error = null
        state.vpn.active = false
      })
      .addCase(validateVpn.fulfilled, (state, action) => {
        if (state.vpn.requestId === action.meta.requestId) {
          state.vpn.state = FetchState.SUCCESS
          state.vpn.requestId = null
          state.vpn.active = true
          state.vpn.error = null
        }
      })
      .addCase(validateVpn.rejected, (state, action) => {
        if (state.vpn.requestId === action.meta.requestId) {
          state.vpn.state = FetchState.ERROR
          state.vpn.requestId = null
          state.vpn.active = false
          state.vpn.error = action.error
        }
      })
  },
})

export const { setDeviceIsMobile, setDeviceIsTouch, dismissVpnError } = deviceSlice.actions

export const selectDeviceIsMobile = (state: AppStoreState) => state.device.isMobile
export const selectDeviceIsTouch = (state: AppStoreState) => state.device.isTouch
export const selectDeviceVpn = (state: AppStoreState) => state.device.vpn

export const deviceReducer = deviceSlice.reducer
