import './index.css'
import '@fontsource/roboto-mono/700.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import IndexPage from './pages'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <IndexPage />
    </BrowserRouter>
  </StrictMode>,
)
