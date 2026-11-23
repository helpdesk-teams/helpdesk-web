import { isAxiosError } from 'axios'
import { i18n } from '@/i18n'
import type { ErrorResponseDto } from './dto'

/**
 * The only error type pages and stores ever see from the API layer.
 * Whatever went wrong (server error, validation, no network), they get
 * a readable `message` in the UI language and fields to decide what to do.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    /** HTTP status; 0 when there was no response at all */
    readonly status: number,
    /** Machine-readable code, e.g. "INVALID_CREDENTIALS" */
    readonly code: string,
    /** Per-field messages for forms: { email: '…' } (as sent by the server) */
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /** No response: backend down, no internet, CORS, timeout */
  get isNetworkError() {
    return this.status === 0
  }
}

/**
 * The text to show, in the current UI language:
 * 1. a translation of the code (errors.code.INVALID_CREDENTIALS) — the server
 *    may answer in any language, but the code is the same for everyone
 * 2. the server's own message, for codes we don't know yet
 * 3. a general text by HTTP status
 */
function messageFor(code: string, status: number, serverMessage?: string): string {
  const { t, te } = i18n.global
  if (te(`errors.code.${code}`)) return t(`errors.code.${code}`)
  if (serverMessage) return serverMessage
  if (status < 500 && te(`errors.status.http${status}`)) return t(`errors.status.http${status}`)
  return t('errors.server')
}

/** Builds an ApiError with a translated message */
export function createApiError(
  code: string,
  status: number,
  {
    serverMessage,
    fieldErrors,
  }: { serverMessage?: string; fieldErrors?: Record<string, string> } = {},
) {
  return new ApiError(messageFor(code, status, serverMessage), status, code, fieldErrors)
}

function isErrorBody(data: unknown): data is ErrorResponseDto {
  return typeof (data as ErrorResponseDto | undefined)?.error?.message === 'string'
}

/** Field errors only when `details` is a flat { field: message } object */
function toFieldErrors(details: unknown): Record<string, string> {
  if (!details || typeof details !== 'object') return {}
  return Object.fromEntries(
    Object.entries(details).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

/** Turns anything thrown by axios (or our code) into an ApiError */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (!isAxiosError(error)) return createApiError('UNKNOWN', 0)

  // The request never got a response
  if (!error.response) {
    const timedOut = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
    return createApiError(timedOut ? 'TIMEOUT' : 'NETWORK_ERROR', 0)
  }

  const { status, data } = error.response
  if (isErrorBody(data)) {
    return createApiError(data.error.code, status, {
      serverMessage: data.error.message,
      fieldErrors: toFieldErrors(data.error.details),
    })
  }
  // A response, but not in the contract format (e.g. a proxy's HTML error page)
  return createApiError(`HTTP_${status}`, status)
}
