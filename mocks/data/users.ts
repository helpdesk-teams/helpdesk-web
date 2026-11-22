import type { UserDto } from '@/api/dto'

/** A user as the fake server stores it: the public fields plus a password. */
export interface MockUser extends UserDto {
  password: string
}

/**
 * Test accounts for the mock server only. These passwords never reach a real backend.
 * Sign in with them on /login while VITE_USE_MOCKS=true.
 */
export const MOCK_PASSWORD = 'password123'

export const USER_IDS = {
  anna: '6f1c2a40-1b7e-4c1a-9a51-0c8f6f0e1a01',
  ivan: '6f1c2a40-1b7e-4c1a-9a51-0c8f6f0e1a02',
  olga: '6f1c2a40-1b7e-4c1a-9a51-0c8f6f0e1a03',
  admin: '6f1c2a40-1b7e-4c1a-9a51-0c8f6f0e1a04',
} as const

export const seedUsers: MockUser[] = [
  {
    id: USER_IDS.anna,
    email: 'client@example.com',
    name: 'Анна Смирнова',
    role: 'client',
    password: MOCK_PASSWORD,
  },
  {
    id: USER_IDS.ivan,
    email: 'client2@example.com',
    name: 'Иван Петров',
    role: 'client',
    password: MOCK_PASSWORD,
  },
  {
    id: USER_IDS.olga,
    email: 'operator@example.com',
    name: 'Ольга Кузнецова',
    role: 'operator',
    password: MOCK_PASSWORD,
  },
  {
    id: USER_IDS.admin,
    email: 'admin@example.com',
    name: 'Администратор',
    role: 'admin',
    password: MOCK_PASSWORD,
  },
]
