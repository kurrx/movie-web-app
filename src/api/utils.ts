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

export function trimStr(str: string) {
  return str.replace(/ +(?= )/g, '').trim()
}

export function stringToBase64(str: string) {
  return Buffer.from(str, 'utf8').toString('base64')
}

export function base64ToString(base64: string) {
  return Buffer.from(base64, 'base64').toString('utf8')
}

export function unite(arr: string[][]) {
  const final: string[] = []
  for (const row of arr) {
    final.push(row.join(''))
  }
  return final
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function product(...args: any[]) {
  let argv = Array.prototype.slice.call(args)
  const argc = argv.length
  if (argc === 2 && !isNaN(argv[argc - 1])) {
    const copies = []
    for (let i = 0; i < argv[argc - 1]; i++) {
      copies.push(argv[0].slice()) // Clone
    }
    argv = copies
  }
  return argv.reduce(
    function tl(accumulator, value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tmp: any = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accumulator.forEach(function (a0: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value.forEach(function (a1: any) {
          tmp.push(a0.concat(a1))
        })
      })
      return tmp
    },
    [[]],
  )
}

export function bytesToStr(bytes: number, digits = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = digits < 0 ? 0 : digits
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
