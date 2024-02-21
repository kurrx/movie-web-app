import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { parseComponentsToIds } from '@/api'
import { WatchContent } from '@/features'
import { AuthMiddleware } from '@/middlewares'
import { ItemID } from '@/types'

import { ErrorView } from './ErrorView'

export function WatchView() {
  const { typeId, genreId, slug } = useParams<Partial<ItemID>>()
  const fullId = useMemo(() => parseComponentsToIds(typeId, genreId, slug), [typeId, genreId, slug])
  const key = useMemo(() => `${typeId}-${genreId}-${slug}`, [typeId, genreId, slug])

  if (!fullId) {
    return <ErrorView title='404' subtitle='Page not found.' docTitle='Not Found' />
  }

  return (
    <AuthMiddleware>
      <WatchContent key={key} fullId={fullId} />
    </AuthMiddleware>
  )
}
