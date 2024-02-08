import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Footer, Navbar, ScrollArea, TooltipProvider } from '@/components'
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
            <ScrollArea hideBar>
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
            </ScrollArea>
          </FeaturesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  )
}
