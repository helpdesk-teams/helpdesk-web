import type { MessageSchema } from './ru'

// `: MessageSchema` makes TypeScript report a missing or extra key
const en: MessageSchema = {
  app: {
    name: 'Smart Helpdesk',
  },
  locale: {
    switchLabel: 'Interface language',
    // Language names stay in their own language, so everyone finds theirs
    ru: 'Русский',
    en: 'English',
  },
}

export default en
