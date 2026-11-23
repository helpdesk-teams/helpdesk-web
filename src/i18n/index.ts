import { createI18n } from 'vue-i18n'
import ru, { type MessageSchema } from './locales/ru'
import en from './locales/en'
import { setPrimeVueLocale } from './primevue'

/*
 * Tells vue-i18n the shape of our messages, so the editor autocompletes keys in t('...').
 * Note: t() still accepts any string, so a typo like t('stauts.open') compiles.
 * Typos are caught by tests instead: there a missing key throws (see `missing` below).
 */
declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}

export const SUPPORTED_LOCALES = ['ru', 'en'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'ru'
const STORAGE_KEY = 'helpdesk.locale'

const isSupported = (value: unknown): value is AppLocale =>
  SUPPORTED_LOCALES.includes(value as AppLocale)

/**
 * Which language to start with:
 * 1. the one the user picked before (saved in localStorage)
 * 2. the browser language, if we support it ("en-US" → "en")
 * 3. Russian
 */
export function detectLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isSupported(saved)) return saved
  } catch {
    // storage unavailable: fall through to the browser language
  }
  const fromBrowser = (navigator.languages ?? [navigator.language])
    .map((tag) => tag.slice(0, 2).toLowerCase())
    .find(isSupported)
  return fromBrowser ?? DEFAULT_LOCALE
}

// <..., false>: tells TypeScript that legacy mode is off (locale is a ref)
export const i18n = createI18n<[MessageSchema], AppLocale, false>({
  legacy: false, // Composition API: useI18n() in <script setup>
  locale: detectLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { ru, en },
  // In tests a missing key fails loudly instead of silently showing "status.open"
  missing: (locale, key) => {
    if (import.meta.env.MODE === 'test') {
      throw new Error(`Missing translation "${key}" for locale "${locale}"`)
    }
  },
})

/** The current language, for code outside components (API errors, dates) */
export const currentLocale = (): AppLocale => i18n.global.locale.value

/** Switches the language everywhere, remembers it and updates <html lang> */
export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  setPrimeVueLocale(locale)
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // not saved: the choice just won't survive a reload
  }
}

// <html lang> must match from the very first render (screen readers, hyphenation)
document.documentElement.lang = currentLocale()
