/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string

  readonly VITE_PROVIDER_URL: string
  readonly VITE_PROXY_URL: string

  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_DB_URL: string

  readonly VITE_SOCIAL_GITHUB_URL: string
  readonly VITE_SOCIAL_X_URL: string
  readonly VITE_SOCIAL_PORTFOLIO_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
