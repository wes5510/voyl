import './globals.css'
import '@fontsource/roboto-mono/700.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import IndexPage from './pages'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <IndexPage />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
