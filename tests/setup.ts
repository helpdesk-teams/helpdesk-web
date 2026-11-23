import { afterAll, afterEach, beforeAll } from 'vitest'
import { config } from '@vue/test-utils'
import { server } from '../mocks/node'
import { resetDb } from '../mocks/db'
import { i18n, setLocale } from '@/i18n'

// Runs before every test file (see vitest.config.ts → setupFiles)

// jsdom in Vitest may not expose localStorage; provide an in-memory mock so
// tokenStorage and i18n locale persistence work in tests.
if (typeof localStorage === 'undefined') {
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key])
      },
    },
    writable: true,
  })
}

// Every mount() in tests gets translations, like the real app; tests run in Russian
config.global.plugins.push(i18n)
setLocale('ru')
localStorage.clear()

// 'error': a request without a handler fails the test instead of hitting the real network
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

afterEach(() => {
  server.resetHandlers() // drop handlers a test added with server.use(...)
  resetDb() // every test starts from the same seed data
  setLocale('ru') // a test that switched to English doesn't affect the next one
  localStorage?.clear() // after setLocale, which saves the language there
})

afterAll(() => server.close())
