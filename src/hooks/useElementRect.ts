import { RefObject, useEffect, useState } from 'react'

export interface ElementRect {
  width: number
  height: number
  x: number
  y: number
}

export function useElementRect(ref: RefObject<HTMLElement>, key?: string) {
  const [rect, setRect] = useState<ElementRect>({ width: 0, height: 0, x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) return
    const element = ref.current

    const onResize = () => {
      const rect = element.getBoundingClientRect()
      setRect({ width: rect.width, height: rect.height, x: rect.x, y: rect.y })
    }
    const observer = new ResizeObserver(onResize)

    onResize()
    window.addEventListener('resize', onResize)
    observer.observe(element)

    return () => {
      setRect({ width: 0, height: 0, x: 0, y: 0 })
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [ref])

  useEffect(() => {
    if (!key) return
    document.body.style.setProperty(`--${key}-width`, `${rect.width}px`)
    document.body.style.setProperty(`--${key}-height`, `${rect.height}px`)
    document.body.style.setProperty(`--${key}-x`, `${rect.x}px`)
    document.body.style.setProperty(`--${key}-y`, `${rect.y}px`)
    return () => {
      document.body.style.removeProperty(`--${key}-width`)
      document.body.style.removeProperty(`--${key}-height`)
      document.body.style.removeProperty(`--${key}-x`)
      document.body.style.removeProperty(`--${key}-y`)
    }
  }, [key, rect])

  return rect
}
