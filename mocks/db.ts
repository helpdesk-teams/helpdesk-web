import type { CommentDto, TicketDto } from '@/api/dto'
import { seedComments } from './data/comments'
import { seedTickets } from './data/tickets'
import { seedUsers, type MockUser } from './data/users'

/**
 * The fake server's "database": plain arrays in memory.
 *
 * Handlers read and change these arrays, so a ticket created in the UI shows up
 * in the list right away. A page reload starts again from the seed data.
 * Tests call resetDb() before each test, so one test can't affect another.
 */
interface MockDb {
  users: MockUser[]
  tickets: TicketDto[]
  comments: CommentDto[]
}

// structuredClone: handlers must change copies, never the seed arrays themselves
const fresh = (): MockDb => ({
  users: structuredClone(seedUsers),
  tickets: structuredClone(seedTickets),
  comments: structuredClone(seedComments),
})

export const db: MockDb = fresh()

export function resetDb() {
  Object.assign(db, fresh())
}

/** Public user fields: never send the password to the client */
export function toPublicUser({ password: _password, ...user }: MockUser) {
  return user
}
