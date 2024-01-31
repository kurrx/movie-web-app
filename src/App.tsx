import '@/App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

export function App() {
  return (
    <BrowserRouter>
      <main id='content'>
        <Routes>
          <Route path='*' element={null} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
