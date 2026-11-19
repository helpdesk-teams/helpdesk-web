/**
 * App types: what pages, stores and components work with.
 *
 * They don't have to match the server 1:1. The wire format lives in src/api/dto.ts,
 * and adapters in src/api/adapters.ts translate between the two. If the backend
 * renames a field, these types (and everything using them) stay the same.
 */
import type { Role, TicketCategory, TicketPriority, TicketStatus } from '@/utils/constants'

/** ISO 8601 date string, e.g. "2026-11-17T10:00:00.000Z" */
export type IsoDate = string

export interface User {
  id: string
  email: string
  name: string
  role: Role
}

export interface Ticket {
  id: string
  authorId: string
  assigneeId: string | null
  title: string
  description: string
  status: TicketStatus
  /** null while the AI has not classified the ticket yet */
  category: TicketCategory | null
  priority: TicketPriority | null
  /** 0..1 */
  aiConfidence: number | null
  aiDraft: string | null
  createdAt: IsoDate
  updatedAt: IsoDate
}

export interface Comment {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  body: string
  isInternal: boolean
  createdAt: IsoDate
}

/** GET /api/tickets/:id returns the ticket together with its comments */
export interface TicketWithComments extends Ticket {
  comments: Comment[]
}

export interface Paginated<T> {
  items: T[]
  total: number
}
