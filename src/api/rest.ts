import { SerializedError } from '@reduxjs/toolkit'

import { Request } from '@/core'
import { RequestArgs } from '@/types'

import { API_URL, PROXY_IP } from './env'

const api = new Request({
  baseURL: API_URL,
  responseType: 'json',
  responseEncoding: 'utf-8',
}).construct()

export async function fetchIsVPNActive({ signal }: RequestArgs) {
  const { data } = await api.get<string>('/ip', { signal })
  const isActive = data.includes(PROXY_IP)
  if (!isActive) {
    const error: SerializedError = {
      name: 'VPN Not Detected',
      message: `In order to be able use this app, you need to enable provided VPN connection. If you sure that VPN is enabled, close this window.`,
      code: 'VPN_NOT_CONNECTED',
    }
    throw error
  }
  return true as const
}
