import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/node'
import { apiPath } from '../../mocks/utils'
import { apiClient } from '@/api/client'
import { ApiError } from '@/api/errors'
import { login } from '@/api/auth.api'
import { setLocale } from '@/i18n'

const failure = (request: Promise<unknown>) =>
  request.then(
    () => {
      throw new Error('expected the request to fail')
    },
    (e: unknown) => e as ApiError,
  )

describe('API error messages follow the UI language', () => {
  it('translates a known code, whatever language the server used', async () => {
    // The mock server answers in Russian; the UI is in English
    setLocale('en')
    const error = await failure(login({ email: 'client@example.com', password: 'wrong' }))
    expect(error.code).toBe('INVALID_CREDENTIALS')
    expect(error.message).toBe('Wrong email or password')
  })

  it("falls back to the server's message for an unknown code", async () => {
    server.use(
      http.get(apiPath('/health'), () =>
        HttpResponse.json(
          { error: { code: 'BRAND_NEW_CODE', message: 'Message from the server' } },
          { status: 422 },
        ),
      ),
    )
    const error = await failure(apiClient.get('/health'))
    expect(error.message).toBe('Message from the server')
  })

  it('uses a text by HTTP status for a non-contract response', async () => {
    server.use(http.get(apiPath('/health'), () => new HttpResponse('<html/>', { status: 403 })))
    expect((await failure(apiClient.get('/health'))).message).toBe(
      'Недостаточно прав для этого действия',
    )

    setLocale('en')
    expect((await failure(apiClient.get('/health'))).message).toBe(
      "You don't have permission to do this",
    )
  })

  it('translates network errors', async () => {
    setLocale('en')
    server.use(http.get(apiPath('/health'), () => HttpResponse.error()))
    const error = await failure(apiClient.get('/health'))
    expect(error.isNetworkError).toBe(true)
    expect(error.message).toMatch(/server is unreachable/)
  })
})
