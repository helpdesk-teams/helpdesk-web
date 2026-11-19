import { http, HttpResponse } from 'msw'
import { API_URL } from '@/config'

/**
 * All request handlers. Each handler describes one endpoint:
 * "when the app sends GET /api/health, answer with this JSON".
 * Auth, tickets and AI handlers are added in the next steps.
 */
export const handlers = [
  http.get(`${API_URL}/health`, () => HttpResponse.json({ status: 'ok', mocked: true })),
]
