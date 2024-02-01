import { Request } from '@/core'
import { FetchSearchArgs } from '@/types'

import { PROVIDER_URL, PROXY_URL } from './env'
import { convertDataToDom, parseProxiedCookies, sendProxiedCookies } from './interceptors'
import { parseSearchDocument } from './parser'

export const html = new Request({
  baseURL: `${PROXY_URL}/${PROVIDER_URL}`,
  responseType: 'document',
  responseEncoding: 'utf8',
})
  .useRequest(sendProxiedCookies)
  .useResponse(parseProxiedCookies)
  .useResponse(convertDataToDom)
  .construct()

export async function fetchSearch({ query, signal }: FetchSearchArgs) {
  const params = { q: query, do: 'search', subaction: 'search' }
  const { data } = await html.get<Document>('/search/', { params, signal })
  return parseSearchDocument(data)
}
