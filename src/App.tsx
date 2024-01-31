import '@/App.css'

import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { store } from '@/features'

export function App() {
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
