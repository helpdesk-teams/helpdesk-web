import { describe, it, expect, vi, afterEach } from 'vitest'
import { detectLocale, i18n, setLocale, currentLocale } from '@/i18n'
import ru from '@/i18n/locales/ru'
import en from '@/i18n/locales/en'

/** All key paths of a messages object: { a: { b: '' } } → ['a.b'] */
function keyPaths(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  )
}

function mockBrowserLanguages(languages: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
}

describe('i18n', () => {
  afterEach(() => vi.restoreAllMocks())

  it('ru and en have exactly the same keys', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(ru).sort())
  })

  it('setLocale switches texts, <html lang> and remembers the choice', () => {
    const { t } = i18n.global
    expect(t('locale.switchLabel')).toBe('Язык интерфейса')

    setLocale('en')

    expect(t('locale.switchLabel')).toBe('Interface language')
    expect(currentLocale()).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('helpdesk.locale')).toBe('en')
  })

  it('detectLocale: a saved choice wins over the browser language', () => {
    mockBrowserLanguages(['en-US'])
    localStorage.setItem('helpdesk.locale', 'ru')
    expect(detectLocale()).toBe('ru')
  })

  it('detectLocale: uses a supported browser language, otherwise Russian', () => {
    mockBrowserLanguages(['de-DE', 'en-GB'])
    expect(detectLocale()).toBe('en')

    mockBrowserLanguages(['de-DE', 'fr-FR'])
    expect(detectLocale()).toBe('ru')
  })

  it('a missing key fails the test instead of rendering the key', () => {
    expect(() => i18n.global.t('no.such.key')).toThrow(/Missing translation/)
  })
})
