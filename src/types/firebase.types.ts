export interface FirestoreModel {
  uid: string
  id: number
}

export interface FirestoreItem extends FirestoreModel {
  title: string
  url: string
  posterUrl: string
  description: string
  favorite: boolean
  saved: boolean
  watched: boolean
  duration?: number | null
  rating?: number | null
}

export interface FirestoreItemState extends FirestoreModel {
  uid: string
  id: number
  translatorId: number
  quality: string
  subtitle?: string | null
  season?: number | null
  episode?: number | null
}

export interface UpdateItemStateArgs {
  translatorId?: number | null
  quality?: string | null
  subtitle?: string | null
  season?: number | null
  episode?: number | null
}
