import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/node'
import { apiPath, issueTokens } from '../../mocks/utils'
import { USER_IDS } from '../../mocks/data/users'
import { apiClient, setSessionExpiredHandler } from '@/api/client'
import { ApiError } from '@/api/errors'
import { tokenStorage } from '@/api/tokenStorage'

// A mock access token that expired a minute ago (format: mock.<type>.<userId>.<expiresAt>.<random>)
const expiredAccessToken = () => `mock.access.${USER_IDS.anna}.${Date.now() - 60_000}.x`

/** Anna is "signed in", but her access token has already expired */
function signInWithExpiredToken() {
  tokenStorage.setTokens({
    accessToken: expiredAccessToken(),
    refreshToken: issueTokens(USER_IDS.anna).refreshToken,
  })
}

/** Counts /auth/refresh calls while still answering like the normal mock */
function countRefreshCalls() {
  const calls = { count: 0 }
  server.use(
    http.post(apiPath('/auth/refresh'), async ({ request }) => {
      calls.count += 1
      const { refreshToken } = (await request.json()) as { refreshToken: string }
      if (!refreshToken.startsWith('mock.refresh.')) {
        return HttpResponse.json(
          { error: { code: 'INVALID_REFRESH_TOKEN', message: 'x' } },
          { status: 401 },
        )
      }
      return HttpResponse.json(issueTokens(USER_IDS.anna))
    }),
  )
  return calls
}

const onSessionExpired = vi.fn<() => void>()

describe('apiClient token refresh', () => {
  beforeEach(() => {
    onSessionExpired.mockReset()
    setSessionExpiredHandler(onSessionExpired)
  })

  it('refreshes an expired token and retries the request transparently', async () => {
    signInWithExpiredToken()
    const calls = countRefreshCalls()
    const oldRefreshToken = tokenStorage.getRefreshToken()

    const { data } = await apiClient.get('/auth/me')

    expect(data.name).toBe('Анна Смирнова')
    expect(calls.count).toBe(1)
    expect(tokenStorage.getRefreshToken()).not.toBe(oldRefreshToken) // new pair saved
    expect(onSessionExpired).not.toHaveBeenCalled()
  })

  it('sends only ONE refresh for several parallel requests', async () => {
    signInWithExpiredToken()
    const calls = countRefreshCalls()

    const results = await Promise.all([
      apiClient.get('/auth/me'),
      apiClient.get('/tickets'),
      apiClient.get('/tickets?status=open'),
      apiClient.get('/auth/me'),
    ])

    expect(results.every((r) => r.status === 200)).toBe(true)
    expect(calls.count).toBe(1)
  })

  it('logs out when the refresh token is rejected', async () => {
    tokenStorage.setTokens({ accessToken: expiredAccessToken(), refreshToken: 'garbage' })

    const error = await apiClient.get('/auth/me').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).code).toBe('SESSION_EXPIRED')
    expect(tokenStorage.getAccessToken()).toBeNull()
    expect(onSessionExpired).toHaveBeenCalledOnce()
  })

  it('keeps the session when the backend is unreachable during refresh', async () => {
    signInWithExpiredToken()
    server.use(http.post(apiPath('/auth/refresh'), () => HttpResponse.error()))

    const error = (await apiClient.get('/auth/me').catch((e: unknown) => e)) as ApiError

    expect(error.isNetworkError).toBe(true)
    expect(tokenStorage.getRefreshToken()).not.toBeNull()
    expect(onSessionExpired).not.toHaveBeenCalled()
  })

  it('does not try to refresh on a wrong password', async () => {
    const calls = countRefreshCalls()
    const error = (await apiClient
      .post('/auth/login', { email: 'client@example.com', password: 'wrong' })
      .catch((e: unknown) => e)) as ApiError

    expect(error.code).toBe('INVALID_CREDENTIALS')
    expect(calls.count).toBe(0)
    expect(onSessionExpired).not.toHaveBeenCalled()
  })

  it('does not retry forever when the new token is rejected too', async () => {
    signInWithExpiredToken()
    const calls = countRefreshCalls()
    // The endpoint keeps answering 401 no matter what token comes
    server.use(
      http.get(apiPath('/auth/me'), () =>
        HttpResponse.json({ error: { code: 'UNAUTHORIZED', message: 'x' } }, { status: 401 }),
      ),
    )

    const error = (await apiClient.get('/auth/me').catch((e: unknown) => e)) as ApiError

    expect(error.code).toBe('SESSION_EXPIRED')
    expect(calls.count).toBe(1)
  })
})
