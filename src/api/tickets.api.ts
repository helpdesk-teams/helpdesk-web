import type { Comment, Paginated, Ticket, TicketWithComments } from '@/types'
import type { TicketCategory, TicketPriority, TicketStatus } from '@/utils/constants'
import { apiClient } from './client'
import { toComment, toPaginated, toTicket, toTicketWithComments } from './adapters'
import type { CommentDto, PaginatedDto, TicketDto, TicketWithCommentsDto } from './dto'

/** Filters and pagination for the ticket list; every field is optional */
export interface TicketListParams {
  status?: TicketStatus
  category?: TicketCategory
  priority?: TicketPriority
  page?: number
  limit?: number
}

export interface NewTicketInput {
  title: string
  description: string
}

export interface NewCommentInput {
  body: string
  /** Operator-only note that the client never sees */
  isInternal?: boolean
}

/** GET /tickets — a client gets own tickets, an operator gets all */
export async function getTickets(params: TicketListParams = {}): Promise<Paginated<Ticket>> {
  // axios turns `params` into ?status=open&page=2 and skips undefined values
  const { data } = await apiClient.get<PaginatedDto<TicketDto>>('/tickets', { params })
  return toPaginated(data, toTicket)
}

/** GET /tickets/:id — the ticket with its conversation */
export async function getTicket(id: string): Promise<TicketWithComments> {
  const { data } = await apiClient.get<TicketWithCommentsDto>(`/tickets/${encodeURIComponent(id)}`)
  return toTicketWithComments(data)
}

/** POST /tickets — the new ticket starts in the "classifying" status */
export async function createTicket(input: NewTicketInput): Promise<Ticket> {
  const { data } = await apiClient.post<TicketDto>('/tickets', input)
  return toTicket(data)
}

/** PATCH /tickets/:id/status — only allowed transitions, otherwise ApiError 409 */
export async function changeTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
  const { data } = await apiClient.patch<TicketDto>(`/tickets/${encodeURIComponent(id)}/status`, {
    status,
  })
  return toTicket(data)
}

/** PATCH /tickets/:id/assign — the current operator takes the ticket */
export async function assignTicket(id: string): Promise<Ticket> {
  const { data } = await apiClient.patch<TicketDto>(`/tickets/${encodeURIComponent(id)}/assign`)
  return toTicket(data)
}

/** PATCH /tickets/:id/category — the operator corrects the AI */
export async function changeTicketCategory(id: string, category: TicketCategory): Promise<Ticket> {
  const { data } = await apiClient.patch<TicketDto>(`/tickets/${encodeURIComponent(id)}/category`, {
    category,
  })
  return toTicket(data)
}

/** POST /tickets/:id/comments */
export async function addComment(ticketId: string, input: NewCommentInput): Promise<Comment> {
  const { data } = await apiClient.post<CommentDto>(
    `/tickets/${encodeURIComponent(ticketId)}/comments`,
    input,
  )
  return toComment(data)
}
