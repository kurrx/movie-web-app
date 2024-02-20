import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { child, DatabaseReference, getDatabase, onValue, ref, set } from 'firebase/database'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore/lite'

import { FirestoreItemState, UpdateItemStateArgs, WatchItemState } from '@/types'

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

export async function updateItemState(uid: string, id: number, state: UpdateItemStateArgs) {
  const { ref, timestampRef } = getItemStateRefs(uid, id)
  const timestamp = state.timestamp
  if (typeof timestamp === 'number') {
    delete state.timestamp
    saveItemStateTimestamp(timestampRef, timestamp)
  }
  if (Object.keys(state).length === 0) return
  return await setDoc(ref, state, { merge: true }).catch(noop)
}
