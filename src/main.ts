import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import 'primeicons/primeicons.css'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { ROUTE_NAMES } from './router/types'
import { USE_MOCKS } from './config'
import { setSessionExpiredHandler } from './api/client'

/**
 * Start MSW before the app sends its first request.
 * The dynamic import() keeps the mock code in a separate chunk,
 * which is downloaded only when mocks are on.
 */
async function enableMocking() {
  // `import.meta.env.DEV` is checked right here (not only inside USE_MOCKS):
  // Vite replaces it with `false` in `vite build`, so the bundler sees dead code
  // and drops the import below. Hidden in another module, it can't tell.
  if (!import.meta.env.DEV || !USE_MOCKS) return
  const { worker } = await import('../mocks/browser')
  // 'bypass': requests without a handler (Vite files, fonts…) go to the network as usual
  await worker.start({ onUnhandledFrame: 'bypass' })
}

// When the tokens can't be refreshed, send the user to /login and remember
// where they were, so after signing in they come back (used at stage 3).
// Stage 3 will also clear the user in the auth store here.
setSessionExpiredHandler(() => {
  const { name, fullPath } = router.currentRoute.value
  if (name === ROUTE_NAMES.login) return
  router.push({ name: ROUTE_NAMES.login, query: { redirect: fullPath } })
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      // Dark mode is toggled by adding this class to <html> (stage 9),
      // instead of following the OS setting automatically.
      darkModeSelector: '.app-dark',
    },
  },
})

enableMocking().then(() => app.mount('#app'))
