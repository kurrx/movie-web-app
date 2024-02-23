import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Footer, Navbar, ScrollArea, TooltipProvider } from '@/components'
import {
  ExploreBestDialog,
  FeaturesProvider,
  LoginDialog,
  ProfileLastItem,
  SearchDialog,
  store,
} from '@/features'
import { useAppViewport } from '@/hooks'
import {
  ExploreCollectionsView,
  ExplorePersonView,
  ExploreView,
  HomeView,
  PolicyView,
  ProfileItemsView,
  ProfileView,
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
                <SearchDialog />
                <ExploreBestDialog />
                <LoginDialog />
                <ProfileLastItem />
                <Routes>
                  <Route index element={<HomeView />} />
                  <Route path='/policy' element={<PolicyView />} />
                  <Route path='/watch/:typeId/:genreId/:slug' element={<WatchView />} />

                  <Route path='/profile'>
                    <Route index element={<ProfileView />} />
                    <Route path='saved' element={<ProfileItemsView type='saved' />} />
                    <Route path='favorite' element={<ProfileItemsView type='favorite' />} />
                    <Route path='watched' element={<ProfileItemsView type='watched' />} />
                    <Route path='rated' element={<ProfileItemsView type='rated' />} />
                    <Route path='*' element={<RedirectView to='/profile' />} />
                  </Route>

                  <Route path='/explore'>
                    <Route path='collections'>
                      <Route index element={<ExploreCollectionsView />} />
                      <Route path='page/:page' element={<ExploreCollectionsView />} />
                    </Route>
                    <Route path='person/:personId' element={<ExplorePersonView />} />
                    <Route path='*' element={<ExploreView />} />
                  </Route>

                  <Route path='*' element={<RedirectView to='/' />} />
                </Routes>
              </main>
              <Footer />
            </ScrollArea>
          </FeaturesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  )
}
