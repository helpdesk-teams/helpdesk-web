import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router/routes'
import { ROUTE_NAMES } from '@/router/types'

function makeRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}

describe('router', () => {
  it('shows the 404 page for unknown paths', () => {
    const route = makeRouter().resolve('/this/does/not/exist')
    expect(route.name).toBe(ROUTE_NAMES.notFound)
  })

  it('does not treat /tickets/new as a ticket id', () => {
    expect(makeRouter().resolve('/tickets/new').name).toBe(ROUTE_NAMES.clientTicketNew)
    expect(makeRouter().resolve('/tickets/42').name).toBe(ROUTE_NAMES.clientTicketDetail)
  })

  it('redirects / to the client ticket list', async () => {
    const router = makeRouter()
    await router.push('/')
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.clientTickets)
  })

  it('uses the auth layout for login and register', () => {
    const router = makeRouter()
    expect(router.resolve('/login').meta.layout).toBe('auth')
    expect(router.resolve('/register').meta.layout).toBe('auth')
  })

  it('closes operator pages to clients', () => {
    const router = makeRouter()
    for (const path of ['/operator/queue', '/operator/tickets/1']) {
      const { meta } = router.resolve(path)
      expect(meta.requiresAuth).toBe(true)
      expect(meta.roles).not.toContain('client')
    }
  })
})

describe('document title', () => {
  it('follows the route and the language', async () => {
    const { default: router } = await import('@/router')
    const { setLocale } = await import('@/i18n')
    const { nextTick } = await import('vue')

    await router.push('/tickets/new')
    expect(document.title).toBe('Новое обращение · Smart Helpdesk')

    setLocale('en')
    await nextTick()
    expect(document.title).toBe('New ticket · Smart Helpdesk')
  })
})
