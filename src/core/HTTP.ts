import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'

import { OnRejected, OnRequestFulfilled, OnResponseFulfilled } from '@/types'

export class HTTP {
  private instance: AxiosInstance

  constructor(config?: CreateAxiosDefaults) {
    this.instance = axios.create(config)
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
    return Promise.reject(err)
  }
}
