import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore/lite'

import { FirestoreItemState, UpdateItemStateArgs, WatchItemState } from '@/types'

import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
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
export const statesRef = collection(firestore, 'states')

function convertState(document: FirestoreItemState) {
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

function serializeState(uid: string, id: number, state: WatchItemState) {
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

export async function getItemState(uid: string, id: number) {
  const docRef = doc(statesRef, `${uid}-${id}`)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return { state: null, exists: false }
  const document = docSnap.data() as FirestoreItemState
  return { state: convertState(document), exists: true }
}

export async function saveItemState(uid: string, id: number, state: WatchItemState) {
  const docRef = doc(statesRef, `${uid}-${id}`)
  const document = serializeState(uid, id, state)
  return await setDoc(docRef, document).catch(noop)
}

export async function updateItemState(uid: string, id: number, state: UpdateItemStateArgs) {
  if (Object.keys(state).length === 0) return
  const docRef = doc(statesRef, `${uid}-${id}`)
  const timestamp = state.timestamp
  if (typeof timestamp === 'number') {
    delete state.timestamp
    console.log(timestamp)
  }
  return await setDoc(docRef, state, { merge: true }).catch(noop)
}
