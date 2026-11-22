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

  pages: {
    login: 'Sign in',
    register: 'Sign up',
    clientTickets: 'My tickets',
    clientTicketNew: 'New ticket',
    ticket: 'Ticket',
    operatorQueue: 'Ticket queue',
    notFound: 'Page not found',
  },

  role: {
    client: 'Client',
    operator: 'Operator',
    admin: 'Administrator',
  },
  status: {
    classifying: 'Analyzing…',
    open: 'Open',
    in_progress: 'In progress',
    waiting_for_client: 'Waiting for client',
    resolved: 'Resolved',
    closed: 'Closed',
  },
  category: {
    billing: 'Billing',
    technical: 'Technical issue',
    account: 'Account',
    other: 'Other',
  },
  priority: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  },
}

export default en
