/**
 * Data shapes from the API contract (spec section 4).
 * At stage 7 these can be replaced by types generated from the backend's openapi.yaml.
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

/** Error body returned by the gateway: { error: { code, message, details? } } */
export interface ApiErrorBody {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
