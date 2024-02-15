import { parse } from 'set-cookie-parser'
import { z } from 'zod'

import { OnRequestFulfilled, OnResponseFulfilled } from '@/types'

export const convertDataToDom: OnResponseFulfilled = (response) => {
  const isContentTypeStr = typeof response.headers['content-type'] === 'string'
  const isHtml = isContentTypeStr && response.headers['content-type'].includes('text/html')
  if (isContentTypeStr && isHtml && typeof response.data === 'string') {
    response.data = new DOMParser().parseFromString(response.data, 'text/html')
  }
  return response
}

const ProxyCookie = z.object({
  name: z.enum([
    'PHPSESSID',
    'dle_user_token',
    'dle_user_taken',
    'dle_user_id',
    'dle_password',
    'dle_hash',
  ]),
  value: z.string(),
  expires: z.number().optional(),
})

const ProxyCookies = z.array(ProxyCookie)

export function getProxyCookies(): z.infer<typeof ProxyCookies> {
  const cookies = localStorage.getItem('proxy-cookies')
  if (!cookies) return []
  try {
    return ProxyCookies.parse(JSON.parse(cookies))
  } catch {
    return []
  }
}

export function appendCookies(cookies: z.infer<typeof ProxyCookies>): void {
  const prevCookies = getProxyCookies()
  for (const cookie of cookies) {
    const prevCookie = prevCookies.find((c) => c.name === cookie.name)
    if (prevCookie) prevCookie.value = cookie.value
    else prevCookies.push(cookie)
  }
  localStorage.setItem('proxy-cookies', JSON.stringify(prevCookies))
}

export const sendProxiedCookies: OnRequestFulfilled = (config) => {
  const cookies = getProxyCookies()
  if (cookies.length > 0) {
    config.headers['x-proxy-cookie'] = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ')
  }
  return config
}

export const sendProxiedUserAgent: OnRequestFulfilled = (config) => {
  config.headers['x-proxy-user-agent'] =
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
  return config
}

export const parseProxiedCookies: OnResponseFulfilled = (response) => {
  const cookiesCountHeader = response.headers['x-proxy-set-cookies-count']
  if (cookiesCountHeader) {
    const cookiesCount = parseInt(cookiesCountHeader)
    if (!isNaN(cookiesCount) && cookiesCount > 0) {
      const cookies: z.infer<typeof ProxyCookies> = []
      for (let i = 1; i <= cookiesCount; i++) {
        const cookieHeader = response.headers[`x-proxy-set-cookie-${i}`]
        if (typeof cookieHeader !== 'string') continue
        try {
          const cookie = parse(cookieHeader)[0]
          if (!cookie) continue
          cookies.push(
            ProxyCookie.parse({
              name: cookie.name,
              value: cookie.value,
              expires: cookie.expires?.getTime(),
            }),
          )
        } catch {
          continue
        }
      }
      appendCookies(cookies)
    }
  }
  return response
}
