import axios from 'axios'
import { API_URL } from '@/config'
import { toApiError } from './errors'
import { tokenStorage } from './tokenStorage'

/**
 * The one axios instance for the whole app.
 * Components never import it: they call functions from src/api/*.api.ts.
 *
 * Interceptors are hooks that run around every request:
 *   request  → add the access token
 *   response → turn any failure into ApiError
 * Automatic token refresh on 401 is added in the next step.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
)
