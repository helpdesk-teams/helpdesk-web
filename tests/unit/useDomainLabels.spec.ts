import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useDomainLabels } from '@/composables/useDomainLabels'
import { setLocale } from '@/i18n'

// A tiny component that renders what the composable returns
const Probe = defineComponent({
  setup() {
    const { statusLabel, priorityLabel, statusOptions } = useDomainLabels()
    return () =>
      h('div', [
        h('p', { id: 'status' }, statusLabel('waiting_for_client')),
        h('p', { id: 'priority' }, priorityLabel('urgent')),
        h('p', { id: 'options' }, statusOptions.value.map((o) => o.label).join('|')),
      ])
  },
})

describe('useDomainLabels', () => {
  it('translates values and re-renders when the language changes', async () => {
    const wrapper = mount(Probe)
    expect(wrapper.find('#status').text()).toBe('Ждём клиента')
    expect(wrapper.find('#priority').text()).toBe('Срочный')

    setLocale('en')
    await nextTick()

    expect(wrapper.find('#status').text()).toBe('Waiting for client')
    expect(wrapper.find('#priority').text()).toBe('Urgent')
    expect(wrapper.find('#options').text().split('|')).toEqual([
      'Analyzing…',
      'Open',
      'In progress',
      'Waiting for client',
      'Resolved',
      'Closed',
    ])
  })
})
