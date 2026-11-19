import { describe, it, expect, vi, afterEach } from 'vitest'
import { MOCK_PASSWORD } from '../../mocks/data/users'

// Node's fetch needs an absolute URL; jsdom's page origin is http://localhost:3000
const url = (path: string) => new URL(`/api${path}`, location.origin)

async function post(path: string, body: unknown) {
  const res = await fetch(url(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, body: await res.json() }
}

async function getMe(accessToken: string) {
  const res = await fetch(url('/auth/me'), { headers: { Authorization: `Bearer ${accessToken}` } })
  return { status: res.status, body: await res.json() }
}

const login = () => post('/auth/login', { email: 'client@example.com', password: MOCK_PASSWORD })

describe('mock auth API', () => {
  afterEach(() => vi.useRealTimers())

  it('logs in a seed user and returns tokens without the password', async () => {
    const { status, body } = await login()
    expect(status).toBe(200)
    expect(body.user).toMatchObject({ email: 'client@example.com', role: 'client' })
    expect(body.user).not.toHaveProperty('password')
    expect(body.accessToken).toEqual(expect.any(String))
    expect(body.refreshToken).toEqual(expect.any(String))
  })

  it('rejects a wrong password with 401 in the contract error format', async () => {
    const { status, body } = await post('/auth/login', {
      email: 'client@example.com',
      password: 'wrong',
    })
    expect(status).toBe(401)
    expect(body).toEqual({ error: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }) })
  })

  it('registers a new client and then logs in', async () => {
    const reg = await post('/auth/register', {
      email: 'New@Example.com',
      password: 'secret123',
      name: 'Новый',
    })
    expect(reg.status).toBe(201)
    expect(reg.body.user).toMatchObject({ email: 'new@example.com', role: 'client' })

    const again = await post('/auth/login', { email: 'new@example.com', password: 'secret123' })
    expect(again.status).toBe(200)
  })

  it('returns field errors for an invalid sign-up and 409 for a taken email', async () => {
    const invalid = await post('/auth/register', { email: 'nope', password: '1', name: '' })
    expect(invalid.status).toBe(400)
    expect(Object.keys(invalid.body.error.details).sort()).toEqual(['email', 'name', 'password'])

    const taken = await post('/auth/register', {
      email: 'client@example.com',
      password: 'secret123',
      name: 'Анна',
    })
    expect(taken.status).toBe(409)
    expect(taken.body.error.code).toBe('EMAIL_TAKEN')
  })

  it('/auth/me works with a fresh token, says TOKEN_EXPIRED after 15 minutes', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }) // move the clock, keep real timers for fetch
    const { body } = await login()

    expect((await getMe(body.accessToken)).body.email).toBe('client@example.com')

    vi.setSystemTime(Date.now() + 16 * 60 * 1000)
    const expired = await getMe(body.accessToken)
    expect(expired.status).toBe(401)
    expect(expired.body.error.code).toBe('TOKEN_EXPIRED')
  })

  it('/auth/refresh gives a new working token pair, rejects an access token', async () => {
    const { body } = await login()

    const refreshed = await post('/auth/refresh', { refreshToken: body.refreshToken })
    expect(refreshed.status).toBe(200)
    expect((await getMe(refreshed.body.accessToken)).status).toBe(200)

    const wrong = await post('/auth/refresh', { refreshToken: body.accessToken })
    expect(wrong.status).toBe(401)
    expect(wrong.body.error.code).toBe('INVALID_REFRESH_TOKEN')
  })

  it('/auth/me without a token is 401 UNAUTHORIZED', async () => {
    const res = await fetch(url('/auth/me'))
    expect(res.status).toBe(401)
    expect((await res.json()).error.code).toBe('UNAUTHORIZED')
  })
})
