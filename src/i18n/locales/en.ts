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

  errors: {
    code: {
      VALIDATION_ERROR: 'Please check the form fields',
      INVALID_CREDENTIALS: 'Wrong email or password',
      EMAIL_TAKEN: 'A user with this email already exists',
      UNAUTHORIZED: 'Please sign in',
      TOKEN_EXPIRED: 'Your session has expired, please sign in again',
      INVALID_REFRESH_TOKEN: 'Your session has expired, please sign in again',
      SESSION_EXPIRED: 'Your session has expired, please sign in again',
      FORBIDDEN: "You don't have permission to do this",
      NOT_FOUND: 'Not found',
      INVALID_TRANSITION: "The ticket can't be moved to this status",
      TICKET_CLOSED: 'The ticket is closed, replies are not possible',
      NETWORK_ERROR: 'The server is unreachable. Check your internet connection',
      TIMEOUT: 'The server is taking too long to respond, please try again',
    },
    status: {
      http400: 'Please check the data you entered',
      http401: 'Please sign in',
      http403: "You don't have permission to do this",
      http404: 'Not found',
      http409: "This can't be done right now, please refresh the page",
      http429: 'Too many requests, please try again a bit later',
    },
    server: 'Something went wrong on the server, please try again later',
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
