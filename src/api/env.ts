export const IS_PROD = import.meta.env.PROD
export const IS_DEV = import.meta.env.DEV

export const APP_NAME = import.meta.env.VITE_APP_NAME
export const APP_VERSION = import.meta.env.VITE_APP_VERSION

export const API_URL = import.meta.env.VITE_API_URL
export const PROVIDER_URL = import.meta.env.VITE_PROVIDER_URL
export const PROVIDER_DOMAIN = PROVIDER_URL.replaceAll('https://', '').replaceAll('http://', '')
export const PROXY_URL = import.meta.env.VITE_PROXY_URL
export const PROXY_IP = import.meta.env.VITE_PROXY_IP

export const SOCIAL_GITHUB_URL = import.meta.env.VITE_SOCIAL_GITHUB_URL
export const SOCIAL_X_URL = import.meta.env.VITE_SOCIAL_X_URL
export const SOCIAL_PORTFOLIO_URL = import.meta.env.VITE_SOCIAL_PORTFOLIO_URL
