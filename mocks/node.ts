import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// The same handlers as in the browser, but for Vitest (Node has no Service Worker):
// MSW patches Node's network modules and answers requests made in tests.
export const server = setupServer(...handlers)
