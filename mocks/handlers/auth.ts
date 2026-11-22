import { delay, http, HttpResponse } from 'msw'
import type { AuthResponseDto, TokenPairDto, UserDto } from '@/api/dto'
import { db, toPublicUser } from '../db'
import { apiError, apiPath, checkToken, issueTokens, requireUser } from '../utils'

interface RegisterBody {
  email?: string
  password?: string
  name?: string
}

interface LoginBody {
  email?: string
  password?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Same minimum as the current backend auth service
const MIN_PASSWORD_LENGTH = 8

/** Server-side validation: returns { field: message } or null when the body is valid */
function validateRegister({ email = '', password = '', name = '' }: RegisterBody) {
  const errors: Record<string, string> = {}
  if (!EMAIL_RE.test(email)) errors.email = 'Некорректный email'
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`
  }
  if (name.trim().length < 2) errors.name = 'Укажите имя'
  return Object.keys(errors).length > 0 ? errors : null
}

export const authHandlers = [
  // POST /api/auth/register { email, password, name } → 201 { user, accessToken, refreshToken }
  http.post<never, RegisterBody>(apiPath('/auth/register'), async ({ request }) => {
    await delay() // a realistic network delay in the browser, ~0 in tests
    const body = await request.json()

    const errors = validateRegister(body)
    if (errors) return apiError(400, 'VALIDATION_ERROR', 'Проверьте поля формы', errors)

    const email = body.email!.toLowerCase()
    if (db.users.some((u) => u.email === email)) {
      return apiError(409, 'EMAIL_TAKEN', 'Пользователь с таким email уже зарегистрирован')
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      name: body.name!.trim(),
      role: 'client' as const, // only clients can sign up; operators are created by an admin
      password: body.password!,
    }
    db.users.push(user)

    return HttpResponse.json<AuthResponseDto>(
      { user: toPublicUser(user), ...issueTokens(user.id) },
      { status: 201 },
    )
  }),

  // POST /api/auth/login { email, password } → 200 { user, accessToken, refreshToken }
  http.post<never, LoginBody>(apiPath('/auth/login'), async ({ request }) => {
    await delay()
    const { email = '', password = '' } = await request.json()

    if (!email || !password) {
      return apiError(400, 'VALIDATION_ERROR', 'Введите email и пароль')
    }

    const user = db.users.find((u) => u.email === email.toLowerCase())
    // The same message for "no such user" and "wrong password",
    // so nobody can find out which emails are registered
    if (!user || user.password !== password) {
      return apiError(401, 'INVALID_CREDENTIALS', 'Неверный email или пароль')
    }

    return HttpResponse.json<AuthResponseDto>({ user: toPublicUser(user), ...issueTokens(user.id) })
  }),

  // POST /api/auth/refresh { refreshToken } → 200 { accessToken, refreshToken }
  http.post<never, { refreshToken?: string }>(apiPath('/auth/refresh'), async ({ request }) => {
    await delay()
    const { refreshToken } = await request.json()

    const result = checkToken(refreshToken, 'refresh')
    if (!('user' in result)) {
      return apiError(401, 'INVALID_REFRESH_TOKEN', 'Сессия истекла, войдите снова')
    }
    return HttpResponse.json<TokenPairDto>(issueTokens(result.user.id))
  }),

  // GET /api/auth/me → 200 { id, email, name, role }
  http.get(apiPath('/auth/me'), async ({ request }) => {
    await delay()
    const user = requireUser(request)
    if (user instanceof Response) return user
    return HttpResponse.json<UserDto>(toPublicUser(user))
  }),
]
