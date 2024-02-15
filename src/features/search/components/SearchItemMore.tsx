import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components'

export interface SearchItemProps {
  query: string
  onSelect: (v: string) => void
}

export function SearchItemMore(props: SearchItemProps) {
  const { query, onSelect } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const value = useMemo(() => `[Load more] ${query}`, [query])
  const route = useMemo(
    () => `/explore/search?do=search&subaction=search&q=${query}&page=2`,
    [query],
  )

  const onClick = useCallback(() => {
    onSelect(value)
    if (pathname !== route) {
      navigate(route)
    }
  }, [navigate, onSelect, value, route, pathname])

  return (
    <Button className='w-full my-4' onClick={onClick}>
      Explore More
    </Button>
  )
}
