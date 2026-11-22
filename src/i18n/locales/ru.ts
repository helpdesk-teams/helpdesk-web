/**
 * Russian texts: the main locale and the source of truth for keys.
 * en.ts must have exactly the same keys (TypeScript checks it).
 * Keys are grouped by where they are used; more groups come with each stage.
 */
const ru = {
  app: {
    name: 'Smart Helpdesk',
  },
  locale: {
    switchLabel: 'Язык интерфейса',
    ru: 'Русский',
    en: 'English',
  },
}

export default ru

/** The shape every locale must follow */
export type MessageSchema = typeof ru
