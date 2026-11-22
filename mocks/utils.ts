import { HttpResponse } from 'msw'
import type { ErrorResponseDto } from '@/api/dto'
import { API_URL } from '@/config'
import { db } from './db'
import type { MockUser } from './data/users'

/** Full mock URL for an API path: apiPath('/auth/login') → '/api/auth/login' */
export const apiPath = (path: string) => `${API_URL}${path}`

/**
 * Error codes the fake server uses. The real list will come from the contract
 * (helpdesk-teams/helpdesk-backend#4); until then these are our assumption.
 */
export type MockErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'INVALID_REFRESH_TOKEN'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INVALID_TRANSITION'
  | 'TICKET_CLOSED'

/** Error in the contract format: { error: { code, message, details? } } */
export function apiError(
  status: number,
  code: MockErrorCode,
  message: string,
  details?: Record<string, string>,
) {
  return HttpResponse.json<ErrorResponseDto>({ error: { code, message, details } }, { status })
}

/* ---------- Fake tokens ---------- */

const MINUTE = 60 * 1000
const REFRESH_TTL_MS = 7 * 24 * 60 * MINUTE

/**
 * Access token lifetime: 15 minutes, like the real backend.
 * To watch the refresh flow in the browser, shorten it from the DevTools console:
 *   localStorage.setItem('mock:access-ttl-seconds', '10')
 */
function accessTtlMs(): number {
  try {
    const seconds = Number(globalThis.localStorage?.getItem('mock:access-ttl-seconds'))
    if (seconds > 0) return seconds * 1000
  } catch {
    // localStorage may be unavailable (e.g. in Node); use the default
  }
  return 15 * MINUTE
}

type TokenType = 'access' | 'refresh'

/*
 * A real backend signs a JWT. The mock only needs the same behavior:
 * the token says who the user is and when it expires.
 * Format: "mock.<type>.<userId>.<expiresAt>.<random>". Nothing is stored on the
 * "server", so tokens keep working after a page reload resets the mock db.
 */
function makeToken(type: TokenType, userId: string, ttlMs: number) {
  return ['mock', type, userId, Date.now() + ttlMs, crypto.randomUUID()].join('.')
}

export function issueTokens(userId: string) {
  return {
    accessToken: makeToken('access', userId, accessTtlMs()),
    refreshToken: makeToken('refresh', userId, REFRESH_TTL_MS),
  }
}

type TokenCheck = { user: MockUser } | { problem: 'invalid' | 'expired' }

export function checkToken(token: string | undefined | null, type: TokenType): TokenCheck {
  const [prefix, tokenType, userId, expiresAt] = token?.split('.') ?? []
  const user = db.users.find((u) => u.id === userId)
  if (prefix !== 'mock' || tokenType !== type || !user) return { problem: 'invalid' }
  if (Number(expiresAt) <= Date.now()) return { problem: 'expired' }
  return { user }
}

/**
 * Who sends the request? Reads "Authorization: Bearer <token>".
 * Returns the user, or a ready 401 response for the handler to return.
 */
export function requireUser(request: Request): MockUser | Response {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '')
  const result = checkToken(token, 'access')
  if ('user' in result) return result.user
  return result.problem === 'expired'
    ? apiError(401, 'TOKEN_EXPIRED', 'Сессия истекла')
    : apiError(401, 'UNAUTHORIZED', 'Требуется вход')
}
