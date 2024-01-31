import { Parser } from '@/core'
import { explore } from '@/features'
import { ItemFullID, SearchItem } from '@/types'

const NOT_AVAILABLE_ERROR = 'Rezka is not available. Try again later.'

export function parseSlugToId(slug: string): number | null {
  try {
    const numberStr = slug.split('-').shift()
    if (!numberStr) return null
    return parseInt(numberStr)
  } catch {
    return null
  }
}

export function parseUrlToIds(url: string): ItemFullID | null {
  try {
    const instance = new URL(url)
    const routes = instance.pathname.split('/')
    const typeId = routes[1]
    const genreId = routes[2]
    const slug = routes[3]?.replace('.html', '')
    if (!typeId || !genreId || !slug) return null
    const type = explore[typeId]
    if (!type) return null
    const genre = type.genres[genreId]
    if (!genre) return null
    const id = parseSlugToId(slug)
    if (!id) return null
    return {
      id,
      typeId,
      type: type.title,
      genre,
      genreId,
      slug,
    }
  } catch {
    return null
  }
}

export function parseSearchDocument(document: Document): SearchItem[] {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)
  parser.switchToChild('.b-content__inline_items', true)

  const results: SearchItem[] = []
  const items = parser.all('.b-content__inline_item')
  for (const item of items) {
    parser.setParent(item)

    // ID
    const id = parser.attrInt('data-id')
    if (id === null) continue

    // URL
    const url = parser.attr('data-url')
    if (!url) continue

    const itemLink = parser.switchToChild('.b-content__inline_item-link')
    if (!itemLink) continue

    // Title
    const itemLinkAnchor = parser.switchToChild(`a[href="${url}"]`)
    if (!itemLinkAnchor) continue
    const title = parser.text()
    if (!title) continue

    // Description
    parser.setParent(itemLink)
    const itemLinkDiv = parser.switchToChild('div')
    if (!itemLinkDiv) continue
    const description = parser.text()
    if (!description) continue

    // Poster URL
    parser.setParent(item)
    const itemPoster = parser.switchToChild(`img[alt="${title}"]`)
    if (!itemPoster) continue
    const posterUrl = parser.attr('src')
    if (!posterUrl) continue

    // IDs
    const ids = parseUrlToIds(url)
    if (!ids) continue

    results.push({
      id,
      typeId: ids.typeId,
      type: ids.type,
      genreId: ids.genreId,
      genre: ids.genre,
      slug: ids.slug,
      title,
      description,
      posterUrl,
    })
  }
  return results
}
