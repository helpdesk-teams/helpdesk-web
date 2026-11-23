import { describe, it, expect } from 'vitest'
import { initPrimeVueLocale, setPrimeVueLocale } from '@/i18n/primevue'
import en from '@/i18n/primevue/en'

describe('PrimeVue locale', () => {
  it('updates the live PrimeVue config when the language changes', () => {
    const config = { locale: { ...en } }
    initPrimeVueLocale(config)

    setPrimeVueLocale('ru')
    expect(config.locale.today).toBe('Сегодня')
    expect(config.locale.firstDayOfWeek).toBe(1)
    expect(config.locale.clear).toBe('Очистить')

    setPrimeVueLocale('en')
    expect(config.locale.today).toBe('Today')
    expect(config.locale.firstDayOfWeek).toBe(0)
    expect(config.locale.clear).toBe('Clear')
  })
})
