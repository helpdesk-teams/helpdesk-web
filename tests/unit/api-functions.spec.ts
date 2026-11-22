import { describe, it, expect } from 'vitest'
import { MOCK_PASSWORD, USER_IDS } from '../../mocks/data/users'
import { ticketId } from '../../mocks/data/tickets'
import { fetchMe, login, register } from '@/api/auth.api'
import {
  addComment,
  assignTicket,
  changeTicketCategory,
  changeTicketStatus,
  createTicket,
  getTicket,
  getTickets,
} from '@/api/tickets.api'
import { regenerateDraft } from '@/api/ai.api'
import { ApiError } from '@/api/errors'
import { tokenStorage } from '@/api/tokenStorage'

/** Signs in like the auth store will: call login(), keep the tokens */
async function signInAs(email: string) {
  const { user, tokens } = await login({ email, password: MOCK_PASSWORD })
  tokenStorage.setTokens(tokens)
  return user
}

const asClient = () => signInAs('client@example.com')
const asOperator = () => signInAs('operator@example.com')

describe('auth.api', () => {
  it('login returns the app user and a token pair', async () => {
    const { user, tokens } = await login({ email: 'client@example.com', password: MOCK_PASSWORD })
    expect(user).toEqual({
      id: USER_IDS.anna,
      email: 'client@example.com',
      name: 'Анна Смирнова',
      role: 'client',
    })
    expect(tokens).toEqual({ accessToken: expect.any(String), refreshToken: expect.any(String) })
  })

  it('register creates a client, fetchMe returns them by the stored token', async () => {
    const { tokens } = await register({
      email: 'new@example.com',
      password: 'secret123',
      name: 'Новый',
    })
    tokenStorage.setTokens(tokens)
    expect(await fetchMe()).toMatchObject({ email: 'new@example.com', role: 'client' })
  })

  it('a wrong password rejects with a readable ApiError', async () => {
    await expect(login({ email: 'client@example.com', password: 'nope' })).rejects.toMatchObject({
      name: 'ApiError',
      code: 'INVALID_CREDENTIALS',
      message: 'Неверный email или пароль',
    })
  })
})

describe('tickets.api', () => {
  it('getTickets passes filters and pagination', async () => {
    await asOperator()
    const page = await getTickets({ status: 'in_progress', limit: 2, page: 1 })
    expect(page.total).toBe(4)
    expect(page.items).toHaveLength(2)
    expect(page.items.every((t) => t.status === 'in_progress')).toBe(true)
  })

  it('createTicket, then getTicket returns it with an empty conversation', async () => {
    await asClient()
    const created = await createTicket({
      title: 'Не работает экспорт',
      description: 'При экспорте в CSV ничего не происходит',
    })
    expect(created.status).toBe('classifying')

    const loaded = await getTicket(created.id)
    expect(loaded).toMatchObject({ id: created.id, title: 'Не работает экспорт', comments: [] })
  })

  it('operator flow: assign → reply → wait for client → fix category', async () => {
    await asOperator()
    const id = ticketId(3) // open, billing

    expect((await assignTicket(id)).status).toBe('in_progress')
    const comment = await addComment(id, { body: 'Проверяем платёж' })
    expect(comment).toMatchObject({ authorName: 'Ольга Кузнецова', isInternal: false })
    expect((await changeTicketStatus(id, 'waiting_for_client')).status).toBe('waiting_for_client')
    expect((await changeTicketCategory(id, 'technical')).category).toBe('technical')
  })

  it('a forbidden transition rejects with ApiError 409', async () => {
    await asOperator()
    const error = await changeTicketStatus(ticketId(3), 'closed').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 409, code: 'INVALID_TRANSITION' })
  })
})

describe('ai.api', () => {
  it('regenerateDraft returns new draft text', async () => {
    await asOperator()
    const draft = await regenerateDraft(ticketId(3))
    expect(draft).toMatch(/^(Здравствуйте|Добрый день)/)
  })
})
