import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Navbar, TooltipProvider } from '@/components'
import { FeaturesProvider, store } from '@/features'
import { useAppViewport } from '@/hooks'
import { RedirectView } from '@/views'

export function App() {
  useAppViewport()

  return (
    <StoreProvider store={store}>
      <FeaturesProvider>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <Navbar />
            <main id='content'>
              <Routes>
                <Route path='/' element={null} />
                <Route path='*' element={<RedirectView to='/' />} />
              </Routes>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </FeaturesProvider>
    </StoreProvider>
  )
}
