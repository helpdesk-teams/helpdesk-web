import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/node'
import { resetDb } from '../mocks/db'

// Runs before every test file (see vitest.config.ts → setupFiles)

// 'error': a request without a handler fails the test instead of hitting the real network
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

afterEach(() => {
  server.resetHandlers() // drop handlers a test added with server.use(...)
  resetDb() // every test starts from the same seed data
  localStorage.clear()
})

afterAll(() => server.close())
