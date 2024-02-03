import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import type { Height } from 'react-animate-height'
import AnimateHeight from 'react-animate-height'

export function AutoHeight({ children }: PropsWithChildren) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<Height>('auto')

  useEffect(() => {
    const element = contentRef.current as HTMLDivElement

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.clientHeight)
    })

    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <AnimateHeight
      disableDisplayNone
      height={height}
      contentClassName='relative'
      contentRef={contentRef}
      delay={0}
      duration={400}
      easing='cubic-bezier(0.4, 0, 0.2, 1)'
    >
      {children}
    </AnimateHeight>
  )
}
