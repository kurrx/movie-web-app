export const IS_PROD = import.meta.env.PROD
export const IS_DEV = import.meta.env.DEV

export const APP_NAME = import.meta.env.VITE_APP_NAME
export const APP_VERSION = import.meta.env.VITE_APP_VERSION

export const PROVIDER_URL = import.meta.env.VITE_PROVIDER_URL
export const PROVIDER_DOMAIN = PROVIDER_URL.replaceAll('https://', '').replaceAll('http://', '')
export const PROXY_URL = import.meta.env.VITE_PROXY_URL

export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY
export const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID
export const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
export const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID
export const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL

export const SOCIAL_GITHUB_URL = import.meta.env.VITE_SOCIAL_GITHUB_URL
export const SOCIAL_X_URL = import.meta.env.VITE_SOCIAL_X_URL
export const SOCIAL_PORTFOLIO_URL = import.meta.env.VITE_SOCIAL_PORTFOLIO_URL
