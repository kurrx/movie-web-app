import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { child, DatabaseReference, getDatabase, onValue, ref, set } from 'firebase/database'
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  setDoc,
} from 'firebase/firestore/lite'

import {
  FirebaseProfileItem,
  FirestoreItemState,
  Item,
  UpdateItemStateArgs,
  UpdateProfileItemArgs,
  WatchItemState,
} from '@/types'

import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DB_URL,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from './env'
import { noop } from './utils'

export const firebaseApp = initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  databaseURL: FIREBASE_DB_URL,
})

const googleProvider = new GoogleAuthProvider()
export const firebaseAuth = getAuth(firebaseApp)
firebaseAuth.useDeviceLanguage()

export async function googleLogin() {
  return await signInWithPopup(firebaseAuth, googleProvider)
}

export async function googleLogout() {
  return await signOut(firebaseAuth)
}

export const firestore = getFirestore(firebaseApp)
export const statesCollection = collection(firestore, 'states')
export const profileItemsCollection = collection(firestore, 'profile-items')

export const fireDatabase = getDatabase(firebaseApp)
export const statesRef = ref(fireDatabase, 'states')

function convertItemState(document: FirestoreItemState) {
  const state: WatchItemState = {
    translatorId: document.translatorId,
    timestamp: 0,
    quality: document.quality,
    subtitle: null,
  }
  if (document.subtitle) {
    state.subtitle = document.subtitle
  }
  if (document.season && document.episode) {
    state.season = document.season
    state.episode = document.episode
  }
  return state
}

function serializeItemState(uid: string, id: number, state: WatchItemState) {
  const document: FirestoreItemState = {
    uid,
    id,
    translatorId: state.translatorId,
    quality: state.quality,
    subtitle: null,
    season: null,
    episode: null,
  }
  if (state.subtitle) {
    document.subtitle = state.subtitle
  }
  if (state.season && state.episode) {
    document.season = state.season
    document.episode = state.episode
  }
  return document
}

function getItemStateRefs(uid: string, id: number) {
  return {
    ref: doc(statesCollection, `${uid}-${id}`),
    timestampRef: child(statesRef, `${uid}/${id}/timestamp`),
  }
}

export async function getItemStateTimestamp(ref: DatabaseReference) {
  return new Promise<number>((resolve) => {
    onValue(
      ref,
      (snapshot) => {
        const value = snapshot.val()
        if (typeof value !== 'number') {
          return resolve(0)
        }
        return resolve(value)
      },
      { onlyOnce: true },
    )
  })
}

export async function saveItemStateTimestamp(ref: DatabaseReference, timestamp: number) {
  return await set(ref, timestamp).catch(noop)
}

export async function getItemState(uid: string, id: number) {
  const { ref, timestampRef } = getItemStateRefs(uid, id)
  const [document, timestamp] = await Promise.all([
    getDoc(ref),
    getItemStateTimestamp(timestampRef),
  ])
  if (!document.exists()) return { state: null, exists: false }
  const state = convertItemState(document.data() as FirestoreItemState)
  state.timestamp = timestamp
  return { state, exists: true }
}

export async function saveItemState(uid: string, id: number, state: WatchItemState) {
  const { ref, timestampRef } = getItemStateRefs(uid, id)
  const document = serializeItemState(uid, id, state)
  return await Promise.all([
    setDoc(ref, document).catch(noop),
    saveItemStateTimestamp(timestampRef, state.timestamp),
  ])
}

export async function updateItemState(uid: string, id: number, args: UpdateItemStateArgs) {
  const { ref, timestampRef } = getItemStateRefs(uid, id)
  const timestamp = args.timestamp
  if (typeof timestamp === 'number') {
    delete args.timestamp
    saveItemStateTimestamp(timestampRef, timestamp)
  }
  if (Object.keys(args).length === 0) return
  return await setDoc(ref, args, { merge: true }).catch(noop)
}

function convertProfileItem(document: FirebaseProfileItem) {
  return {
    favorite: document.favorite.value,
    saved: document.saved.value,
    watched: document.watched.value,
    rating: document.rating.value,
  }
}

function serializeProfileItem(uid: string, id: number, item: Item) {
  const year = item.year ? `${item.year}, ` : ''
  const country = item.country ? `${item.country}, ` : ''
  const now = Date.now()
  const document: FirebaseProfileItem = {
    uid,
    id,
    title: item.title,
    isSeries: item.itemType === 'series',
    url: `/${item.typeId}/${item.genreId}/${item.slug}`,
    posterUrl: item.posterUrl || item.highResPosterUrl || 'null',
    description: `${year}${country}${item.genre}`,
    kpRating: item.kinopoiskRating?.rate || null,
    favorite: {
      value: false,
      updatedAt: now,
    },
    saved: {
      value: false,
      updatedAt: now,
    },
    watched: {
      value: false,
      updatedAt: now,
    },
    rating: {
      value: null,
      updatedAt: now,
    },
  }
  return document
}

function getProfileItemRef(uid: string, id: number) {
  return doc(profileItemsCollection, `${uid}-${id}`)
}

export async function getProfileItem(uid: string, id: number, item: Item) {
  const ref = getProfileItemRef(uid, id)
  const document = await getDoc(ref)
  if (document.exists()) {
    return convertProfileItem(document.data() as FirebaseProfileItem)
  }
  return convertProfileItem(serializeProfileItem(uid, id, item))
}

export async function updateProfileItem(
  uid: string,
  id: number,
  item: Item,
  args: UpdateProfileItemArgs,
) {
  const ref = getProfileItemRef(uid, id)
  if (Object.keys(args).length === 0) return
  return await runTransaction(firestore, async (tx) => {
    const document = await tx.get(ref)
    let updateDocument: FirebaseProfileItem
    if (!document.exists()) {
      updateDocument = serializeProfileItem(uid, id, item)
    } else {
      updateDocument = document.data() as FirebaseProfileItem
    }
    const now = Date.now()
    if (args.favorite !== undefined) {
      updateDocument.favorite.value = args.favorite
      updateDocument.favorite.updatedAt = now
    }
    if (args.saved !== undefined) {
      updateDocument.saved.value = args.saved
      updateDocument.saved.updatedAt = now
    }
    if (args.watched !== undefined) {
      updateDocument.watched.value = args.watched
      updateDocument.watched.updatedAt = now
    }
    if (args.rating !== undefined) {
      updateDocument.rating.value = args.rating
      updateDocument.rating.updatedAt = now
    }
    const isFavorite = updateDocument.favorite.value
    const isSaved = updateDocument.saved.value
    const isWatched = updateDocument.watched.value
    const hasRating = updateDocument.rating.value !== null
    if (isFavorite || isSaved || isWatched || hasRating) {
      tx.set(ref, updateDocument)
    } else if (document.exists()) {
      tx.delete(ref)
    }
  })
}
