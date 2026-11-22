import { delay, http, HttpResponse } from 'msw'
import type {
  PaginatedDto,
  TicketCategoryDto,
  TicketDto,
  TicketStatusDto,
  TicketWithCommentsDto,
} from '@/api/dto'
import { TICKET_CATEGORIES, canTransition } from '@/utils/constants'
import { db } from '../db'
import { scheduleClassification } from '../fake-ai'
import { canSee, findTicketFor, isStaff, staffOnly, touch } from '../access'
import { apiError, apiPath, requireUser } from '../utils'

type IdParams = { id: string }

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

export const ticketHandlers = [
  // GET /api/tickets?status=&category=&priority=&page=&limit= → { items, total }
  http.get(apiPath('/tickets'), async ({ request }) => {
    await delay()
    const user = requireUser(request)
    if (user instanceof Response) return user

    const query = new URL(request.url).searchParams
    const page = Math.max(1, Number(query.get('page')) || 1)
    const limit = Math.min(MAX_LIMIT, Number(query.get('limit')) || DEFAULT_LIMIT)
    // A filter matches when the param is absent or equals the field
    const matches = (ticket: TicketDto, key: 'status' | 'category' | 'priority') =>
      !query.get(key) || ticket[key] === query.get(key)

    const found = db.tickets
      .filter((t) => canSee(user, t))
      .filter((t) => matches(t, 'status') && matches(t, 'category') && matches(t, 'priority'))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // newest first

    return HttpResponse.json<PaginatedDto<TicketDto>>({
      items: found.slice((page - 1) * limit, page * limit),
      total: found.length,
    })
  }),

  // POST /api/tickets { title, description } → 201 Ticket with status "classifying"
  http.post<never, { title?: string; description?: string }>(
    apiPath('/tickets'),
    async ({ request }) => {
      await delay()
      const user = requireUser(request)
      if (user instanceof Response) return user
      if (isStaff(user)) return apiError(403, 'FORBIDDEN', 'Обращения создают клиенты')

      const body = await request.json()
      const title = body.title?.trim() ?? ''
      const description = body.description?.trim() ?? ''
      const errors: Record<string, string> = {}
      if (title.length < 5 || title.length > 120) errors.title = 'От 5 до 120 символов'
      if (description.length < 10 || description.length > 5000) {
        errors.description = 'От 10 до 5000 символов'
      }
      if (Object.keys(errors).length > 0) {
        return apiError(400, 'VALIDATION_ERROR', 'Проверьте поля формы', errors)
      }

      const now = new Date().toISOString()
      const ticket: TicketDto = {
        id: crypto.randomUUID(),
        authorId: user.id,
        assigneeId: null,
        title,
        description,
        status: 'classifying',
        category: null,
        priority: null,
        aiConfidence: null,
        aiDraft: null,
        createdAt: now,
        updatedAt: now,
      }
      db.tickets.push(ticket)
      scheduleClassification(ticket.id) // the "AI" answers in ~3 seconds
      return HttpResponse.json(ticket, { status: 201 })
    },
  ),

  // GET /api/tickets/:id → Ticket + comments (internal ones only for operators)
  http.get<IdParams>(apiPath('/tickets/:id'), async ({ request, params }) => {
    await delay()
    const user = requireUser(request)
    if (user instanceof Response) return user
    const ticket = findTicketFor(user, params.id)
    if (ticket instanceof Response) return ticket

    const comments = db.comments
      .filter((c) => c.ticketId === ticket.id && (isStaff(user) || !c.isInternal))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)) // oldest first, like a chat
    return HttpResponse.json<TicketWithCommentsDto>({ ...ticket, comments })
  }),

  // PATCH /api/tickets/:id/status { status } → Ticket
  http.patch<IdParams, { status?: TicketStatusDto }>(
    apiPath('/tickets/:id/status'),
    async ({ request, params }) => {
      await delay()
      const user = requireUser(request)
      if (user instanceof Response) return user
      const ticket = findTicketFor(user, params.id)
      if (ticket instanceof Response) return ticket

      const { status: next } = await request.json()
      // A client may only reopen a resolved ticket; classifying → open is done by the AI
      const allowedForUser = isStaff(user)
        ? ticket.status !== 'classifying'
        : ticket.status === 'resolved' && next === 'open'
      if (!next || !canTransition(ticket.status, next) || !allowedForUser) {
        return apiError(
          409,
          'INVALID_TRANSITION',
          `Нельзя перевести обращение из «${ticket.status}» в «${next}»`,
        )
      }

      ticket.status = next
      touch(ticket)
      return HttpResponse.json(ticket)
    },
  ),

  // PATCH /api/tickets/:id/assign → Ticket assigned to the current operator
  http.patch<IdParams>(apiPath('/tickets/:id/assign'), async ({ request, params }) => {
    await delay()
    const user = requireUser(request)
    if (user instanceof Response) return user
    if (!isStaff(user)) return staffOnly()
    const ticket = findTicketFor(user, params.id)
    if (ticket instanceof Response) return ticket

    ticket.assigneeId = user.id
    // Assumption: "take into work" also starts the work (open → in_progress)
    if (ticket.status === 'open') ticket.status = 'in_progress'
    touch(ticket)
    return HttpResponse.json(ticket)
  }),

  // PATCH /api/tickets/:id/category { category } → Ticket (operator fixes the AI)
  http.patch<IdParams, { category?: TicketCategoryDto }>(
    apiPath('/tickets/:id/category'),
    async ({ request, params }) => {
      await delay()
      const user = requireUser(request)
      if (user instanceof Response) return user
      if (!isStaff(user)) return staffOnly()
      const ticket = findTicketFor(user, params.id)
      if (ticket instanceof Response) return ticket

      const { category } = await request.json()
      if (!category || !TICKET_CATEGORIES.includes(category)) {
        return apiError(400, 'VALIDATION_ERROR', 'Неизвестная категория', {
          category: 'Неизвестная категория',
        })
      }
      ticket.category = category
      touch(ticket)
      return HttpResponse.json(ticket)
    },
  ),
]
