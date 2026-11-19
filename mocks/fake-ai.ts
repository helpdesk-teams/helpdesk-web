import type { TicketCategoryDto, TicketDto, TicketPriorityDto } from '@/api/dto'
import { db } from './db'

/**
 * A pretend AI service. The real one (FastAPI + Ollama) reads the ticket with an LLM;
 * the mock guesses by keywords. Good enough to see every UI state.
 */

const CATEGORY_KEYWORDS: Record<Exclude<TicketCategoryDto, 'other'>, string[]> = {
  billing: ['оплат', 'спис', 'деньг', 'счёт', 'счет', 'тариф', 'карт', 'возврат', 'акт'],
  technical: ['ошибк', 'не работает', 'вылета', 'медленно', 'баг', 'загруз', 'интеграц'],
  account: ['войти', 'вход', 'пароль', 'аккаунт', 'профил', 'email', 'почт'],
}

const URGENT_WORDS = ['срочно', 'дважды', 'не могу войти', 'всё сломалось', 'все сломалось']
const HIGH_WORDS = ['не работает', 'ошибк', 'вылета', 'не проходит']

const DRAFTS: Record<TicketCategoryDto, string> = {
  billing:
    'Мы проверили ваш платёж и уже разбираемся с ситуацией. Вернёмся с ответом в течение рабочего дня.',
  technical:
    'Спасибо, что сообщили о проблеме. Мы передали её техническим специалистам и сообщим, как только исправим.',
  account:
    'Мы проверили ваш аккаунт. Попробуйте, пожалуйста, войти снова, а если не получится — напишите нам.',
  other: 'Спасибо за обращение! Мы изучим его и обязательно ответим.',
}

export interface Classification {
  category: TicketCategoryDto
  priority: TicketPriorityDto
  confidence: number
  draft: string
}

export function makeDraft(category: TicketCategoryDto, variant = 0): string {
  const intro = ['Здравствуйте!', 'Добрый день!', 'Здравствуйте, спасибо за терпение!'][variant % 3]
  return `${intro}\n\n${DRAFTS[category]}\n\nС уважением, служба поддержки`
}

/** Pure function: same text → same result, easy to test */
export function classify(title: string, description: string): Classification {
  const text = `${title} ${description}`.toLowerCase()
  const has = (words: string[]) => words.filter((w) => text.includes(w)).length

  const scored = Object.entries(CATEGORY_KEYWORDS)
    .map(([category, words]) => ({ category: category as TicketCategoryDto, hits: has(words) }))
    .sort((a, b) => b.hits - a.hits)
  const best = scored[0]!
  const category = best.hits > 0 ? best.category : 'other'

  const priority: TicketPriorityDto =
    has(URGENT_WORDS) > 0
      ? 'urgent'
      : has(HIGH_WORDS) > 0
        ? 'high'
        : best.hits > 0
          ? 'medium'
          : 'low'

  // More matching words → more confident, between 0.45 and 0.95
  const confidence = Math.min(0.95, 0.45 + best.hits * 0.15)

  return { category, priority, confidence, draft: makeDraft(category) }
}

/** How long the "AI" thinks before a new ticket leaves `classifying` */
export const CLASSIFY_DELAY_MS = 3000

type Listener = (ticket: TicketDto, result: Classification) => void
const listeners: Listener[] = []

/** Stage 6 subscribes here to emit the `ticket:classified` WebSocket event */
export function onTicketClassified(listener: Listener) {
  listeners.push(listener)
}

/** Called after a ticket is created: classifies it in the background, like the real service */
export function scheduleClassification(ticketId: string) {
  setTimeout(() => {
    const ticket = db.tickets.find((t) => t.id === ticketId)
    if (!ticket || ticket.status !== 'classifying') return // deleted or reset meanwhile

    const result = classify(ticket.title, ticket.description)
    Object.assign(ticket, {
      category: result.category,
      priority: result.priority,
      aiConfidence: result.confidence,
      aiDraft: result.draft,
      status: 'open',
      updatedAt: new Date().toISOString(),
    })
    listeners.forEach((listener) => listener(ticket, result))
  }, CLASSIFY_DELAY_MS)
}
