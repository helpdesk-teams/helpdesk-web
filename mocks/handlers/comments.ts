import { delay, http, HttpResponse } from 'msw'
import type { CommentDto } from '@/api/dto'
import { db } from '../db'
import { findTicketFor, isStaff, touch } from '../access'
import { apiError, apiPath, requireUser } from '../utils'

const MAX_BODY_LENGTH = 5000

export const commentHandlers = [
  // POST /api/tickets/:id/comments { body, isInternal? } → 201 Comment
  http.post<{ id: string }, { body?: string; isInternal?: boolean }>(
    apiPath('/tickets/:id/comments'),
    async ({ request, params }) => {
      await delay()
      const user = requireUser(request)
      if (user instanceof Response) return user
      const ticket = findTicketFor(user, params.id)
      if (ticket instanceof Response) return ticket

      const { body = '', isInternal = false } = await request.json()
      const text = body.trim()
      if (!text || text.length > MAX_BODY_LENGTH) {
        return apiError(400, 'VALIDATION_ERROR', 'Сообщение пустое или слишком длинное', {
          body: `От 1 до ${MAX_BODY_LENGTH} символов`,
        })
      }
      if (isInternal && !isStaff(user)) {
        return apiError(403, 'FORBIDDEN', 'Внутренние заметки доступны только операторам')
      }
      if (ticket.status === 'closed') {
        return apiError(409, 'TICKET_CLOSED', 'Обращение закрыто, ответить нельзя')
      }

      const comment: CommentDto = {
        id: crypto.randomUUID(),
        ticketId: ticket.id,
        authorId: user.id,
        authorName: user.name,
        body: text,
        isInternal,
        createdAt: new Date().toISOString(),
      }
      db.comments.push(comment)

      // From the spec: waiting_for_client → in_progress when the client replies
      if (!isStaff(user) && ticket.status === 'waiting_for_client') {
        ticket.status = 'in_progress'
      }
      touch(ticket)
      return HttpResponse.json(comment, { status: 201 })
    },
  ),
]
