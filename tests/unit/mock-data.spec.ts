import { describe, it, expect, beforeEach } from 'vitest'
import { db, resetDb, toPublicUser } from '../../mocks/db'
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '@/utils/constants'

describe('mock data', () => {
  beforeEach(() => resetDb())

  it('has 18 tickets covering every status, category and priority', () => {
    expect(db.tickets).toHaveLength(18)
    const used = (key: 'status' | 'category' | 'priority') => new Set(db.tickets.map((t) => t[key]))
    expect([...used('status')].sort()).toEqual([...TICKET_STATUSES].sort())
    for (const category of TICKET_CATEGORIES) expect(used('category')).toContain(category)
    for (const priority of TICKET_PRIORITIES) expect(used('priority')).toContain(priority)
  })

  it('leaves AI fields empty while a ticket is classifying', () => {
    for (const ticket of db.tickets.filter((t) => t.status === 'classifying')) {
      expect(ticket).toMatchObject({
        category: null,
        priority: null,
        aiConfidence: null,
        aiDraft: null,
      })
    }
  })

  it('links every ticket and comment to existing users and tickets', () => {
    const userIds = new Set(db.users.map((u) => u.id))
    const ticketIds = new Set(db.tickets.map((t) => t.id))
    const assigneeIds = db.tickets.flatMap((t) => (t.assigneeId ? [t.assigneeId] : []))
    for (const id of [...db.tickets.map((t) => t.authorId), ...assigneeIds]) {
      expect(userIds).toContain(id)
    }
    for (const c of db.comments) expect(ticketIds).toContain(c.ticketId)
  })

  it('resetDb() restores the seed data after changes', () => {
    db.tickets.pop()
    db.tickets[0]!.title = 'changed'
    resetDb()
    expect(db.tickets).toHaveLength(18)
    expect(db.tickets[0]!.title).not.toBe('changed')
  })

  it('never exposes passwords', () => {
    expect(toPublicUser(db.users[0]!)).not.toHaveProperty('password')
  })
})
