import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { disableReactDevtools, IS_PROD } from '@/api'

if (IS_PROD) {
  disableReactDevtools()
}

const container = document.getElementById('app') as HTMLDivElement
const root = createRoot(container)

root.render(<StrictMode></StrictMode>)
