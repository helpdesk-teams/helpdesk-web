import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useFormattedDate } from '@/composables/useFormattedDate'
import { setLocale } from '@/i18n'

const fixedDate = '2026-11-19T10:00:00.000Z'

const Probe = defineComponent({
  props: {
    date: { type: String, required: true },
    relativeDate: { type: String, required: true },
  },
  setup(props) {
    const { formatDate, formatRelativeTime } = useFormattedDate()
    return () =>
      h('div', [
        h('p', { id: 'date' }, formatDate(props.date)),
        h('p', { id: 'relative' }, formatRelativeTime(props.relativeDate)),
      ])
  },
})

describe('useFormattedDate', () => {
  it('formats a date in Russian by default', () => {
    const wrapper = mount(Probe, {
      props: { date: fixedDate, relativeDate: fixedDate },
    })
    expect(wrapper.find('#date').text()).toMatch(/19/)
  })

  it('switches the date format when the language changes', async () => {
    const wrapper = mount(Probe, {
      props: { date: fixedDate, relativeDate: fixedDate },
    })
    const russian = wrapper.find('#date').text()

    setLocale('en')
    await nextTick()

    const english = wrapper.find('#date').text()
    expect(english).not.toBe(russian)
    expect(english).toMatch(/Nov/)
  })

  it('formats a relative time in the current language', async () => {
    const wrapper = mount(Probe, {
      props: { date: fixedDate, relativeDate: fixedDate },
    })

    setLocale('ru')
    await nextTick()
    const russianRelative = wrapper.find('#relative').text()
    expect(russianRelative.length).toBeGreaterThan(0)

    setLocale('en')
    await nextTick()
    const englishRelative = wrapper.find('#relative').text()
    expect(englishRelative.length).toBeGreaterThan(0)
  })
})
