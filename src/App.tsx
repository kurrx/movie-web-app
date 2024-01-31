import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Footer, Navbar, TooltipProvider } from '@/components'
import { FeaturesProvider, store } from '@/features'
import { useAppViewport } from '@/hooks'
import { RedirectView } from '@/views'

export function App() {
  useAppViewport()

  return (
    <StoreProvider store={store}>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <FeaturesProvider>
            <Navbar />
            <main id='content'>
              <Routes>
                <Route path='/' element={null} />
                <Route path='*' element={<RedirectView to='/' />} />
              </Routes>
            </main>
            <Footer />
          </FeaturesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  )
}
