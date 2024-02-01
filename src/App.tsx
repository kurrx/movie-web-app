import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Footer, Navbar, TooltipProvider } from '@/components'
import { FeaturesProvider, SearchDialog, store } from '@/features'
import { useAppViewport } from '@/hooks'
import { VPNMiddleware } from '@/middlewares'
import { HomeView, RedirectView, WatchView } from '@/views'

export function App() {
  useAppViewport()

  return (
    <StoreProvider store={store}>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <FeaturesProvider>
            <Navbar />
            <main id='content'>
              <VPNMiddleware>
                <SearchDialog />
                <Routes>
                  <Route path='/' element={<HomeView />} />
                  <Route path='/watch/:typeId/:genreId/:slug' element={<WatchView />} />
                  <Route path='*' element={<RedirectView to='/' />} />
                </Routes>
              </VPNMiddleware>
            </main>
            <Footer />
          </FeaturesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  )
}
