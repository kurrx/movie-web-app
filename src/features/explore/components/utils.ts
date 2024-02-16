export function urlToRoute(url: string) {
  const instance = new URL(`${window.location.origin}/explore${url}`)
  let pathname = instance.pathname
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }
  return pathname + instance.search
}
