import { http, HttpResponse } from 'msw'
import { apiPath } from '../utils'
import { authHandlers } from './auth'

/**
 * All request handlers. Each handler describes one endpoint:
 * "when the app sends POST /api/auth/login, answer like this".
 * Tickets and AI handlers are added in the next step.
 */
export const handlers = [
  http.get(apiPath('/health'), () => HttpResponse.json({ status: 'ok', mocked: true })),
  ...authHandlers,
]
