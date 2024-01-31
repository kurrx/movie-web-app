import { useEffect, useMemo } from 'react'

import { APP_NAME } from '@/api'

export function Title({ children }: { children: string }) {
  const title = useMemo(() => `${children} • ${APP_NAME}`, [children])

  useEffect(() => {
    document.title = title
    return () => {
      document.title = APP_NAME
    }
  }, [title])

  return null
}
