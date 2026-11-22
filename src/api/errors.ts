import { isAxiosError } from 'axios'
import type { ErrorResponseDto } from './dto'

/**
 * The only error type pages and stores ever see from the API layer.
 * Whatever went wrong (server error, validation, no network), they get
 * a readable `message` to show and fields to decide what to do.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    /** HTTP status; 0 when there was no response at all */
    readonly status: number,
    /** Machine-readable code from the server, e.g. "INVALID_CREDENTIALS" */
    readonly code: string,
    /** Per-field messages for forms: { email: 'Некорректный email' } */
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

/** Fallback texts when the server didn't send its own message */
const STATUS_MESSAGES: Record<number, string> = {
  400: 'Проверьте введённые данные',
  401: 'Нужно войти в систему',
  403: 'Недостаточно прав для этого действия',
  404: 'Не найдено',
  409: 'Действие сейчас невозможно, обновите страницу',
  429: 'Слишком много запросов, попробуйте чуть позже',
}
const SERVER_ERROR_MESSAGE = 'Ошибка на сервере, попробуйте позже'
const NETWORK_ERROR_MESSAGE = 'Сервер недоступен. Проверьте подключение к интернету'
const TIMEOUT_MESSAGE = 'Сервер долго не отвечает, попробуйте ещё раз'

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

  if (!isAxiosError(error)) {
    return new ApiError(SERVER_ERROR_MESSAGE, 0, 'UNKNOWN')
  }

  // The request never got a response
  if (!error.response) {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
      ? new ApiError(TIMEOUT_MESSAGE, 0, 'TIMEOUT')
      : new ApiError(NETWORK_ERROR_MESSAGE, 0, 'NETWORK_ERROR')
  }

  const { status, data } = error.response
  if (isErrorBody(data)) {
    return new ApiError(
      data.error.message,
      status,
      data.error.code,
      toFieldErrors(data.error.details),
    )
  }
  // A response, but not in the contract format (e.g. a proxy's HTML error page)
  const message =
    status >= 500 ? SERVER_ERROR_MESSAGE : (STATUS_MESSAGES[status] ?? SERVER_ERROR_MESSAGE)
  return new ApiError(message, status, `HTTP_${status}`)
}
