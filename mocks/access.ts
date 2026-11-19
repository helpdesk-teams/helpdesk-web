import type { TicketDto } from '@/api/dto'
import { db } from './db'
import type { MockUser } from './data/users'
import { apiError } from './utils'

/** Operators and admins work with all tickets; clients only with their own */
export const isStaff = (user: MockUser) => user.role === 'operator' || user.role === 'admin'

export const canSee = (user: MockUser, ticket: TicketDto) =>
  isStaff(user) || ticket.authorId === user.id

/**
 * Finds a ticket the user is allowed to see.
 * Returns the ticket, or a ready 404 / 403 response for the handler to return.
 */
export function findTicketFor(user: MockUser, id: string): TicketDto | Response {
  const ticket = db.tickets.find((t) => t.id === id)
  if (!ticket) return apiError(404, 'NOT_FOUND', 'Обращение не найдено')
  if (!canSee(user, ticket)) return apiError(403, 'FORBIDDEN', 'Нет доступа к этому обращению')
  return ticket
}

export const staffOnly = () => apiError(403, 'FORBIDDEN', 'Действие доступно только операторам')

export function touch(ticket: TicketDto) {
  ticket.updatedAt = new Date().toISOString()
}
