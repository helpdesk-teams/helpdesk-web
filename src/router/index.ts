import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import './types'

const APP_NAME = 'Smart Helpdesk'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Open every new page at the top, but restore the position on browser "Back"
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

// Browser tab title: "Мои обращения · Smart Helpdesk"
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})

export default router
