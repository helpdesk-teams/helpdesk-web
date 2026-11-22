import { watch } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { i18n } from '@/i18n'
import { routes } from './routes'
import './types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Open every new page at the top, but restore the position on browser "Back"
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

/** Browser tab title: "Мои обращения · Smart Helpdesk" / "My tickets · Smart Helpdesk" */
function updateDocumentTitle(route: RouteLocationNormalized) {
  const { t } = i18n.global
  const appName = t('app.name')
  document.title = route.meta.page ? `${t(`pages.${route.meta.page}`)} · ${appName}` : appName
}

router.afterEach(updateDocumentTitle)

// The tab title must follow a language switch too, not only navigation
watch(i18n.global.locale, () => updateDocumentTitle(router.currentRoute.value))

export default router
