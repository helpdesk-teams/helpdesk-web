import { describe, it, expect } from 'vitest'
import {
  TICKET_STATUSES,
  TICKET_STATUS_META,
  canTransition,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_META,
} from '@/utils/constants'

describe('constants', () => {
  it('has a label for every status', () => {
    for (const status of TICKET_STATUSES) {
      expect(TICKET_STATUS_META[status].label).toBeTruthy()
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
