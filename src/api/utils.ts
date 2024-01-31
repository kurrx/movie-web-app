import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function disableReactDevtools() {
  if (!window || !window.document) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalHook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
  if (typeof globalHook !== 'function') return
  if (typeof globalHook !== 'object' || !globalHook) return
  for (const prop in globalHook) {
    if (prop === 'renderers') {
      globalHook[prop] = new Map()
      continue
    }
    globalHook[prop] = typeof globalHook[prop] === 'function' ? noop : null
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mediaQuery(query: string) {
  return window.matchMedia(query).matches
}
