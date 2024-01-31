import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('app') as HTMLDivElement
const root = createRoot(container)

root.render(<StrictMode></StrictMode>)
