import type { User } from '@/types'
import { apiClient } from './client'
import { toUser } from './adapters'
import type { AuthResponseDto, UserDto } from './dto'
import type { Tokens } from './tokenStorage'

/**
 * Auth endpoints. These functions only talk to the server and translate the answer;
 * saving tokens and remembering the user is the auth store's job (stage 3).
 */

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
}

export interface AuthResult {
  user: User
  tokens: Tokens
}

const toAuthResult = ({ user, accessToken, refreshToken }: AuthResponseDto): AuthResult => ({
  user: toUser(user),
  tokens: { accessToken, refreshToken },
})

/** POST /auth/login */
export async function login(input: LoginInput): Promise<AuthResult> {
  const { data } = await apiClient.post<AuthResponseDto>('/auth/login', input)
  return toAuthResult(data)
}

/** POST /auth/register — creates a client account and signs it in */
export async function register(input: RegisterInput): Promise<AuthResult> {
  const { data } = await apiClient.post<AuthResponseDto>('/auth/register', input)
  return toAuthResult(data)
}

/** GET /auth/me — the user behind the stored access token */
export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<UserDto>('/auth/me')
  return toUser(data)
}
