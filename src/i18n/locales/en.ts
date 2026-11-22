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

  layout: {
    mainNavigation: 'Main navigation',
    openMenu: 'Open menu',
    myTickets: 'My tickets',
    queue: 'Queue',
    notifications: 'Notifications',
    notificationsUnread: 'Notifications, unread: {count}',
    guest: 'Guest',
    logout: 'Sign out',
  },

  common: {
    comingAtStage: 'This page is coming at stage {stage}.',
  },

  tickets: {
    newTicket: 'New ticket',
    idLabel: 'ID: {id}',
  },

  notFound: {
    hint: 'The address may be mistyped, or the page has been removed.',
    goHome: 'Go home',
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
