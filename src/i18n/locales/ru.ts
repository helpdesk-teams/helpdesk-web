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

  /** Header, navigation, mobile menu */
  layout: {
    mainNavigation: 'Основная навигация',
    openMenu: 'Открыть меню',
    myTickets: 'Мои обращения',
    queue: 'Очередь',
    notifications: 'Уведомления',
    notificationsUnread: 'Уведомления, непрочитанных: {count}',
    guest: 'Гость',
    logout: 'Выйти',
  },

  common: {
    comingAtStage: 'Страница появится на этапе {stage}.',
  },

  tickets: {
    newTicket: 'Новое обращение',
    idLabel: 'ID: {id}',
  },

  notFound: {
    hint: 'Возможно, адрес набран с ошибкой или страница была удалена.',
    goHome: 'На главную',
  },

  /** Page titles: the browser tab and the page heading */
  pages: {
    login: 'Вход',
    register: 'Регистрация',
    clientTickets: 'Мои обращения',
    clientTicketNew: 'Новое обращение',
    ticket: 'Обращение',
    operatorQueue: 'Очередь обращений',
    notFound: 'Страница не найдена',
  },

  /* ---------- Domain values (keys match the values in utils/constants) ---------- */
  role: {
    client: 'Клиент',
    operator: 'Оператор',
    admin: 'Администратор',
  },
  status: {
    classifying: 'Анализируется…',
    open: 'Открыто',
    in_progress: 'В работе',
    waiting_for_client: 'Ждём клиента',
    resolved: 'Решено',
    closed: 'Закрыто',
  },
  category: {
    billing: 'Оплата',
    technical: 'Техническая проблема',
    account: 'Аккаунт',
    other: 'Другое',
  },
  priority: {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный',
  },
}

export default ru

/** The shape every locale must follow */
export type MessageSchema = typeof ru
