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
  const wrapper = mount(App, { global: { plugins: [router, PrimeVue] }, attachTo: document.body })
  await flushPromises()
  return wrapper
}

/** The RU / EN buttons of the first switcher on the page */
const switchButton = (wrapper: Awaited<ReturnType<typeof mountAt>>, code: 'RU' | 'EN') =>
  wrapper.findAll('.locale-switcher button').find((b) => b.text() === code)!

describe('LocaleSwitcher', () => {
  it('switches the whole interface to English and back', async () => {
    const wrapper = await mountAt('/tickets')
    expect(wrapper.find('h1').text()).toBe('Мои обращения')
    expect(wrapper.text()).toContain('Новое обращение')

    await switchButton(wrapper, 'EN').trigger('click')
    await flushPromises()

    expect(wrapper.find('h1').text()).toBe('My tickets')
    expect(wrapper.text()).toContain('New ticket')
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation')
    expect(document.documentElement.lang).toBe('en')

    await switchButton(wrapper, 'RU').trigger('click')
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('Мои обращения')
    wrapper.unmount()
  })

  it('is available on the login page, before signing in', async () => {
    const wrapper = await mountAt('/login')
    await switchButton(wrapper, 'EN').trigger('click')
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('Sign in')
    wrapper.unmount()
  })
})
