import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { store, useAppTheme } from '@/features'

export function App() {
  useAppTheme()

  return (
    <StoreProvider store={store}>
      <BrowserRouter>
        <main id='content'>
          <Routes>
            <Route path='*' element={null} />
          </Routes>
        </main>
      </BrowserRouter>
    </StoreProvider>
  )
}
