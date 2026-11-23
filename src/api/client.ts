import axios, { type InternalAxiosRequestConfig } from 'axios'
import { API_URL } from '@/config'
import type { TokenPairDto } from './dto'
import { createApiError, toApiError } from './errors'
import { tokenStorage } from './tokenStorage'

/**
 * The one axios instance for the whole app.
 * Components never import it: they call functions from src/api/*.api.ts.
 *
 * Interceptors are hooks that run around every request:
 *   request  → add the access token
 *   response → on 401, refresh the tokens once and retry; turn any failure into ApiError
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/* ---------- What to do when the session can't be restored ---------- */

let onSessionExpired: () => void = () => {}

/**
 * Registered once at startup (main.ts): clear the user and go to /login.
 * A callback instead of importing the router or the store here,
 * so this module doesn't depend on them (no circular imports).
 */
export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler
}

const SESSION_EXPIRED = () => createApiError('SESSION_EXPIRED', 401)

/* ---------- Refresh: one request, shared by everyone who waits ---------- */

/**
 * While a refresh is running, this holds its promise.
 * Five requests that get 401 at the same time all await this one promise,
 * instead of sending five /auth/refresh requests.
 */
let refreshing: Promise<string> | null = null

async function requestNewTokens(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) throw SESSION_EXPIRED()
  // Plain axios, not apiClient: the refresh request must not go through
  // our own interceptors (a 401 here would try to refresh again, forever)
  const { data } = await axios.post<TokenPairDto>(`${API_URL}/auth/refresh`, { refreshToken })
  tokenStorage.setTokens(data)
  return data.accessToken
}

function refreshAccessToken(): Promise<string> {
  refreshing ??= requestNewTokens().finally(() => {
    refreshing = null
  })
  return refreshing
}

/* ---------- Interceptors ---------- */

// 401 from these means "wrong password" or "bad refresh token", not "token expired"
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh']

interface RetriableConfig extends InternalAxiosRequestConfig {
  /** Set after one retry, so a request is never retried in a loop */
  _retried?: boolean
}

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetriableConfig | undefined
    const sentToken = String(config?.headers.Authorization ?? '').replace('Bearer ', '')
    const isExpiredToken =
      error.response?.status === 401 &&
      config &&
      sentToken && // no token sent = not signed in, nothing to refresh
      !config._retried &&
      !AUTH_ENDPOINTS.some((path) => config.url?.endsWith(path))

    if (!isExpiredToken) return Promise.reject(toApiError(error))

    config._retried = true
    try {
      // If another request already refreshed while this one was in flight,
      // the stored token is newer than the one we sent: just retry with it
      const current = tokenStorage.getAccessToken()
      const token = current && current !== sentToken ? current : await refreshAccessToken()

      config.headers.Authorization = `Bearer ${token}`
      return await apiClient(config)
    } catch (failure) {
      const apiError = toApiError(failure)
      // The retried request failed for another reason (e.g. 404), or the backend
      // is unreachable (status 0): report that, the session itself is still fine
      if (apiError.status !== 401) throw apiError

      // The refresh token was rejected (or there is none): the session is over
      tokenStorage.clear()
      onSessionExpired()
      throw SESSION_EXPIRED()
    }
  },
)
