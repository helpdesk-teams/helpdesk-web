import { http, HttpResponse } from 'msw'
import { apiPath } from '../utils'
import { aiHandlers } from './ai'
import { authHandlers } from './auth'
import { commentHandlers } from './comments'
import { ticketHandlers } from './tickets'

/**
 * All request handlers. Each handler describes one endpoint:
 * "when the app sends POST /api/auth/login, answer like this".
 */
export const handlers = [
  http.get(apiPath('/health'), () => HttpResponse.json({ status: 'ok', mocked: true })),
  ...authHandlers,
  ...ticketHandlers,
  ...commentHandlers,
  ...aiHandlers,
]
