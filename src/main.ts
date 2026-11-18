import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import 'primeicons/primeicons.css'
import './assets/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
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

app.mount('#app')
