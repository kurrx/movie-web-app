/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string

  readonly VITE_API_URL: string
  readonly VITE_PROVIDER_URL: string
  readonly VITE_PROXY_URL: string
  readonly VITE_PROXY_IP: string

  readonly VITE_SOCIAL_GITHUB_URL: string
  readonly VITE_SOCIAL_X_URL: string
  readonly VITE_SOCIAL_PORTFOLIO_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
