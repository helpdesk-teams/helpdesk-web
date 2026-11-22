/**
 * Domain constants shared with the backend contract.
 *
 * Every status / category / priority / role lives here exactly once.
 * Components never write strings like 'in_progress' by hand — they import from this file.
 * Types (TicketStatus etc.) are derived from the arrays, so adding a value in one place
 * updates both runtime code and TypeScript checks.
 *
 * Labels are NOT here: they are translations, keyed by the value itself
 * (status.open, category.billing… in src/i18n/locales). Use useDomainLabels().
 */

/** Severity values supported by PrimeVue <Tag> / <Badge>. Colors come from the theme. */
export type TagSeverity = 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast'

/** How a value looks as a badge: color and icon (the text comes from translations) */
interface BadgeMeta {
  severity: TagSeverity
  icon: string
}

/* ---------- Roles ---------- */

export const ROLES = ['client', 'operator', 'admin'] as const
export type Role = (typeof ROLES)[number]

/* ---------- Ticket statuses ---------- */

export const TICKET_STATUSES = [
  'classifying',
  'open',
  'in_progress',
  'waiting_for_client',
  'resolved',
  'closed',
] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const TICKET_STATUS_META: Record<TicketStatus, BadgeMeta> = {
  classifying: { severity: 'secondary', icon: 'pi pi-spin pi-spinner' },
  open: { severity: 'info', icon: 'pi pi-inbox' },
  in_progress: { severity: 'warn', icon: 'pi pi-cog' },
  waiting_for_client: { severity: 'contrast', icon: 'pi pi-clock' },
  resolved: { severity: 'success', icon: 'pi pi-check' },
  closed: { severity: 'secondary', icon: 'pi pi-lock' },
}

/**
 * Allowed status transitions (section 3 of the spec).
 * `classifying → open` is done by the AI service, not by a person,
 * so the UI never offers it as a button.
 */
export const TICKET_STATUS_TRANSITIONS: Record<TicketStatus, readonly TicketStatus[]> = {
  classifying: ['open'],
  open: ['in_progress'],
  in_progress: ['waiting_for_client'],
  waiting_for_client: ['resolved', 'in_progress'],
  resolved: ['closed', 'open'],
  closed: [],
}

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return TICKET_STATUS_TRANSITIONS[from].includes(to)
}

/* ---------- Categories ---------- */

export const TICKET_CATEGORIES = ['billing', 'technical', 'account', 'other'] as const
export type TicketCategory = (typeof TICKET_CATEGORIES)[number]

export const TICKET_CATEGORY_META: Record<TicketCategory, BadgeMeta> = {
  billing: { severity: 'info', icon: 'pi pi-credit-card' },
  technical: { severity: 'info', icon: 'pi pi-wrench' },
  account: { severity: 'info', icon: 'pi pi-user' },
  other: { severity: 'secondary', icon: 'pi pi-question-circle' },
}

/* ---------- Priorities ---------- */

export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export const TICKET_PRIORITY_META: Record<TicketPriority, BadgeMeta & { weight: number }> = {
  low: { severity: 'secondary', icon: 'pi pi-angle-down', weight: 1 },
  medium: { severity: 'info', icon: 'pi pi-minus', weight: 2 },
  high: { severity: 'warn', icon: 'pi pi-angle-up', weight: 3 },
  urgent: { severity: 'danger', icon: 'pi pi-angle-double-up', weight: 4 },
}
