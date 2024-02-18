import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollTop() {
  const location = useLocation()

  useEffect(() => {
    const scrollElement = document.querySelector('#app-scroll > [data-radix-scroll-area-viewport]')
    if (!scrollElement) return
    scrollElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [location])
}
