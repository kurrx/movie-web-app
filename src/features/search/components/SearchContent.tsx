import { AlertSuper, CommandGroup } from '@/components'
import { FetchState } from '@/core'
import { SearchQuery } from '@/types'

import { SearchItem } from './SearchItem'
import { SearchItemMore } from './SearchItemMore'
import { SearchItemSkeleton } from './SearchItemSkeleton'

export interface SearchContentProps {
  value: string
  item?: SearchQuery
  onSelect: (value: string) => void
  onRetry: () => void
}

export function SearchContent(props: SearchContentProps) {
  const { value, item, onSelect, onRetry } = props

  if (!value) return null

  if (item === undefined || item.state === FetchState.LOADING) {
    return (
      <CommandGroup heading='Loading...'>
        <SearchItemSkeleton />
        <SearchItemSkeleton />
        <SearchItemSkeleton />
        <SearchItemSkeleton />
      </CommandGroup>
    )
  }

  if (item.state === FetchState.ERROR) {
    return (
      <div className='p-4 relative'>
        <AlertSuper
          title={item.error?.name}
          buttonText='Retry'
          variant='destructive'
          onClick={onRetry}
        >
          {item.error?.message || 'Something went wrong'}
        </AlertSuper>
      </div>
    )
  }

  return (
    <CommandGroup heading='Result'>
      {!item.results || item.results.length === 0 ? (
        <div className='py-6 text-center text-sm'>No results found</div>
      ) : (
        item.results.map((item) => <SearchItem key={item.id} onSelect={onSelect} {...item} />)
      )}
      {item.paginated && <SearchItemMore query={item.query} onSelect={onSelect} />}
    </CommandGroup>
  )
}
