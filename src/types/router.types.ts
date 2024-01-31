export interface NavigationItemCollection {
  url: string
  title: string
}

export interface NavigationItem {
  title: string
  genres: Record<string, string>
  collections: NavigationItemCollection[]
}

export type Navigation = Record<string, NavigationItem>
