import { Request } from '@/core'
import { FetchItemArgs, FetchSearchArgs } from '@/types'

import { PROVIDER_URL, PROXY_URL } from './env'
import { convertDataToDom, parseProxiedCookies, sendProxiedCookies } from './interceptors'
import { parseItemDocument, parseSearchDocument } from './parser'

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
  // TODO: Add pagination support
  const params = { q: query, do: 'search', subaction: 'search' }
  const { data } = await html.get<Document>('/search/', { params, signal })
  return parseSearchDocument(data)
}

export async function fetchItem(args: FetchItemArgs) {
  const { signal, fullId } = args
  const uri = `/${fullId.typeId}/${fullId.genreId}/${fullId.slug}.html`
  const { data } = await html.get<Document>(uri, { signal })
  const baseItem = parseItemDocument(data, fullId)
  console.log(baseItem)
}
