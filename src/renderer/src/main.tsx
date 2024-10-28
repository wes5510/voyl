import './index.css'
import '@fontsource/roboto-mono/700.css'
import 'jotai-devtools/styles.css'
import { createRoot } from 'react-dom/client'
import App from './ui/App'
import { StrictMode } from 'react'
import { DevTools } from 'jotai-devtools'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <DevTools />
    <App />
  </StrictMode>,
)
