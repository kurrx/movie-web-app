import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { parseSlugToId } from '@/api'
import { explore } from '@/features'
import { ItemID } from '@/types'

import { ErrorView } from './ErrorView'

export function WatchView() {
  const { typeId, genreId, slug } = useParams<Partial<ItemID>>()
  const validatedParams = useMemo(() => {
    if (!typeId || !genreId || !slug) return null
    const type = explore[typeId].title
    if (!type) return null
    const genre = explore[typeId].genres[genreId]
    if (!genre) return null
    const id = parseSlugToId(slug)
    if (!id) return null
    return { typeId, type, genreId, genre, slug, id }
  }, [typeId, genreId, slug])
  const key = useMemo(() => `${typeId}-${genreId}-${slug}`, [typeId, genreId, slug])

  if (!validatedParams) {
    return <ErrorView title='404' subtitle='Page not found.' docTitle='Not Found' />
  }

  return null
}
