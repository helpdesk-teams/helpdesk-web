import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      // Lazy loading: the page's code is downloaded only when the route is opened.
      component: () => import('@/views/WelcomeView.vue'),
    },
  ],
})

export default router
