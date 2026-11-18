import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import App from '@/App.vue'
import { routes } from '@/router/routes'

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router, PrimeVue] } })
  await flushPromises() // wait for the lazy-loaded page
  return wrapper
}

describe('App layouts', () => {
  it('renders the header for pages with the default layout', async () => {
    const wrapper = await mountAt('/tickets')
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Мои обращения')
  })

  it('renders no header on the login page', async () => {
    const wrapper = await mountAt('/login')
    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('h1').text()).toBe('Вход')
  })
})
