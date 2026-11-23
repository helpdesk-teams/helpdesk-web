import type { Role } from '@/utils/constants'
import type { MessageSchema } from '@/i18n/locales/ru'

/** A page name from the translations: 'clientTickets' → t('pages.clientTickets') */
export type PageKey = keyof MessageSchema['pages']

/** Which page frame to render around the route (see App.vue). */
export type LayoutName = 'default' | 'auth'

/**
 * Module augmentation: we add our own fields to Vue Router's RouteMeta,
 * so `route.meta.roles` is typed everywhere (guards, layouts, tests).
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** Page name for the browser tab title, translated via t(`pages.${page}`) */
    page?: PageKey
    /** Page frame; 'default' when omitted */
    layout?: LayoutName
    /** true → only signed-in users (enforced by guards at stage 3) */
    requiresAuth?: boolean
    /** Roles allowed to open the page; any signed-in user when omitted */
    roles?: Role[]
  }
}

/** Route names in one place, so components never hard-code them. */
export const ROUTE_NAMES = {
  login: 'login',
  register: 'register',
  clientTickets: 'client-tickets',
  clientTicketNew: 'client-ticket-new',
  clientTicketDetail: 'client-ticket-detail',
  operatorQueue: 'operator-queue',
  operatorTicketDetail: 'operator-ticket-detail',
  notFound: 'not-found',
} as const
