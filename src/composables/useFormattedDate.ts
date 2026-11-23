import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type DateInput = Date | string | number

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value)
}

/**
 * Locale-aware date formatting.
 *
 * Examples:
 *   formatDate(ticket.createdAt)            // "19 нояб. 2026 г., 10:00" / "Nov 19, 2026, 10:00 AM"
 *   formatDate(ticket.createdAt, { dateStyle: 'long' })  // "19 ноября 2026 г."
 */
export function useFormattedDate() {
  const { locale } = useI18n()

  const formatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
  )

  const formatDate = (value: DateInput, options?: Intl.DateTimeFormatOptions) => {
    const date = toDate(value)
    if (Number.isNaN(date.getTime())) return ''
    if (options) {
      return new Intl.DateTimeFormat(locale.value, options).format(date)
    }
    return formatter.value.format(date)
  }

  /**
   * "2 hours ago", "вчера", "3 days ago" / "3 дня назад".
   * Uses Intl.RelativeTimeFormat with the current UI language.
   */
  const formatRelativeTime = (value: DateInput) => {
    const date = toDate(value)
    if (Number.isNaN(date.getTime())) return ''

    const now = Date.now()
    const diffMs = date.getTime() - now
    const diffSeconds = Math.round(diffMs / 1000)
    const absSeconds = Math.abs(diffSeconds)

    const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })

    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365

    if (absSeconds < minute) return rtf.format(diffSeconds, 'second')
    if (absSeconds < hour) return rtf.format(Math.round(diffSeconds / minute), 'minute')
    if (absSeconds < day) return rtf.format(Math.round(diffSeconds / hour), 'hour')
    if (absSeconds < week) return rtf.format(Math.round(diffSeconds / day), 'day')
    if (absSeconds < month) return rtf.format(Math.round(diffSeconds / week), 'week')
    if (absSeconds < year) return rtf.format(Math.round(diffSeconds / month), 'month')
    return rtf.format(Math.round(diffSeconds / year), 'year')
  }

  return { formatDate, formatRelativeTime }
}
