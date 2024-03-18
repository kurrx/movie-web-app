import { Parser, Thumbnails } from '@/core'
import { explore } from '@/features'
import {
  BaseItem,
  ExploreCollectionItem,
  ExplorePagination,
  ExplorePersonItem,
  ExploreResponse,
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

import { PROVIDER_DOMAIN, PROXY_URL } from './env'
import { capitalizeFirstLetter, trimStr } from './utils'

const NOT_AVAILABLE_ERROR = 'Provider is not available. Try again later.'
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

export function parseComponentsToIds(typeId?: string, genreId?: string, slug?: string) {
  if (!typeId || !genreId || !slug) return null
  const type = explore[typeId].title
  if (!type) return null
  const genre = explore[typeId].genres[genreId]
  if (!genre) return null
  const id = parseSlugToId(slug)
  if (!id) return null
  return { typeId, type, genreId, genre, slug, id }
}

function parseSearchItems(parser: Parser, parent: ParentNode) {
  parser.setParent(parent)
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
    const itemPoster = parser.switchToChild('img')
    if (!itemPoster) continue
    const posterUrl = parser.attr('src')
    if (!posterUrl) continue

    // Rating
    parser.setParent(item)
    let rating: number | null = null
    const ratingElem = parser.switchToChild('.b-category-bestrating')
    if (ratingElem) {
      const ratingStr = parser.text()?.replaceAll('(', '').replaceAll(')', '').replaceAll(',', '.')
      if (ratingStr) {
        const ratingNumber = parseFloat(ratingStr)
        if (!isNaN(ratingNumber)) {
          rating = ratingNumber
        }
      }
    }

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
      rating,
    })
  }
  return results
}

export function parseSearchDocument(document: Document) {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)
  parser.switchToChild('.b-content__inline_items', true)

  parser.setParent(document)
  const paginated = parser.hasChild('.b-navigation')
  const results = parseSearchItems(parser, document)

  return { results, paginated }
}

function findFilterLinkWithText(parser: Parser, document: Document, text: string) {
  parser.setParent(document)
  const filters = parser.all('.b-content__main_filters a')
  for (const filter of filters) {
    parser.setParent(filter)
    if (parser.text() === text) {
      const link =
        parser
          .attr('href')
          ?.replaceAll('https://', '')
          .replaceAll('http://', '')
          .replaceAll(PROVIDER_DOMAIN, '') || 'current'
      const isActive = parser.contains('active')
      return [link, isActive] as const
    }
  }
  return [null, false] as const
}

function parseExplorePagination(parser: Parser, document: Document) {
  parser.setParent(document)
  parser.switchToChild('.b-navigation', true)
  const pagination: ExplorePagination = { pages: [] }
  const childs = parser.all(':scope > *')
  for (let i = 0; i < childs.length; i++) {
    const child = childs[i]
    parser.setParent(child)
    const link = parser
      .attr('href')
      ?.replaceAll('https://', '')
      .replaceAll('http://', '')
      .replaceAll(PROVIDER_DOMAIN, '')

    if (parser.hasChild('.b-navigation__prev')) {
      if (link) pagination.prev = link
      continue
    }
    if (parser.hasChild('.b-navigation__next')) {
      if (link) pagination.next = link
      continue
    }

    const page = parser.text()
    if (!page) continue
    if (page === '...') continue

    if (parser.isNextSibling('nav_ext') && i === 1) {
      if (link) pagination.firstPage = { page: '1', link }
      continue
    }
    if (parser.isPrevSibling('nav_ext') && i === childs.length - 2) {
      if (link) pagination.lastPage = { page, link }
      continue
    }

    pagination.pages.push({ page, link })
  }
  return pagination
}

export function parseExploreDocument(document: Document) {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)
  const { results, paginated } = parseSearchDocument(document)

  parser.switchToChild('.b-content__htitle', true)
  let title = parser.text()?.replaceAll(' в HD онлайн', '').replaceAll('Смотреть ', '')
  if (!title) throw new Error(NOT_AVAILABLE_ERROR)

  let pagination: ExplorePagination | undefined
  if (paginated) {
    pagination = parseExplorePagination(parser, document)
    const currentPage = pagination.pages.find((page) => !page.link)
    if (currentPage) {
      title = title.replaceAll(`, страница ${currentPage.page}`, '')
    }
  }

  title = capitalizeFirstLetter(trimStr(title))

  const response: ExploreResponse = { title, items: results, pagination }

  const [last, lastActive] = findFilterLinkWithText(parser, document, 'Последние поступления')
  const [popular, popularActive] = findFilterLinkWithText(parser, document, 'Популярные')
  const [soon, soonActive] = findFilterLinkWithText(parser, document, 'В ожидании')
  const [watching, watchingActive] = findFilterLinkWithText(parser, document, 'Сейчас смотрят')
  const isSomeSortActive = lastActive || popularActive || soonActive || watchingActive
  if (last && popular && soon && watching && isSomeSortActive) {
    let active: NonNullable<ExploreResponse['sort']>['active'] = 'last'
    if (popularActive) active = 'popular'
    if (soonActive) active = 'soon'
    if (watchingActive) active = 'watching'
    response.sort = {
      last,
      popular,
      soon,
      watching,
      active,
    }
  }

  const [all, allActive] = findFilterLinkWithText(parser, document, 'Все')
  const [films, filmsActive] = findFilterLinkWithText(parser, document, 'Фильмы')
  const [series, seriesActive] = findFilterLinkWithText(parser, document, 'Сериалы')
  const [cartoons, cartoonsActive] = findFilterLinkWithText(parser, document, 'Мультфильмы')
  const [animation, animationActive] = findFilterLinkWithText(parser, document, 'Аниме')
  const isFilterSomeActive =
    allActive || filmsActive || seriesActive || cartoonsActive || animationActive
  if (all && films && series && cartoons && animation && isFilterSomeActive) {
    let active: NonNullable<ExploreResponse['filter']>['active'] = 'all'
    if (filmsActive) active = 'films'
    if (seriesActive) active = 'series'
    if (cartoonsActive) active = 'cartoons'
    if (animationActive) active = 'animation'
    response.filter = {
      all,
      films,
      series,
      cartoons,
      animation,
      active,
    }
  }

  return response
}

export function parsePersonDocument(document: Document) {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)
  const parent = parser.switchToChild('.b-content__main', true)

  // Name
  parser.switchToChild('[itemprop="name"]', true)
  const name = parser.text()
  if (!name) throw new Error(NOT_AVAILABLE_ERROR)

  // English Name
  parser.setParent(parent)
  const engNameElem = parser.switchToChild('[itemprop="alternativeHeadline"]')
  let engName: string | null = null
  if (engNameElem) {
    engName = parser.text()
  }

  // Photo URL
  parser.setParent(parent)
  const photoUrlElem = parser.switchToChild('[itemprop="image"]')
  let photoUrl: string | null = null
  if (photoUrlElem) {
    photoUrl = parser.attr('src')
  }

  // Roles
  parser.setParent(parent)
  const roles: string[] = []
  const roleElements = parser.all('[itemprop="jobTitle"]')
  for (const roleElement of roleElements) {
    parser.setParent(roleElement)
    const role = parser.text()
    if (role) roles.push(capitalizeFirstLetter(role))
  }

  // Birth Date
  parser.setParent(parent)
  const birthDateElement = parser.switchToChild('[itemprop="birthDate"]')
  let birthDate: Date | null = null
  if (birthDateElement) {
    const birthDateStr = parser.attr('datetime')
    if (birthDateStr) {
      birthDate = new Date(birthDateStr)
      if (isNaN(birthDate.getTime())) {
        birthDate = null
      }
    }
  }

  // Birth Place
  const birthPlace = parseItemTableText(parser, parent, 'Место рождения')

  // Height
  const heightMeterStr = parseItemTableText(parser, parent, 'Рост')
  let height: number | null = null
  if (heightMeterStr) {
    const heightMeter = parseFloat(heightMeterStr.replaceAll(' м', ''))
    if (!isNaN(heightMeter)) {
      height = heightMeter * 100
    }
  }

  // Gallery
  parser.setParent(parent)
  const images = parser.all('.b-person__gallery_list a')
  const gallery: string[] = []
  for (const image of images) {
    parser.setParent(image)
    const url = parser.attr('href')
    if (url) gallery.push(url)
  }

  parser.setParent(parent)
  const rolesItems: ExplorePersonItem[] = []
  const careers = parser.all('.b-person__career')
  for (const career of careers) {
    parser.setParent(career)

    // Title
    const titleElem = parser.switchToChild('h2')
    if (!titleElem) continue
    const title = parser.text()
    if (!title) continue

    // Subtitle
    parser.setParent(career)
    const subtitleElem = parser.switchToChild('.b-person__career_stats')
    if (!subtitleElem) continue
    const subtitle = parser.text()
    if (!subtitle) continue

    // Items
    const items = parseSearchItems(parser, career)

    rolesItems.push({ title, subtitle, items })
  }

  return {
    name,
    engName,
    photoUrl,
    roles,
    birthDate,
    birthPlace,
    height,
    gallery,
    rolesItems,
  }
}

export function parseCollectionsDocument(document: Document) {
  const parser = new Parser(document)
  parser.setDefaultError(NOT_AVAILABLE_ERROR)

  // Title
  parser.switchToChild('.b-content__htitle', true)
  let title = parser.text()?.replaceAll(' в HD онлайн', '').replaceAll('Смотреть ', '')
  if (!title) throw new Error(NOT_AVAILABLE_ERROR)

  parser.setParent(document)
  const parent = parser.switchToChild('.b-content__main', true)

  // Pagination
  parser.setParent(parent)
  const paginated = parser.hasChild('.b-navigation')
  let pagination: ExplorePagination | undefined
  if (paginated) {
    pagination = parseExplorePagination(parser, document)
    const currentPage = pagination.pages.find((page) => !page.link)
    if (currentPage) {
      title = title.replaceAll(`, страница ${currentPage.page}`, '')
    }
  }

  // Items
  parser.setParent(parent)
  const items: ExploreCollectionItem[] = []
  const itemElems = parser.all('.b-content__collections_item')
  for (const itemElem of itemElems) {
    parser.setParent(itemElem)

    // URL
    let url = parser
      .attr('data-url')
      ?.replaceAll('https://', '')
      .replaceAll('http://', '')
      .replaceAll(PROVIDER_DOMAIN, '')
    if (!url) continue
    if (url.endsWith('/')) url = url.slice(0, -1)

    // Image URL
    const imageElem = parser.switchToChild('img')
    if (!imageElem) continue
    const imageUrl = parser.attr('src')
    if (!imageUrl) continue

    // Title
    parser.setParent(itemElem)
    const titleElem = parser.switchToChild('a')
    if (!titleElem) continue
    const title = parser.text()
    if (!title) continue

    // Count
    parser.setParent(itemElem)
    const countElem = parser.switchToChild('.num')
    if (!countElem) continue
    const countStr = parser.text()
    if (!countStr) continue
    const count = parseInt(countStr)
    if (isNaN(count)) continue

    items.push({ url, imageUrl, title, count })
  }

  return { title, items, pagination }
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
    const link = decodeURIComponent(atob(linkEncoded))

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
    const url = parser
      .attr('href')
      ?.replaceAll('https://', '')
      .replaceAll('http://', '')
      .replaceAll(PROVIDER_DOMAIN, '')
      .slice(0, -1)
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
      const url = parser
        .attr('href')
        ?.replaceAll('https://', '')
        .replaceAll('http://', '')
        .replaceAll(PROVIDER_DOMAIN, '')
        .slice(0, -1)
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

    // Is premium
    if (parser.contains('b-prem_translator')) continue

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

  // Year
  const td = findItemTableElementWithText(parser, parent, 'Дата выхода')
  let year: number | null = null
  if (td) {
    parser.setParent(td)
    const link = parser.switchToChild('a')
    if (link) {
      const link = parser.attr('href')
      if (link) {
        const yearStr = link
          .replaceAll('https://', '')
          .replaceAll('http://', '')
          .replaceAll(`${PROVIDER_DOMAIN}/year/`, '')
          .slice(0, -1)
        if (yearStr) {
          year = parseInt(yearStr)
          if (isNaN(year)) year = null
        }
      }
    }
  }

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
    const genreId = url
      .replaceAll('https://', '')
      .replaceAll('http://', '')
      .replaceAll(PROVIDER_DOMAIN + '/', '')
      .slice(0, -1)
      .split('/')[1]
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
    year,
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

const trashChars = ['$$#!!@#!@##', '^^^!@##!!##', '####^!!##!@@', '@@@@@!##!^^^', '$$!!@$$@^!@#$$@']
function parseStreamQualities(url: string) {
  let finalString = url.replace('#h', '')
  for (let i = 4; i >= 0; i--) {
    const trashStr = btoa(
      encodeURIComponent(trashChars[i]).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(Number('0x' + p1))
      }),
    )
    finalString = finalString.replace('//_//' + trashStr, '')
  }
  finalString = decodeURIComponent(
    atob(finalString)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(''),
  )

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
    if (qualityId === '4K' || qualityId === '2K') altername = qualityId
    if (qualityId === '1080p') altername = 'HD'
    qualities.push({
      id,
      altername,
      streamUrl: `${PROXY_URL}/${streamUrl}`,
      downloadUrl: `${PROXY_URL}/${downloadUrl}`,
      downloadSize: 0,
      downloadSizeStr: '0B',
    })
  }

  return qualities
}

export function parseStream(data: StreamSuccessResponse): Stream {
  if (!data.url) throw new Error(NOT_AVAILABLE_ERROR)
  return {
    detailsFetched: false,
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
