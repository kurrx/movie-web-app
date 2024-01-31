import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { FeaturesProvider, store } from '@/features'
import { useAppViewport } from '@/hooks'

export function App() {
  useAppViewport()

  return (
    <StoreProvider store={store}>
      <FeaturesProvider>
        <BrowserRouter>
          <main id='content'>
            <Routes>
              <Route path='*' element={null} />
            </Routes>
          </main>
        </BrowserRouter>
      </FeaturesProvider>
    </StoreProvider>
  )
}
