import { describe, it, expect } from 'vitest'
import {
  ROLES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_META,
  TICKET_STATUSES,
  canTransition,
} from '@/utils/constants'
import { i18n, SUPPORTED_LOCALES } from '@/i18n'

describe('constants', () => {
  it('every domain value has a translation in every language', () => {
    const keys = [
      ...TICKET_STATUSES.map((v) => `status.${v}`),
      ...TICKET_CATEGORIES.map((v) => `category.${v}`),
      ...TICKET_PRIORITIES.map((v) => `priority.${v}`),
      ...ROLES.map((v) => `role.${v}`),
    ]
    for (const locale of SUPPORTED_LOCALES) {
      const missing = keys.filter((key) => !i18n.global.te(key, locale))
      expect(missing, `missing in "${locale}"`).toEqual([])
    }
  })

  it('follows the status transition rules from the spec', () => {
    expect(canTransition('open', 'in_progress')).toBe(true)
    expect(canTransition('waiting_for_client', 'in_progress')).toBe(true)
    expect(canTransition('resolved', 'open')).toBe(true)
    expect(canTransition('closed', 'open')).toBe(false)
    expect(canTransition('open', 'closed')).toBe(false)
  })

  it('orders priorities by weight (urgent is the heaviest)', () => {
    const weights = TICKET_PRIORITIES.map((p) => TICKET_PRIORITY_META[p].weight)
    expect(weights).toEqual([...weights].sort((a, b) => a - b))
  })
})
