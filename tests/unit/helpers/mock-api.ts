import { MOCK_PASSWORD } from '../../../mocks/data/users'

/**
 * Small fetch helpers for testing the mock API directly.
 * Node's fetch needs an absolute URL; jsdom's page origin is http://localhost:3000.
 */
const url = (path: string) => new URL(`/api${path}`, location.origin)

export interface Res {
  status: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- tests read arbitrary JSON
  body: any
}

export async function call(
  method: string,
  path: string,
  { token, body }: { token?: string; body?: unknown } = {},
): Promise<Res> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url(path), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return { status: res.status, body: await res.json() }
}

/** Logs in a seed user and returns the access token */
export async function tokenFor(email: string): Promise<string> {
  const { body } = await call('POST', '/auth/login', { body: { email, password: MOCK_PASSWORD } })
  return body.accessToken
}

export const CLIENT = 'client@example.com'
export const CLIENT_2 = 'client2@example.com'
export const OPERATOR = 'operator@example.com'
