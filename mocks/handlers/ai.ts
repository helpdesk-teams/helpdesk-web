import { delay, http, HttpResponse } from 'msw'
import { findTicketFor, isStaff, staffOnly, touch } from '../access'
import { makeDraft } from '../fake-ai'
import { apiError, apiPath, requireUser } from '../utils'

// An LLM is slow: long enough to see the loading state in the UI (no wait in tests)
const AI_DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 1200

// Each regeneration picks the next greeting, so the operator sees the draft change
let variant = 0

export const aiHandlers = [
  // POST /api/ai/draft/:ticketId → { draft } (operators only)
  http.post<{ ticketId: string }>(apiPath('/ai/draft/:ticketId'), async ({ request, params }) => {
    await delay(AI_DELAY_MS)
    const user = requireUser(request)
    if (user instanceof Response) return user
    if (!isStaff(user)) return staffOnly()
    const ticket = findTicketFor(user, params.ticketId)
    if (ticket instanceof Response) return ticket
    if (!ticket.category) {
      return apiError(409, 'INVALID_TRANSITION', 'Обращение ещё анализируется')
    }

    variant += 1
    ticket.aiDraft = makeDraft(ticket.category, variant)
    touch(ticket)
    return HttpResponse.json({ draft: ticket.aiDraft })
  }),
]
