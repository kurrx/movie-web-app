import { SerializedError } from '@reduxjs/toolkit'
import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'

import { OnRejected, OnRequestFulfilled, OnResponseFulfilled } from '@/types'

export class Request {
  private instance: AxiosInstance

  constructor(config?: CreateAxiosDefaults) {
    this.instance = axios.create(config)
    this.useRequest(Request.onRequestDefault, Request.onErrorDefault)
    this.useResponse(Request.onResponseDefault, Request.onErrorDefault)
  }

  public construct() {
    return this.instance
  }

  public useRequest(onFulfilled: OnRequestFulfilled, onRejected?: OnRejected) {
    this.instance.interceptors.request.use(onFulfilled, onRejected)
    return this
  }

  public useResponse(onFulfilled: OnResponseFulfilled, onRejected?: OnRejected) {
    this.instance.interceptors.response.use(onFulfilled, onRejected)
    return this
  }

  public static onRequestDefault<C extends InternalAxiosRequestConfig>(config: C): C | Promise<C> {
    return config
  }

  public static onResponseDefault<R extends AxiosResponse>(response: R): R | Promise<R> {
    return response
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static onErrorDefault(err: any): any {
    const convertedError: SerializedError = {}
    if (axios.isCancel(err)) {
      convertedError.name = 'Request Cancelled'
      convertedError.message = `Request has been cancelled for some reason, please refresh the page.`
      convertedError.code = 'CANCELLED'
    } else if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        convertedError.name = 'Request Timeout'
        convertedError.message = 'Request has been timed out, please try again later.'
        convertedError.code = 'TIMEOUT'
      } else {
        convertedError.name = err.name
        convertedError.message = err.response?.data?.message || err.message
        convertedError.code = err.response?.status ? `${err.response.status}` : err.code
      }
    } else if (err instanceof Error) {
      convertedError.name = err.name
      convertedError.message = err.message
      convertedError.code = 'ERROR'
    } else {
      convertedError.name = 'Unknown Error'
      convertedError.message = 'Something went wrong! Try again later.'
      convertedError.code = 'UNKNOWN'
    }
    return Promise.reject(convertedError)
  }
}
