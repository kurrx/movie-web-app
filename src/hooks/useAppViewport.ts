import { useLayoutEffect } from 'react'

function getSizes(width = window.innerWidth, height = window.innerHeight) {
  return {
    vw: width / 100,
    vh: height / 100,
    vmin: Math.min(width, height) / 100,
    vmax: Math.max(width, height) / 100,
  }
}

export function useAppViewport() {
  useLayoutEffect(() => {
    const windowResize = () => {
      const sizes = getSizes(window.innerWidth, window.innerHeight)
      for (const [key, value] of Object.entries(sizes)) {
        document.body.style.setProperty(`--${key}`, `${value}px`)
        if (!window.visualViewport) {
          document.body.style.setProperty(`--visual-${key}`, `${value}px`)
        }
      }
    }
    const visualResize = () => {
      const sizes = getSizes(window.visualViewport?.width, window.visualViewport?.height)
      for (const [key, value] of Object.entries(sizes)) {
        document.body.style.setProperty(`--visual-${key}`, `${value}px`)
      }
    }

    windowResize()
    visualResize()

    window.addEventListener('resize', windowResize)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', visualResize)
    }

    return () => {
      window.removeEventListener('resize', windowResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', visualResize)
      }
      const sizes = getSizes(window.innerWidth, window.innerHeight)
      for (const key of Object.keys(sizes)) {
        document.body.style.removeProperty(`--${key}`)
        if (!window.visualViewport) {
          document.body.style.removeProperty(`--visual-${key}`)
        }
      }
    }
  }, [])
}
