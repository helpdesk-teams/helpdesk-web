/**
 * DTO = Data Transfer Object: the exact shape of data on the wire,
 * as described by the API contract (spec section 4, later docs/openapi.yaml).
 *
 * Only src/api and the mocks use these types. Pages, stores and components use
 * the app types from src/types; adapters in src/api translate DTO → app type.
 * If the backend renames a field, we change the DTO and its adapter, nothing else.
 */

export type RoleDto = 'client' | 'operator' | 'admin'
export type TicketStatusDto =
  'classifying' | 'open' | 'in_progress' | 'waiting_for_client' | 'resolved' | 'closed'
export type TicketCategoryDto = 'billing' | 'technical' | 'account' | 'other'
export type TicketPriorityDto = 'low' | 'medium' | 'high' | 'urgent'

export interface UserDto {
  id: string
  email: string
  name: string
  role: RoleDto
}

export interface TicketDto {
  id: string
  authorId: string
  assigneeId: string | null
  title: string
  description: string
  status: TicketStatusDto
  category: TicketCategoryDto | null
  priority: TicketPriorityDto | null
  aiConfidence: number | null
  aiDraft: string | null
  createdAt: string
  updatedAt: string
}

export interface CommentDto {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  body: string
  isInternal: boolean
  createdAt: string
}

export interface TicketWithCommentsDto extends TicketDto {
  comments: CommentDto[]
}

export interface PaginatedDto<T> {
  items: T[]
  total: number
}

/* ---------- Auth ---------- */

export interface AuthResponseDto {
  user: UserDto
  accessToken: string
  refreshToken: string
}

export interface TokenPairDto {
  accessToken: string
  refreshToken: string
}

/* ---------- Errors ---------- */

export interface ErrorResponseDto {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
