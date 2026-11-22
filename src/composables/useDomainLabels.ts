import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Role,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from '@/utils/constants'

/** One option for a PrimeVue Select / filter dropdown */
export interface SelectOption<T extends string> {
  label: string
  value: T
}

/**
 * Translated labels for domain values, in the current language.
 *
 *   const { statusLabel, statusOptions } = useDomainLabels()
 *   statusLabel('open')  // "Открыто" or "Open"
 *
 * The options are computed: when the language changes, dropdowns update by themselves.
 */
export function useDomainLabels() {
  const { t } = useI18n()

  const statusLabel = (status: TicketStatus) => t(`status.${status}`)
  const categoryLabel = (category: TicketCategory) => t(`category.${category}`)
  const priorityLabel = (priority: TicketPriority) => t(`priority.${priority}`)
  const roleLabel = (role: Role) => t(`role.${role}`)

  const statusOptions = computed<SelectOption<TicketStatus>[]>(() =>
    TICKET_STATUSES.map((value) => ({ value, label: statusLabel(value) })),
  )
  const categoryOptions = computed<SelectOption<TicketCategory>[]>(() =>
    TICKET_CATEGORIES.map((value) => ({ value, label: categoryLabel(value) })),
  )
  const priorityOptions = computed<SelectOption<TicketPriority>[]>(() =>
    TICKET_PRIORITIES.map((value) => ({ value, label: priorityLabel(value) })),
  )

  return {
    statusLabel,
    categoryLabel,
    priorityLabel,
    roleLabel,
    statusOptions,
    categoryOptions,
    priorityOptions,
  }
}
