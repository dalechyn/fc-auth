import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { Demo } from './exports/index.js'

const domNode = document.getElementById('root')
if (!domNode) throw new Error('no root node')

const root = createRoot(domNode)

const queryClient = new QueryClient()
root.render(
  <QueryClientProvider client={queryClient}>
    <Demo />
  </QueryClientProvider>,
)
