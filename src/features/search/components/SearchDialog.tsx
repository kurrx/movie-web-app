import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDebounce } from 'usehooks-ts'

import { trimStr } from '@/api'
import { CommandDialog, CommandInput, CommandList } from '@/components'
import { useStore, useStoreBoolean } from '@/hooks'

import { rezkaSearch, selectSearchOpen, selectSearchResult, setSearchOpen } from '../search.slice'
import { SearchContent } from './SearchContent'

export function SearchDialog() {
  const [dispatch, selector] = useStore()
  const open = selector(selectSearchOpen)
  const { set: onOpenChange, toggle, setFalse: close } = useStoreBoolean(setSearchOpen)
  const [selected, setSelected] = useState('')
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)
  const clearValue = useMemo(() => trimStr(debouncedValue).toLowerCase(), [debouncedValue])
  const item = selector((state) => selectSearchResult(state, clearValue))

  const onSelect = useCallback(
    (value: string) => {
      setSelected(value)
      close()
    },
    [close],
  )

  const search = useCallback(() => {
    const signal = dispatch(rezkaSearch(clearValue))
    return () => void signal.abort()
  }, [dispatch, clearValue])

  useEffect(search, [search])

  useHotkeys('meta+k', toggle, [toggle])

  return (
    <CommandDialog
      label='Search title'
      shouldFilter={false}
      value={selected}
      dialogProps={{ open, onOpenChange }}
      onValueChange={setSelected}
    >
      <CommandInput
        placeholder='Type a title...'
        value={value}
        border={!!clearValue}
        onValueChange={setValue}
      />
      <CommandList>
        <SearchContent value={clearValue} item={item} onRetry={search} onSelect={onSelect} />
      </CommandList>
    </CommandDialog>
  )
}
