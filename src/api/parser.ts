import { Parser, Thumbnails } from '@/core'
import { explore } from '@/features'
import {
  BaseItem,
  ItemCollection,
  ItemEpisodeInfo,
  ItemFranchise,
  ItemFranchiseItem,
  ItemFullID,
  ItemPerson,
  ItemRating,
  ItemTranslator,
  SearchItem,
  Stream,
  StreamQuality,
  StreamSeason,
  StreamSubtitle,
  StreamSuccessResponse,
} from '@/types'

import { base64ToString, product, stringToBase64, unite } from './utils'

const NOT_AVAILABLE_ERROR = 'Rezka is not available. Try again later.'
const NOT_REALEASED_ERROR = 'This title is not released yet.'

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

function findItemTableElementWithText(parser: Parser, parent: Element, text: string) {
  try {
    parser.setParent(parent)
    parser.switchToChild('.b-post__info', true)

    const tdls = parser.all('td.l')
    for (const tdl of tdls) {
      parser.setParent(tdl)
      if (parser.text() === `${text}:`) {
        return tdl.nextElementSibling
      }
    }
    return null
  } catch {
    return null
  }
}

function parseItemTableText(parser: Parser, parent: Element, text: string) {
  parser.setParent(parent)
  const td = findItemTableElementWithText(parser, parent, text)
  if (!td) return null
  parser.setParent(td)
  return parser.text()
}

function parseItemRating(parser: Parser, parent: Element, selector: string): ItemRating | null {
  try {
    parser.setParent(parent)
    const contentElem = parser.switchToChild(`.b-post__info_rates.${selector}`, true)

    // Link
    parser.switchToChild('a', true)
    const linkEncoded = parser.attr('href')?.replaceAll('/help/', '').slice(0, -1)
    if (!linkEncoded) return null
    const link = decodeURIComponent(base64ToString(linkEncoded))

    // Rate
    parser.setParent(contentElem)
    parser.switchToChild('span.bold', true)
    const rateStr = parser.text()
    if (!rateStr) return null
    const rate = parseFloat(rateStr)

    // Votes
    parser.setParent(contentElem)
    parser.switchToChild('i', true)
    const votesStr = parser.text()?.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '')
    if (!votesStr) return null
    const votes = parseInt(votesStr)
    if (isNaN(votes)) return null

    return { rate, votes, link }
  } catch {
    return null
  }
}

function parseItemCollections(parser: Parser, parent: Element, text: string): ItemCollection[] {
  parser.setParent(parent)
  const td = findItemTableElementWithText(parser, parent, text)
  if (!td) return []
  parser.setParent(td)

  const result: ItemCollection[] = []
  const links = parser.all('a')
  for (const link of links) {
    parser.setParent(link)

    // URL
    const url = parser.attr('href')
    if (!url) continue

    // Title
    const title = parser.text()
    if (!title) continue

    let place = null
    if (link.nextSibling) {
      const placeStr = link.nextSibling.textContent?.replaceAll('(', '').replaceAll(' место)', '')
      if (placeStr) {
        const placeInt = parseInt(placeStr)
        if (!isNaN(placeInt)) {
          place = placeInt
        }
      }
    }

    result.push({ url, title, place })
  }
  return result
}

function parseItemPersons(parser: Parser, parent: Element, type: string): ItemPerson[] {
  parser.setParent(parent)

  const results: ItemPerson[] = []
  const persons = parser.all(`.persons-list-holder [itemprop="${type}"]`)
  for (const person of persons) {
    try {
      parser.setParent(person)

      // ID
      const id = parser.attrInt('data-id')
      if (id === null) continue

      // Photo URL
      const photoUrl = parser.attr('data-photo')
      if (!photoUrl) continue

      // Job
      const job = parser.attr('data-job')
      if (!job) continue

      parser.switchToChild('a', true)

      // Name
      const name = parser.text()
      if (!name) continue

      // URL
      const url = parser.attr('href')
      if (!url) continue

      results.push({ id, name, photoUrl, job, url })
    } catch {
      continue
    }
  }
  return results
}

function parseItemTranslators(
  document: Document,
  parser: Parser,
  parent: Element,
  isSeries: boolean,
): ItemTranslator[] {
  parser.setParent(parent)

  // Translators
  const results: ItemTranslator[] = []
  const translators = parser.all('.b-translator__item')
  for (const translator of translators) {
    parser.setParent(translator)

    // ID
    const id = parser.attrInt('data-translator_id')
    if (id === null) continue

    // Name
    const name = parser.text()
    if (!name) continue

    // Is Ukranian
    const isUkranian = parser.hasChild('img[src="https://static.hdrezka.ac/i/flags/ua.png"]')

    // Is Camprip
    const isCamrip = Boolean(parser.attrInt('data-camrip') || 0)

    // Is Ads
    const isAds = Boolean(parser.attrInt('data-ads') || 0)

    // Is Director
    const isDirector = Boolean(parser.attrInt('data-director') || 0)

    results.push({
      id,
      name,
      isUkranian,
      rating: 0,
      isCamrip,
      isAds,
      isDirector,
    })
  }

  // If no translators, then take single translator from script
  if (results.length === 0) {
    parser.setParent(document)
    const searchFor = `sof.tv.${isSeries ? 'initCDNSeriesEvents' : 'initCDNMoviesEvents'}(`
    const scripts = parser.all('script')
    for (const script of scripts) {
      parser.setParent(script)
      const scriptText = parser.text()
      if (scriptText && scriptText.includes(searchFor)) {
        const params = scriptText.split(searchFor)[1]?.split('{')[0]?.split(',')

        // ID
        const id = parseInt(params[1]?.trim() || '')
        if (isNaN(id)) continue

        // Is Camrip
        const isCamrip = Boolean(isSeries ? 0 : parseInt(params[2]?.trim() || ''))

        // Is Ads
        const isAds = Boolean(isSeries ? 0 : parseInt(params[3]?.trim() || ''))

        // Is Director
        const isDirector = Boolean(isSeries ? 0 : parseInt(params[4]?.trim() || ''))

        results.push({
          id,
          name: 'Оригинал',
          isUkranian: false,
          rating: 0,
          isCamrip,
          isAds,
          isDirector,
        })
      }
    }
    if (results.length === 0) throw new Error(NOT_REALEASED_ERROR)
  }

  // Ratings
  parser.setParent(parent)
  const ratingElement = parser.switchToChild('.b-rgstats__help')
  if (ratingElement) {
    const ratingElementTitle = parser.attr('title')
    if (ratingElementTitle) {
      const tempDoc = new DOMParser().parseFromString(
        `<div>${ratingElementTitle}</div>`,
        'text/html',
      )
      parser.setParent(tempDoc)

      const ratings = parser.all('.b-rgstats__list_item')
      for (const rating of ratings) {
        try {
          parser.setParent(rating)

          // Title
          parser.switchToChild('.title', true)
          const title = parser.text()
          if (!title) continue

          // Rating
          parser.setParent(rating)
          parser.switchToChild('.count', true)
          const ratingStr = parser.text()?.replaceAll('%', '').replaceAll(',', '.')
          if (!ratingStr) continue
          const ratingNum = parseFloat(ratingStr)
          if (isNaN(ratingNum)) continue

          // Is Ukranian
          parser.setParent(rating)
          const isUkranian = parser.hasChild('img[title="Украинский"]')
          for (const translator of results) {
            if (translator.name === title && translator.isUkranian === isUkranian) {
              translator.rating = ratingNum
              break
            }
          }
        } catch {
          continue
        }
      }

      results.sort((a, b) => b.rating - a.rating)
    }
  }

  return results
}

export function parseItemDocumentEpisodes(document: Document) {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)
  parser.switchToChild('.b-content__main', true)

  const seasonElems = parser.all('.b-post__schedule_table')
  const seasons: ItemEpisodeInfo[][] = []
  if (seasonElems.length) {
    for (const seasonElem of seasonElems) {
      parser.setParent(seasonElem)
      const season: ItemEpisodeInfo[] = []
      const episodeElems = parser.all('tr')
      for (const episodeElem of episodeElems) {
        parser.setParent(episodeElem)
        if (parser.hasChild('.load-more')) continue

        // Title
        const titleElem = parser.switchToChild('.td-2 b')
        let title = 'Untitled'
        if (titleElem) {
          const titleStrNull = parser.text()
          if (titleStrNull) {
            title = titleStrNull
          } else {
            parser.setParent(episodeElem)
            const fallbackTitleElem = parser.switchToChild('.td-2')
            if (fallbackTitleElem) {
              title = parser.text() || title
            }
          }
        }

        // Original Title
        parser.setParent(episodeElem)
        const originalTitleElem = parser.switchToChild('.td-2 span')
        let originalTitle: null | string = null
        if (originalTitleElem) {
          originalTitle = parser.text()
        }

        // Release Date
        parser.setParent(episodeElem)
        const releaseDateElem = parser.switchToChild('.td-4')
        let releaseDate: null | string = null
        if (releaseDateElem) {
          releaseDate = parser.text()
        }

        season.unshift({ title, originalTitle, releaseDate })
      }
      seasons.unshift(season)
    }
  }
  return seasons
}

export function parseItemDocument(document: Document, fullId: ItemFullID): BaseItem {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)
  const parent = parser.switchToChild('.b-content__main', true)

  // OG Type
  parser.setParent(document)
  parser.switchToChild('meta[property="og:type"]', true)
  const ogType = parser.attrEnum('content', ['video.movie', 'video.tv_series'])
  if (!ogType) throw new Error(NOT_AVAILABLE_ERROR)

  // Title
  parser.setParent(parent)
  parser.switchToChild('.b-post__title > h1', true)
  const title = parser.text()
  if (!title) throw new Error(NOT_AVAILABLE_ERROR)

  // Favs ID
  parser.setParent(parent)
  parser.switchToChild('#ctrl_favs', true)
  const favsId = parser.attr('value')
  if (!favsId) throw new Error(NOT_AVAILABLE_ERROR)

  // Original Title
  let originalTitle: string | null = null
  parser.setParent(parent)
  const originalTitleElem = parser.switchToChild('.b-post__origtitle')
  if (originalTitleElem) {
    originalTitle = parser.text()
  }

  // High Res Poster URL
  let highResPosterUrl: string | null = null
  parser.setParent(parent)
  const highResPosterUrlElem = parser.switchToChild('.b-sidecover > a')
  if (highResPosterUrlElem) {
    highResPosterUrl = parser.attr('href')
  }

  // Poster URL
  let posterUrl: string | null = null
  parser.setParent(parent)
  const posterUrlElem = parser.switchToChild('.b-sidecover > a > img')
  if (posterUrlElem) {
    posterUrl = parser.attr('src')
  }

  // Last Info Update
  let lastInfo: string | null = null
  parser.setParent(parent)
  const lastInfoElem = parser.switchToChild('.b-post__infolast')
  if (lastInfoElem) {
    lastInfo = parser.text()
  }

  // Duration
  let duration: number | null = null
  parser.setParent(parent)
  const durationElem = parser.switchToChild('[itemprop="duration"]')
  if (durationElem) {
    const parsedDuration = parseInt(parser.text()?.replaceAll(' мин.', '') || '')
    if (!isNaN(parsedDuration)) {
      duration = parsedDuration
    }
  }

  // Description
  let description: string | null = null
  parser.setParent(parent)
  const descriptionElem = parser.switchToChild('.b-post__description_text')
  if (descriptionElem) {
    description = parser.text()
  }

  // Slogan
  const slogan = parseItemTableText(parser, parent, 'Слоган')

  // Release Date
  const releaseDate = parseItemTableText(parser, parent, 'Дата выхода')

  // Country
  const country = parseItemTableText(parser, parent, 'Страна')

  // Quality
  const quality = parseItemTableText(parser, parent, 'В качестве')

  // Age Rating
  const ageRating = parseItemTableText(parser, parent, 'Возраст')

  // IMDB Rating
  const imdbRating = parseItemRating(parser, parent, 'imdb')

  // Kinopoisk Rating
  const kinopoiskRating = parseItemRating(parser, parent, 'kp')

  // Best of ...
  const bestOf = parseItemCollections(parser, parent, 'Входит в списки')

  // Collections
  const collections = parseItemCollections(parser, parent, 'Из серии')

  // Directors
  const directors = parseItemPersons(parser, parent, 'director')

  // Actors
  const actors = parseItemPersons(parser, parent, 'actor')

  // Genres
  const genreIds: string[] = []
  parser.setParent(parent)
  const genres = parser.all('[itemprop="genre"]')
  for (const genre of genres) {
    if (!genre.parentElement) continue
    parser.setParent(genre.parentElement)
    const url = parser.attr('href')
    if (!url) continue
    const genreId = url.replaceAll('https://rezka.ag/', '').slice(0, -1).split('/')[1]
    if (!genreId) continue
    genreIds.push(genreId)
  }

  // Franchise
  let franchise: ItemFranchise | null = null
  parser.setParent(parent)
  const franchiseLinkElem = parser.switchToChild('.b-post__franchise_link_title')
  if (franchiseLinkElem) {
    const url = parser.attr('href')
    const title = parser.text()
    if (url && title) {
      parser.setParent(parent)

      const items: ItemFranchiseItem[] = []
      const franchiseItems = parser.all('.b-post__partcontent_item')
      for (const franchiseItem of franchiseItems) {
        try {
          parser.setParent(franchiseItem)

          // URL
          const isCurrent = parser.contains('current')
          let ids = fullId
          if (!isCurrent) {
            const url = parser.attr('data-url') || ''
            if (!url) continue
            const currentIds = parseUrlToIds(url)
            if (!currentIds) continue
            ids = currentIds
          }

          // Order
          parser.switchToChild('.num', true)
          const orderStr = parser.text()
          if (!orderStr) continue
          const order = parseInt(orderStr)
          if (isNaN(order)) continue

          // Title
          parser.setParent(franchiseItem)
          parser.switchToChild('.title', true)
          const title = parser.text()
          if (!title) continue

          // Year
          parser.setParent(franchiseItem)
          const yearElem = parser.switchToChild('.year')
          let year: null | number = null
          if (yearElem) {
            const yearStr = parser.text()
            if (yearStr) {
              year = parseInt(yearStr)
              if (isNaN(year)) year = null
            }
          }

          // Kinopoisk Rating
          parser.setParent(franchiseItem)
          const ratingElem = parser.switchToChild('.rating')
          let rating: null | number = null
          if (ratingElem) {
            const ratingStr = parser.text()
            if (ratingStr) {
              rating = parseFloat(ratingStr)
              if (isNaN(rating)) rating = null
            }
          }

          items.push({ ...ids, order, title, isCurrent, year, rating })
        } catch {
          continue
        }
      }
      items.sort((a, b) => a.order - b.order)
      franchise = { title, url, items }
    }
  }

  // Translators
  const translators = parseItemTranslators(document, parser, parent, ogType === 'video.tv_series')

  return {
    ...fullId,
    ogType,
    title,
    favsId,
    translators,
    franchise,

    originalTitle,
    highResPosterUrl,
    posterUrl,
    lastInfo,
    duration,
    description,
    slogan,
    releaseDate,
    country,
    quality,
    ageRating,
    imdbRating,
    kinopoiskRating,
    bestOf,
    collections,
    directors,
    actors,
    genreIds,
  }
}

function parseStreamSubtitles(
  subtitle: string | false,
  subtitleLns: Record<string, string> | false,
): StreamSubtitle[] {
  const results: StreamSubtitle[] = [{ id: null, title: null, url: null }]
  if (!subtitle || !subtitleLns) return results
  const entries = subtitle.split(',')
  for (const entry of entries) {
    const [title, url] = entry
      .slice(1)
      .split(']')
      .map((v) => v.trim())
    if (!title || !url) continue
    try {
      new URL(url)
      const id = subtitleLns[title]
      if (!id) continue
      results.push({ id, title, url })
    } catch {
      continue
    }
  }
  return results
}

function parseStreamQualities(url: string) {
  const trashList = ['@', '#', '!', '^', '$']
  const two = unite(product(trashList, 2))
  const tree = unite(product(trashList, 3))
  const trashCodesSet = two.concat(tree)

  const arr = url.replace('#h', '').split('//_//')
  let trashString = arr.join('')

  for (const codeSet of trashCodesSet) {
    trashString = trashString.replaceAll(stringToBase64(codeSet), '')
  }

  const finalString = base64ToString(trashString)
  const qualitiesArr = finalString.split(',')
  const qualities: StreamQuality[] = []
  const seenUrls: string[] = []
  for (const quality of qualitiesArr) {
    const [qualityId, urls] = quality.slice(1).split(']')
    const [streamUrl, downloadUrl] = urls.split(' or ')
    if (seenUrls.includes(streamUrl) || seenUrls.includes(downloadUrl)) continue
    seenUrls.push(streamUrl, downloadUrl)
    const id = qualityId.replaceAll('4K', '2160p').replaceAll('2K', '1440p')
    let altername = null
    if (qualityId.includes('4K') || qualityId.includes('2K')) altername = qualityId
    if (qualityId.includes('1080p')) altername = 'HD'
    qualities.push({
      id,
      altername,
      streamUrl,
      downloadUrl,
      downloadSize: 0,
      downloadSizeStr: '0B',
    })
  }

  return qualities
}

export function parseStream(data: StreamSuccessResponse): Stream {
  return {
    subtitles: parseStreamSubtitles(data.subtitle, data.subtitle_lns),
    defaultSubtitle: data.subtitle_def || null,
    message: data.message,
    thumbnailsUrl: data.thumbnails,
    thumbnails: new Thumbnails(),
    qualities: parseStreamQualities(data.url),
    defaultQuality: data.quality,
  }
}

export function parseStreamSeasons(seasonsStr: string, episodesStr: string) {
  const doc = new DOMParser().parseFromString(
    `<div>
      <div id='parse-seasons'>${seasonsStr}</div>
      <div id='parse-episodes'>${episodesStr}</div>
    </div>`,
    'text/html',
  )
  const parser = new Parser(doc)

  // Seasons
  parser.switchToChild('#parse-seasons', true)
  const results: StreamSeason[] = []
  const seasons = parser.all('[data-tab_id]')
  for (const season of seasons) {
    parser.setParent(season)
    const number = parser.attrInt('data-tab_id')
    if (number === null) continue
    const title = parser.text() || 'Untitled'
    results.push({ number, title, episodes: [] })
  }

  // Episodes
  parser.setParent(doc)
  parser.switchToChild('#parse-episodes', true)
  const episodes = parser.all('[data-episode_id]')
  for (const episode of episodes) {
    parser.setParent(episode)
    const number = parser.attrInt('data-episode_id')
    if (number === null) continue
    const title = parser.text() || 'Untitled'
    const season = parser.attrInt('data-season_id')
    if (season === null) continue
    const seasonIndex = results.findIndex((s) => s.number === season)
    if (seasonIndex === -1) continue
    results[seasonIndex].episodes.push({ number, title })
  }

  results.sort((a, b) => a.number - b.number)
  results.forEach((season) => season.episodes.sort((a, b) => a.number - b.number))

  return results
}