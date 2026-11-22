import { describe, it, expect } from 'vitest'
import { ticketId } from '../../mocks/data/tickets'
import { USER_IDS } from '../../mocks/data/users'
import { classify } from '../../mocks/fake-ai'
import { call, tokenFor, CLIENT, CLIENT_2, OPERATOR } from './helpers/mock-api'

// Seed tickets: #1 classifying (Anna), #3 open billing (Anna), #4 open (Ivan),
// #11 waiting_for_client with an internal note (Anna), #14 resolved (Ivan), #17 closed (Anna)

describe('mock tickets API: reading', () => {
  it('a client sees only own tickets, an operator sees all', async () => {
    const anna = await call('GET', '/tickets?limit=100', { token: await tokenFor(CLIENT) })
    const olga = await call('GET', '/tickets?limit=100', { token: await tokenFor(OPERATOR) })

    expect(anna.body.items.every((t: { authorId: string }) => t.authorId === USER_IDS.anna)).toBe(
      true,
    )
    expect(anna.body.total).toBe(9)
    expect(olga.body.total).toBe(18)
  })

  it('filters, paginates and sorts newest first', async () => {
    const token = await tokenFor(OPERATOR)
    const open = await call('GET', '/tickets?status=open&category=billing', { token })
    expect(open.body.items.map((t: { id: string }) => t.id)).toEqual([ticketId(3)])

    const page2 = await call('GET', '/tickets?page=2&limit=5', { token })
    expect(page2.body.items).toHaveLength(5)
    expect(page2.body.total).toBe(18)
    const dates = page2.body.items.map((t: { createdAt: string }) => t.createdAt)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('hides internal comments from the client, shows them to the operator', async () => {
    const path = `/tickets/${ticketId(11)}`
    const anna = await call('GET', path, { token: await tokenFor(CLIENT) })
    const olga = await call('GET', path, { token: await tokenFor(OPERATOR) })

    expect(anna.body.comments.some((c: { isInternal: boolean }) => c.isInternal)).toBe(false)
    expect(olga.body.comments.some((c: { isInternal: boolean }) => c.isInternal)).toBe(true)
  })

  it("returns 403 for someone else's ticket and 404 for an unknown one", async () => {
    const token = await tokenFor(CLIENT_2)
    expect((await call('GET', `/tickets/${ticketId(3)}`, { token })).status).toBe(403)
    expect((await call('GET', '/tickets/no-such-id', { token })).status).toBe(404)
  })

  it('requires a token', async () => {
    expect((await call('GET', '/tickets')).status).toBe(401)
  })
})

describe('mock tickets API: changes', () => {
  it('a client creates a ticket in the "classifying" status; validation errors are per field', async () => {
    const token = await tokenFor(CLIENT)
    const created = await call('POST', '/tickets', {
      token,
      body: { title: 'Списали деньги дважды', description: 'Сегодня списали оплату два раза' },
    })
    expect(created.status).toBe(201)
    expect(created.body).toMatchObject({
      status: 'classifying',
      category: null,
      authorId: USER_IDS.anna,
    })

    const invalid = await call('POST', '/tickets', {
      token,
      body: { title: 'Hi', description: '' },
    })
    expect(invalid.status).toBe(400)
    expect(Object.keys(invalid.body.error.details).sort()).toEqual(['description', 'title'])
  })

  it('the fake AI classifies by keywords', () => {
    expect(classify('Списали деньги дважды', '')).toMatchObject({
      category: 'billing',
      priority: 'urgent',
    })
    expect(classify('Не могу войти', 'пароль не подходит')).toMatchObject({ category: 'account' })
    expect(classify('Привет', 'Просто хотел сказать спасибо')).toMatchObject({
      category: 'other',
      priority: 'low',
    })
  })

  it('status changes follow the allowed transitions', async () => {
    const olga = await tokenFor(OPERATOR)
    const path = `/tickets/${ticketId(3)}/status` // open
    expect((await call('PATCH', path, { token: olga, body: { status: 'closed' } })).status).toBe(
      409,
    )
    const ok = await call('PATCH', path, { token: olga, body: { status: 'in_progress' } })
    expect(ok.body.status).toBe('in_progress')
  })

  it('a client can only reopen a resolved ticket', async () => {
    const ivan = await tokenFor(CLIENT_2)
    const path = `/tickets/${ticketId(14)}/status` // resolved, Ivan's
    expect((await call('PATCH', path, { token: ivan, body: { status: 'closed' } })).status).toBe(
      409,
    )
    expect((await call('PATCH', path, { token: ivan, body: { status: 'open' } })).body.status).toBe(
      'open',
    )
  })

  it('an operator takes a ticket into work and fixes its category; a client cannot', async () => {
    const olga = await tokenFor(OPERATOR)
    const taken = await call('PATCH', `/tickets/${ticketId(4)}/assign`, { token: olga })
    expect(taken.body).toMatchObject({ assigneeId: USER_IDS.olga, status: 'in_progress' })

    const fixed = await call('PATCH', `/tickets/${ticketId(4)}/category`, {
      token: olga,
      body: { category: 'billing' },
    })
    expect(fixed.body.category).toBe('billing')

    const anna = await tokenFor(CLIENT)
    expect((await call('PATCH', `/tickets/${ticketId(3)}/assign`, { token: anna })).status).toBe(
      403,
    )
  })

  it("a client's reply moves waiting_for_client → in_progress; internal notes are staff-only", async () => {
    const anna = await tokenFor(CLIENT)
    const path = `/tickets/${ticketId(11)}/comments`
    const reply = await call('POST', path, { token: anna, body: { body: 'Первые цифры 427601' } })
    expect(reply.status).toBe(201)
    expect(reply.body).toMatchObject({ authorName: 'Анна Смирнова', isInternal: false })

    const ticket = await call('GET', `/tickets/${ticketId(11)}`, { token: anna })
    expect(ticket.body.status).toBe('in_progress')

    const internal = await call('POST', path, {
      token: anna,
      body: { body: 'x', isInternal: true },
    })
    expect(internal.status).toBe(403)
    const closed = await call('POST', `/tickets/${ticketId(17)}/comments`, {
      token: anna,
      body: { body: 'x' },
    })
    expect(closed.status).toBe(409)
  })

  it('an operator regenerates the AI draft', async () => {
    const olga = await tokenFor(OPERATOR)
    const before = await call('GET', `/tickets/${ticketId(3)}`, { token: olga })
    const res = await call('POST', `/ai/draft/${ticketId(3)}`, { token: olga })
    expect(res.status).toBe(200)
    expect(res.body.draft).not.toBe(before.body.aiDraft)

    const anna = await tokenFor(CLIENT)
    expect((await call('POST', `/ai/draft/${ticketId(3)}`, { token: anna })).status).toBe(403)
  })
})
