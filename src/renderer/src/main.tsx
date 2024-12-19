import './index.css'
import '@fontsource/roboto-mono/700.css'
import 'jotai-devtools/styles.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { DevTools } from 'jotai-devtools'
import { BrowserRouter } from 'react-router'
import IndexPage from './pages/page'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <DevTools />
      <IndexPage />
    </BrowserRouter>
  </StrictMode>,
)
