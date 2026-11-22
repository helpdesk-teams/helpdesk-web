import type { Comment, Paginated, Ticket, TicketWithComments, User } from '@/types'
import type { CommentDto, PaginatedDto, TicketDto, TicketWithCommentsDto, UserDto } from './dto'

/**
 * Adapters: server format (DTO) → app types.
 *
 * Today the two match, so each adapter just copies fields one by one.
 * Copying explicitly (not `return dto`) is the point: when the backend decides,
 * for example, `username` instead of `name` or `CLIENT` instead of `client`,
 * only the line for that field changes here.
 */

export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role,
  }
}

export function toTicket(dto: TicketDto): Ticket {
  return {
    id: dto.id,
    authorId: dto.authorId,
    assigneeId: dto.assigneeId,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    category: dto.category,
    priority: dto.priority,
    aiConfidence: dto.aiConfidence,
    aiDraft: dto.aiDraft,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function toComment(dto: CommentDto): Comment {
  return {
    id: dto.id,
    ticketId: dto.ticketId,
    authorId: dto.authorId,
    authorName: dto.authorName,
    body: dto.body,
    isInternal: dto.isInternal,
    createdAt: dto.createdAt,
  }
}

export function toTicketWithComments(dto: TicketWithCommentsDto): TicketWithComments {
  return { ...toTicket(dto), comments: dto.comments.map(toComment) }
}

export function toPaginated<D, T>(dto: PaginatedDto<D>, map: (item: D) => T): Paginated<T> {
  return { items: dto.items.map(map), total: dto.total }
}
