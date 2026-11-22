import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './types'

/*
 * Every page is lazy-loaded: `() => import(...)` makes Vite put the page into
 * its own chunk, which the browser downloads only when the route is opened.
 *
 * `props: true` passes route params (e.g. :id) to the page as props,
 * so the page doesn't need to read useRoute() and is easier to test.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    // Stage 3 will redirect by role (client → /tickets, operator → /operator/queue)
    redirect: { name: ROUTE_NAMES.clientTickets },
  },

  /* ---------- Auth (no header) ---------- */
  {
    path: '/login',
    name: ROUTE_NAMES.login,
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { page: 'login', layout: 'auth' },
  },
  {
    path: '/register',
    name: ROUTE_NAMES.register,
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { page: 'register', layout: 'auth' },
  },

  /* ---------- Client ---------- */
  {
    path: '/tickets',
    name: ROUTE_NAMES.clientTickets,
    component: () => import('@/views/client/TicketListView.vue'),
    meta: { page: 'clientTickets', requiresAuth: true, roles: ['client'] },
  },
  {
    // Declared before /tickets/:id, otherwise "new" would be taken as an id
    path: '/tickets/new',
    name: ROUTE_NAMES.clientTicketNew,
    component: () => import('@/views/client/TicketCreateView.vue'),
    meta: { page: 'clientTicketNew', requiresAuth: true, roles: ['client'] },
  },
  {
    path: '/tickets/:id',
    name: ROUTE_NAMES.clientTicketDetail,
    component: () => import('@/views/TicketDetailView.vue'),
    props: true,
    meta: { page: 'ticket', requiresAuth: true, roles: ['client'] },
  },

  /* ---------- Operator ---------- */
  {
    path: '/operator/queue',
    name: ROUTE_NAMES.operatorQueue,
    component: () => import('@/views/operator/OperatorQueueView.vue'),
    meta: { page: 'operatorQueue', requiresAuth: true, roles: ['operator', 'admin'] },
  },
  {
    path: '/operator/tickets/:id',
    name: ROUTE_NAMES.operatorTicketDetail,
    component: () => import('@/views/TicketDetailView.vue'),
    props: true,
    meta: { page: 'ticket', requiresAuth: true, roles: ['operator', 'admin'] },
  },

  /* ---------- 404: must be the last route ---------- */
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/views/NotFoundView.vue'),
    meta: { page: 'notFound' },
  },
]
