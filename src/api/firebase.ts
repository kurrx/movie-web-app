import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import {
  child,
  DatabaseReference,
  getDatabase,
  onValue,
  ref,
  remove,
  runTransaction as runTransactionDB,
  set,
} from 'firebase/database'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  runTransaction,
  setDoc,
  startAfter,
  where,
} from 'firebase/firestore'

import {
  FirestoreItemState,
  FirestoreProfileItem,
  FirestoreProfileItemType,
  Item,
  LastItemState,
  ProfileCounters,
  QueryProfileItemsArgs,
  QueryProfileItemsResult,
  SearchItem,
  UpdateCounterAction,
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
  PROVIDER_URL,
} from './env'
import { parseUrlToIds } from './parser'
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
export const countersRef = ref(fireDatabase, 'counters')
export const lastRef = ref(fireDatabase, 'last')

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
    updatedAt: Date.now(),
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

function getItemStateRefs(uid: string, id: number, directTs = true) {
  return {
    ref: doc(statesCollection, `${uid}-${id}`),
    timestampRef: child(statesRef, directTs ? `${uid}/${id}/timestamp` : `${uid}/${id}`),
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
  return await set(ref, { timestamp, updatedAt: Date.now() }).catch(noop)
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
  const { ref, timestampRef } = getItemStateRefs(uid, id, false)
  const document = serializeItemState(uid, id, state)
  return await Promise.all([
    setDoc(ref, document).catch(noop),
    saveItemStateTimestamp(timestampRef, state.timestamp),
  ])
}

export async function updateItemState(uid: string, id: number, args: UpdateItemStateArgs) {
  const { ref, timestampRef } = getItemStateRefs(uid, id, false)
  const timestamp = args.timestamp
  if (typeof timestamp === 'number') {
    delete args.timestamp
    saveItemStateTimestamp(timestampRef, timestamp)
  }
  if (Object.keys(args).length === 0) return
  return await setDoc(ref, { ...args, updatedAt: Date.now() }, { merge: true }).catch(noop)
}

function convertProfileItem(document: FirestoreProfileItem) {
  return {
    favorite: document.favorite.value,
    saved: document.saved.value,
    watched: document.watched.value,
    rating: document.rating.value,
  }
}

function convertProfileItemToCard(document: FirestoreProfileItem): SearchItem {
  return {
    ...parseUrlToIds(`${PROVIDER_URL}${document.url}`)!,
    title: document.title,
    posterUrl: document.posterUrl,
    description: document.description,
    rating: document.kpRating || null,
    favorite: document.favorite.value,
    saved: document.saved.value,
    watched: document.watched.value,
    myRating: document.rating.value,
  }
}

function serializeProfileItem(uid: string, id: number, item: Item) {
  const year = item.year ? `${item.year}, ` : ''
  const country = item.country ? `${item.country}, ` : ''
  const now = Date.now()
  const document: FirestoreProfileItem = {
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

function getProfileCountersRef(uid: string) {
  return child(countersRef, uid)
}

export function subscribeProfileCounters(
  uid: string,
  callback: (counters: ProfileCounters | null) => void,
) {
  return onValue(getProfileCountersRef(uid), (snapshot) => {
    const value = snapshot.val()
    if (typeof value === 'object' && value !== null) {
      const counters: ProfileCounters = {
        total: value.total || 0,
        favorite: value.favorite || 0,
        saved: value.saved || 0,
        watched: value.watched || 0,
        rated: value.rated || 0,
        seriesType: value.seriesType || 0,
        moviesType: value.moviesType || 0,
        films: value.films || 0,
        cartoons: value.cartoons || 0,
        series: value.series || 0,
        animation: value.animation || 0,
      }
      callback(counters)
    } else {
      callback(null)
    }
  })
}

export async function getProfileItem(uid: string, id: number, item: Item) {
  const ref = getProfileItemRef(uid, id)
  const document = await getDoc(ref)
  if (document.exists()) {
    return convertProfileItem(document.data() as FirestoreProfileItem)
  }
  return convertProfileItem(serializeProfileItem(uid, id, item))
}

export async function updateProfileItem(
  uid: string,
  id: number,
  item: Item,
  args: UpdateProfileItemArgs,
) {
  if (Object.keys(args).length === 0) return
  const ref = getProfileItemRef(uid, id)
  const counterActions = await runTransaction(firestore, async (tx) => {
    const counterActions: UpdateCounterAction[] = []
    const document = await tx.get(ref)
    let updateDocument: FirestoreProfileItem
    if (!document.exists()) {
      updateDocument = serializeProfileItem(uid, id, item)
    } else {
      updateDocument = document.data() as FirestoreProfileItem
    }
    const now = Date.now()
    if (args.favorite !== undefined && args.favorite !== updateDocument.favorite.value) {
      updateDocument.favorite.value = args.favorite
      updateDocument.favorite.updatedAt = now
      counterActions.push({
        type: args.favorite ? 'increment' : 'decrement',
        counter: 'favorite',
      })
    }
    if (args.saved !== undefined && args.saved !== updateDocument.saved.value) {
      updateDocument.saved.value = args.saved
      updateDocument.saved.updatedAt = now
      counterActions.push({
        type: args.saved ? 'increment' : 'decrement',
        counter: 'saved',
      })
    }
    if (args.watched !== undefined && args.watched !== updateDocument.watched.value) {
      updateDocument.watched.value = args.watched
      updateDocument.watched.updatedAt = now
      counterActions.push({
        type: args.watched ? 'increment' : 'decrement',
        counter: 'watched',
      })
    }
    if (
      args.rating !== undefined &&
      ((args.rating === null && updateDocument.rating.value !== null) ||
        (args.rating !== null && updateDocument.rating.value === null))
    ) {
      updateDocument.rating.value = args.rating
      updateDocument.rating.updatedAt = now
      counterActions.push({
        type: args.rating ? 'increment' : 'decrement',
        counter: 'rated',
      })
    }
    if (counterActions.length === 0) return []
    const isFavorite = updateDocument.favorite.value
    const isSaved = updateDocument.saved.value
    const isWatched = updateDocument.watched.value
    const hasRating = updateDocument.rating.value !== null
    if (isFavorite || isSaved || isWatched || hasRating) {
      if (!document.exists()) {
        counterActions.push({
          type: 'increment',
          counter: 'total',
        })
        counterActions.push({
          type: 'increment',
          counter: updateDocument.isSeries ? 'seriesType' : 'moviesType',
        })
        counterActions.push({
          type: 'increment',
          counter: item.typeId as 'films' | 'cartoons' | 'series' | 'animation',
        })
      }
      await tx.set(ref, updateDocument)
    } else if (document.exists()) {
      counterActions.push({
        type: 'decrement',
        counter: 'total',
      })
      counterActions.push({
        type: 'decrement',
        counter: updateDocument.isSeries ? 'seriesType' : 'moviesType',
      })
      counterActions.push({
        type: 'decrement',
        counter: item.typeId as 'films' | 'cartoons' | 'series' | 'animation',
      })
      await tx.delete(ref)
    }
    return counterActions
  })

  if (counterActions.length === 0) return
  const countersRef = getProfileCountersRef(uid)
  await runTransactionDB(countersRef, (counters) => {
    if (!counters) counters = {}
    for (const action of counterActions) {
      if (action.type === 'increment') {
        if (typeof counters[action.counter] !== 'number') {
          counters[action.counter] = 0
        }
        counters[action.counter]++
      } else {
        if (typeof counters[action.counter] !== 'number') {
          counters[action.counter] = 1
        }
        counters[action.counter]--
        if (counters[action.counter] === 0) {
          delete counters[action.counter]
        }
      }
    }
    return counters
  })
}

function getProfileItemsQueryFor(
  uid: string,
  type: FirestoreProfileItemType,
  limitSize: number,
  last?: QueryDocumentSnapshot,
) {
  const constraints: QueryConstraint[] = [
    where('uid', '==', uid),
    type === 'rated'
      ? where('rating.value', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      : where(`${type}.value`, '==', true),
    orderBy(`${type === 'rated' ? 'rating' : type}.updatedAt`, 'desc'),
  ]
  if (last) {
    constraints.push(startAfter(last))
  }
  constraints.push(limit(limitSize))
  return query(profileItemsCollection, ...constraints)
}

export async function getProfileItems(uid: string, type: FirestoreProfileItemType) {
  const q = getProfileItemsQueryFor(uid, type, 6)
  const result = await getDocs(q)
  return result.docs.map((doc) => convertProfileItemToCard(doc.data() as FirestoreProfileItem))
}

export async function queryProfileItems(
  uid: string,
  args: QueryProfileItemsArgs,
): Promise<QueryProfileItemsResult> {
  const { type, limitSize = 12, last } = args
  const q = getProfileItemsQueryFor(uid, type, limitSize, last)
  const result = await getDocs(q)
  const newLast = result.docs[result.docs.length - 1]
  const items = result.docs.map((doc) =>
    convertProfileItemToCard(doc.data() as FirestoreProfileItem),
  )
  let next: null | (() => Promise<QueryProfileItemsResult>) = null
  if (items.length === limitSize) {
    next = async () => await queryProfileItems(uid, { type, limitSize, last: newLast })
  }
  return { items, next }
}

function getLastItemRef(uid: string) {
  return child(lastRef, uid)
}

export async function getLastItem(uid: string) {
  const last = await new Promise<LastItemState | null>((resolve) => {
    onValue(
      getLastItemRef(uid),
      (snapshot) => {
        const value = snapshot.val()
        if (typeof value === 'object' && value !== null) {
          resolve(value as LastItemState)
        } else {
          resolve(null)
        }
      },
      { onlyOnce: true },
    )
  })
  if (!last) return null
  const timestamp = await getItemStateTimestamp(getItemStateRefs(uid, last.id).timestampRef)
  last.progress = timestamp
  return last
}

export async function saveLastItem(uid: string, item: LastItemState | null) {
  const ref = getLastItemRef(uid)
  if (!item) {
    return await remove(ref).catch(noop)
  }
  return await set(ref, {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    url: item.url,
    thumbnails: item.thumbnails,
    duration: item.duration,
  }).catch(noop)
}
