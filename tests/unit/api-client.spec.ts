import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/node'
import { apiPath } from '../../mocks/utils'
import { MOCK_PASSWORD } from '../../mocks/data/users'
import { apiClient } from '@/api/client'
import { ApiError } from '@/api/errors'
import { tokenStorage } from '@/api/tokenStorage'
import { toTicketWithComments } from '@/api/adapters'
import type { AuthResponseDto, TicketWithCommentsDto } from '@/api/dto'

async function signIn() {
  const { data } = await apiClient.post<AuthResponseDto>('/auth/login', {
    email: 'client@example.com',
    password: MOCK_PASSWORD,
  })
  tokenStorage.setTokens(data)
  return data
}

/** Runs a request that must fail and returns the error it was rejected with */
async function failure(request: Promise<unknown>): Promise<ApiError> {
  const error = await request.then(
    () => null,
    (e: unknown) => e,
  )
  expect(error).toBeInstanceOf(ApiError)
  return error as ApiError
}

describe('apiClient', () => {
  it('adds the access token from tokenStorage to every request', async () => {
    await signIn()
    const { data } = await apiClient.get('/auth/me')
    expect(data).toMatchObject({ email: 'client@example.com', role: 'client' })
  })

  it('turns a contract error into ApiError with code and message', async () => {
    const error = await failure(apiClient.get('/auth/me')) // no token
    expect(error).toMatchObject({ status: 401, code: 'UNAUTHORIZED', message: 'Требуется вход' })
  })

  it('exposes per-field validation errors for forms', async () => {
    const error = await failure(
      apiClient.post('/auth/register', { email: 'bad', password: '1', name: '' }),
    )
    expect(error.status).toBe(400)
    expect(Object.keys(error.fieldErrors).sort()).toEqual(['email', 'name', 'password'])
  })

  it('gives a readable message for a non-contract server error', async () => {
    server.use(
      http.get(
        apiPath('/health'),
        () => new HttpResponse('<html>Bad Gateway</html>', { status: 502 }),
      ),
    )
    const error = await failure(apiClient.get('/health'))
    expect(error).toMatchObject({ status: 502, code: 'HTTP_502' })
    expect(error.message).toBe('Ошибка на сервере, попробуйте позже')
  })

  it('reports a network failure (backend down) as a network error', async () => {
    server.use(http.get(apiPath('/health'), () => HttpResponse.error()))
    const error = await failure(apiClient.get('/health'))
    expect(error.isNetworkError).toBe(true)
    expect(error.message).toMatch(/Сервер недоступен/)
  })
})

describe('tokenStorage', () => {
  it('stores, reads and clears both tokens', () => {
    tokenStorage.setTokens({ accessToken: 'a', refreshToken: 'r' })
    expect([tokenStorage.getAccessToken(), tokenStorage.getRefreshToken()]).toEqual(['a', 'r'])
    tokenStorage.clear()
    expect([tokenStorage.getAccessToken(), tokenStorage.getRefreshToken()]).toEqual([null, null])
  })
})

describe('adapters', () => {
  it('maps a ticket with comments from the server format to the app type', () => {
    const dto: TicketWithCommentsDto = {
      id: 't1',
      authorId: 'u1',
      assigneeId: null,
      title: 'Title',
      description: 'Description',
      status: 'open',
      category: 'billing',
      priority: 'high',
      aiConfidence: 0.9,
      aiDraft: 'Draft',
      createdAt: '2026-11-19T10:00:00.000Z',
      updatedAt: '2026-11-19T10:00:00.000Z',
      comments: [
        {
          id: 'c1',
          ticketId: 't1',
          authorId: 'u1',
          authorName: 'Анна',
          body: 'Hi',
          isInternal: false,
          createdAt: '2026-11-19T10:05:00.000Z',
        },
      ],
    }
    expect(toTicketWithComments(dto)).toEqual(dto)
  })
})
