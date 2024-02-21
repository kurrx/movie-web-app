export interface FirestoreModel {
  uid: string
  id: number
}

interface ProfileItemField<T> {
  value: T
  updatedAt: number
}

export interface FirebaseProfileItem extends FirestoreModel {
  title: string
  isSeries: boolean
  url: string
  posterUrl: string
  description: string
  kpRating?: number | null
  favorite: ProfileItemField<boolean>
  saved: ProfileItemField<boolean>
  watched: ProfileItemField<boolean>
  rating: ProfileItemField<number | null | undefined>
}

export interface UpdateProfileItemArgs {
  lastWatched?: number
  favorite?: boolean
  saved?: boolean
  watched?: boolean
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
  timestamp?: number
  translatorId?: number
  quality?: string
  subtitle?: string | null
  season?: number | null
  episode?: number | null
}
