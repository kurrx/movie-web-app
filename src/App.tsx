import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Footer, Navbar, ScrollArea, TooltipProvider } from '@/components'
import { ExploreBestDialog, FeaturesProvider, LoginDialog, SearchDialog, store } from '@/features'
import { useAppViewport } from '@/hooks'
import { AuthMiddleware, VPNMiddleware } from '@/middlewares'
import {
  ExploreCollectionsView,
  ExplorePersonView,
  ExploreView,
  HomeView,
  PolicyView,
  RedirectView,
  WatchView,
} from '@/views'

export function App() {
  useAppViewport()

  return (
    <StoreProvider store={store}>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <FeaturesProvider>
            <Navbar />
            <ScrollArea hideBar id='app-scroll'>
              <main id='content'>
                <VPNMiddleware>
                  <SearchDialog />
                  <ExploreBestDialog />
                  <LoginDialog />
                  <Routes>
                    <Route path='/' element={<HomeView />} />
                    <Route path='/policy' element={<PolicyView />} />
                    <Route
                      path='/watch/:typeId/:genreId/:slug'
                      element={
                        <AuthMiddleware>
                          <WatchView />
                        </AuthMiddleware>
                      }
                    />
                    <Route path='/explore/collections' element={<ExploreCollectionsView />} />
                    <Route
                      path='/explore/collections/page/:page'
                      element={<ExploreCollectionsView />}
                    />
                    <Route path='/explore/person/:personId' element={<ExplorePersonView />} />
                    <Route path='/explore/*' element={<ExploreView />} />
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
