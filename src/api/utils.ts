import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { ItemFullID } from '@/types'

import { PROVIDER_URL } from './env'

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

const minuteInSeconds = 60
const hourInSeconds = 60 * minuteInSeconds
const dayInSeconds = 24 * hourInSeconds

export function toDoubleDigit(input: number) {
  return input < 10 ? `0${input}` : `${input}`
}

export function convertSeconds(input: number) {
  const days = Math.floor(input / dayInSeconds)
  const hours = Math.floor((input % dayInSeconds) / hourInSeconds)
  const minutes = Math.floor(((input % dayInSeconds) % hourInSeconds) / minuteInSeconds)
  const seconds = Math.floor(((input % dayInSeconds) % hourInSeconds) % minuteInSeconds)
  let result = `${toDoubleDigit(seconds)}`
  if (hours > 0 || days > 0) {
    result = `${toDoubleDigit(minutes)}:${result}`
    if (days > 0) {
      result = `${days}${toDoubleDigit(hours)}:${result}`
    } else {
      result = `${hours}:${result}`
    }
  } else {
    result = `${minutes}:${result}`
  }
  return result
}

export function transliterate(str: string) {
  return str
    .replace(/\u0401/g, 'YO')
    .replace(/\u0419/g, 'I')
    .replace(/\u0426/g, 'TS')
    .replace(/\u0423/g, 'U')
    .replace(/\u041A/g, 'K')
    .replace(/\u0415/g, 'E')
    .replace(/\u041D/g, 'N')
    .replace(/\u0413/g, 'G')
    .replace(/\u0428/g, 'SH')
    .replace(/\u0429/g, 'SCH')
    .replace(/\u0417/g, 'Z')
    .replace(/\u0425/g, 'H')
    .replace(/\u042A/g, '')
    .replace(/\u0451/g, 'yo')
    .replace(/\u0439/g, 'i')
    .replace(/\u0446/g, 'ts')
    .replace(/\u0443/g, 'u')
    .replace(/\u043A/g, 'k')
    .replace(/\u0435/g, 'e')
    .replace(/\u043D/g, 'n')
    .replace(/\u0433/g, 'g')
    .replace(/\u0448/g, 'sh')
    .replace(/\u0449/g, 'sch')
    .replace(/\u0437/g, 'z')
    .replace(/\u0445/g, 'h')
    .replace(/\u044A/g, "'")
    .replace(/\u0424/g, 'F')
    .replace(/\u042B/g, 'I')
    .replace(/\u0412/g, 'V')
    .replace(/\u0410/g, 'a')
    .replace(/\u041F/g, 'P')
    .replace(/\u0420/g, 'R')
    .replace(/\u041E/g, 'O')
    .replace(/\u041B/g, 'L')
    .replace(/\u0414/g, 'D')
    .replace(/\u0416/g, 'ZH')
    .replace(/\u042D/g, 'E')
    .replace(/\u0444/g, 'f')
    .replace(/\u044B/g, 'i')
    .replace(/\u0432/g, 'v')
    .replace(/\u0430/g, 'a')
    .replace(/\u043F/g, 'p')
    .replace(/\u0440/g, 'r')
    .replace(/\u043E/g, 'o')
    .replace(/\u043B/g, 'l')
    .replace(/\u0434/g, 'd')
    .replace(/\u0436/g, 'zh')
    .replace(/\u044D/g, 'e')
    .replace(/\u042F/g, 'Ya')
    .replace(/\u0427/g, 'CH')
    .replace(/\u0421/g, 'S')
    .replace(/\u041C/g, 'M')
    .replace(/\u0418/g, 'I')
    .replace(/\u0422/g, 'T')
    .replace(/\u042C/g, "'")
    .replace(/\u0411/g, 'B')
    .replace(/\u042E/g, 'YU')
    .replace(/\u044F/g, 'ya')
    .replace(/\u0447/g, 'ch')
    .replace(/\u0441/g, 's')
    .replace(/\u043C/g, 'm')
    .replace(/\u0438/g, 'i')
    .replace(/\u0442/g, 't')
    .replace(/\u044C/g, "'")
    .replace(/\u0431/g, 'b')
    .replace(/\u044E/g, 'yu')
}

export function refererFromId(fullId: ItemFullID) {
  return `${PROVIDER_URL}/${fullId.typeId}/${fullId.genreId}/${fullId.slug}.html`
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function wrap(min: number, max: number, value: number) {
  const rangeSize = max - min
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min
}
