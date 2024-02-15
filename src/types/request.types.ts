import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export type OnFulfilled<T> = ((value: T) => T | Promise<T>) | null
export type OnRequestFulfilled = OnFulfilled<InternalAxiosRequestConfig>
export type OnResponseFulfilled = OnFulfilled<AxiosResponse>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnRejected = ((error: any) => any) | null

export interface RequestArgs {
  signal?: AbortSignal
  referer?: string
}
