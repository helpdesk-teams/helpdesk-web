import type { PrimeVueConfiguration, PrimeVueLocaleOptions } from '@primevue/core/config'
import en from './en'
import ru from './ru'
import type { AppLocale } from '@/i18n'

const primevueLocales: Record<AppLocale, PrimeVueLocaleOptions> = { en, ru }

let activeConfig: PrimeVueConfiguration | null = null

/**
 * Call once after `app.use(PrimeVue)` so `setPrimeVueLocale` has somewhere
 * to write. We keep a reference to the live config object; mutating it
 * updates every PrimeVue component immediately.
 */
export function initPrimeVueLocale(config: PrimeVueConfiguration) {
  activeConfig = config
  // PrimeVue creates the config object even when no `locale` option is passed.
  if (!activeConfig.locale) {
    activeConfig.locale = { ...en }
  }
}

/** Switches PrimeVue's built-in texts (calendar, table pagination, etc.) */
export function setPrimeVueLocale(locale: AppLocale) {
  if (!activeConfig || !activeConfig.locale) return
  Object.assign(activeConfig.locale, primevueLocales[locale])
}
